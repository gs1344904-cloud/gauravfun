import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Award } from 'lucide-react';

export const SoccerPenaltyGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(5);
  const [statusText, setStatusText] = useState('Pick a corner and tap STRIKE!');
  const [keeperX, setKeeperX] = useState(160);
  const [ballPos, setBallPos] = useState({ x: 160, y: 320 });
  const [isKicking, setIsKicking] = useState(false);
  const [targetCorner, setTargetCorner] = useState<'TL' | 'TR' | 'BL' | 'BR'>('TL');
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const CORNERS = {
    TL: { x: 70, y: 70, name: 'Top Left' },
    TR: { x: 250, y: 70, name: 'Top Right' },
    BL: { x: 70, y: 170, name: 'Bottom Left' },
    BR: { x: 250, y: 170, name: 'Bottom Right' },
  };

  const kickBall = () => {
    if (isKicking || isGameOver) return;
    setIsKicking(true);
    soundEngine.playSound('hit');

    // Keeper dives randomly to one of the 4 quadrants
    const options: ('TL' | 'TR' | 'BL' | 'BR')[] = ['TL', 'TR', 'BL', 'BR'];
    const keeperDive = options[Math.floor(Math.random() * options.length)];
    const target = CORNERS[targetCorner];
    const keeperTarget = CORNERS[keeperDive];

    setKeeperX(keeperTarget.x);
    setBallPos({ x: target.x, y: target.y });

    setTimeout(() => {
      const isSaved = keeperDive === targetCorner;
      if (isSaved) {
        soundEngine.playSound('gameover');
        setStatusText('❌ SAVED BY THE GOALKEEPER!');
        setStreak(0);
      } else {
        soundEngine.playSound('win');
        confetti({ particleCount: 40, spread: 60 });
        setStatusText('⚽ GOAL! Clean in the back of the net!');
        setScore((s) => s + 100 + streak * 25);
        setStreak((s) => s + 1);
      }

      setShotsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });

      setTimeout(() => {
        setBallPos({ x: 160, y: 320 });
        setKeeperX(160);
        setIsKicking(false);
      }, 1200);
    }, 600);
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setScore(0);
    setShotsLeft(5);
    setStreak(0);
    setIsGameOver(false);
    setStatusText('Pick a corner and tap STRIKE!');
    setBallPos({ x: 160, y: 320 });
    setKeeperX(160);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Shots:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{shotsLeft} Left</span>
        </div>
        <div>
          <span className="text-neutral-400">Streak:</span>{' '}
          <span className="font-mono font-bold text-amber-400">{streak} 🔥</span>
        </div>
      </div>

      {/* Soccer Pitch Canvas Representation */}
      <div className="relative my-3 w-full h-[360px] bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 rounded-xl border-2 border-emerald-600 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* Goal Post Frame */}
        <div className="relative mx-auto w-[240px] h-[140px] border-4 border-white bg-emerald-950/40 rounded-t-lg shadow-inner">
          {/* Net pattern lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* 4 Corner Target Selector Buttons */}
          <button
            onClick={() => {
              soundEngine.playSound('click');
              setTargetCorner('TL');
            }}
            className={`absolute top-2 left-2 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-transform ${
              targetCorner === 'TL'
                ? 'bg-amber-500 text-neutral-950 scale-110 shadow-lg ring-2 ring-white'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            ↖ TL
          </button>

          <button
            onClick={() => {
              soundEngine.playSound('click');
              setTargetCorner('TR');
            }}
            className={`absolute top-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-transform ${
              targetCorner === 'TR'
                ? 'bg-amber-500 text-neutral-950 scale-110 shadow-lg ring-2 ring-white'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            ↗ TR
          </button>

          <button
            onClick={() => {
              soundEngine.playSound('click');
              setTargetCorner('BL');
            }}
            className={`absolute bottom-2 left-2 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-transform ${
              targetCorner === 'BL'
                ? 'bg-amber-500 text-neutral-950 scale-110 shadow-lg ring-2 ring-white'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            ↙ BL
          </button>

          <button
            onClick={() => {
              soundEngine.playSound('click');
              setTargetCorner('BR');
            }}
            className={`absolute bottom-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-transform ${
              targetCorner === 'BR'
                ? 'bg-amber-500 text-neutral-950 scale-110 shadow-lg ring-2 ring-white'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            ↘ BR
          </button>

          {/* Goalkeeper Avatar */}
          <div
            className="absolute bottom-0 w-12 h-20 transition-all duration-300 flex flex-col items-center justify-end"
            style={{ left: `${keeperX - 24}px` }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-300 border-2 border-neutral-900 shadow-md flex items-center justify-center text-xs">
              🧤
            </div>
            <div className="w-10 h-12 bg-red-600 rounded-t-lg border border-neutral-900 flex items-center justify-center text-[10px] text-white font-bold">
              1
            </div>
          </div>
        </div>

        {/* Penalty Spot & Soccer Ball */}
        <div className="relative w-full flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-white mb-1 shadow-sm" />
          <div
            className={`text-3xl transition-all duration-500 ${
              isKicking ? 'scale-75' : 'scale-100 animate-bounce'
            }`}
            style={{
              transform: isKicking
                ? `translate(${ballPos.x - 160}px, ${ballPos.y - 320}px) scale(0.6)`
                : 'none',
            }}
          >
            ⚽
          </div>
        </div>

        {/* Status Toast */}
        <div className="w-full text-center py-1.5 px-3 bg-neutral-950/80 backdrop-blur-md rounded-lg border border-white/10 text-xs font-bold text-neutral-100">
          {statusText}
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-neutral-100 font-display">SHOOTOUT FINISHED</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Final Score: <span className="font-bold text-amber-400 text-sm">{score} Pts</span>
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Another Round
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls for Shootout */}
      <div className="w-full flex items-center justify-between gap-2 mt-2">
        <button
          onClick={() => {
            const corners: ('TL' | 'TR' | 'BL' | 'BR')[] = ['TL', 'TR', 'BL', 'BR'];
            const nextIdx = (corners.indexOf(targetCorner) + 1) % corners.length;
            setTargetCorner(corners[nextIdx]);
            soundEngine.playSound('click');
          }}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-xs font-bold text-neutral-200 cursor-pointer"
        >
          AIM: {targetCorner}
        </button>

        <button
          onClick={kickBall}
          disabled={isKicking || isGameOver}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-lg transition-transform cursor-pointer disabled:opacity-50"
        >
          ⚡ STRIKE BALL!
        </button>
      </div>
    </div>
  );
};
