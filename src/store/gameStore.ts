import { create } from "zustand";
import { initialState, type GameState } from "../engine/state";
import { advanceTurn } from "../engine/turn";
import { decideOnLaw, type LawDecision } from "../engine/laws";
import { nominatePM } from "../engine/government";
import type { PMCandidate } from "../data/candidates";

const SAVE_KEY = "cotroceni.save.v1";

interface GameStore {
  state: GameState | null;
  startNewGame: (presidentName: string) => void;
  loadGame: () => boolean;
  saveGame: () => void;
  resetGame: () => void;

  advance: (days?: number) => void;
  decideLaw: (lawId: string, decision: LawDecision) => void;
  appointPM: (candidate: PMCandidate) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,

  startNewGame: (presidentName: string) => {
    const state = initialState(presidentName);
    set({ state });
    persist(state);
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const state = JSON.parse(raw) as GameState;
      set({ state });
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
    set({ state: null });
  },

  advance: (days = 1) => {
    const s = get().state;
    if (!s) return;
    const next = advanceTurn(s, days);
    set({ state: next });
    persist(next);
  },

  decideLaw: (lawId, decision) => {
    const s = get().state;
    if (!s) return;
    const next = decideOnLaw(s, lawId, decision);
    set({ state: next });
    persist(next);
  },

  appointPM: (candidate) => {
    const s = get().state;
    if (!s) return;
    const next = nominatePM(s, candidate);
    set({ state: next });
    persist(next);
  },
}));

function persist(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
