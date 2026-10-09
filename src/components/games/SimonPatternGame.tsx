import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

const COLORS = ['GREEN', 'RED', 'YELLOW', 'BLUE'] as const;
type ColorType = (typeof COLORS)[number];

export const SimonPatternGame: React.FC = () => {
  const [sequence, setSequence] = useState<ColorType[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [activePad, setActivePad] = useState<ColorType | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('simon_highscore') || '0', 10);
  });

  const playPadSound = (color: ColorType) => {
    switch (color) {
      case 'GREEN': soundEngine.playSound('score'); break;
      case 'RED': soundEngine.playSound('hit'); break;
      case 'YELLOW': soundEngine.playSound('coin'); break;
      case 'BLUE': soundEngine.playSound('jump'); break;
    }
  };

  const startNewGame = () => {
    setIsGameOver(false);
    setScore(0);
    const firstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSeq = [firstColor];
    setSequence(newSeq);
    setUserStep(0);
    playSequence(newSeq);
  };

  const playSequence = (seq: ColorType[]) => {
    setIsPlayingSeq(true);
    seq.forEach((col, index) => {
      setTimeout(() => {
        setActivePad(col);
        playPadSound(col);
        setTimeout(() => setActivePad(null), 350);
      }, (index + 1) * 600);
    });

    setTimeout(() => {
      setIsPlayingSeq(false);
      setUserStep(0);
    }, (seq.length + 1) * 600);
  };

  const handlePadClick = (color: ColorType) => {
    if (isPlayingSeq || isGameOver || sequence.length === 0) return;

    setActivePad(color);
    playPadSound(color);
    setTimeout(() => setActivePad(null), 200);

    if (color === sequence[userStep]) {
      // Correct step
      const nextStep = userStep + 1;
      if (nextStep === sequence.length) {
        // Completed this round!
        const nextScore = score + 1;
        setScore(nextScore);
        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('simon_highscore', nextScore.toString());
        }

        const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const nextSeq = [...sequence, nextColor];
        setSequence(nextSeq);
        setTimeout(() => playSequence(nextSeq), 800);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Wrong pad!
      setIsGameOver(true);
      soundEngine.playSound('gameover');
    }
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Streak:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-300 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* 4-Color Circular Simon Matrix */}
      <div className="relative my-6 w-64 h-64 rounded-full bg-neutral-950 border-4 border-neutral-800 p-3 shadow-2xl flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3 w-full h-full">
          <button
            onClick={() => handlePadClick('GREEN')}
            className={`rounded-tl-full transition-all duration-150 ${
              activePad === 'GREEN'
                ? 'bg-emerald-400 scale-95 shadow-[0_0_20px_#34d399]'
                : 'bg-emerald-700 hover:bg-emerald-600'
            }`}
          />
          <button
            onClick={() => handlePadClick('RED')}
            className={`rounded-tr-full transition-all duration-150 ${
              activePad === 'RED'
                ? 'bg-red-400 scale-95 shadow-[0_0_20px_#f87171]'
                : 'bg-red-700 hover:bg-red-600'
            }`}
          />
          <button
            onClick={() => handlePadClick('YELLOW')}
            className={`rounded-bl-full transition-all duration-150 ${
              activePad === 'YELLOW'
                ? 'bg-amber-300 scale-95 shadow-[0_0_20px_#fcd34d]'
                : 'bg-amber-600 hover:bg-amber-500'
            }`}
          />
          <button
            onClick={() => handlePadClick('BLUE')}
            className={`rounded-br-full transition-all duration-150 ${
              activePad === 'BLUE'
                ? 'bg-blue-400 scale-95 shadow-[0_0_20px_#60a5fa]'
                : 'bg-blue-700 hover:bg-blue-600'
            }`}
          />
        </div>

        {/* Center Console */}
        <div className="absolute w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-700 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SIMON</span>
          <span className="font-mono text-lg font-extrabold text-amber-400">{score}</span>
        </div>
      </div>

      {sequence.length === 0 || isGameOver ? (
        <button
          onClick={startNewGame}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-lg text-sm transition-transform shadow-lg"
        >
          {isGameOver ? 'Try Again' : 'Start Sequence'}
        </button>
      ) : (
        <span className="text-xs text-neutral-400">
          {isPlayingSeq ? 'Watch the sequence...' : 'Repeat the sequence!'}
        </span>
      )}
    </div>
  );
};
