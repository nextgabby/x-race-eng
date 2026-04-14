import GrokRadio from "./GrokRadio";

export default function FeedbackScreen({
  scenario,
  choiceIndex,
  wasTimeout,
  points,
  grokMessage,
  grokLive,
  onNext,
  isLast,
}) {
  const choiceLabel = wasTimeout
    ? "NO DECISION (TIMED OUT)"
    : scenario.options[choiceIndex]?.label || "Unknown";

  const pointColor =
    points === 3 ? "text-emerald-400" :
    points >= 1 ? "text-amber-400" :
    "text-red-400";

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 py-6 animate-fadeIn">
      <div className="mb-4 text-center">
        <div className="text-xs font-mono tracking-widest text-neutral-600 mb-1">
          {scenario.title}
        </div>
        <div className="font-display text-lg font-black text-neutral-300">
          {choiceLabel}
        </div>
      </div>

      <div className="text-center mb-6">
        <span className={`font-display text-5xl font-black ${pointColor}`}>
          +{points}
        </span>
        <span className="text-neutral-600 text-lg font-mono ml-1">/3</span>
      </div>

      <div className="mb-8">
        <GrokRadio message={grokMessage} live={grokLive} />
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-display text-base font-black tracking-wider rounded-lg transition-all active:scale-[0.98]"
      >
        {isLast ? "SEE RESULTS" : "NEXT SCENARIO"}
      </button>
    </div>
  );
}
