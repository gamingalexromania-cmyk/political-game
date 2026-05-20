# Political Game — Design Decisions

A browser-based political simulator where the player is the President of Romania.
Powers and constraints follow the Romanian Constitution (Title III, Chapter II).

## Locked design choices

1. **Real party names** — PSD, PNL, USR, AUR, UDMR, POT, SOS Romania, etc.
2. **Language: English only** for now (no i18n).
3. **Visual style: Suzerain-like** — text/card-driven, narrative flavor text,
   single-decision focus, muted "presidential office" palette (navy, gold,
   parchment), serif headers + sans body.
4. **Realism: plausible** — strict to the Constitution by default, but room
   for dramatic "what-if" scenarios (drone incursions, constitutional
   standoffs, etc.).
5. **MVP scope: laws + PM appointment only.** CSAT, emergency powers, and
   foreign policy come in later phases.

## Tech stack

- Vite + React + TypeScript
- Zustand for state (pure engine functions wrapped in a store)
- Tailwind CSS for styling
- localStorage for save/load
- Vitest for engine unit tests (added later)

## Architecture rule

The `engine/` directory must remain pure: functions over `GameState`, no React,
no DOM, no random side effects outside seeded RNG. UI dispatches actions, never
mutates state directly.

## Content rule

All laws, parties, characters, and events live in `src/data/` as typed data,
not hard-coded into engine logic. Adding a new law should not require touching
engine code.

## Constitutional accuracy notes

- President is non-partisan (Art. 84) — player has no party affiliation.
- Promulgation: 20 days, may return once or refer to Constitutional Court (Art. 77).
- PM appointment after consulting parliamentary majority (Art. 85, 103).
- Two failed PM nominations within 60 days → may dissolve Parliament (Art. 89).
- State of siege/emergency must be confirmed by Parliament within 5 days (Art. 93).
- Suspension by Parliament + referendum (Art. 95); impeachment for high treason 2/3 (Art. 96).
