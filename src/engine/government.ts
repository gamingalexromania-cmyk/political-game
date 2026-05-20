import { PARTIES, MAJORITY_THRESHOLD, type PartyId } from "../data/parties";
import { PM_CANDIDATES, type PMCandidate } from "../data/candidates";
import {
  clamp,
  getRelation,
  type GameState,
  type Government,
  type PMNominationState,
} from "./state";

// Determine which parties currently form the most plausible majority coalition.
// Greedy: start with the largest party most aligned with the president, add
// neighbours until majority is reached.
export function plausibleMajorityParties(state: GameState): PartyId[] {
  const sorted = [...PARTIES].sort((a, b) => {
    const ra = getRelation(state, a.id);
    const rb = getRelation(state, b.id);
    // Prefer friendly + large
    return b.seats + rb * 0.5 - (a.seats + ra * 0.5);
  });

  const chosen: PartyId[] = [];
  let total = 0;
  for (const p of sorted) {
    // Skip the most extreme parties unless we'd otherwise fail.
    if (p.id === "AUR" || p.id === "SOS" || p.id === "POT") continue;
    chosen.push(p.id);
    total += p.seats;
    if (total >= MAJORITY_THRESHOLD) break;
  }

  // Fallback: if the centrist coalition cannot reach majority, take whatever's available.
  if (total < MAJORITY_THRESHOLD) {
    for (const p of sorted) {
      if (chosen.includes(p.id)) continue;
      chosen.push(p.id);
      total += p.seats;
      if (total >= MAJORITY_THRESHOLD) break;
    }
  }

  return chosen;
}

// Return a fresh nomination state: each major coalition party suggests one
// candidate. The President consults parliamentary majority (Art. 103).
export function openPMNomination(state: GameState): PMNominationState {
  const majority = plausibleMajorityParties(state);
  const candidates: PMCandidate[] = [];

  for (const partyId of majority) {
    const partyCandidates = PM_CANDIDATES.filter((c) => c.party === partyId);
    if (partyCandidates.length > 0) {
      // Pick the one with best relation alignment for the president.
      const best = partyCandidates.sort(
        (a, b) =>
          (b.effects.approval ?? 0) +
          (b.effects.relations[partyId] ?? 0) -
          ((a.effects.approval ?? 0) + (a.effects.relations[partyId] ?? 0)),
      )[0];
      candidates.push(best);
    }
  }

  return {
    candidates,
    failedCount: state.pmNomination?.failedCount ?? 0,
    openedOnDay: state.day,
  };
}

// Probability that Parliament will confirm a given candidate, based on the
// expected coalition support. Used as a simple model for the vote of confidence.
export function confirmationOdds(
  state: GameState,
  candidate: PMCandidate,
): number {
  const majority = plausibleMajorityParties(state);
  // If the candidate's party is in the majority → high odds.
  // Adjust by how friendly the relations are.
  let base = majority.includes(candidate.party) ? 0.85 : 0.35;
  const rel = getRelation(state, candidate.party);
  base += rel / 400; // ±0.25 swing
  return Math.max(0.05, Math.min(0.99, base));
}

// Apply nomination outcome. Deterministic for now: the candidate's party must
// be in the plausible majority, otherwise the vote of confidence fails.
export function nominatePM(
  state: GameState,
  candidate: PMCandidate,
): GameState {
  const majority = plausibleMajorityParties(state);
  const willPass = majority.includes(candidate.party);

  if (!willPass) {
    const failedCount = (state.pmNomination?.failedCount ?? 0) + 1;
    return {
      ...state,
      approval: clamp(state.approval - 4),
      legitimacy: clamp(state.legitimacy - 2),
      pmNomination: {
        ...openPMNomination(state),
        failedCount,
      },
      log: [
        ...state.log,
        {
          day: state.day,
          text: `${candidate.name} (${candidate.party}) fails the vote of confidence in Parliament. ${
            failedCount >= 2
              ? "A second failed nomination — Parliament may now be dissolved under Art. 89."
              : "You must consult the parties again."
          }`,
        },
      ],
    };
  }

  // Successful confirmation: apply the candidate's effects.
  const newRelations = state.relations.map((r) => {
    const delta = candidate.effects.relations[r.id as PartyId] ?? 0;
    return { ...r, value: clamp(r.value + delta, -100, 100) };
  });

  const government: Government = {
    pm: candidate,
    confirmed: true,
    sworeInOnDay: state.day,
  };

  return {
    ...state,
    approval: clamp(state.approval + candidate.effects.approval),
    economy: clamp(state.economy + candidate.effects.economy),
    relations: newRelations,
    government,
    pmNomination: null,
    log: [
      ...state.log,
      {
        day: state.day,
        text: `Parliament confirms the ${candidate.name} cabinet. ${candidate.name} is sworn in as Prime Minister.`,
      },
    ],
  };
}
