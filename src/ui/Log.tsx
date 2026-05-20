import { useGameStore } from "../store/gameStore";
import { formatDate } from "../engine/state";

export function Log() {
  const log = useGameStore((s) => s.state?.log ?? []);
  const entries = [...log].reverse();

  return (
    <aside className="lg:sticky lg:top-6 self-start">
      <h3 className="text-xs uppercase tracking-[0.3em] text-gold-light mb-3">
        Daily Log
      </h3>
      <ol className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {entries.map((entry, i) => (
          <li
            key={i}
            className="text-sm leading-relaxed text-parchment/85 border-l-2 border-gold/40 pl-3"
          >
            <p className="text-[11px] uppercase tracking-wider text-gold-light/70">
              {formatDate(entry.day)}
            </p>
            <p>{entry.text}</p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
