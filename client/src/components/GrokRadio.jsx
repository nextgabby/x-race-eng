import { useState, useEffect, useRef } from "react";

const CHAR_DELAY = 18;
const STATIC_CHARS = "░▒▓█▌▐▄▀";

function randomStatic(length) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += STATIC_CHARS[Math.floor(Math.random() * STATIC_CHARS.length)];
  }
  return s;
}

export default function GrokRadio({ message, onTypingDone, live = true }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [staticText, setStaticText] = useState("");
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const onTypingDoneRef = useRef(onTypingDone);
  onTypingDoneRef.current = onTypingDone;

  useEffect(() => {
    if (!message) return;

    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= message.length) {
        setDisplayed(message);
        setDone(true);
        clearInterval(intervalRef.current);
        onTypingDoneRef.current?.();
      } else {
        setDisplayed(message.slice(0, indexRef.current));
        setStaticText(randomStatic(3));
      }
    }, CHAR_DELAY);

    return () => clearInterval(intervalRef.current);
  }, [message]);

  if (!message) {
    return (
      <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-950/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold">
            ✖
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-neutral-400">GROK</div>
            <div className="text-[10px] tracking-widest text-neutral-600">RACE ENGINEER</div>
          </div>
        </div>
        <div className="font-mono text-sm text-neutral-500 animate-pulse">
          Connecting to race engineer...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-950/80">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold">
          ✖
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold tracking-widest text-neutral-400">GROK</div>
          <div className="text-[10px] tracking-widest text-neutral-600">RACE ENGINEER</div>
        </div>
        <div className="text-[10px] tracking-wider">
          {live ? (
            <span className="text-emerald-500">&#9889; Live</span>
          ) : (
            <span className="text-amber-500">&#128225; Cached</span>
          )}
        </div>
      </div>
      <div className="font-mono text-sm leading-relaxed text-neutral-200 min-h-[3rem]">
        {displayed}
        {!done && <span className="animate-blink">&#9610;</span>}
      </div>
      {!done && (
        <div className="mt-2 text-[10px] tracking-widest text-orange-500 font-mono">
          {staticText} TRANSMITTING
        </div>
      )}
      {done && (
        <div className="mt-2 text-[10px] tracking-widest text-amber-500 font-mono animate-pulse">
          AWAITING RESPONSE
        </div>
      )}
    </div>
  );
}
