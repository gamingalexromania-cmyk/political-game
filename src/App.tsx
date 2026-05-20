import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { StartScreen } from "./ui/StartScreen";
import { Dashboard } from "./ui/Dashboard";
import { EndScreen } from "./ui/EndScreen";

export default function App() {
  const state = useGameStore((s) => s.state);
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    // Try restoring an existing save on first mount.
    loadGame();
  }, [loadGame]);

  if (!state) return <StartScreen />;
  if (state.phase !== "playing") return <EndScreen />;
  return <Dashboard />;
}
