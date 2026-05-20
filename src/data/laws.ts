import type { PartyId } from "./parties";

export type LawDomain =
  | "Economy"
  | "Justice"
  | "Defense"
  | "Education"
  | "Healthcare"
  | "Energy"
  | "Foreign";

// Effects applied to game state depending on the president's choice.
// "promulgate" — sign into law.
// "return"     — send back to Parliament for re-examination (one time only, Art. 77).
// "refer"      — refer to the Constitutional Court (CCR).
export interface LawEffects {
  approval: number;     // delta to public approval
  economy: number;
  legitimacy: number;   // perceived constitutional standing
  relations: Partial<Record<PartyId, number>>;
}

export interface Law {
  id: string;
  title: string;
  domain: LawDomain;
  // Which parties pushed for this law (used for relation deltas)
  sponsors: PartyId[];
  summary: string;     // dossier text shown on the card
  promulgate: LawEffects;
  return: LawEffects;
  refer: LawEffects;
}

export const LAWS: Law[] = [
  {
    id: "law-pension-2025",
    title: "Special Pensions Reform Act",
    domain: "Justice",
    sponsors: ["USR", "PNL"],
    summary:
      "Caps service pensions for magistrates, military, and parliamentarians at the level of the contributory pension. Civil society applauds; the magistrates' associations have already announced they will challenge it at the Constitutional Court.",
    promulgate: {
      approval: 8,
      economy: 4,
      legitimacy: -2,
      relations: { USR: 6, PNL: 4, PSD: -3, AUR: 2 },
    },
    return: {
      approval: -3,
      economy: -1,
      legitimacy: 2,
      relations: { USR: -4, PNL: -2, PSD: 2 },
    },
    refer: {
      approval: 1,
      economy: 0,
      legitimacy: 4,
      relations: { USR: -2, PNL: -1 },
    },
  },
  {
    id: "law-energy-cap",
    title: "Energy Price Cap Extension",
    domain: "Energy",
    sponsors: ["PSD"],
    summary:
      "Extends the cap on household electricity and gas prices for another 18 months. Households cheer; the energy companies warn of underinvestment and the Fiscal Council flags a budget hole.",
    promulgate: {
      approval: 6,
      economy: -5,
      legitimacy: 0,
      relations: { PSD: 8, PNL: -2, USR: -3, AUR: 4 },
    },
    return: {
      approval: -4,
      economy: 3,
      legitimacy: 1,
      relations: { PSD: -6, PNL: 3, USR: 3 },
    },
    refer: {
      approval: -1,
      economy: 1,
      legitimacy: 2,
      relations: { PSD: -3 },
    },
  },
  {
    id: "law-defense-procurement",
    title: "Strategic Defense Procurement Programme",
    domain: "Defense",
    sponsors: ["PNL", "PSD"],
    summary:
      "A multi-year programme funding F-35 acquisition, Patriot batteries, and domestic ammunition production. NATO partners have signaled strong support; AUR denounces it as 'mortgaging Romania to the Americans.'",
    promulgate: {
      approval: 2,
      economy: -2,
      legitimacy: 2,
      relations: { PNL: 5, PSD: 3, USR: 2, AUR: -8, SOS: -6 },
    },
    return: {
      approval: -2,
      economy: 1,
      legitimacy: -1,
      relations: { PNL: -4, PSD: -3, AUR: 5 },
    },
    refer: {
      approval: -3,
      economy: 0,
      legitimacy: 1,
      relations: { PNL: -3, PSD: -2 },
    },
  },
  {
    id: "law-electoral-amendment",
    title: "Electoral Code Amendment",
    domain: "Justice",
    sponsors: ["PSD", "PNL"],
    summary:
      "Raises the parliamentary threshold from 5% to 7% and tightens the rules for new party registration. The governing parties call it a 'stability measure'; opposition and small parties call it a stitch-up.",
    promulgate: {
      approval: -6,
      economy: 0,
      legitimacy: -8,
      relations: { PSD: 6, PNL: 4, USR: -8, AUR: -10, POT: -10, SOS: -10 },
    },
    return: {
      approval: 4,
      economy: 0,
      legitimacy: 4,
      relations: { PSD: -5, PNL: -3, USR: 6, AUR: 4, POT: 4, SOS: 4 },
    },
    refer: {
      approval: 6,
      economy: 0,
      legitimacy: 8,
      relations: { PSD: -4, PNL: -2, USR: 6, AUR: 3, POT: 3, SOS: 3 },
    },
  },
  {
    id: "law-education-funding",
    title: "Education Funding Floor Act",
    domain: "Education",
    sponsors: ["USR", "UDMR"],
    summary:
      "Constitutionally enshrines the long-promised 6% of GDP minimum for education. Teachers' unions celebrate. The Ministry of Finance warns it is incompatible with the deficit reduction plan agreed with Brussels.",
    promulgate: {
      approval: 7,
      economy: -4,
      legitimacy: 1,
      relations: { USR: 6, UDMR: 4, PNL: -3, PSD: 0 },
    },
    return: {
      approval: -5,
      economy: 3,
      legitimacy: 0,
      relations: { USR: -6, UDMR: -3, PNL: 2 },
    },
    refer: {
      approval: -1,
      economy: 1,
      legitimacy: 2,
      relations: { USR: -2 },
    },
  },
  {
    id: "law-anti-ngo",
    title: "Foreign-Funded Organizations Transparency Act",
    domain: "Justice",
    sponsors: ["AUR", "SOS"],
    summary:
      "Requires NGOs receiving more than 50% of their funding from abroad to register as 'foreign agents' and submit to enhanced audits. The Venice Commission has already issued a critical preliminary opinion.",
    promulgate: {
      approval: -4,
      economy: -2,
      legitimacy: -10,
      relations: { AUR: 8, SOS: 6, USR: -10, UDMR: -6, PNL: -3 },
    },
    return: {
      approval: 3,
      economy: 1,
      legitimacy: 4,
      relations: { AUR: -5, SOS: -4, USR: 5, UDMR: 3 },
    },
    refer: {
      approval: 5,
      economy: 1,
      legitimacy: 9,
      relations: { AUR: -6, SOS: -5, USR: 8, UDMR: 5, PNL: 2 },
    },
  },
  {
    id: "law-healthcare-coinsurance",
    title: "Healthcare Co-insurance Bill",
    domain: "Healthcare",
    sponsors: ["PNL"],
    summary:
      "Introduces small co-payments for non-emergency hospital visits, with broad exemptions for pensioners, children, and the chronically ill. The PNL frames it as fighting waste; PSD calls it the end of free healthcare.",
    promulgate: {
      approval: -5,
      economy: 3,
      legitimacy: 0,
      relations: { PNL: 6, PSD: -6, USR: 1, AUR: -3 },
    },
    return: {
      approval: 3,
      economy: -2,
      legitimacy: 0,
      relations: { PNL: -5, PSD: 4 },
    },
    refer: {
      approval: 0,
      economy: 0,
      legitimacy: 1,
      relations: { PNL: -2 },
    },
  },
];
