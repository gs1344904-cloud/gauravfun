import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy } from 'lucide-react';

const WORDS = [
  'ARCADE',
  'GAMING',
  'PADDLE',
  'CRICKET',
  'CHAMPION',
  'RECORD',
  'PUZZLE',
  'STRIKE',
  'RETRO',
  'TURBO',
  'GALAXY',
  'FLAPPY',
  'CASINO',
  'KNIFE',
  'MATRIX',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const HangmanGame: React.FC = () => {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const isWon = word.split('').every((l) => guessedLetters.includes(l));
  const isLost = mistakes >= 6;

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || isWon || isLost) return;

    const nextGuessed = [...guessedLetters, letter];
    setGuessedLetters(nextGuessed);

    if (word.includes(letter)) {
      soundEngine.playSound('score');
      if (word.split('').every((l) => nextGuessed.includes(l))) {
        soundEngine.playSound('win');
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      soundEngine.playSound('hit');
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      if (nextMistakes >= 6) {
        soundEngine.playSound('gameover');
      }
    }
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessedLetters([]);
    setMistakes(0);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Strikes:</span>{' '}
          <span className="font-mono text-base font-bold text-rose-400 tabular-nums">
            {mistakes} / 6
          </span>
        </div>
        <div>
          <span className="text-neutral-400">Status:</span>{' '}
          <span className="font-mono font-bold text-amber-400">
            {isWon ? '🏆 YOU ESCAPED!' : isLost ? '💀 HANGED!' : 'GUESS LETTERS'}
          </span>
        </div>
      </div>

      {/* Gallows Diagram */}
      <div className="relative my-3 w-full h-[180px] bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center p-3">
        <div className="text-xs font-mono text-neutral-400 flex flex-col items-center">
          <div className="text-amber-400 font-bold mb-1">
            {mistakes === 0 && '  +---+ \n  |   | \n      | \n      | \n      | \n========='}
            {mistakes === 1 && '  +---+ \n  |   | \n  O   | \n      | \n      | \n========='}
            {mistakes === 2 && '  +---+ \n  |   | \n  O   | \n  |   | \n      | \n========='}
            {mistakes === 3 && '  +---+ \n  |   | \n  O   | \n /|   | \n      | \n========='}
            {mistakes === 4 && '  +---+ \n  |   | \n  O   | \n /|\\  | \n      | \n========='}
            {mistakes === 5 && '  +---+ \n  |   | \n  O   | \n /|\\  | \n /    | \n========='}
            {mistakes >= 6 && '  +---+ \n  |   | \n  O   | \n /|\\  | \n / \\  | \n========='}
          </div>
        </div>

        {/* Word Display with Underlines */}
        <div className="flex gap-2 mt-3">
          {word.split('').map((char, idx) => (
            <div
              key={idx}
              className="w-7 h-9 border-b-2 border-amber-400 flex items-center justify-center text-lg font-black text-white font-mono"
            >
              {guessedLetters.includes(char) || isLost ? (
                <span className={!guessedLetters.includes(char) ? 'text-rose-400' : ''}>
                  {char}
                </span>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual On-Screen Alphabet Keyboard */}
      <div className="w-full grid grid-cols-7 gap-1 mt-1">
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={isGuessed || isWon || isLost}
              className={`h-9 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                isGuessed
                  ? 'bg-neutral-950 text-neutral-600 border border-neutral-800'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 active:bg-amber-500 active:text-neutral-950'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetGame}
        className="mt-3 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>New Word</span>
      </button>
    </div>
  );
};
