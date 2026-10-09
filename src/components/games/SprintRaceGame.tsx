import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Footprints } from 'lucide-react';

export const SprintRaceGame: React.FC = () => {
  const [distanceLeft, setDistanceLeft] = useState(100);
  const [lastFoot, setLastFoot] = useState<'left' | 'right' | null>(null);
  const [speed, setSpeed] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const startTime = useRef<number | null>(null);

  // Speed decay & stopwatch loop
  useEffect(() => {
    if (!isRacing || isFinished) return;
    const interval = setInterval(() => {
      // Speed decay
      setSpeed((s) => Math.max(0, s - 0.8));

      // Timer
      if (startTime.current) {
        setTimeMs(Date.now() - startTime.current);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isRacing, isFinished]);

  const tapStride = (foot: 'left' | 'right') => {
    if (isFinished) return;

    if (!isRacing) {
      setIsRacing(true);
      startTime.current = Date.now();
      soundEngine.playSound('score');
    }

    if (foot !== lastFoot) {
      // Clean cadence stride!
      soundEngine.playSound('click');
      setLastFoot(foot);
      const newSpeed = Math.min(35, speed + 3.2);
      setSpeed(newSpeed);

      setDistanceLeft((d) => {
        const next = Math.max(0, d - (newSpeed / 10));
        if (next <= 0) {
          setIsFinished(true);
          setIsRacing(false);
          soundEngine.playSound('win');
          confetti({ particleCount: 70, spread: 80 });
        }
        return next;
      });
    } else {
      // Stumble! Tapped same foot twice
      soundEngine.playSound('hit');
      setSpeed((s) => Math.max(0, s - 6));
    }
  };

  const resetRace = () => {
    soundEngine.playSound('click');
    setDistanceLeft(100);
    setLastFoot(null);
    setSpeed(0);
    setTimeMs(0);
    setIsRacing(false);
    setIsFinished(false);
    startTime.current = null;
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Distance:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            {distanceLeft.toFixed(1)}m
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Time:</span>{' '}
          <span className="font-mono font-bold text-emerald-400 tabular-nums">
            {(timeMs / 1000).toFixed(2)}s
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Speed:</span>{' '}
          <span className="font-mono font-bold text-blue-400 tabular-nums">{speed.toFixed(0)} km/h</span>
        </div>
      </div>

      {/* Running Track Viewport */}
      <div className="relative my-3 w-full h-[320px] bg-gradient-to-b from-amber-900 via-rose-950 to-amber-950 rounded-2xl border-4 border-amber-800/60 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* White lane line markers */}
        <div className="absolute inset-0 flex justify-between px-10 pointer-events-none opacity-40">
          <div className="w-1 h-full border-r-2 border-dashed border-white" />
          <div className="w-1 h-full border-r-2 border-dashed border-white" />
        </div>

        {/* Runner Avatar position along vertical track */}
        <div className="relative w-full flex flex-col items-center">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">
            OLYMPIC 100M SPRINT TRACK
          </div>

          <div
            className="text-5xl transition-all duration-100 mt-12"
            style={{
              transform: `translateY(${((100 - distanceLeft) / 100) * 120}px) scale(${1 + speed / 80})`,
            }}
          >
            🏃‍♂️
          </div>
        </div>

        {/* Finish line tape indicator */}
        <div className="w-full border-b-4 border-dashed border-white py-1 flex justify-center text-[10px] font-black tracking-widest text-white/80">
          {distanceLeft <= 10 ? '🏁 FINISH TAPE!' : `${distanceLeft.toFixed(0)}m TO FINISH`}
        </div>

        {/* Finish Summary Screen */}
        {isFinished && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-xl">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-emerald-400 font-display">FINISH LINE CROSSED!</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Official Time: <strong className="text-amber-400 text-base font-mono font-bold">{(timeMs / 1000).toFixed(2)}s</strong>
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">World Record: 9.58s</p>
            <button
              onClick={resetRace}
              className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Race Again
            </button>
          </div>
        )}
      </div>

      {/* Alternating Stride Touch Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 mt-1">
        <button
          onClick={() => tapStride('left')}
          disabled={isFinished}
          className={`py-4 rounded-xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            lastFoot === 'right' || lastFoot === null
              ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 ring-2 ring-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>LEFT FOOT 👟</span>
        </button>

        <button
          onClick={() => tapStride('right')}
          disabled={isFinished}
          className={`py-4 rounded-xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            lastFoot === 'left'
              ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 ring-2 ring-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>RIGHT FOOT 👟</span>
        </button>
      </div>
    </div>
  );
};
