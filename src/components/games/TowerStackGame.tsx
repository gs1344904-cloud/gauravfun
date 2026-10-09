import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Layers } from 'lucide-react';

interface Block {
  x: number;
  y: number;
  width: number;
  color: string;
}

export const TowerStackGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { x: 50, y: 320, width: 200, color: '#f59e0b' },
  ]);

  const currentX = useRef(20);
  const currentWidth = useRef(200);
  const currentSpeed = useRef(3.5);
  const currentDirection = useRef(1);
  const [, setTick] = useState(0);

  const COLORS = [
    '#f59e0b',
    '#ef4444',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
  ];

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      currentX.current += currentSpeed.current * currentDirection.current;
      if (currentX.current + currentWidth.current >= 300) {
        currentDirection.current = -1;
      }
      if (currentX.current <= 0) {
        currentDirection.current = 1;
      }
      setTick((t) => t + 1);
    }, 20);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const dropBlock = () => {
    if (isGameOver) return;

    const topBlock = blocks[blocks.length - 1];
    const dropX = currentX.current;
    const diff = dropX - topBlock.x;
    const tolerance = 4;

    if (Math.abs(diff) <= tolerance) {
      // Perfect drop!
      soundEngine.playSound('win');
      const newWidth = topBlock.width;
      const newBlock: Block = {
        x: topBlock.x,
        y: topBlock.y - 24,
        width: newWidth,
        color: COLORS[blocks.length % COLORS.length],
      };
      setBlocks((prev) => [...prev, newBlock]);
      setScore((s) => s + 2);
    } else if (diff > 0 && diff < topBlock.width) {
      // Sliced right
      soundEngine.playSound('score');
      const newWidth = topBlock.width - diff;
      currentWidth.current = newWidth;
      const newBlock: Block = {
        x: dropX,
        y: topBlock.y - 24,
        width: newWidth,
        color: COLORS[blocks.length % COLORS.length],
      };
      setBlocks((prev) => [...prev, newBlock]);
      setScore((s) => s + 1);
    } else if (diff < 0 && Math.abs(diff) < topBlock.width) {
      // Sliced left
      soundEngine.playSound('score');
      const newWidth = topBlock.width - Math.abs(diff);
      currentWidth.current = newWidth;
      const newBlock: Block = {
        x: topBlock.x,
        y: topBlock.y - 24,
        width: newWidth,
        color: COLORS[blocks.length % COLORS.length],
      };
      setBlocks((prev) => [...prev, newBlock]);
      setScore((s) => s + 1);
    } else {
      // Complete miss
      soundEngine.playSound('gameover');
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setScore(0);
    currentX.current = 20;
    currentWidth.current = 200;
    currentDirection.current = 1;
    setBlocks([{ x: 50, y: 320, width: 200, color: '#f59e0b' }]);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Floors:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{highScore} Floors</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative my-3 w-full h-[360px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col justify-end p-2">
        {/* Render Tower Blocks */}
        {blocks.slice(-10).map((b, idx) => (
          <div
            key={idx}
            className="h-6 rounded-xs shadow-md border border-black/30 transition-all absolute"
            style={{
              left: `${b.x}px`,
              bottom: `${(blocks.length - 1 - idx) * 26 + 10}px`,
              width: `${b.width}px`,
              backgroundColor: b.color,
            }}
          />
        ))}

        {/* Moving Active Block at Top */}
        {!isGameOver && (
          <div
            className="h-6 rounded-xs shadow-xl border-2 border-white absolute transition-none"
            style={{
              left: `${currentX.current}px`,
              bottom: `${Math.min(10, blocks.length) * 26 + 20}px`,
              width: `${currentWidth.current}px`,
              backgroundColor: COLORS[blocks.length % COLORS.length],
            }}
          />
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-rose-500 font-display">TOWER TOPPLED!</h3>
            <p className="text-xs text-neutral-300 mt-1">
              You stacked <strong className="text-amber-400 text-sm font-bold">{score} floors</strong> high!
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Stack Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile CTA */}
      <button
        onClick={dropBlock}
        disabled={isGameOver}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-sm shadow-xl transition-transform cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Layers className="w-4 h-4" />
        <span>DROP BLOCK!</span>
      </button>
    </div>
  );
};
