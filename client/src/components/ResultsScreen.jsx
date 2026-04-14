import { useEffect, useState } from "react";
import GrokRadio from "./GrokRadio";
import { getResult } from "../utils/scoring";

export default function ResultsScreen({ totalPoints, decisions, debriefMessage, debriefLive, onRestart }) {
  const result = getResult(totalPoints);

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{result.emoji}</div>
        <h2
          className="font-display text-3xl font-black tracking-wider"
          style={{ color: result.color }}
        >
          {result.title}
        </h2>
        <div className="text-neutral-500 font-mono text-sm mt-1">{result.tier}</div>
      </div>

      <div className="text-center mb-6">
        <span className="font-display text-5xl font-black text-white">{totalPoints}</span>
        <span className="text-neutral-600 text-2xl font-mono">/15</span>
      </div>

      <div className="border border-neutral-800 rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <span className="text-xs font-mono tracking-widest text-neutral-500">RACE BREAKDOWN</span>
        </div>
        {decisions.map((d, i) => {
          const ptColor =
            d.points === 3 ? "text-emerald-400" :
            d.points >= 1 ? "text-amber-400" :
            "text-red-400";
          return (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50 last:border-b-0"
            >
              <div>
                <div className="text-xs font-mono text-neutral-500">{d.scenario}</div>
                <div className="text-sm text-neutral-300 font-mono">{d.choice}</div>
              </div>
              <div className={`font-display text-xl font-black ${ptColor}`}>+{d.points}</div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <div className="text-xs font-mono tracking-widest text-neutral-600 mb-2">POST-RACE DEBRIEF</div>
        <GrokRadio message={debriefMessage} live={debriefLive} />
      </div>

      <div className="space-y-3 mt-auto">
        <button
          onClick={onRestart}
          className="w-full py-4 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 font-display text-base font-black tracking-wider rounded-lg transition-all active:scale-[0.98]"
        >
          RACE AGAIN
        </button>
      </div>

      <div className="text-center mt-8 text-xs font-mono text-neutral-700 tracking-widest">
        Powered by Grok on ✖ | Dell Technologies x McLaren
      </div>
    </div>
  );
}
