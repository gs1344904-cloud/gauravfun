import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy } from 'lucide-react';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  cps: number;
  count: number;
  icon: string;
}

export const TractorClickerGame: React.FC = () => {
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('clicker_coins') || '0', 10);
  });
  const [clickPower, setClickPower] = useState<number>(1);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'harvester', name: 'Combine Harvester', cost: 15, cps: 1, count: 0, icon: '🌾' },
    { id: 'tubewell', name: 'Punjab Tube Well', cost: 100, cps: 5, count: 0, icon: '💧' },
    { id: 'tractor_5911', name: 'Modified 5911 Fleet', cost: 500, cps: 25, count: 0, icon: '🚜' },
    { id: 'studio', name: 'Moosa Village Studio', cost: 2500, cps: 120, count: 0, icon: '🎙️' },
    { id: 'billboard', name: 'Global Billboard Record', cost: 10000, cps: 600, count: 0, icon: '🏆' },
  ]);

  const totalCps = upgrades.reduce((acc, u) => acc + u.cps * u.count, 0);

  const handleClickTractor = () => {
    soundEngine.playSound('score');
    setCoins((c) => {
      const next = c + clickPower;
      localStorage.setItem('clicker_coins', next.toString());
      return next;
    });
  };

  const buyUpgrade = (id: string) => {
    const up = upgrades.find((u) => u.id === id);
    if (!up || coins < up.cost) return;

    soundEngine.playSound('powerup');
    setCoins((c) => c - up.cost);
    setUpgrades((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            count: item.count + 1,
            cost: Math.floor(item.cost * 1.25),
          };
        }
        return item;
      })
    );
  };

  // Passive earnings ticker
  useEffect(() => {
    const timer = setInterval(() => {
      if (totalCps > 0) {
        setCoins((c) => {
          const next = c + totalCps;
          localStorage.setItem('clicker_coins', next.toString());
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [totalCps]);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Wealth:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            {coins.toLocaleString()} Quintals
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Rate:</span>{' '}
          <span className="font-mono font-semibold text-emerald-400 tabular-nums">+{totalCps}/sec</span>
        </div>
      </div>

      {/* Main Big Clickable 5911 Tractor */}
      <div className="my-6 flex flex-col items-center">
        <button
          onClick={handleClickTractor}
          className="w-40 h-40 bg-gradient-to-br from-amber-500/20 via-neutral-900 to-amber-600/30 border-2 border-amber-500/40 rounded-full flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-2xl group cursor-pointer"
        >
          <span className="text-5xl group-hover:rotate-6 transition-transform">🚜</span>
          <span className="text-xs font-bold text-amber-400 font-display mt-2">TAP 5911</span>
        </button>
        <span className="text-xs text-neutral-400 mt-3">+ {clickPower} per click</span>
      </div>

      {/* Upgrades List */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <span className="text-xs font-bold text-neutral-300">Agricultural & Music Upgrades</span>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          {upgrades.map((u) => {
            const canAfford = coins >= u.cost;
            return (
              <button
                key={u.id}
                onClick={() => buyUpgrade(u.id)}
                disabled={!canAfford}
                className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-colors ${
                  canAfford
                    ? 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 text-neutral-100'
                    : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{u.icon}</span>
                  <div>
                    <div className="font-semibold text-neutral-200">{u.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      +{u.cps}/s · Owned: <span className="font-bold text-amber-400">{u.count}</span>
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-amber-400 tabular-nums">{u.cost.toLocaleString()} Q</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
