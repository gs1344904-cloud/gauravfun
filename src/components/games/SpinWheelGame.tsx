import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Sparkles } from 'lucide-react';

const PRIZES = [
  { label: '500 Coins', pts: 500, color: '#f59e0b' },
  { label: '50 Coins', pts: 50, color: '#3b82f6' },
  { label: '1000 JACKPOT', pts: 1000, color: '#ef4444' },
  { label: '100 Coins', pts: 100, color: '#10b981' },
  { label: '250 Coins', pts: 250, color: '#8b5cf6' },
  { label: '20 Coins', pts: 20, color: '#6b7280' },
  { label: '750 Coins', pts: 750, color: '#ec4899' },
  { label: 'DOUBLE x2', pts: 400, color: '#06b6d4' },
];

export const SpinWheelGame: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [totalCoins, setTotalCoins] = useState(100);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    soundEngine.playSound('jump');

    // Random extra spins (5 to 8 full revolutions + random wedge offset)
    const extraDegrees = Math.floor(Math.random() * 360) + 1800;
    const finalRot = rotation + extraDegrees;
    setRotation(finalRot);

    // Audio clicks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      soundEngine.playSound('click');
      tickCount++;
      if (tickCount > 16) clearInterval(tickInterval);
    }, 180);

    setTimeout(() => {
      setIsSpinning(false);
      // Determine winning wedge (at top marker: 360 - (finalRot % 360))
      const normalized = (360 - (finalRot % 360) + 22.5) % 360;
      const prizeIdx = Math.floor(normalized / 45) % PRIZES.length;
      const prize = PRIZES[prizeIdx];

      setWonPrize(prize.label);
      setTotalCoins((c) => c + prize.pts);

      if (prize.pts >= 500) {
        soundEngine.playSound('win');
        confetti({ particleCount: 60, spread: 70 });
      } else {
        soundEngine.playSound('score');
      }
    }, 3200);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Your Bank:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            💰 {totalCoins} Coins
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Prize:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{wonPrize || 'Ready to Spin'}</span>
        </div>
      </div>

      {/* Wheel Stage */}
      <div className="relative my-3 w-full h-[320px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-2">
        {/* Top Needle Indicator */}
        <div className="absolute top-2 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

        {/* Spinning Wheel */}
        <div
          className="relative w-64 h-64 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden transition-transform ease-out flex items-center justify-center"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '3.2s' : '0s',
          }}
        >
          {PRIZES.map((p, idx) => (
            <div
              key={idx}
              className="absolute top-0 left-0 w-full h-full flex justify-center pt-2"
              style={{
                transform: `rotate(${idx * 45}deg)`,
                backgroundColor: p.color,
                clipPath: 'polygon(50% 50%, 30% 0%, 70% 0%)',
              }}
            >
              <span className="text-[9px] font-black text-white uppercase tracking-tighter mt-2 shadow-xs">
                {p.label}
              </span>
            </div>
          ))}

          {/* Golden Center Hub */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 border-2 border-white shadow-xl flex items-center justify-center text-xs font-bold text-neutral-950">
            ★ SPIN ★
          </div>
        </div>
      </div>

      {/* Big Action CTA */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 fill-current" />
        <span>{isSpinning ? 'WHEEL IS SPINNING...' : 'SPIN CARNIVAL WHEEL!'}</span>
      </button>
    </div>
  );
};
