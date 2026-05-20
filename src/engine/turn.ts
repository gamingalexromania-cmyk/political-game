import { LAWS, type GameState, type PendingLaw } from "./state";
import { autoPromulgateExpired } from "./laws";
import { openPMNomination } from "./government";

// Days between law arrivals on average.
const LAW_INTERVAL_DAYS = 9;

// Pseudo-random; not cryptographic. Threaded via state so saves are deterministic.
function rng(seed: number): { value: number; next: number } {
  const next = (seed * 9301 + 49297) % 233280;
  return { value: next / 233280, next };
}

// Pick the next law not currently in inbox or archive.
function nextLaw(state: GameState, seed: number): { lawId: string | null; nextSeed: number } {
  const used = new Set([
    ...state.archive.map((a) => a.lawId),
    ...state.inbox.map((p) => p.law.id),
  ]);
  const available = LAWS.filter((l) => !used.has(l.id));
  if (available.length === 0) return { lawId: null, nextSeed: seed };
  const { value, next } = rng(seed);
  const idx = Math.floor(value * available.length);
  return { lawId: available[idx].id, nextSeed: next };
}

// Advance the game by `days` days. The dashboard typically advances 1 day at a time;
// when there is nothing pressing the player can fast-forward 7 days.
export function advanceTurn(state: GameState, days = 1): GameState {
  if (state.phase !== "playing") return state;

  let next: GameState = { ...state };

  for (let i = 0; i < days; i++) {
    next = stepOneDay(next);
    if (next.phase !== "playing") break;
  }

  return next;
}

function stepOneDay(state: GameState): GameState {
  let next: GameState = {
    ...state,
    day: state.day + 1,
    inbox: state.inbox.map((p) => ({
      ...p,
      // Decrement cooldown first; only decrement deadline when not in cooldown.
      cooldownDays:
        p.cooldownDays && p.cooldownDays > 0 ? p.cooldownDays - 1 : 0,
      daysRemaining:
        p.cooldownDays && p.cooldownDays > 0
          ? p.daysRemaining
          : p.daysRemaining - 1,
    })),
  };

  // Surface any law whose cooldown just expired with a log entry.
  for (const p of next.inbox) {
    if (p.cooldownDays === 0 && p.wasReturned) {
      const wasInCooldown = state.inbox.find(
        (q) => q.law.id === p.law.id && (q.cooldownDays ?? 0) > 0,
      );
      if (wasInCooldown) {
        next = {
          ...next,
          log: [
            ...next.log,
            {
              day: next.day,
              text: `Parliament has re-examined "${p.law.title}" and re-transmits it. You may no longer return it.`,
            },
          ],
        };
      }
    }
  }

  // 1. Auto-promulgate any law whose window expired (skip ones in cooldown).
  next = autoPromulgateExpired(next);

  // 2. If no government and no nomination open, open one.
  if (!next.government && !next.pmNomination) {
    next = {
      ...next,
      pmNomination: openPMNomination(next),
      log: [
        ...next.log,
        {
          day: next.day,
          text:
            "After consulting the parliamentary parties, you must designate a candidate for Prime Minister.",
        },
      ],
    };
  }

  // 3. Maybe a new law arrives — only when a confirmed government exists.
  if (next.government?.confirmed) {
    const daysSinceLastLaw =
      next.day -
      Math.max(
        0,
        ...next.inbox.map((p) => p.arrivedOnDay),
        ...next.archive.map((a) => a.day),
      );
    if (daysSinceLastLaw >= LAW_INTERVAL_DAYS && next.inbox.length < 3) {
      const { lawId, nextSeed } = nextLaw(next, next.rngSeed);
      if (lawId) {
        const law = LAWS.find((l) => l.id === lawId)!;
        const newPending: PendingLaw = {
          law,
          arrivedOnDay: next.day,
          daysRemaining: 20,
          wasReturned: false,
        };
        next = {
          ...next,
          rngSeed: nextSeed,
          inbox: [...next.inbox, newPending],
          log: [
            ...next.log,
            {
              day: next.day,
              text: `Parliament transmits "${law.title}" to Cotroceni for promulgation.`,
            },
          ],
        };
      }
    }
  }

  // 4. End-of-term check.
  if (next.day >= next.termLengthDays) {
    if (next.approval >= 45) {
      next = { ...next, phase: "won" };
      next.log.push({
        day: next.day,
        text:
          "Your five-year term concludes. With the country broadly behind you, you leave Cotroceni with your legacy intact.",
      });
    } else {
      next = { ...next, phase: "lost" };
      next.log.push({
        day: next.day,
        text:
          "Your term ends in the shadow of public discontent. History will not be kind.",
      });
    }
  }

  // 5. Crisis fail-safe: total collapse of legitimacy.
  if (next.legitimacy <= 5 && next.phase === "playing") {
    next = { ...next, phase: "lost" };
    next.log.push({
      day: next.day,
      text:
        "Parliament suspends you in a constitutional crisis. The referendum is set; your presidency is effectively over.",
    });
  }

  // Trim log to last 30 entries to keep state manageable.
  if (next.log.length > 30) {
    next = { ...next, log: next.log.slice(-30) };
  }

  return next;
}

// Convenience: how many days until the next "interesting" event, used to enable
// the fast-forward button safely.
export function canFastForward(state: GameState): boolean {
  const visibleInbox = state.inbox.filter(
    (p) => !p.cooldownDays || p.cooldownDays === 0,
  );
  return (
    state.phase === "playing" &&
    visibleInbox.length === 0 &&
    state.pmNomination === null &&
    !!state.government?.confirmed
  );
}
