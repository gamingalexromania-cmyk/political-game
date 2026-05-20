import { useGameStore } from "../store/gameStore";

export function EndScreen() {
  const state = useGameStore((s) => s.state)!;
  const reset = useGameStore((s) => s.resetGame);
  const won = state.phase === "won";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <p className="uppercase tracking-[0.4em] text-gold-light text-xs mb-6">
          End of Term
        </p>
        <h1 className="font-serif text-5xl text-parchment mb-6">
          {won ? "A presidency remembered." : "A presidency forgotten."}
        </h1>
        <p className="font-serif italic text-gold-light text-xl mb-10">
          {won
            ? `History will speak well of President ${state.presidentName}.`
            : `The history books will not be kind to President ${state.presidentName}.`}
        </p>

        <dl className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-10 text-left">
          <div>
            <dt className="text-xs uppercase text-parchment/50">Approval</dt>
            <dd className="font-mono text-2xl">
              {Math.round(state.approval)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-parchment/50">Economy</dt>
            <dd className="font-mono text-2xl">
              {Math.round(state.economy)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-parchment/50">Standing</dt>
            <dd className="font-mono text-2xl">
              {Math.round(state.legitimacy)}
            </dd>
          </div>
        </dl>

        <button onClick={reset} className="btn-primary px-8 py-3">
          Begin a new term
        </button>
      </div>
    </div>
  );
}
