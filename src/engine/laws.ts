import type { PartyId } from "../data/parties";
import type { Law, LawEffects } from "../data/laws";
import { clamp, type GameState } from "./state";

export type LawDecision = "promulgate" | "return" | "refer";

// Apply an effect package to the game state and return a new state.
// Pure: no mutation of input.
export function applyLawEffects(
  state: GameState,
  effects: LawEffects,
): GameState {
  const newRelations = state.relations.map((r) => {
    const delta = effects.relations[r.id as PartyId] ?? 0;
    return { ...r, value: clamp(r.value + delta, -100, 100) };
  });

  return {
    ...state,
    approval: clamp(state.approval + effects.approval),
    economy: clamp(state.economy + effects.economy),
    legitimacy: clamp(state.legitimacy + effects.legitimacy),
    relations: newRelations,
  };
}

export function decideOnLaw(
  state: GameState,
  lawId: string,
  decision: LawDecision,
): GameState {
  const pending = state.inbox.find((p) => p.law.id === lawId);
  if (!pending) return state;

  // Constitutional rule: the President may RETURN a law to Parliament only
  // once. After re-examination the law comes back and must be promulgated
  // or referred to the Constitutional Court.
  if (decision === "return" && pending.wasReturned) {
    return state;
  }

  const effects =
    decision === "promulgate"
      ? pending.law.promulgate
      : decision === "return"
        ? pending.law.return
        : pending.law.refer;

  let next = applyLawEffects(state, effects);

  if (decision === "return") {
    // Law is removed from inbox; Parliament re-examines and re-transmits it.
    // We mark it wasReturned = true so the player cannot return it twice.
    // For MVP we simulate a brief re-examination by deferring it 14 days
    // via cooldownDays; the turn loop decrements that and only surfaces the
    // law again once it reaches zero.
    next = {
      ...next,
      inbox: next.inbox
        .filter((p) => p.law.id !== lawId)
        .concat([
          {
            ...pending,
            arrivedOnDay: next.day,
            daysRemaining: 20,
            wasReturned: true,
            cooldownDays: 14,
          },
        ]),
      log: [
        ...next.log,
        {
          day: next.day,
          text: `You return "${pending.law.title}" to Parliament for re-examination.`,
        },
      ],
    };
  } else {
    next = {
      ...next,
      inbox: next.inbox.filter((p) => p.law.id !== lawId),
      archive: [
        ...next.archive,
        { lawId: pending.law.id, decision, day: next.day },
      ],
      log: [
        ...next.log,
        {
          day: next.day,
          text: narrationFor(decision, pending.law),
        },
      ],
    };
  }

  return next;
}

function narrationFor(decision: LawDecision, law: Law): string {
  switch (decision) {
    case "promulgate":
      return `You sign "${law.title}" into law at Cotroceni Palace.`;
    case "refer":
      return `You refer "${law.title}" to the Constitutional Court for review.`;
    case "return":
      return `You return "${law.title}" to Parliament.`;
  }
}

// Called each turn for any law whose 20-day window has elapsed without a
// decision: the constitution treats silence as tacit promulgation.
export function autoPromulgateExpired(state: GameState): GameState {
  let next = state;
  for (const pending of state.inbox) {
    if ((pending.cooldownDays ?? 0) > 0) continue; // hidden, don't auto-promulgate
    if (pending.daysRemaining <= 0) {
      next = applyLawEffects(next, pending.law.promulgate);
      next = {
        ...next,
        inbox: next.inbox.filter((p) => p.law.id !== pending.law.id),
        archive: [
          ...next.archive,
          { lawId: pending.law.id, decision: "promulgate", day: next.day },
        ],
        log: [
          ...next.log,
          {
            day: next.day,
            text: `The 20-day window has expired. "${pending.law.title}" is automatically promulgated.`,
          },
        ],
        approval: clamp(next.approval - 2), // small penalty for inaction
      };
    }
  }
  return next;
}
