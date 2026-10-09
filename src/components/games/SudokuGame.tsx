import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Check } from 'lucide-react';

const PUZZLE = [
  [1, 0, 3, 0],
  [0, 0, 0, 2],
  [3, 0, 0, 0],
  [0, 4, 0, 1],
];

const SOLUTION = [
  [1, 2, 3, 4],
  [4, 3, 1, 2],
  [3, 1, 2, 4],
  [2, 4, 4, 1],
];

export const SudokuGame: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => PUZZLE.map((row) => [...row]));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 1]);
  const [isSolved, setIsSolved] = useState(false);

  const handleCellClick = (r: number, c: number) => {
    // If it's not a pre-filled clue
    if (PUZZLE[r][c] === 0) {
      soundEngine.playSound('click');
      setSelectedCell([r, c]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isSolved) return;
    const [r, c] = selectedCell;

    soundEngine.playSound('click');
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Check complete
    const isFull = newGrid.every((row) => row.every((val) => val !== 0));
    if (isFull) {
      // Validate rows, cols, and 2x2 blocks
      let valid = true;
      for (let i = 0; i < 4; i++) {
        const rowVals = new Set(newGrid[i]);
        const colVals = new Set(newGrid.map((row) => row[i]));
        if (rowVals.size !== 4 || colVals.size !== 4) valid = false;
      }

      if (valid) {
        soundEngine.playSound('win');
        confetti({ particleCount: 50, spread: 60 });
        setIsSolved(true);
      }
    }
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setGrid(PUZZLE.map((row) => [...row]));
    setSelectedCell([0, 1]);
    setIsSolved(false);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Puzzle:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400">Mini 4x4 Sudoku</span>
        </div>
        <div>
          <span className="text-neutral-400">Status:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">
            {isSolved ? '🏆 SOLVED!' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* 4x4 Sudoku Grid */}
      <div className="my-3 p-3 bg-neutral-950 rounded-2xl border-2 border-neutral-800 shadow-2xl">
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-800 rounded-xl">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isFixed = PUZZLE[r][c] !== 0;
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg font-black font-display text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isFixed
                      ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      : isSelected
                      ? 'bg-amber-500 text-neutral-950 ring-4 ring-white scale-105 shadow-xl'
                      : 'bg-neutral-950 hover:bg-neutral-900 text-amber-400 border border-neutral-800'
                  }`}
                >
                  {val !== 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number Keypad Buttons */}
      <div className="w-full grid grid-cols-5 gap-2 mt-1">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-neutral-950 rounded-xl text-neutral-100 font-black text-lg transition-colors cursor-pointer shadow-md"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          className="py-3 bg-neutral-950 hover:bg-neutral-800 rounded-xl text-rose-400 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer border border-neutral-800 shadow-md"
        >
          CLEAR
        </button>
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetGame}
        className="mt-3 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Puzzle</span>
      </button>
    </div>
  );
};
