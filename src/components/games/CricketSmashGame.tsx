import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const CricketSmashGame: React.FC = () => {
  const [runs, setRuns] = useState<number>(0);
  const [ballsLeft, setBallsLeft] = useState<number>(6);
  const [lastShot, setLastShot] = useState<string>('');
  const [bowlerState, setBowlerState] = useState<'IDLE' | 'BOWLING' | 'DELIVERED'>('IDLE');
  const [ballPosition, setBallPosition] = useState<number>(0); // 0 to 100% down the pitch
  const [isMatchOver, setIsMatchOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_smash_high') || '0', 10);
  });

  const timerRef = useRef<number | null>(null);

  const startMatch = () => {
    setRuns(0);
    setBallsLeft(6);
    setLastShot('');
    setIsMatchOver(false);
    bowlBall();
  };

  const bowlBall = () => {
    if (ballsLeft <= 0) {
      finishMatch();
      return;
    }
    setBowlerState('BOWLING');
    setBallPosition(0);
    setLastShot('Watch the ball approaching the crease...');

    const duration = 1200 + Math.random() * 400; // delivery speed
    const startTime = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setBallPosition(progress);

      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setBowlerState('DELIVERED');
        // Missed swing!
        swingBatMiss();
      }
    }, 20);
  };

  const swingBat = () => {
    if (bowlerState !== 'BOWLING' || isMatchOver) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setBowlerState('DELIVERED');
    setBallsLeft((b) => b - 1);

    // Sweet timing zone: 72% to 88%
    const timing = ballPosition;

    if (timing >= 75 && timing <= 85) {
      // Perfect timing: SIX!
      soundEngine.playSound('score');
      confetti({ particleCount: 50, spread: 60 });
      setRuns((r) => r + 6);
      setLastShot('🚀 OUT OF THE STADIUM! 6 RUNS! MONSTER HIT!');
    } else if ((timing >= 65 && timing < 75) || (timing > 85 && timing <= 92)) {
      // Good timing: FOUR!
      soundEngine.playSound('score');
      setRuns((r) => r + 4);
      setLastShot('🔥 Raced along the turf! BOUNDARY 4 RUNS!');
    } else if (timing >= 50 && timing < 65) {
      // Early edge: 1 or 2 runs
      soundEngine.playSound('click');
      const earned = Math.random() > 0.5 ? 2 : 1;
      setRuns((r) => r + earned);
      setLastShot(`Single taken! ${earned} run.`);
    } else {
      // Dot ball or bowled
      soundEngine.playSound('hit');
      setLastShot('Clean bowled! Middle stump uprooted! 0 runs.');
    }

    setTimeout(() => {
      setBallsLeft((current) => {
        if (current <= 0) {
          finishMatch();
          return 0;
        } else {
          bowlBall();
          return current;
        }
      });
    }, 1500);
  };

  const swingBatMiss = () => {
    setBallsLeft((b) => {
      const next = b - 1;
      if (next <= 0) {
        finishMatch();
      } else {
        setTimeout(bowlBall, 1500);
      }
      return next;
    });
    soundEngine.playSound('hit');
    setLastShot('Beaten outside off stump! Dot ball.');
  };

  const finishMatch = () => {
    setIsMatchOver(true);
    setBowlerState('IDLE');
    setRuns((final) => {
      if (final > highScore) {
        setHighScore(final);
        localStorage.setItem('cricket_smash_high', final.toString());
        soundEngine.playSound('win');
      }
      return final;
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Total Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{runs}</span>
        </div>
        <div>
          <span className="text-neutral-400">Balls Left:</span>{' '}
          <span className="font-mono font-semibold text-emerald-400 tabular-nums">{ballsLeft} / 6</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-300 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* Cricket Pitch View */}
      <div className="relative w-full h-64 my-4 bg-gradient-to-b from-green-900 via-yellow-950 to-green-900 rounded-xl border border-neutral-700 overflow-hidden flex flex-col items-center justify-between p-3 shadow-inner">
        {/* Bowler End & Stumps */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-2 bg-yellow-200 rounded-xs mb-1" />
          <span className="text-[11px] text-neutral-300 font-semibold">Bowler: Fast Yorker 145 KPH</span>
        </div>

        {/* Pitch track */}
        <div className="relative w-28 h-40 bg-amber-900/60 rounded border-x-2 border-dashed border-amber-200/40 flex justify-center">
          {/* Sweet Spot Timing Marker */}
          <div className="absolute bottom-6 w-full h-8 bg-emerald-500/25 border-y border-emerald-400/60 flex items-center justify-center">
            <span className="text-[9px] font-bold text-emerald-300 tracking-wider">SWEET SPOT</span>
          </div>

          {/* Red Cricket Leather Ball */}
          {bowlerState === 'BOWLING' && (
            <div
              className="absolute w-5 h-5 bg-red-600 rounded-full border border-red-300 shadow-md transition-all duration-75"
              style={{
                top: `${ballPosition}%`,
                transform: 'translateX(-50%)',
                left: '50%',
              }}
            />
          )}
        </div>

        {/* Batsman Crease & Stumps */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-1.5 bg-white rounded-xs mb-1" />
          <span className="text-[11px] text-amber-300 font-bold">SIDHU ON STRIKE 🏏</span>
        </div>
      </div>

      <div className="w-full text-center min-h-6 mb-3">
        <p className="text-xs font-semibold text-neutral-200">{lastShot}</p>
      </div>

      {isMatchOver ? (
        <div className="w-full text-center">
          <p className="text-sm font-bold text-amber-400 mb-2">Over Finished! Total Runs: {runs}</p>
          <button
            onClick={startMatch}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Next Over Match
          </button>
        </div>
      ) : (
        <div className="w-full flex gap-3">
          {bowlerState === 'IDLE' ? (
            <button
              onClick={startMatch}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-sm"
            >
              Start 6-Ball Match
            </button>
          ) : (
            <button
              onClick={swingBat}
              disabled={bowlerState !== 'BOWLING'}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-neutral-950 font-extrabold rounded-lg text-sm tracking-wide shadow-lg disabled:opacity-50"
            >
              SWING BAT (CLICK HERE!)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
