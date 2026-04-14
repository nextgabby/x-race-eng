export default function IntroScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center animate-fadeIn">
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-none mb-2">
          RACE DAY
        </h1>
        <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm tracking-widest font-mono">
          <span>with</span>
          <span className="text-white font-bold text-base">GROK</span>
          <span className="text-neutral-500">✖</span>
        </div>
      </div>

      <div className="max-w-sm space-y-4 mb-10 text-neutral-400 text-sm leading-relaxed font-mono">
        <p>
          You are the driver. Grok is your race engineer on the team radio.
        </p>
        <p>
          5 high-pressure scenarios. Timed decisions. Every call changes the race.
        </p>
        <p className="text-neutral-500 text-xs">
          Powered by Grok on ✖ | Dell Technologies x McLaren
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 px-6 bg-orange-500 hover:bg-orange-400 text-white font-display text-lg font-black tracking-wider rounded-lg transition-all active:scale-[0.98]"
      >
        START YOUR ENGINE
      </button>
    </div>
  );
}
