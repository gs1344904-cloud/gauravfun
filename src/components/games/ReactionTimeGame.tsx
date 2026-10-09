import React, { useState, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Zap } from 'lucide-react';

export const ReactionTimeGame: React.FC = () => {
  const [state, setState] = useState<'IDLE' | 'WAITING' | 'READY' | 'RESULT' | 'TOO_EARLY'>('IDLE');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('reaction_best');
    return saved ? parseInt(saved, 10) : null;
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setState('WAITING');
    soundEngine.playSound('click');
    const delay = 1800 + Math.random() * 3000;

    timerRef.current = window.setTimeout(() => {
      setState('READY');
      startTimeRef.current = Date.now();
      soundEngine.playSound('laser');
    }, delay);
  };

  const handleClick = () => {
    if (state === 'IDLE' || state === 'RESULT' || state === 'TOO_EARLY') {
      startTest();
    } else if (state === 'WAITING') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('TOO_EARLY');
      soundEngine.playSound('hit');
    } else if (state === 'READY') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setState('RESULT');
      soundEngine.playSound('score');

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction_best', time.toString());
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  const getRank = (ms: number) => {
    if (ms < 190) return 'Godlike Reflexes ⚡';
    if (ms < 240) return 'Sidhu Tier Legend 🦁';
    if (ms < 300) return 'Pro Gamer Speed 🎯';
    if (ms < 400) return 'Good Reflexes 👍';
    return 'Slow reaction - keep practicing! ⏳';
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <span className="text-neutral-400">Millisecond Reflex Test</span>
        {bestTime && (
          <div>
            <span className="text-neutral-400">Fastest:</span>{' '}
            <span className="font-mono font-bold text-amber-400 tabular-nums">{bestTime} ms</span>
          </div>
        )}
      </div>

      <div
        onClick={handleClick}
        className={`w-full h-72 my-4 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors shadow-2xl select-none ${
          state === 'IDLE'
            ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-100'
            : state === 'WAITING'
            ? 'bg-red-900/90 text-white'
            : state === 'READY'
            ? 'bg-emerald-600 text-white font-extrabold animate-pulse'
            : state === 'TOO_EARLY'
            ? 'bg-amber-900 text-amber-100'
            : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        {state === 'IDLE' && (
          <>
            <Zap className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-xl font-bold font-display">CLICK TO START</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs">
              When the screen turns green, click as fast as you can!
            </p>
          </>
        )}

        {state === 'WAITING' && (
          <>
            <div className="w-6 h-6 rounded-full bg-red-400 animate-ping mb-3" />
            <h3 className="text-2xl font-bold font-display tracking-widest">WAIT FOR GREEN...</h3>
            <p className="text-xs text-red-200 mt-1">Do not click yet!</p>
          </>
        )}

        {state === 'READY' && (
          <>
            <h3 className="text-3xl font-extrabold font-display tracking-wider">CLICK NOW!</h3>
          </>
        )}

        {state === 'TOO_EARLY' && (
          <>
            <h3 className="text-2xl font-bold font-display text-amber-300">TOO EARLY!</h3>
            <p className="text-xs text-amber-200 mt-2">You clicked before it turned green.</p>
            <span className="text-xs font-semibold text-white underline mt-4">Click to try again</span>
          </>
        )}

        {state === 'RESULT' && reactionTime !== null && (
          <>
            <h3 className="text-4xl font-extrabold font-mono text-amber-400 tabular-nums">
              {reactionTime} ms
            </h3>
            <p className="text-sm font-semibold text-emerald-400 mt-2">{getRank(reactionTime)}</p>
            <span className="text-xs font-medium text-neutral-400 mt-5 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Click anywhere to test again
            </span>
          </>
        )}
      </div>
    </div>
  );
};
