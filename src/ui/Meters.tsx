import { useGameStore } from "../store/gameStore";
import { PARTIES } from "../data/parties";

function Bar({
  label,
  value,
  hint,
  accent = "bg-gold",
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs mb-1">
        <span className="uppercase tracking-wider text-parchment/70">
          {label}
        </span>
        <span className="font-mono text-parchment">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 bg-parchment/15 rounded-sm overflow-hidden">
        <div
          className={`h-full ${accent}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {hint && <p className="text-[11px] text-parchment/40 mt-1">{hint}</p>}
    </div>
  );
}

export function Meters() {
  const state = useGameStore((s) => s.state)!;

  return (
    <aside className="space-y-6 lg:sticky lg:top-6 self-start">
      <section className="space-y-4">
        <h2 className="text-lg text-gold-light font-serif">The State of Affairs</h2>
        <Bar label="Approval" value={state.approval} accent="bg-gold" />
        <Bar label="Economy" value={state.economy} accent="bg-emerald-500" />
        <Bar
          label="Constitutional standing"
          value={state.legitimacy}
          accent="bg-sky-400"
          hint="High when you respect the Court and consult Parliament."
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm uppercase tracking-wider text-gold-light/80">
          Party Relations
        </h3>
        <ul className="space-y-1 text-sm">
          {PARTIES.map((p) => {
            const rel =
              state.relations.find((r) => r.id === p.id)?.value ?? 0;
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="text-parchment/90">{p.shortName}</span>
                  <span className="text-parchment/40 text-xs">{p.seats}</span>
                </span>
                <span
                  className={`font-mono text-xs ${
                    rel > 20
                      ? "text-emerald-400"
                      : rel < -20
                        ? "text-rose-400"
                        : "text-parchment/70"
                  }`}
                >
                  {rel > 0 ? "+" : ""}
                  {rel}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
