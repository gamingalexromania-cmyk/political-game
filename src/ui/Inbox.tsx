import { useGameStore } from "../store/gameStore";

export function Inbox() {
  const inbox = useGameStore((s) => s.state?.inbox ?? []);
  const visible = inbox.filter((p) => !p.cooldownDays || p.cooldownDays === 0);
  if (visible.length <= 1) return null;

  return (
    <section>
      <h3 className="text-xs uppercase tracking-[0.3em] text-gold-light mb-2">
        Other dossiers waiting
      </h3>
      <ul className="space-y-1">
        {visible.slice(1).map((p) => (
          <li
            key={p.law.id}
            className="text-sm text-parchment/80 flex justify-between border-b border-parchment/10 py-1"
          >
            <span>{p.law.title}</span>
            <span className="font-mono text-parchment/50">
              {p.daysRemaining}d
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
