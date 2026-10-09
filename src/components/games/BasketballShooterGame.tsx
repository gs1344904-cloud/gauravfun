import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy } from 'lucide-react';

export const BasketballShooterGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(10);
  const [power, setPower] = useState(50);
  const [isShooting, setIsShooting] = useState(false);
  const [isScored, setIsScored] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const powerDir = useRef(1);

  // Power meter oscillation
  useEffect(() => {
    if (isShooting || isGameOver) return;
    const interval = setInterval(() => {
      setPower((p) => {
        if (p >= 95) powerDir.current = -1;
        if (p <= 5) powerDir.current = 1;
        return p + powerDir.current * 3;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [isShooting, isGameOver]);

  const shootBall = () => {
    if (isShooting || isGameOver) return;
    setIsShooting(true);
    soundEngine.playSound('jump');

    // Sweet spot between 65 and 82
    const success = power >= 65 && power <= 82;

    setTimeout(() => {
      if (success) {
        soundEngine.playSound('win');
        confetti({ particleCount: 35, spread: 50 });
        setIsScored(true);
        setScore((s) => s + 2 + (streak >= 2 ? 1 : 0));
        setStreak((s) => s + 1);
      } else {
        soundEngine.playSound('hit');
        setIsScored(false);
        setStreak(0);
      }

      setBallsLeft((b) => {
        const next = b - 1;
        if (next <= 0) setIsGameOver(true);
        return next;
      });

      setTimeout(() => {
        setIsShooting(false);
        setIsScored(null);
      }, 1000);
    }, 500);
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setScore(0);
    setBallsLeft(10);
    setStreak(0);
    setIsGameOver(false);
    setIsShooting(false);
    setIsScored(null);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Balls:</span>{' '}
          <span className="font-mono font-bold text-orange-400">{ballsLeft} Left</span>
        </div>
        <div>
          <span className="text-neutral-400">Streak:</span>{' '}
          <span className="font-mono font-bold text-amber-400">{streak} 🔥</span>
        </div>
      </div>

      {/* Arena Court */}
      <div className="relative my-3 w-full h-[360px] bg-gradient-to-b from-neutral-950 via-amber-950/40 to-amber-900/60 rounded-xl border border-neutral-700 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* Backboard & Rim */}
        <div className="relative mx-auto flex flex-col items-center mt-4">
          {/* Backboard */}
          <div className="w-24 h-16 bg-white/90 border-2 border-orange-600 rounded-xs shadow-md flex items-center justify-center">
            <div className="w-10 h-8 border-2 border-orange-600" />
          </div>
          {/* Rim Hoop */}
          <div className="relative -mt-1 w-14 h-4 rounded-full border-4 border-orange-500 shadow-lg flex justify-center">
            {/* Net strings */}
            <div className="w-10 h-10 border-b-2 border-l border-r border-dashed border-white/60 -mt-1 rounded-b-md" />
          </div>
        </div>

        {/* Dynamic Basketball Ball */}
        <div className="relative w-full flex flex-col items-center">
          <div
            className={`text-4xl transition-all duration-500 ${
              isShooting
                ? isScored
                  ? '-translate-y-48 scale-75 text-amber-400'
                  : '-translate-y-36 translate-x-12 rotate-45 scale-75'
                : 'translate-y-0 scale-100'
            }`}
          >
            🏀
          </div>
        </div>

        {/* Sweet spot power meter */}
        <div className="w-full bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
            <span>Timing Power Meter</span>
            <span className={power >= 65 && power <= 82 ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
              {power >= 65 && power <= 82 ? '🎯 SWEET SPOT!' : `${power}%`}
            </span>
          </div>
          <div className="relative w-full h-4 bg-neutral-800 rounded-full overflow-hidden">
            {/* Target sweet spot zone */}
            <div className="absolute left-[65%] w-[17%] h-full bg-emerald-500/50" />
            {/* Moving indicator */}
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-amber-400 rounded-full shadow-md"
              style={{ left: `${power}%` }}
            />
          </div>
        </div>

        {/* Result Toast */}
        {isScored !== null && (
          <div className="absolute top-24 inset-x-8 py-2 bg-neutral-950/90 rounded-lg text-center font-bold text-sm border border-neutral-700">
            {isScored ? (
              <span className="text-emerald-400">🔥 SWISH! NOTHING BUT NET!</span>
            ) : (
              <span className="text-rose-400">❌ CLANK! OFF THE BACK RIM!</span>
            )}
          </div>
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-neutral-100 font-display">CHALLENGE COMPLETE</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Final Points: <span className="font-bold text-amber-400 text-sm">{score}</span>
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Shoot Again
            </button>
          </div>
        )}
      </div>

      {/* Primary Mobile Action CTA Button */}
      <button
        onClick={shootBall}
        disabled={isShooting || isGameOver}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span>🏀 RELEASE JUMP SHOT!</span>
      </button>
    </div>
  );
};
