import { useEffect, useState } from "react";
import GrokRadio from "./GrokRadio";

const BRIEFING_MESSAGE =
  "Right, driver. We're on the grid, formation lap is done. Five critical strategy windows coming up today. I'll feed you the situation, you make the call. Timer is live on every decision, so if you don't call it, we lose the window. Stay sharp, stay on the radio. Let's have a good one.";

export default function BriefingScreen({ onStart }) {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 animate-fadeIn">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-black tracking-wider text-neutral-300 mb-1">
          PRE-RACE BRIEFING
        </h2>
        <div className="text-xs font-mono tracking-widest text-neutral-600">
          FORMATION LAP
        </div>
      </div>

      <div className="mb-6">
        <GrokRadio message={BRIEFING_MESSAGE} onTypingDone={() => setTypingDone(true)} />
      </div>

      <div className="space-y-3 mb-8 text-xs font-mono text-neutral-500 border border-neutral-800 rounded-lg p-4">
        <div className="text-neutral-400 font-bold tracking-widest mb-2">RULES</div>
        <p>&#8226; 5 scenarios, 2 options each</p>
        <p>&#8226; Timer starts after the radio message</p>
        <p>&#8226; No decision = 0 points</p>
        <p>&#8226; Max 3 points per scenario (15 total)</p>
      </div>

      {typingDone && (
        <button
          onClick={onStart}
          className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-display text-lg font-black tracking-wider rounded-lg transition-all active:scale-[0.98] animate-fadeIn"
        >
          LIGHTS OUT &mdash; GO
        </button>
      )}
    </div>
  );
}
