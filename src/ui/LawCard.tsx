import { useGameStore } from "../store/gameStore";
import { PARTIES } from "../data/parties";
import type { LawDecision } from "../engine/laws";

const decisionLabel: Record<LawDecision, string> = {
  promulgate: "Promulgate",
  return: "Return to Parliament",
  refer: "Refer to Constitutional Court",
};

const decisionHelp: Record<LawDecision, string> = {
  promulgate: "Sign the law. It enters into force.",
  return:
    "Return for re-examination. Permitted only once per law (Art. 77).",
  refer:
    "Refer to the Constitutional Court for review of constitutionality.",
};

// Modal dossier for a single pending law. The player can act on it or close
// it to defer the decision; the 20-day countdown runs regardless.
export function LawCard() {
  const selectedLawId = useGameStore((s) => s.selectedLawId);
  const inbox = useGameStore((s) => s.state?.inbox ?? []);
  const decideLaw = useGameStore((s) => s.decideLaw);
  const closeLaw = useGameStore((s) => s.closeLaw);

  const pending = inbox.find((p) => p.law.id === selectedLawId);
  if (!pending) return null;

  const { law, daysRemaining, wasReturned } = pending;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-10"
      onClick={closeLaw}
    >
      <article
        className="doc max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeLaw}
          className="absolute top-3 right-4 text-ink/50 hover:text-ink text-2xl leading-none"
          aria-label="Close dossier"
          title="Close · keep on the desk"
        >
          ×
        </button>

        <header className="flex items-start justify-between gap-6 mb-6 border-b border-ink/15 pb-4 pr-8">
          <div>
            <p className="uppercase text-[10px] tracking-[0.3em] text-ink/50">
              Bill transmitted by Parliament · {law.domain}
            </p>
            <h2 className="font-serif text-3xl text-ink mt-1">{law.title}</h2>
            <p className="text-ink/60 text-sm mt-2">
              Sponsored by:{" "}
              {law.sponsors
                .map((id) => PARTIES.find((p) => p.id === id)?.shortName ?? id)
                .join(", ")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-3xl text-crimson">{daysRemaining}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink/50">
              days to decide
            </p>
          </div>
        </header>

        <p className="font-serif text-lg leading-relaxed text-ink mb-8">
          {law.summary}
        </p>

        {wasReturned && (
          <p className="text-sm bg-crimson/10 border border-crimson/30 text-crimson px-4 py-2 mb-6">
            This law has already been returned once. You may no longer return it.
            It must now be promulgated or referred to the Constitutional Court.
          </p>
        )}

        <div className="grid sm:grid-cols-3 gap-3">
          {(["promulgate", "return", "refer"] as LawDecision[]).map((d) => {
            const disabled = d === "return" && wasReturned;
            return (
              <button
                key={d}
                disabled={disabled}
                onClick={() => decideLaw(law.id, d)}
                className={`group text-left rounded-sm border p-4 transition ${
                  disabled
                    ? "opacity-40 cursor-not-allowed border-ink/20"
                    : "border-ink/30 hover:bg-ink hover:text-parchment"
                }`}
              >
                <p className="font-serif text-lg mb-1">{decisionLabel[d]}</p>
                <p className="text-xs leading-snug text-ink/60 group-hover:text-parchment/70">
                  {decisionHelp[d]}
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={closeLaw}
          className="mt-6 text-sm text-ink/60 hover:text-ink underline underline-offset-4"
        >
          Set aside · decide another day
        </button>
      </article>
    </div>
  );
}
