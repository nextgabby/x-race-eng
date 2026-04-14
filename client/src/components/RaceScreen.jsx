import { useState, useCallback } from "react";
import HUD from "./HUD";
import GrokRadio from "./GrokRadio";
import Timer from "./Timer";

export default function RaceScreen({ scenario, scenarioIndex, totalScenarios, grokMessage, grokLive, onDecision }) {
  const [typingDone, setTypingDone] = useState(false);
  const [decided, setDecided] = useState(false);

  const handleTypingDone = useCallback(() => {
    setTypingDone(true);
  }, []);

  const handleChoice = (optionIndex) => {
    if (decided) return;
    setDecided(true);
    onDecision(optionIndex, false);
  };

  const handleTimeout = () => {
    if (decided) return;
    setDecided(true);
    onDecision(-1, true);
  };

  return (
    <div className="flex flex-col px-4 py-6 animate-fadeIn">
      <HUD
        lap={scenario.lap}
        totalLaps={scenario.totalLaps}
        scenarioIndex={scenarioIndex}
        totalScenarios={totalScenarios}
      />

      <div className="mt-4 mb-2">
        <h2 className="font-display text-xl font-black tracking-wider text-orange-500">
          {scenario.title}
        </h2>
      </div>

      <div className="mb-4">
        <GrokRadio message={grokMessage} onTypingDone={handleTypingDone} live={grokLive} />
      </div>

      {typingDone && !decided && (
        <div className="mb-4 animate-fadeIn">
          <Timer seconds={scenario.timerSeconds} active={true} onTimeout={handleTimeout} />
        </div>
      )}

      {typingDone && (
        <div className="space-y-3 animate-fadeIn">
          {scenario.options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => handleChoice(i)}
              disabled={decided}
              className={`w-full text-left p-4 rounded-lg border transition-all active:scale-[0.98] ${
                decided
                  ? "border-neutral-800 bg-neutral-900/50 text-neutral-600 cursor-not-allowed"
                  : "border-neutral-700 bg-neutral-900 hover:bg-orange-950/40 hover:border-orange-600 text-white cursor-pointer"
              }`}
            >
              <div className="font-display text-lg font-black tracking-wide">
                {opt.label}
              </div>
              <div className="text-xs font-mono text-neutral-500 mt-1">
                {opt.subtitle}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
