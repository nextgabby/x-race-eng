import { useState, useEffect, useRef, useCallback } from "react";

export default function Timer({ seconds, active, onTimeout }) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeoutRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active]);

  const pct = (remaining / seconds) * 100;
  const color =
    remaining > 5 ? "bg-emerald-500 shadow-emerald-500/50" :
    remaining > 3 ? "bg-amber-500 shadow-amber-500/50" :
    "bg-red-500 shadow-red-500/50";

  const textColor =
    remaining > 5 ? "text-emerald-400" :
    remaining > 3 ? "text-amber-400" :
    "text-red-400";

  return (
    <div className="space-y-2">
      <div className={`text-center font-display text-3xl font-black tabular-nums ${textColor} ${remaining <= 3 ? "animate-pulse" : ""}`}>
        {remaining}s
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full shadow-lg transition-all duration-1000 linear ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
