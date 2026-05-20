import { PARTIES, type PartyId } from "../data/parties";
import { LAWS } from "../data/laws";
import type { Law } from "../data/laws";
import type { PMCandidate } from "../data/candidates";

export type Phase = "playing" | "won" | "lost";

export interface PartyRelation {
  id: PartyId;
  value: number; // -100..100
}

export interface PendingLaw {
  law: Law;
  arrivedOnDay: number;
  // Days remaining of the 20-day promulgation window (Art. 77).
  daysRemaining: number;
  // The president may return a law to Parliament only ONCE.
  // After re-examination it returns to the inbox with `wasReturned = true`.
  wasReturned: boolean;
  // When > 0, the law is being re-examined in Parliament and is hidden from
  // the active inbox; the turn loop decrements until it reaches zero.
  cooldownDays?: number;
}

export interface Government {
  pm: PMCandidate;
  // True once Parliament has confirmed the cabinet (vote of confidence).
  confirmed: boolean;
  // Day the cabinet was sworn in.
  sworeInOnDay: number;
}

export interface PMNominationState {
  // List of party-suggested candidates for the player to choose from.
  candidates: PMCandidate[];
  // How many failed nominations so far (within rolling 60-day window).
  failedCount: number;
  // Day the nomination window opened (used for the Art. 89 dissolution window).
  openedOnDay: number;
}

export interface GameState {
  phase: Phase;
  presidentName: string;
  // Day 0 = inauguration day.
  day: number;
  termLengthDays: number; // 5 years ~ 1825

  approval: number;     // 0..100
  economy: number;      // 0..100
  legitimacy: number;   // 0..100
  relations: PartyRelation[];

  government: Government | null;
  // When government is null and a nomination is needed, this is set.
  pmNomination: PMNominationState | null;

  inbox: PendingLaw[];
  // Laws already decided on (for log/history view, optional in MVP).
  archive: Array<{
    lawId: string;
    decision: "promulgate" | "return" | "refer";
    day: number;
  }>;

  // Last narrative event shown to the player (for the dashboard log).
  log: Array<{ day: number; text: string }>;

  // Seeded RNG counter so the engine stays deterministic.
  rngSeed: number;
}

export function initialState(presidentName: string): GameState {
  return {
    phase: "playing",
    presidentName: presidentName.trim() || "President",
    day: 0,
    termLengthDays: 5 * 365,
    approval: 52,
    economy: 50,
    legitimacy: 70,
    relations: PARTIES.map((p) => ({ id: p.id, value: p.initialRelation })),
    government: null,
    pmNomination: null,
    inbox: [],
    archive: [],
    log: [
      {
        day: 0,
        text:
          "You take the oath of office at the joint session of Parliament. The country is watching.",
      },
    ],
    rngSeed: Math.floor(Math.random() * 1_000_000),
  };
}

// Helper: clamp a numeric meter to its valid range.
export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

// Helper: relation lookup.
export function getRelation(state: GameState, party: PartyId): number {
  return state.relations.find((r) => r.id === party)?.value ?? 0;
}

// Helper: format an in-game date relative to inauguration day.
// Inauguration is fixed to Jan 1 of an unspecified year for simplicity.
export function formatDate(day: number): string {
  const start = new Date(2025, 0, 1);
  const d = new Date(start);
  d.setDate(start.getDate() + day);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Re-export for convenience.
export { LAWS };
