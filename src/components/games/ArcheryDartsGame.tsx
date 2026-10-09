import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Target } from 'lucide-react';

export const ArcheryDartsGame: React.FC = () => {
  const [arrowsLeft, setArrowsLeft] = useState(6);
  const [score, setScore] = useState(0);
  const [isAiming, setIsAiming] = useState(true);
  const [lastShot, setLastShot] = useState<{ x: number; y: number; pts: number } | null>(null);
  const [shots, setShots] = useState<{ x: number; y: number; pts: number }[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const aimX = useRef(140);
  const aimY = useRef(140);
  const vx = useRef(3.5);
  const vy = useRef(2.5);
  const [, setTick] = useState(0);

  // Reticle oscillation loop
  useEffect(() => {
    if (!isAiming || isGameOver) return;
    const interval = setInterval(() => {
      aimX.current += vx.current;
      aimY.current += vy.current;

      if (aimX.current >= 240 || aimX.current <= 40) vx.current *= -1;
      if (aimY.current >= 240 || aimY.current <= 40) vy.current *= -1;

      setTick((t) => t + 1);
    }, 20);
    return () => clearInterval(interval);
  }, [isAiming, isGameOver]);

  const shootArrow = () => {
    if (!isAiming || isGameOver || arrowsLeft <= 0) return;
    setIsAiming(false);
    soundEngine.playSound('laser');

    // Calculate score based on distance from center (140, 140)
    const centerX = 140;
    const centerY = 140;
    const dist = Math.hypot(aimX.current - centerX, aimY.current - centerY);

    let pts = 0;
    if (dist <= 15) pts = 50; // Bullseye
    else if (dist <= 35) pts = 30;
    else if (dist <= 60) pts = 20;
    else if (dist <= 90) pts = 10;
    else pts = 5;

    const shotData = { x: aimX.current, y: aimY.current, pts };
    setLastShot(shotData);
    setShots((prev) => [...prev, shotData]);
    setScore((s) => s + pts);

    if (pts === 50) {
      soundEngine.playSound('win');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      soundEngine.playSound('score');
    }

    const nextArrows = arrowsLeft - 1;
    setArrowsLeft(nextArrows);

    setTimeout(() => {
      if (nextArrows <= 0) {
        setIsGameOver(true);
      } else {
        setIsAiming(true);
        setLastShot(null);
      }
    }, 1000);
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setArrowsLeft(6);
    setScore(0);
    setShots([]);
    setLastShot(null);
    setIsGameOver(false);
    setIsAiming(true);
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
          <span className="text-neutral-400">Arrows:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{arrowsLeft} Left</span>
        </div>
        <div>
          <span className="text-neutral-400">Last:</span>{' '}
          <span className="font-mono font-bold text-amber-400">
            {lastShot ? `+${lastShot.pts}` : '-'}
          </span>
        </div>
      </div>

      {/* Target Canvas Container */}
      <div className="relative my-3 w-full h-[320px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex items-center justify-center p-2">
        {/* Concentric Target Rings */}
        <div className="relative w-[280px] h-[280px] rounded-full border-4 border-neutral-700 bg-white shadow-2xl flex items-center justify-center overflow-hidden">
          {/* 10 pts white ring */}
          <div className="w-[230px] h-[230px] rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center">
            {/* 20 pts black ring */}
            <div className="w-[170px] h-[170px] rounded-full bg-blue-600 border-2 border-neutral-700 flex items-center justify-center">
              {/* 30 pts blue ring */}
              <div className="w-[110px] h-[110px] rounded-full bg-red-600 border-2 border-neutral-700 flex items-center justify-center">
                {/* 50 pts yellow gold bullseye */}
                <div className="w-[50px] h-[50px] rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Previous Shots */}
          {shots.map((sh, idx) => (
            <div
              key={idx}
              className="absolute w-3.5 h-3.5 rounded-full bg-rose-500 border border-white shadow-md -ml-1.5 -mt-1.5 pointer-events-none"
              style={{ left: `${sh.x}px`, top: `${sh.y}px` }}
            />
          ))}

          {/* Active Aiming Crosshair Reticle */}
          {isAiming && (
            <div
              className="absolute w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center -ml-4 -mt-4 pointer-events-none shadow-lg animate-pulse"
              style={{ left: `${aimX.current}px`, top: `${aimY.current}px` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
          )}
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-xl">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-neutral-100 font-display">ARCHERY ROUND OVER</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Final Points: <strong className="text-amber-400 text-sm font-bold">{score} Pts</strong>
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Shoot Another End
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <button
        onClick={shootArrow}
        disabled={!isAiming || isGameOver}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Target className="w-4 h-4" />
        <span>🎯 LOOSE ARROW / THROW DART!</span>
      </button>
    </div>
  );
};
