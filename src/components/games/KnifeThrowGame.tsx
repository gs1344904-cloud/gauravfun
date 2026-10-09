import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy } from 'lucide-react';

export const KnifeThrowGame: React.FC = () => {
  const [knivesLeft, setKnivesLeft] = useState(7);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [embeddedAngles, setEmbeddedAngles] = useState<number[]>([0, 90, 180]);
  const [targetAngle, setTargetAngle] = useState(0);

  const angleRef = useRef(0);
  const speedRef = useRef(2);

  // Target Rotation Loop
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      angleRef.current = (angleRef.current + speedRef.current) % 360;
      setTargetAngle(angleRef.current);
    }, 20);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const throwKnife = () => {
    if (isGameOver || knivesLeft <= 0) return;
    soundEngine.playSound('laser');

    // The angle where the knife hits (bottom of the rotating circle)
    // Relative to the rotating target, angle is (270 - current target rotation) % 360
    const hitAngle = ((270 - angleRef.current) % 360 + 360) % 360;

    // Check collision with any existing knife (within 15 degrees)
    const hasCollision = embeddedAngles.some((a) => {
      const diff = Math.abs(a - hitAngle);
      return diff < 16 || diff > 344;
    });

    if (hasCollision) {
      soundEngine.playSound('hit');
      setIsGameOver(true);
    } else {
      soundEngine.playSound('score');
      setEmbeddedAngles((prev) => [...prev, hitAngle]);
      setScore((s) => s + 10 * stage);

      const nextKnives = knivesLeft - 1;
      setKnivesLeft(nextKnives);

      if (nextKnives <= 0) {
        // Stage Complete!
        soundEngine.playSound('win');
        confetti({ particleCount: 50, spread: 60 });
        setTimeout(() => {
          setStage((st) => st + 1);
          setKnivesLeft(7 + stage);
          setEmbeddedAngles([Math.random() * 360, Math.random() * 360]);
          speedRef.current = (Math.random() > 0.5 ? 1 : -1) * (2 + stage * 0.5);
        }, 600);
      }
    }
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setScore(0);
    setStage(1);
    setKnivesLeft(7);
    setEmbeddedAngles([0, 90, 180]);
    setIsGameOver(false);
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
          <span className="text-neutral-400">Stage:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">Level {stage}</span>
        </div>
        <div>
          <span className="text-neutral-400">Knives:</span>{' '}
          <span className="font-mono font-bold text-amber-400">{knivesLeft} 🗡️</span>
        </div>
      </div>

      {/* Target Arena */}
      <div className="relative my-3 w-full h-[360px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col justify-between items-center p-4">
        {/* Rotating Wooden Wheel */}
        <div className="relative mt-8 w-44 h-44 flex items-center justify-center">
          {/* Main Wooden Log */}
          <div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 border-4 border-amber-600 shadow-2xl flex items-center justify-center transition-none relative"
            style={{ transform: `rotate(${targetAngle}deg)` }}
          >
            {/* Tree growth rings */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-950/60 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-amber-950/40" />
            </div>

            {/* Embedded Knives */}
            {embeddedAngles.map((ang, idx) => (
              <div
                key={idx}
                className="absolute top-1/2 left-1/2 w-4 h-20 -ml-2 -mt-10 origin-center pointer-events-none"
                style={{ transform: `rotate(${ang}deg) translateY(-48px)` }}
              >
                <div className="w-2 h-14 bg-neutral-200 border border-neutral-400 rounded-t-sm shadow-md mx-auto" />
                <div className="w-3 h-5 bg-amber-500 rounded-b-xs mx-auto -mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Ready Blade at bottom */}
        <div className="relative flex flex-col items-center mb-2">
          <div className="w-3 h-18 bg-neutral-200 border border-neutral-400 rounded-t-sm shadow-lg" />
          <div className="w-4 h-6 bg-amber-500 rounded-b-xs -mt-1" />
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-black text-rose-500 font-display">KNIFE SHATTERED!</h3>
            <p className="text-xs text-neutral-300 mt-1">
              You struck another embedded knife!
            </p>
            <p className="text-sm font-bold text-amber-400 mt-2">Score: {score} Pts</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Throw Button */}
      <button
        onClick={throwKnife}
        disabled={isGameOver || knivesLeft <= 0}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer disabled:opacity-50"
      >
        🗡️ THROW KNIFE
      </button>
    </div>
  );
};
