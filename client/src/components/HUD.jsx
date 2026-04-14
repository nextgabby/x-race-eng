export default function HUD({ lap, totalLaps, scenarioIndex, totalScenarios }) {
  const racePct = (lap / totalLaps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-neutral-400">
        <span>LAP {lap}/{totalLaps}</span>
        <span>SCENARIO {scenarioIndex + 1}/{totalScenarios}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-blink" />
          LIVE
        </span>
      </div>
      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500/60 rounded-full transition-all duration-500"
          style={{ width: `${racePct}%` }}
        />
      </div>
    </div>
  );
}
