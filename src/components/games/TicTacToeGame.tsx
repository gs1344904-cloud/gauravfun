import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Bot, User } from 'lucide-react';

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [stats, setStats] = useState({ player: 0, ai: 0, draws: 0 });

  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (sq: (string | null)[]) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
        return { winner: sq[a], line: combo };
      }
    }
    if (sq.every((cell) => cell !== null)) {
      return { winner: 'Draw', line: null };
    }
    return null;
  };

  const handleClick = (idx: number) => {
    if (board[idx] || winner || !isXNext) return;

    soundEngine.playSound('click');
    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    const res = checkWinner(newBoard);
    if (res) {
      resolveGame(res.winner, res.line);
      return;
    }

    // AI Turn (Minimax / Smart Bot)
    setIsXNext(false);
    setTimeout(() => {
      const bestMove = getBestMove(newBoard);
      if (bestMove !== -1) {
        soundEngine.playSound('laser');
        newBoard[bestMove] = 'O';
        setBoard(newBoard);

        const aiRes = checkWinner(newBoard);
        if (aiRes) {
          resolveGame(aiRes.winner, aiRes.line);
        } else {
          setIsXNext(true);
        }
      }
    }, 400);
  };

  const getBestMove = (sq: (string | null)[]) => {
    // 1. Can AI win immediately?
    for (let i = 0; i < 9; i++) {
      if (!sq[i]) {
        sq[i] = 'O';
        if (checkWinner(sq)?.winner === 'O') {
          sq[i] = null;
          return i;
        }
        sq[i] = null;
      }
    }
    // 2. Can player win? Block player!
    for (let i = 0; i < 9; i++) {
      if (!sq[i]) {
        sq[i] = 'X';
        if (checkWinner(sq)?.winner === 'X') {
          sq[i] = null;
          return i;
        }
        sq[i] = null;
      }
    }
    // 3. Take center
    if (!sq[4]) return 4;
    // 4. Take corners
    const corners = [0, 2, 6, 8].filter((i) => !sq[i]);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    // 5. Open sides
    const open = sq.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null) as number[];
    return open.length > 0 ? open[0] : -1;
  };

  const resolveGame = (win: string, line: number[] | null) => {
    setWinner(win);
    setWinningLine(line);

    if (win === 'X') {
      soundEngine.playSound('win');
      confetti({ particleCount: 50, spread: 70 });
      setStats((s) => ({ ...s, player: s.player + 1 }));
    } else if (win === 'O') {
      soundEngine.playSound('gameover');
      setStats((s) => ({ ...s, ai: s.ai + 1 }));
    } else {
      soundEngine.playSound('score');
      setStats((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const resetMatch = () => {
    soundEngine.playSound('click');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* HUD Stats */}
      <div className="w-full grid grid-cols-3 gap-2 pb-3 border-b border-neutral-800 text-center text-xs">
        <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
          <span className="text-[10px] text-neutral-400 block">YOU (X)</span>
          <span className="font-bold text-amber-400 font-mono text-sm">{stats.player}</span>
        </div>
        <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
          <span className="text-[10px] text-neutral-400 block">DRAWS</span>
          <span className="font-bold text-neutral-300 font-mono text-sm">{stats.draws}</span>
        </div>
        <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
          <span className="text-[10px] text-neutral-400 block">BOT (O)</span>
          <span className="font-bold text-rose-400 font-mono text-sm">{stats.ai}</span>
        </div>
      </div>

      {/* Turn indicator */}
      <div className="my-2.5 text-xs font-bold text-neutral-300">
        {!winner ? (
          isXNext ? (
            <span className="text-amber-400">Your Turn (X)</span>
          ) : (
            <span className="text-rose-400 animate-pulse">Bot Thinking (O)...</span>
          )
        ) : winner === 'Draw' ? (
          <span className="text-neutral-400">Game Ended in a Draw!</span>
        ) : (
          <span className={winner === 'X' ? 'text-emerald-400' : 'text-rose-400'}>
            {winner === 'X' ? '🏆 YOU WIN!' : '🤖 BOT WINS!'}
          </span>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3 bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl my-2">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);

          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-xl flex items-center justify-center font-display font-black text-3xl sm:text-4xl transition-all cursor-pointer ${
                cell === 'X'
                  ? 'text-amber-400 bg-neutral-900 border border-amber-500/50'
                  : cell === 'O'
                  ? 'text-rose-400 bg-neutral-900 border border-rose-500/50'
                  : 'bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800'
              } ${isWinningCell ? 'ring-4 ring-emerald-400 scale-105' : ''}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetMatch}
        className="mt-3 w-full py-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>New Round</span>
      </button>
    </div>
  );
};
