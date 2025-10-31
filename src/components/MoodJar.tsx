import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type MoodOption = {
  id: string;
  label: string;
  color: string;
  value: number;
};

const MOODS: MoodOption[] = [
  { id: "awful", label: "Awful", color: "#C084FC", value: 0 },
  { id: "bad", label: "Bad", color: "#93C5FD", value: 1 },
  { id: "neutral", label: "Neutral", color: "#FBCFE8", value: 2 },
  { id: "good", label: "Good", color: "#BBF7D0", value: 3 },
  { id: "great", label: "Great", color: "#FDBAAB", value: 4 },
];

type PlacedBubble = {
  id: string;
  moodId: string;
  color: string;
  x: number; // relative to jar container
  y: number; // relative to jar container
  createdAt: number;
};

const STORAGE_KEY = "smriti:mood-bubbles";

export function MoodJar() {
  const jarRef = useRef<HTMLDivElement | null>(null);
  const [placed, setPlaced] = useState<PlacedBubble[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // transient bubbles used for animation (start -> target)
  const [animBubbles, setAnimBubbles] = useState<Array<any>>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placed));
    } catch {}
  }, [placed]);

  const handleMoodClick = useCallback((mood: MoodOption, e: React.MouseEvent) => {
    const jar = jarRef.current;
    if (!jar) return;

    const jarRect = jar.getBoundingClientRect();
    const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    // target position inside jar (random x, stack from bottom)
    const innerPadding = 20;
    const innerWidth = jarRect.width - innerPadding * 2;
    const innerHeight = jarRect.height - innerPadding * 2;

    // compute stack level to avoid overlap: placed length
    const stackIndex = placed.length;
    const bubbleSize = 28; // px

    const targetX = innerPadding + Math.random() * (innerWidth - bubbleSize);
    const baseY = innerPadding + (innerHeight - bubbleSize);
    // stack upwards a bit for each bubble
    const targetY = baseY - (stackIndex % Math.floor(innerHeight / (bubbleSize * 0.8))) * (bubbleSize * 0.7);

    // starting coordinates (absolute)
    const startX = btnRect.left + btnRect.width / 2 - jarRect.left - bubbleSize / 2;
    const startY = btnRect.top + btnRect.height / 2 - jarRect.top - bubbleSize / 2;

    const animId = uuidv4();

    const animObj = {
      id: animId,
      color: mood.color,
      startX,
      startY,
      targetX,
      targetY,
      size: bubbleSize,
    };

    setAnimBubbles((s) => [...s, animObj]);

    // after animation (800ms) commit to placed
    setTimeout(() => {
      setPlaced((s) => [
        ...s,
        {
          id: animId,
          moodId: mood.id,
          color: mood.color,
          x: targetX,
          y: targetY,
          createdAt: Date.now(),
        },
      ]);

      // remove from anim list
      setAnimBubbles((s) => s.filter((b) => b.id !== animId));
    }, 750);
  }, [placed]);

  const clearAll = () => {
    setPlaced([]);
    setAnimBubbles([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-primary">MOOD BUBBLE JAR</h3>
        </div>

        <div className="relative bg-white/0 rounded-3xl p-4 flex flex-col items-center">
          {/* Jar container */}
          <div ref={jarRef} className="relative w-64 h-72 bg-[linear-gradient(#ffffff,#f3f4f6)] rounded-[28px] border border-white/60 shadow-2xl overflow-hidden">
            {/* subtle glass highlight */}
            <div className="absolute inset-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 200 220" preserveAspectRatio="none" className="opacity-60">
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
              </svg>
            </div>

            {/* placed bubbles */}
            {placed.map((b) => (
              <div
                key={b.id}
                className="absolute rounded-full flex items-center justify-center text-xs shadow-md"
                style={{
                  width: 28,
                  height: 28,
                  left: Math.max(6, Math.min(b.x, 64)),
                  top: Math.max(6, Math.min(b.y, 200)),
                  background: b.color,
                  transition: "transform 300ms ease",
                }}
                aria-hidden
              />
            ))}

            {/* animating bubbles */}
            {animBubbles.map((b) => (
              <div
                key={b.id}
                className="absolute rounded-full shadow-xl"
                style={{
                  width: b.size,
                  height: b.size,
                  left: b.startX,
                  top: b.startY,
                  background: b.color,
                  transform: `translate(${b.targetX - b.startX}px, ${b.targetY - b.startY}px)`,
                  transition: "transform 750ms cubic-bezier(.2,.9,.2,1), opacity 400ms",
                }}
              />
            ))}
          </div>

          {/* Mood buttons row (icons similar to image) */}
          <div className="mt-4 w-full">
            <div className="flex items-center justify-center gap-4 bg-white/50 rounded-xl p-3">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={(e) => handleMoodClick(m, e)}
                  className="flex flex-col items-center gap-1 focus:outline-none"
                >
                  <div style={{ background: m.color }} className="w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-white">
                    {/* minimalist face: use emoji to keep expressive */}
                    <span className="text-xs">{m.id === 'awful' ? '😣' : m.id === 'bad' ? '😕' : m.id === 'neutral' ? '😐' : m.id === 'good' ? '🙂' : '😊'}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-center text-sm text-muted-foreground">How do you feel right now?</div>
            <div className="mt-3 flex justify-center gap-4">
              <button onClick={clearAll} className="text-xs text-foreground/70 underline">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodJar;