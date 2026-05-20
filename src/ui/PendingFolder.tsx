import { useGameStore } from "../store/gameStore";
import { PARTIES } from "../data/parties";
import type { PendingLaw } from "../engine/state";

// The President's desk: every law transmitted by Parliament that has not yet
// been decided sits here as a dossier card. The 20-day countdown runs even
// when the dossier is closed; expiry triggers tacit promulgation in the
// engine's turn loop.
export function PendingFolder() {
  const inbox = useGameStore((s) => s.state?.inbox ?? []);
  const openLaw = useGameStore((s) => s.openLaw);
  const government = useGameStore((s) => s.state?.government);

  const visible = inbox.filter(
    (p) => !p.cooldownDays || p.cooldownDays === 0,
  );

  if (visible.length === 0) {
    return (
      <div className="doc p-10 text-center">
        <h2 className="font-serif text-2xl text-ink mb-2">
          Your desk is clear.
        </h2>
        <p className="text-ink/70">
          {government?.confirmed
            ? "No bills awaiting promulgation. Parliament will surely send something soon."
            : "First you must form a government. Until then, no legislation can be transmitted."}
        </p>
      </div>
    );
  }

  // Sort by urgency: fewest days remaining first.
  const sorted = [...visible].sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <section>
      <header className="flex items-baseline justify-between mb-3">
        <h2 className="font-serif text-xl text-parchment">
          Pending Dossiers
        </h2>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
          {visible.length} on your desk
        </p>
      </header>

      <ul className="space-y-3">
        {sorted.map((p) => (
          <DossierRow key={p.law.id} pending={p} onOpen={() => openLaw(p.law.id)} />
        ))}
      </ul>

      <p className="text-xs text-parchment/50 mt-4 italic">
        The 20-day promulgation window runs whether you open the file or not.
        Failure to act results in tacit promulgation.
      </p>
    </section>
  );
}

function DossierRow({
  pending,
  onOpen,
}: {
  pending: PendingLaw;
  onOpen: () => void;
}) {
  const { law, daysRemaining, wasReturned } = pending;
  const urgent = daysRemaining <= 5;

  return (
    <li>
      <button
        onClick={onOpen}
        className="doc w-full text-left p-5 transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="uppercase text-[10px] tracking-[0.3em] text-ink/50">
              {law.domain} · sponsored by{" "}
              {law.sponsors
                .map((id) => PARTIES.find((p) => p.id === id)?.shortName ?? id)
                .join(", ")}
            </p>
            <h3 className="font-serif text-xl text-ink mt-1 truncate">
              {law.title}
            </h3>
            <p className="text-sm text-ink/70 mt-1 line-clamp-2">
              {law.summary}
            </p>
            {wasReturned && (
              <p className="text-[11px] text-crimson mt-2 italic">
                Already returned once · cannot be returned again
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p
              className={`font-mono text-3xl ${
                urgent ? "text-crimson" : "text-ink"
              }`}
            >
              {daysRemaining}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-ink/50">
              days left
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}
