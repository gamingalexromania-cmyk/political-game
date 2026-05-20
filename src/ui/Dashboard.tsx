import { useGameStore } from "../store/gameStore";
import { formatDate } from "../engine/state";
import { canFastForward } from "../engine/turn";
import { Meters } from "./Meters";
import { Inbox } from "./Inbox";
import { LawCard } from "./LawCard";
import { PMNominationModal } from "./PMNominationModal";
import { Log } from "./Log";

export function Dashboard() {
  const state = useGameStore((s) => s.state)!;
  const advance = useGameStore((s) => s.advance);
  const reset = useGameStore((s) => s.resetGame);

  const visibleInbox = state.inbox.filter(
    (p) => !p.cooldownDays || p.cooldownDays === 0,
  );
  const activeLaw = visibleInbox[0]; // single-decision focus

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

        <section className="space-y-6">
          {activeLaw ? (
            <LawCard pending={activeLaw} />
          ) : (
            <div className="doc p-10 text-center">
              <h2 className="text-2xl text-ink mb-2">
                No urgent dossiers on your desk.
              </h2>
              <p className="text-ink/70">
                {state.government?.confirmed
                  ? "The country runs on. Parliament will surely send something soon."
                  : "First you must form a government."}
              </p>
            </div>
          )}

          <Inbox />
        </section>

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
              state.pmNomination ? "Form a government first." : "Advance one day."
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
                ? "Fast-forward 7 days."
                : "Resolve open matters first."
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

      {state.pmNomination && <PMNominationModal />}
    </div>
  );
}
