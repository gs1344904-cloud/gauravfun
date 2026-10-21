import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('2048_highscore') || '0', 10);
  });
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);

  const spawnTile = (currentBoard: number[][]) => {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return currentBoard;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const initGame = () => {
    let newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newBoard = spawnTile(newBoard);
    newBoard = spawnTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setWon(false);
    setOver(false);
    soundEngine.playSound('click');
  };

  useEffect(() => {
    initGame();
  }, []);

  const slideRow = (row: number[]) => {
    const nonZero = row.filter((val) => val !== 0);
    let points = 0;
    const merged: number[] = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const val = nonZero[i] * 2;
        merged.push(val);
        points += val;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }
    while (merged.length < 4) merged.push(0);
    return { row: merged, points };
  };

  const moveLeft = (b: number[][]) => {
    let earned = 0;
    const next = b.map((row) => {
      const res = slideRow(row);
      earned += res.points;
      return res.row;
    });
    return { board: next, earned };
  };

  const rotate = (matrix: number[][]) => {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse());
  };

  const handleMove = (direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    if (over) return;
    let b = board.map((r) => [...r]);
    let earned = 0;

    if (direction === 'LEFT') {
      const res = moveLeft(b);
      b = res.board;
      earned = res.earned;
    } else if (direction === 'RIGHT') {
      b = rotate(rotate(b));
      const res = moveLeft(b);
      b = rotate(rotate(res.board));
      earned = res.earned;
    } else if (direction === 'UP') {
      b = rotate(rotate(rotate(b)));
      const res = moveLeft(b);
      b = rotate(res.board);
      earned = res.earned;
    } else if (direction === 'DOWN') {
      b = rotate(b);
      const res = moveLeft(b);
      b = rotate(rotate(rotate(res.board)));
      earned = res.earned;
    }

    // Check if board changed
    const changed = JSON.stringify(board) !== JSON.stringify(b);
    if (changed) {
      soundEngine.playSound('score');
      const updated = spawnTile(b);
      setBoard(updated);
      const nextScore = score + earned;
      setScore(nextScore);
      if (nextScore > highScore) {
        setHighScore(nextScore);
        localStorage.setItem('2048_highscore', nextScore.toString());
      }

      // Check win 2048
      if (!won && updated.some((row) => row.some((val) => val === 2048))) {
        setWon(true);
        soundEngine.playSound('win');
        confetti({ particleCount: 80, spread: 70 });
      }

      // Check Game Over
      if (!canMove(updated)) {
        setOver(true);
        soundEngine.playSound('gameover');
      }
    }
  };

  const canMove = (b: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return true;
        if (c < 3 && b[r][c] === b[r][c + 1]) return true;
        if (r < 3 && b[r][c] === b[r + 1][c]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleMove('LEFT');
      else if (e.key === 'ArrowRight') handleMove('RIGHT');
      else if (e.key === 'ArrowUp') handleMove('UP');
      else if (e.key === 'ArrowDown') handleMove('DOWN');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-neutral-800 text-neutral-200 border-neutral-700';
      case 4: return 'bg-neutral-700 text-neutral-100 border-neutral-600';
      case 8: return 'bg-amber-600 text-neutral-950 border-amber-500';
      case 16: return 'bg-orange-600 text-neutral-950 border-orange-500';
      case 32: return 'bg-red-600 text-neutral-950 border-red-500';
      case 64: return 'bg-rose-700 text-neutral-950 border-rose-600';
      case 128: return 'bg-yellow-500 text-neutral-950 border-yellow-400 font-bold';
      case 256: return 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold';
      case 512: return 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold';
      case 1024: return 'bg-blue-600 text-neutral-950 border-blue-500 font-bold';
      case 2048: return 'bg-amber-400 text-neutral-950 border-amber-300 font-extrabold shadow-lg';
      default: return 'bg-neutral-900/60 text-neutral-500 border-neutral-800/80';
    }
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <button
          onClick={initGame}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3 h-3" /> New Game
        </button>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-200 tabular-nums">{highScore}</span>
        </div>
      </div>

      <div className="relative my-4 p-2 bg-neutral-950 rounded-xl border border-neutral-800 shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5 w-72 h-72">
          {board.flat().map((val, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center rounded-lg border text-lg font-bold font-mono transition-all duration-100 ${getTileColor(
                val
              )}`}
            >
              {val > 0 ? val : ''}
            </div>
          ))}
        </div>

        {over && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-500 font-display">NO MORE MOVES</h4>
            <p className="text-xs text-neutral-400 mt-1">Final Score: {score}</p>
            <button
              onClick={initGame}
              className="mt-3 px-5 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleMove('LEFT')}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          ◀
        </button>
        <button
          onClick={() => handleMove('UP')}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          ▲
        </button>
        <button
          onClick={() => handleMove('DOWN')}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          ▼
        </button>
        <button
          onClick={() => handleMove('RIGHT')}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          ▶
        </button>
      </div>
    </div>
  );
};
