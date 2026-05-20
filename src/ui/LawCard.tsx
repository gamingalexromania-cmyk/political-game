import { useGameStore } from "../store/gameStore";
import { PARTIES } from "../data/parties";
import type { PendingLaw } from "../engine/state";
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

export function LawCard({ pending }: { pending: PendingLaw }) {
  const decideLaw = useGameStore((s) => s.decideLaw);
  const { law, daysRemaining, wasReturned } = pending;

  return (
    <article className="doc p-8 md:p-10">
      <header className="flex items-start justify-between gap-6 mb-6 border-b border-ink/15 pb-4">
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
    </article>
  );
}
