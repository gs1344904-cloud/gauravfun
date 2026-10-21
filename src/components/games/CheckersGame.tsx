import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Crown } from 'lucide-react';

type Piece = 'R' | 'B' | 'RK' | 'BK' | null;

export const CheckersGame: React.FC = () => {
  const INITIAL_BOARD: Piece[][] = [
    [null, 'B', null, 'B', null, 'B'],
    ['B', null, 'B', null, 'B', null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, 'R', null, 'R', null, 'R'],
    ['R', null, 'R', null, 'R', null],
  ];

  const [board, setBoard] = useState<Piece[][]>(INITIAL_BOARD);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'R' | 'B'>('R');
  const [redCount, setRedCount] = useState(6);
  const [blackCount, setBlackCount] = useState(6);
  const [winner, setWinner] = useState<string | null>(null);

  const handleCellClick = (r: number, c: number) => {
    if (winner) return;

    const piece = board[r][c];

    // If selecting own piece
    if (piece && piece.startsWith(turn)) {
      soundEngine.playSound('click');
      setSelected([r, c]);
      return;
    }

    // If moving selected piece to empty square
    if (selected && !piece && (r + c) % 2 === 1) {
      const [sr, sc] = selected;
      const sPiece = board[sr][sc]!;

      const rowDiff = r - sr;
      const colDiff = Math.abs(c - sc);

      // Normal single step
      const isForward = turn === 'R' ? rowDiff === -1 : rowDiff === 1;
      const isKing = sPiece.endsWith('K');

      if ((isForward || isKing) && Math.abs(rowDiff) === 1 && colDiff === 1) {
        soundEngine.playSound('hit');
        executeMove(sr, sc, r, c);
        return;
      }

      // Jump capture
      if (Math.abs(rowDiff) === 2 && colDiff === 2) {
        const midR = (sr + r) / 2;
        const midC = (sc + c) / 2;
        const midPiece = board[midR][midC];

        if (midPiece && !midPiece.startsWith(turn)) {
          soundEngine.playSound('score');
          executeCapture(sr, sc, r, c, midR, midC);
          return;
        }
      }
    }
  };

  const executeMove = (fromR: number, fromC: number, toR: number, toC: number) => {
    const nextBoard = board.map((row) => [...row]);
    let piece = nextBoard[fromR][fromC]!;
    nextBoard[fromR][fromC] = null;

    // King promotion
    if (turn === 'R' && toR === 0) piece = 'RK';
    if (turn === 'B' && toR === 5) piece = 'BK';

    nextBoard[toR][toC] = piece;
    setBoard(nextBoard);
    setSelected(null);
    setTurn(turn === 'R' ? 'B' : 'R');
  };

  const executeCapture = (
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    capR: number,
    capC: number
  ) => {
    const nextBoard = board.map((row) => [...row]);
    let piece = nextBoard[fromR][fromC]!;
    nextBoard[fromR][fromC] = null;
    nextBoard[capR][capC] = null;

    if (turn === 'R') {
      const nb = blackCount - 1;
      setBlackCount(nb);
      if (nb <= 0) {
        setWinner('Red Player Wins!');
        soundEngine.playSound('win');
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      const nr = redCount - 1;
      setRedCount(nr);
      if (nr <= 0) {
        setWinner('Black Player Wins!');
        soundEngine.playSound('win');
        confetti({ particleCount: 50, spread: 60 });
      }
    }

    if (turn === 'R' && toR === 0) piece = 'RK';
    if (turn === 'B' && toR === 5) piece = 'BK';

    nextBoard[toR][toC] = piece;
    setBoard(nextBoard);
    setSelected(null);
    setTurn(turn === 'R' ? 'B' : 'R');
  };

  const resetGame = () => {
    soundEngine.playSound('click');
    setBoard(INITIAL_BOARD);
    setSelected(null);
    setTurn('R');
    setRedCount(6);
    setBlackCount(6);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-red-400 font-bold">Red: {redCount}</span>
        </div>
        <div>
          <span className="font-bold text-amber-400">
            {winner || `${turn === 'R' ? 'Red' : 'Black'} Turn`}
          </span>
        </div>
        <div>
          <span className="text-neutral-400 font-bold">Black: {blackCount}</span>
        </div>
      </div>

      {/* 6x6 Checkers Board */}
      <div className="my-3 p-2 bg-neutral-950 rounded-2xl border-4 border-amber-900 shadow-2xl">
        <div className="grid grid-cols-6 border-2 border-neutral-800 rounded-lg overflow-hidden">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selected?.[0] === r && selected?.[1] === c;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all cursor-pointer ${
                    isDark ? 'bg-amber-950' : 'bg-amber-100'
                  } ${isSelected ? 'ring-4 ring-amber-400 scale-105 z-10' : ''}`}
                >
                  {cell && (
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md ${
                        cell.startsWith('R')
                          ? 'bg-red-600 border-red-300 text-neutral-950'
                          : 'bg-neutral-900 border-neutral-600 text-amber-400'
                      }`}
                    >
                      {cell.endsWith('K') ? '👑' : ''}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Reset CTA */}
      <button
        onClick={resetGame}
        className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>New Checkers Game</span>
      </button>
    </div>
  );
};
