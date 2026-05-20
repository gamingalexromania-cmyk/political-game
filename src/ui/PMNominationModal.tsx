import { useGameStore } from "../store/gameStore";
import { PARTIES } from "../data/parties";
import { confirmationOdds } from "../engine/government";

export function PMNominationModal() {
  const state = useGameStore((s) => s.state)!;
  const appointPM = useGameStore((s) => s.appointPM);
  const nomination = state.pmNomination!;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-10">
      <div className="doc max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-10">
        <p className="uppercase tracking-[0.3em] text-ink/50 text-[10px]">
          Designation of the Prime Minister · Art. 103
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mt-1 mb-3">
          Form a Government
        </h2>
        <p className="text-ink/75 leading-relaxed mb-6 max-w-2xl">
          After consulting the parliamentary parties, you must designate a
          candidate for Prime Minister. The candidate must then secure a vote
          of confidence in Parliament. Choose carefully — two failed
          nominations within sixty days entitle you to dissolve the legislature.
        </p>

        {nomination.failedCount > 0 && (
          <p className="text-sm bg-crimson/10 border border-crimson/30 text-crimson px-4 py-2 mb-6">
            Failed nominations so far in this round: {nomination.failedCount}.
            {nomination.failedCount >= 2 &&
              " You may now invoke Article 89 and dissolve Parliament — but for the MVP, simply pick someone who can pass."}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {nomination.candidates.map((c) => {
            const party = PARTIES.find((p) => p.id === c.party)!;
            const odds = confirmationOdds(state, c);
            return (
              <article
                key={c.id}
                className="border border-ink/20 p-5 hover:bg-ink hover:text-parchment transition group"
              >
                <header className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-xl">{c.name}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      background: party.color,
                      color: "white",
                    }}
                  >
                    {party.shortName}
                  </span>
                </header>
                <p className="text-xs text-ink/50 group-hover:text-parchment/60 mb-3">
                  {c.background}
                </p>
                <p className="font-serif italic mb-4 leading-relaxed">
                  &ldquo;{c.pitch}&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs text-ink/60 group-hover:text-parchment/60 mb-4">
                  <span>
                    Expected confirmation:{" "}
                    <span className="font-mono">
                      {Math.round(odds * 100)}%
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => appointPM(c)}
                  className="btn-primary w-full"
                >
                  Designate {c.name.split(" ")[0]}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
