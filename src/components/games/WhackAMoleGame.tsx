import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const WhackAMoleGame: React.FC = () => {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('whack_mole_high') || '0', 10);
  });

  const timerRef = useRef<number | null>(null);
  const moleIntervalRef = useRef<number | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setIsPlaying(true);
    soundEngine.playSound('click');

    // Countdown timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Mole popup loop
    moleIntervalRef.current = window.setInterval(() => {
      const nextHole = Math.floor(Math.random() * 9);
      setActiveHole(nextHole);
      soundEngine.playSound('click');
    }, 750);
  };

  const whack = (index: number) => {
    if (!isPlaying) return;
    if (activeHole === index) {
      soundEngine.playSound('score');
      setScore((s) => s + 1);
      setActiveHole(null); // Hit!
    } else {
      soundEngine.playSound('hit');
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setActiveHole(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
    soundEngine.playSound('gameover');

    setScore((final) => {
      if (final > highScore) {
        setHighScore(final);
        localStorage.setItem('whack_mole_high', final.toString());
        confetti({ particleCount: 60, spread: 70 });
      }
      return final;
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Time:</span>{' '}
          <span className="font-mono font-bold text-emerald-400 tabular-nums">{timeLeft}s</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-300 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* 3x3 Mole Holes Grid */}
      <div className="grid grid-cols-3 gap-3 my-5">
        {Array.from({ length: 9 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => whack(idx)}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform"
          >
            {/* Mole Hole Dirt Rim */}
            <div className="absolute inset-x-2 bottom-1 h-4 bg-amber-950/80 rounded-full" />

            {activeHole === idx && (
              <span className="text-4xl animate-bounce z-10 filter drop-shadow-md">
                🎯
              </span>
            )}
          </button>
        ))}
      </div>

      {!isPlaying ? (
        <button
          onClick={startGame}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-sm transition-transform shadow-lg"
        >
          {timeLeft === 0 ? 'Play Again' : 'Start Reflex Blitz (20s)'}
        </button>
      ) : (
        <span className="text-xs text-neutral-400">Tap targets as fast as they appear!</span>
      )}
    </div>
  );
};
