import { useGameStore } from "../store/gameStore";
import { formatDate } from "../engine/state";
import { canFastForward } from "../engine/turn";
import { Meters } from "./Meters";
import { PendingFolder } from "./PendingFolder";
import { LawCard } from "./LawCard";
import { PMNominationModal } from "./PMNominationModal";
import { Log } from "./Log";

export function Dashboard() {
  const state = useGameStore((s) => s.state)!;
  const selectedLawId = useGameStore((s) => s.selectedLawId);
  const advance = useGameStore((s) => s.advance);
  const reset = useGameStore((s) => s.resetGame);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gold/30 px-6 md:px-10 py-4 flex items-center justify-between">
        <div>
          <p className="uppercase tracking-[0.3em] text-gold-light text-[10px]">
            Cotroceni Palace · Daily Brief
          </p>
          <h1 className="font-serif text-2xl text-parchment">
            President {state.presidentName}
          </h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-xl text-parchment">
            {formatDate(state.day)}
          </p>
          <p className="text-gold-light text-xs">
            Day {state.day} of {state.termLengthDays} ·{" "}
            {state.government?.confirmed
              ? `PM ${state.government.pm.name}`
              : "no government"}
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6 px-6 md:px-10 py-8">
        <Meters />
        <PendingFolder />
        <Log />
      </main>

      {/* Footer controls */}
      <footer className="border-t border-gold/30 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            className="btn-primary"
            onClick={() => advance(1)}
            disabled={!!state.pmNomination}
            title={
              state.pmNomination
                ? "Form a government first."
                : "Advance one day. Pending dossiers tick down."
            }
          >
            Advance 1 day
          </button>
          <button
            className="btn-primary"
            onClick={() => advance(7)}
            disabled={!canFastForward(state)}
            title={
              canFastForward(state)
                ? "Fast-forward 7 days. Only available when your desk is clear."
                : "Clear your desk first to fast-forward."
            }
          >
            Skip a week
          </button>
        </div>
        <button
          className="btn-ghost text-parchment/70 border-parchment/20"
          onClick={() => {
            if (confirm("Abandon this presidency and start over?")) reset();
          }}
        >
          Resign and start over
        </button>
      </footer>

      {selectedLawId && <LawCard />}
      {state.pmNomination && <PMNominationModal />}
    </div>
  );
}
