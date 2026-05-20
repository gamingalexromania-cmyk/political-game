// Romanian Parliament composition (Chamber of Deputies, ~330 seats).
// Approximated from the 2024 parliamentary election results.
// Used both for PM-nomination math and for tracking presidential relations.

export type PartyId =
  | "PSD"
  | "PNL"
  | "USR"
  | "AUR"
  | "POT"
  | "SOS"
  | "UDMR"
  | "MIN"; // Minorities group

export interface Party {
  id: PartyId;
  name: string;
  shortName: string;
  ideology: string;
  seats: number;
  // -100 hostile, 0 neutral, +100 allied. Initial values reflect a non-partisan
  // president freshly inaugurated.
  initialRelation: number;
  color: string; // hex for UI accents
}

export const PARTIES: Party[] = [
  {
    id: "PSD",
    name: "Social Democratic Party",
    shortName: "PSD",
    ideology: "Social democracy, center-left",
    seats: 86,
    initialRelation: 10,
    color: "#c8102e",
  },
  {
    id: "AUR",
    name: "Alliance for the Union of Romanians",
    shortName: "AUR",
    ideology: "National conservatism, far-right",
    seats: 63,
    initialRelation: -25,
    color: "#1a3a6c",
  },
  {
    id: "PNL",
    name: "National Liberal Party",
    shortName: "PNL",
    ideology: "Liberal conservatism, center-right",
    seats: 49,
    initialRelation: 15,
    color: "#fdd008",
  },
  {
    id: "USR",
    name: "Save Romania Union",
    shortName: "USR",
    ideology: "Liberalism, progressivism",
    seats: 40,
    initialRelation: 10,
    color: "#3b82f6",
  },
  {
    id: "SOS",
    name: "S.O.S. Romania",
    shortName: "SOS",
    ideology: "Right-wing populism",
    seats: 28,
    initialRelation: -30,
    color: "#5b1a1a",
  },
  {
    id: "POT",
    name: "Party of Young People",
    shortName: "POT",
    ideology: "Right-wing populism",
    seats: 24,
    initialRelation: -15,
    color: "#7c3aed",
  },
  {
    id: "UDMR",
    name: "Democratic Union of Hungarians in Romania",
    shortName: "UDMR",
    ideology: "Hungarian minority interests",
    seats: 22,
    initialRelation: 5,
    color: "#16a34a",
  },
  {
    id: "MIN",
    name: "National Minorities Group",
    shortName: "Minorities",
    ideology: "Constitutionally reserved seats",
    seats: 18,
    initialRelation: 0,
    color: "#94a3b8",
  },
];

export const TOTAL_SEATS = PARTIES.reduce((s, p) => s + p.seats, 0);
export const MAJORITY_THRESHOLD = Math.floor(TOTAL_SEATS / 2) + 1;
