import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, RotateCw, ArrowDown, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

const COLS = 10;
const ROWS = 16;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = [
  '#06b6d4', // I cyan
  '#facc15', // O yellow
  '#a855f7', // T purple
  '#f97316', // L orange
  '#3b82f6', // J blue
  '#22c55e', // S green
  '#ef4444', // Z red
];

export const TetrisMatrixGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState({
    shape: SHAPES[0],
    color: COLORS[0],
    x: 3,
    y: 0,
  });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const spawnPiece = useCallback(() => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const color = COLORS[idx];
    const newPiece = { shape, color, x: 3, y: 0 };

    // Check collision at spawn
    if (checkCollision(newPiece.x, newPiece.y, shape, grid)) {
      soundEngine.playSound('gameover');
      setIsGameOver(true);
      return;
    }

    setCurrentPiece(newPiece);
  }, [grid]);

  const checkCollision = (x: number, y: number, shape: number[][], currentGrid: string[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && currentGrid[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const moveLeft = () => {
    if (isGameOver) return;
    if (!checkCollision(currentPiece.x - 1, currentPiece.y, currentPiece.shape, grid)) {
      soundEngine.playSound('click');
      setCurrentPiece((p) => ({ ...p, x: p.x - 1 }));
    }
  };

  const moveRight = () => {
    if (isGameOver) return;
    if (!checkCollision(currentPiece.x + 1, currentPiece.y, currentPiece.shape, grid)) {
      soundEngine.playSound('click');
      setCurrentPiece((p) => ({ ...p, x: p.x + 1 }));
    }
  };

  const rotate = () => {
    if (isGameOver) return;
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    );
    if (!checkCollision(currentPiece.x, currentPiece.y, rotated, grid)) {
      soundEngine.playSound('jump');
      setCurrentPiece((p) => ({ ...p, shape: rotated }));
    }
  };

  const dropDown = useCallback(() => {
    if (isGameOver) return;
    if (!checkCollision(currentPiece.x, currentPiece.y + 1, currentPiece.shape, grid)) {
      setCurrentPiece((p) => ({ ...p, y: p.y + 1 }));
    } else {
      // Lock piece
      soundEngine.playSound('hit');
      const newGrid = grid.map((r) => [...r]);
      currentPiece.shape.forEach((r, rIdx) => {
        r.forEach((c, cIdx) => {
          if (c) {
            const gy = currentPiece.y + rIdx;
            const gx = currentPiece.x + cIdx;
            if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
              newGrid[gy][gx] = currentPiece.color;
            }
          }
        });
      });

      // Clear full lines
      let cleared = 0;
      const filteredGrid = newGrid.filter((row) => {
        const isFull = row.every((cell) => cell !== '');
        if (isFull) cleared++;
        return !isFull;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(''));
      }

      if (cleared > 0) {
        soundEngine.playSound('win');
        setLines((l) => l + cleared);
        setScore((s) => s + cleared * 100);
      }

      setGrid(filteredGrid);
      spawnPiece();
    }
  }, [currentPiece, grid, isGameOver, spawnPiece]);

  // Tick loop
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      dropDown();
    }, 650);
    return () => clearInterval(timer);
  }, [dropDown, isGameOver]);

  const resetGame = () => {
    soundEngine.playSound('click');
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
    setScore(0);
    setLines(0);
    setIsGameOver(false);
    spawnPiece();
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-3 sm:p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Lines:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">{lines} Cleared</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="relative my-2.5 p-2 bg-neutral-950 rounded-xl border-2 border-neutral-800 shadow-2xl">
        <div
          className="grid gap-[2px] bg-neutral-900/60 p-1 rounded-lg"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              // Check if part of falling piece
              let pieceColor = cell;
              const p = currentPiece;
              if (
                !isGameOver &&
                r >= p.y &&
                r < p.y + p.shape.length &&
                c >= p.x &&
                c < p.x + p.shape[0].length
              ) {
                if (p.shape[r - p.y][c - p.x]) {
                  pieceColor = p.color;
                }
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-[2px] border border-black/20"
                  style={{ backgroundColor: pieceColor || '#171717' }}
                />
              );
            })
          )}
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center rounded-xl">
            <Trophy className="w-10 h-10 text-amber-400 mb-1" />
            <h3 className="text-lg font-black text-rose-500 font-display">GAME OVER</h3>
            <p className="text-xs text-neutral-300 mt-1">
              Final Score: <strong className="text-amber-400">{score} Pts</strong>
            </p>
            <button
              onClick={resetGame}
              className="mt-3 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Touch Controls */}
      <div className="w-full grid grid-cols-4 gap-2 mt-1">
        <button
          onClick={moveLeft}
          className="py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-neutral-200 font-bold flex items-center justify-center cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={rotate}
          className="py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-neutral-950 rounded-xl text-neutral-200 font-bold flex items-center justify-center cursor-pointer shadow-md"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={moveRight}
          className="py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-neutral-200 font-bold flex items-center justify-center cursor-pointer shadow-md"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={dropDown}
          className="py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl flex items-center justify-center cursor-pointer shadow-lg"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
