import type { PartyId } from "./parties";

export interface PMCandidate {
  id: string;
  name: string;
  party: PartyId;
  background: string; // one-line bio
  pitch: string;      // flavor text shown to player on nomination
  // Effects applied when this PM is appointed and confirmed by Parliament.
  effects: {
    approval: number;
    economy: number;
    relations: Partial<Record<PartyId, number>>;
  };
}

export const PM_CANDIDATES: PMCandidate[] = [
  {
    id: "ciolacu",
    name: "Marcel Ciolacu",
    party: "PSD",
    background: "PSD president, former Speaker of the Chamber of Deputies.",
    pitch:
      "I will lead a stable government of social responsibility. Pensions and wages must rise. Romania needs predictability, not experiments.",
    effects: {
      approval: -2,
      economy: -3,
      relations: { PSD: 12, PNL: 4, USR: -6, AUR: -8 },
    },
  },
  {
    id: "grindeanu",
    name: "Sorin Grindeanu",
    party: "PSD",
    background: "Former Prime Minister (2017), seasoned PSD operator.",
    pitch:
      "A technical PSD government, focused on absorbing EU funds and finishing the highways promised a decade ago.",
    effects: {
      approval: 0,
      economy: 2,
      relations: { PSD: 10, PNL: 3, USR: -4, AUR: -6 },
    },
  },
  {
    id: "bolojan",
    name: "Ilie Bolojan",
    party: "PNL",
    background: "PNL president, reformist mayor of Oradea, Bihor County Council head.",
    pitch:
      "Cut the bureaucracy. Cut special pensions. A liberal government that respects the public purse.",
    effects: {
      approval: 6,
      economy: 5,
      relations: { PNL: 12, PSD: -10, USR: 6, AUR: -8 },
    },
  },
  {
    id: "ciuca",
    name: "Nicolae Ciucă",
    party: "PNL",
    background: "Former Prime Minister, retired Army general.",
    pitch:
      "Discipline, defense spending at 2.5% of GDP, and continuity with our Euro-Atlantic partners.",
    effects: {
      approval: 0,
      economy: 0,
      relations: { PNL: 10, PSD: 4, USR: -2, AUR: -10 },
    },
  },
  {
    id: "drula",
    name: "Cătălin Drulă",
    party: "USR",
    background: "Former Transport Minister, USR reformist.",
    pitch:
      "An anti-corruption government. We finish the highways. We end clientelism. Romania joins the 21st century.",
    effects: {
      approval: 8,
      economy: 4,
      relations: { USR: 14, PSD: -14, PNL: -4, AUR: -10 },
    },
  },
  {
    id: "fritz",
    name: "Dominic Fritz",
    party: "USR",
    background: "USR president, mayor of Timișoara.",
    pitch:
      "A clean break with the old parties. Open government, European modernization, no more backroom deals.",
    effects: {
      approval: 6,
      economy: 2,
      relations: { USR: 12, PSD: -16, PNL: -6, AUR: -12, UDMR: 4 },
    },
  },
  {
    id: "simion",
    name: "George Simion",
    party: "AUR",
    background: "AUR leader, nationalist activist.",
    pitch:
      "A sovereignist government. Romanians first. We renegotiate everything Brussels has imposed on us.",
    effects: {
      approval: -8,
      economy: -8,
      relations: { AUR: 18, SOS: 10, POT: 8, PSD: -12, PNL: -14, USR: -18, UDMR: -20 },
    },
  },
];
