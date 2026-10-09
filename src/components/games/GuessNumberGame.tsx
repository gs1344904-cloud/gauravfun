import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

export const GuessNumberGame: React.FC = () => {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState('Guess a number between 1 and 100!');
  const [isWon, setIsWon] = useState(false);
  const [history, setHistory] = useState<{ num: number; res: string }[]>([]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(guess, 10);
    if (isNaN(val) || val < 1 || val > 100 || isWon) return;

    soundEngine.playSound('click');
    const nextTries = tries + 1;
    setTries(nextTries);

    if (val === secret) {
      soundEngine.playSound('win');
      confetti({ particleCount: 60, spread: 70 });
      setHint(`🎉 BINGO! The secret number was ${secret}!`);
      setIsWon(true);
      setHistory((prev) => [{ num: val, res: 'CORRECT! ★' }, ...prev]);
    } else if (val < secret) {
      soundEngine.playSound('score');
      setHint(`▲ HIGHER! ${val} is too low.`);
      setHistory((prev) => [{ num: val, res: 'HIGHER ▲' }, ...prev]);
    } else {
      soundEngine.playSound('hit');
      setHint(`▼ LOWER! ${val} is too high.`);
      setHistory((prev) => [{ num: val, res: 'LOWER ▼' }, ...prev]);
    }
    setGuess('');
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setSecret(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setTries(0);
    setHint('Guess a number between 1 and 100!');
    setIsWon(false);
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Target:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400">1 – 100</span>
        </div>
        <div>
          <span className="text-neutral-400">Tries:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{tries} Attempts</span>
        </div>
      </div>

      {/* Main Guess Box */}
      <div className="my-4 w-full p-5 bg-neutral-950 rounded-2xl border-2 border-amber-500/40 shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-amber-400 flex items-center justify-center font-black font-display text-2xl text-amber-400 shadow-inner mb-2">
          {isWon ? secret : '?'}
        </div>

        <p className="text-xs font-bold text-neutral-200 mt-1 leading-relaxed">{hint}</p>

        {/* Input Form */}
        <form onSubmit={handleGuess} className="w-full flex gap-2 mt-4">
          <input
            type="number"
            min="1"
            max="100"
            required
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isWon}
            placeholder="1..100"
            className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-center text-base font-bold text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            disabled={isWon || !guess}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-xs shadow-md transition-transform cursor-pointer disabled:opacity-50"
          >
            GUESS!
          </button>
        </form>

        {/* Previous Tries Chips */}
        {history.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {history.slice(0, 5).map((h, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300"
              >
                {h.num}: {h.res}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetGame}
        className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>New Secret Number</span>
      </button>
    </div>
  );
};
