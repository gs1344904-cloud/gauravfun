import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Sparkles } from 'lucide-react';

export const BubblePopGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<boolean[]>(Array(36).fill(false));
  const [poppedCount, setPoppedCount] = useState(0);

  const popBubble = (idx: number) => {
    if (bubbles[idx]) return;
    soundEngine.playSound('click');

    const nextBubbles = [...bubbles];
    nextBubbles[idx] = true;
    setBubbles(nextBubbles);
    setPoppedCount((c) => c + 1);

    if (nextBubbles.every((b) => b)) {
      soundEngine.playSound('win');
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => {
        setBubbles(Array(36).fill(false));
      }, 800);
    }
  };

  const resetSheet = () => {
    soundEngine.playSound('click');
    setBubbles(Array(36).fill(false));
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Popped:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            {poppedCount} Bubbles
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Sheet:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">
            {bubbles.filter((b) => !b).length} Remaining
          </span>
        </div>
      </div>

      {/* Bubble Wrap Sheet */}
      <div className="my-3 p-3 bg-neutral-950 rounded-2xl border-2 border-cyan-500/30 shadow-2xl">
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
          {bubbles.map((isPopped, idx) => (
            <button
              key={idx}
              onClick={() => popBubble(idx)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-100 flex items-center justify-center cursor-pointer ${
                isPopped
                  ? 'bg-neutral-900/80 border border-neutral-800 scale-90 shadow-inner'
                  : 'bg-gradient-to-br from-cyan-400/80 via-blue-500/70 to-indigo-600/80 border-2 border-white/60 shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              {isPopped ? (
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-white/70 -mt-2 -ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetSheet}
        className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Fresh Bubble Sheet</span>
      </button>
    </div>
  );
};
