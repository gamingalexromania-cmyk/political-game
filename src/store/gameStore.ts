import { create } from "zustand";
import { initialState, type GameState } from "../engine/state";
import { advanceTurn } from "../engine/turn";
import { decideOnLaw, type LawDecision } from "../engine/laws";
import { nominatePM } from "../engine/government";
import type { PMCandidate } from "../data/candidates";

const SAVE_KEY = "cotroceni.save.v1";

interface GameStore {
  state: GameState | null;
  // UI state — kept here so it survives renders but is intentionally NOT
  // persisted (it makes no sense to remember "this dossier was open" across reloads).
  selectedLawId: string | null;

  startNewGame: (presidentName: string) => void;
  loadGame: () => boolean;
  saveGame: () => void;
  resetGame: () => void;

  advance: (days?: number) => void;
  decideLaw: (lawId: string, decision: LawDecision) => void;
  appointPM: (candidate: PMCandidate) => void;

  openLaw: (lawId: string) => void;
  closeLaw: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  selectedLawId: null,

  startNewGame: (presidentName: string) => {
    const state = initialState(presidentName);
    set({ state, selectedLawId: null });
    persist(state);
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const state = JSON.parse(raw) as GameState;
      set({ state, selectedLawId: null });
      return true;
    } catch {
      return false;
    }
  },

  saveGame: () => {
    const s = get().state;
    if (s) persist(s);
  },

  resetGame: () => {
    localStorage.removeItem(SAVE_KEY);
    set({ state: null, selectedLawId: null });
  },

  advance: (days = 1) => {
    const s = get().state;
    if (!s) return;
    const next = advanceTurn(s, days);
    // If the open dossier was auto-promulgated or moved into cooldown by the
    // turn loop, close the modal so the player isn't looking at a stale view.
    const sel = get().selectedLawId;
    const stillOpenable =
      sel &&
      next.inbox.some(
        (p) => p.law.id === sel && (!p.cooldownDays || p.cooldownDays === 0),
      );
    set({ state: next, selectedLawId: stillOpenable ? sel : null });
    persist(next);
  },

  decideLaw: (lawId, decision) => {
    const s = get().state;
    if (!s) return;
    const next = decideOnLaw(s, lawId, decision);
    set({ state: next, selectedLawId: null });
    persist(next);
  },

  appointPM: (candidate) => {
    const s = get().state;
    if (!s) return;
    const next = nominatePM(s, candidate);
    set({ state: next });
    persist(next);
  },

  openLaw: (lawId) => set({ selectedLawId: lawId }),
  closeLaw: () => set({ selectedLawId: null }),
}));

function persist(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
