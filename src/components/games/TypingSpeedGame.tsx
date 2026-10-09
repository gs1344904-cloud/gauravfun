import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

const LYRICS_PROMPTS = [
  'Dil da ni maada tera Sidhu Moose Wala, sirr kaddve record paida kite balliye!',
  'Leaderan de piche lagg lade loko, ae gabru de naa naal 295 lagdi!',
  'Ho chobbar de chehre utte noor dassda, ni ehda utthuga jawani ch janaaza mithhiye!',
  'Assi kisse de vi mohtaaj naiyo, sadda maalik ohi rabb ae!',
  'Ajj vi ohi aan ni assi same beef rakhde, mardan di anakh te hundi sada koot!',
  'Pind Moosa zila Mansa da pind balliye, tochan mukaable jite gabbru ne!',
];

export const TypingSpeedGame: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [bestWpm, setBestWpm] = useState<number>(() => {
    return parseInt(localStorage.getItem('typing_best_wpm') || '0', 10);
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const startTest = () => {
    const random = LYRICS_PROMPTS[Math.floor(Math.random() * LYRICS_PROMPTS.length)];
    setPrompt(random);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    startTest();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setInput(val);
    soundEngine.playSound('click');

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === prompt[i]) correct++;
    }
    const acc = val.length > 0 ? Math.floor((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate live WPM
    if (startTime && val.length > 3) {
      const minutes = (Date.now() - startTime) / 60000;
      const words = val.length / 5;
      const currentWpm = Math.floor(words / Math.max(0.05, minutes));
      setWpm(currentWpm);
    }

    // Check completion
    if (val === prompt) {
      setIsFinished(true);
      const finalMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      const finalWpm = Math.floor(prompt.length / 5 / Math.max(0.05, finalMinutes));
      setWpm(finalWpm);
      soundEngine.playSound('win');

      if (finalWpm > bestWpm) {
        setBestWpm(finalWpm);
        localStorage.setItem('typing_best_wpm', finalWpm.toString());
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Speed:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{wpm} WPM</span>
        </div>
        <div>
          <span className="text-neutral-400">Accuracy:</span>{' '}
          <span className="font-mono font-semibold text-emerald-400 tabular-nums">{accuracy}%</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-300 tabular-nums">{bestWpm} WPM</span>
        </div>
      </div>

      {/* Target Lyric Prompt */}
      <div className="my-4 p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-sm font-medium leading-relaxed">
        {prompt.split('').map((char, idx) => {
          let color = 'text-neutral-400';
          if (idx < input.length) {
            color = input[idx] === char ? 'text-emerald-400 font-semibold' : 'text-red-400 bg-red-950/40';
          } else if (idx === input.length) {
            color = 'text-amber-400 underline decoration-2 underline-offset-4';
          }
          return (
            <span key={idx} className={color}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        disabled={isFinished}
        placeholder="Type the lyrics above here..."
        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 font-mono text-sm"
      />

      {isFinished ? (
        <div className="mt-4 text-center">
          <p className="text-emerald-400 font-bold text-sm">🎉 Complete! Final Speed: {wpm} WPM</p>
          <button
            onClick={startTest}
            className="mt-3 px-5 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Next Lyric
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-end mt-3">
          <button
            onClick={startTest}
            className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Skip to another quote
          </button>
        </div>
      )}
    </div>
  );
};
