import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface Card {
  rank: number; // 2..14 (14 is Ace)
  name: string;
  suit: '♠' | '♥' | '♦' | '♣';
  color: 'red' | 'black';
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const NAMES = ['', '', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const HigherLowerGame: React.FC = () => {
  const getRandomCard = (): Card => {
    const rank = Math.floor(Math.random() * 13) + 2;
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    return {
      rank,
      name: NAMES[rank],
      suit,
      color: suit === '♥' || suit === '♦' ? 'red' : 'black',
    };
  };

  const [currentCard, setCurrentCard] = useState<Card>(getRandomCard);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const makeGuess = (guess: 'higher' | 'lower') => {
    if (isGameOver) return;
    const nextCard = getRandomCard();

    // Check guess
    const isCorrect =
      (guess === 'higher' && nextCard.rank >= currentCard.rank) ||
      (guess === 'lower' && nextCard.rank <= currentCard.rank);

    setHistory((prev) => [currentCard, ...prev.slice(0, 4)]);
    setCurrentCard(nextCard);

    if (isCorrect) {
      soundEngine.playSound('score');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 50 * nextStreak);
      setFeedback('🎯 CORRECT GUESS!');

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
      }
      if (nextStreak % 5 === 0) {
        soundEngine.playSound('win');
        confetti({ particleCount: 40, spread: 60 });
      }
    } else {
      soundEngine.playSound('gameover');
      setFeedback('❌ WRONG CARD!');
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setCurrentCard(getRandomCard());
    setStreak(0);
    setScore(0);
    setHistory([]);
    setIsGameOver(false);
    setFeedback(null);
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
          <span className="text-neutral-400">Streak:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{streak} 🔥</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-bold text-amber-400">{bestStreak}</span>
        </div>
      </div>

      {/* Main Tabletop Card Area */}
      <div className="relative my-3 w-full h-[320px] bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-4 border-emerald-800 shadow-2xl flex flex-col items-center justify-center p-4">
        {/* Table Felt Accent */}
        <div className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest mb-3">
          CASINO HIGHER OR LOWER
        </div>

        {/* Current Face-Up Card */}
        <div className="w-36 h-52 bg-white rounded-2xl border-2 border-neutral-300 shadow-2xl flex flex-col justify-between p-3 transition-transform animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-start">
            <span
              className={`text-2xl font-black font-display leading-none ${
                currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'
              }`}
            >
              {currentCard.name}
            </span>
            <span
              className={`text-xl ${currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'}`}
            >
              {currentCard.suit}
            </span>
          </div>

          <div
            className={`text-5xl self-center font-bold ${
              currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'
            }`}
          >
            {currentCard.suit}
          </div>

          <div className="flex justify-between items-end rotate-180">
            <span
              className={`text-2xl font-black font-display leading-none ${
                currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'
              }`}
            >
              {currentCard.name}
            </span>
            <span
              className={`text-xl ${currentCard.color === 'red' ? 'text-red-600' : 'text-neutral-900'}`}
            >
              {currentCard.suit}
            </span>
          </div>
        </div>

        {/* Toast / Feedback */}
        {feedback && (
          <div className="mt-3 px-3 py-1 bg-neutral-950/80 rounded-full border border-white/20 text-xs font-bold text-neutral-100">
            {feedback}
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-xl">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-rose-500 font-display">STREAK BROKEN!</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Final Streak: <strong className="text-amber-400 text-sm font-bold">{streak} Cards</strong>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">Total Points: {score}</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Guess Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 mt-1">
        <button
          onClick={() => makeGuess('higher')}
          disabled={isGameOver}
          className="py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <ArrowUp className="w-4 h-4" />
          <span>HIGHER ▲</span>
        </button>

        <button
          onClick={() => makeGuess('lower')}
          disabled={isGameOver}
          className="py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <ArrowDown className="w-4 h-4" />
          <span>LOWER ▼</span>
        </button>
      </div>
    </div>
  );
};
