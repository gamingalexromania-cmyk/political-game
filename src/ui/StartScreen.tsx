import { useState } from "react";
import { useGameStore } from "../store/gameStore";

export function StartScreen() {
  const [name, setName] = useState("");
  const startNewGame = useGameStore((s) => s.startNewGame);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        <p className="uppercase tracking-[0.4em] text-gold-light text-xs mb-6">
          Cotroceni Palace
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-parchment mb-4">
          President of Romania
        </h1>
        <p className="font-serif italic text-gold-light text-xl mb-10">
          The constitution is yours to uphold.
        </p>

        <p className="text-parchment/80 leading-relaxed mb-10 max-w-xl mx-auto">
          You have been sworn in for a five-year term. Parliament has just
          convened. The parties are already manoeuvring. Your first task is
          to designate a Prime Minister; many more will follow.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            startNewGame(name);
          }}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name, Mr./Madam President"
            className="bg-transparent border-b border-gold/60 text-parchment text-center text-lg py-2 w-80 focus:outline-none focus:border-gold-light placeholder:text-parchment/40"
            autoFocus
          />
          <button type="submit" className="btn-primary mt-4 px-8 py-3">
            Take the oath of office
          </button>
        </form>

        <p className="text-parchment/40 text-xs mt-12">
          A political simulator inspired by the Romanian Constitution, Title III, Chapter II.
        </p>
      </div>
    </div>
  );
}
