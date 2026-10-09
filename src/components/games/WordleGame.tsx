import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

const WORDS_LIST = [
  'MOOSA',
  'MANSA',
  'TRACK',
  'MUSIC',
  'SHINE',
  'PRIDE',
  'HEART',
  'FLAME',
  'ROYAL',
  'RHYME',
  'BEATS',
  'POWER',
  'SOUND',
  'TIGER',
  'BRAVE',
];

export const WordleGame: React.FC = () => {
  const [targetWord, setTargetWord] = useState<string>('MOOSA');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const startNewGame = () => {
    const random = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
    setTargetWord(random);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setHasWon(false);
    soundEngine.playSound('click');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleKeyPress = (letter: string) => {
    if (isGameOver) return;
    if (letter === 'ENTER') {
      if (currentGuess.length !== 5) return;
      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setHasWon(true);
        setIsGameOver(true);
        soundEngine.playSound('win');
        confetti({ particleCount: 80, spread: 70 });
      } else if (nextGuesses.length >= 6) {
        setIsGameOver(true);
        soundEngine.playSound('gameover');
      } else {
        soundEngine.playSound('click');
      }
    } else if (letter === 'BACK') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      soundEngine.playSound('click');
    } else {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + letter);
        soundEngine.playSound('click');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('BACK');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getLetterStatus = (letter: string, index: number, word: string) => {
    if (targetWord[index] === letter) return 'CORRECT';
    if (targetWord.includes(letter)) return 'PRESENT';
    return 'ABSENT';
  };

  const getTileBg = (status: string) => {
    switch (status) {
      case 'CORRECT': return 'bg-emerald-600 text-white border-emerald-500 font-bold';
      case 'PRESENT': return 'bg-amber-500 text-neutral-950 border-amber-400 font-bold';
      case 'ABSENT': return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      default: return 'bg-neutral-900/60 text-white border-neutral-700';
    }
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
  ];

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <span className="text-neutral-400">Guess the 5-letter word</span>
        <button
          onClick={startNewGame}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3 h-3" /> New Word
        </button>
      </div>

      {/* Wordle 6-Row Grid */}
      <div className="grid grid-rows-6 gap-2 my-4">
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const guess = guesses[rowIdx];
          const isCurrent = rowIdx === guesses.length;

          return (
            <div key={rowIdx} className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, colIdx) => {
                let letter = '';
                let status = '';

                if (guess) {
                  letter = guess[colIdx];
                  status = getLetterStatus(letter, colIdx, guess);
                } else if (isCurrent) {
                  letter = currentGuess[colIdx] || '';
                }

                return (
                  <div
                    key={colIdx}
                    className={`w-11 h-11 flex items-center justify-center rounded-lg border text-lg font-bold transition-all ${
                      status ? getTileBg(status) : 'border-neutral-700 bg-neutral-950/70 text-neutral-100'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {isGameOver && (
        <div className="mb-3 text-center">
          {hasWon ? (
            <p className="text-emerald-400 font-bold text-sm">🎉 You guessed it! Word was {targetWord}!</p>
          ) : (
            <p className="text-red-400 font-bold text-sm">Game Over! The word was {targetWord}.</p>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="w-full flex flex-col gap-1.5 pt-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                className={`py-2 text-xs font-semibold rounded active:scale-95 transition-transform ${
                  k === 'ENTER' || k === 'BACK'
                    ? 'px-2.5 bg-neutral-700 text-neutral-100 text-[10px]'
                    : 'w-7 sm:w-8 bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
              >
                {k === 'BACK' ? '⌫' : k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
