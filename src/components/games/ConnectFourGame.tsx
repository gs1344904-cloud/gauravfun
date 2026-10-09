import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const ConnectFourGame: React.FC = () => {
  const ROWS = 6;
  const COLS = 7;
  const [board, setBoard] = useState<(string | null)[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [turn, setTurn] = useState<'RED' | 'YELLOW'>('RED'); // RED: Player, YELLOW: AI
  const [winner, setWinner] = useState<string | null>(null);

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setTurn('RED');
    setWinner(null);
    soundEngine.playSound('click');
  };

  const checkWin = (b: (string | null)[][], r: number, c: number, color: string) => {
    // Directions: Horizontal, Vertical, Diagonal /, Diagonal \
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dr, dc] of dirs) {
      let count = 1;
      // forward
      let step = 1;
      while (
        r + dr * step >= 0 &&
        r + dr * step < ROWS &&
        c + dc * step >= 0 &&
        c + dc * step < COLS &&
        b[r + dr * step][c + dc * step] === color
      ) {
        count++;
        step++;
      }
      // backward
      step = 1;
      while (
        r - dr * step >= 0 &&
        r - dr * step < ROWS &&
        c - dc * step >= 0 &&
        c - dc * step < COLS &&
        b[r - dr * step][c - dc * step] === color
      ) {
        count++;
        step++;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const dropDisc = (colIndex: number) => {
    if (winner || turn !== 'RED') return;

    // Find lowest empty row in column
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][colIndex]) {
        targetRow = r;
        break;
      }
    }
    if (targetRow === -1) return; // Column full

    soundEngine.playSound('score');
    const newBoard = board.map((row) => [...row]);
    newBoard[targetRow][colIndex] = 'RED';
    setBoard(newBoard);

    if (checkWin(newBoard, targetRow, colIndex, 'RED')) {
      setWinner('RED');
      soundEngine.playSound('win');
      confetti({ particleCount: 70, spread: 70 });
      return;
    }

    // AI Turn (Yellow)
    setTurn('YELLOW');
    setTimeout(() => {
      aiMove(newBoard);
    }, 450);
  };

  const aiMove = (currentBoard: (string | null)[][]) => {
    // Smart AI: check if AI can win, or block player win, otherwise pick random valid column
    const validCols: number[] = [];
    for (let c = 0; c < COLS; c++) {
      if (!currentBoard[0][c]) validCols.push(c);
    }
    if (validCols.length === 0) return;

    // Check if AI can win
    let chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
    for (const c of validCols) {
      let r = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (!currentBoard[row][c]) {
          r = row;
          break;
        }
      }
      if (r !== -1 && checkWin(currentBoard, r, c, 'YELLOW')) {
        chosenCol = c;
        break;
      }
    }

    // Drop AI disc
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!currentBoard[r][chosenCol]) {
        targetRow = r;
        break;
      }
    }
    if (targetRow !== -1) {
      soundEngine.playSound('click');
      const nextBoard = currentBoard.map((row) => [...row]);
      nextBoard[targetRow][chosenCol] = 'YELLOW';
      setBoard(nextBoard);

      if (checkWin(nextBoard, targetRow, chosenCol, 'YELLOW')) {
        setWinner('YELLOW');
        soundEngine.playSound('gameover');
      } else {
        setTurn('RED');
      }
    }
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Turn:</span>{' '}
          <span
            className={`font-bold ${turn === 'RED' ? 'text-red-400' : 'text-amber-400'}`}
          >
            {winner
              ? winner === 'RED'
                ? 'Player Red Won! 🏆'
                : 'AI Yellow Won!'
              : turn === 'RED'
              ? 'Your Turn (Red)'
              : 'AI Thinking...'}
          </span>
        </div>
        <button
          onClick={resetGame}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Connect 4 Blue Stand */}
      <div className="my-4 p-3 bg-blue-700 border-4 border-blue-800 rounded-2xl shadow-2xl">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: COLS }).map((_, c) => (
            <button
              key={c}
              onClick={() => dropDisc(c)}
              className="flex flex-col gap-2 group cursor-pointer"
            >
              {Array.from({ length: ROWS }).map((_, r) => {
                const cell = board[r][c];
                return (
                  <div
                    key={r}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-blue-900 shadow-inner flex items-center justify-center transition-colors ${
                      cell === 'RED'
                        ? 'bg-red-500 shadow-md'
                        : cell === 'YELLOW'
                        ? 'bg-amber-400 shadow-md'
                        : 'bg-neutral-950/70 group-hover:bg-neutral-900'
                    }`}
                  />
                );
              })}
            </button>
          ))}
        </div>
      </div>
      <span className="text-xs text-neutral-400">Click any column above to drop a disc!</span>
    </div>
  );
};
