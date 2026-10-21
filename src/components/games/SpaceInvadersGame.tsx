import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface Invader {
  x: number;
  y: number;
  alive: boolean;
  type: number;
}

export const SpaceInvadersGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const playerX = useRef(150);
  const lasers = useRef<{ x: number; y: number }[]>([]);
  const invaders = useRef<Invader[]>([]);
  const invaderDir = useRef(1);
  const invaderSpeed = useRef(1.2);

  const initInvaders = () => {
    const list: Invader[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        list.push({
          x: 40 + c * 40,
          y: 40 + r * 30,
          alive: true,
          type: r,
        });
      }
    }
    invaders.current = list;
    lasers.current = [];
    playerX.current = 150;
  };

  useEffect(() => {
    initInvaders();
  }, []);

  const moveLeft = () => {
    playerX.current = Math.max(20, playerX.current - 18);
    soundEngine.playSound('click');
  };

  const moveRight = () => {
    playerX.current = Math.min(280, playerX.current + 18);
    soundEngine.playSound('click');
  };

  const shootLaser = () => {
    if (lasers.current.length >= 3 || isGameOver || hasWon) return;
    soundEngine.playSound('laser');
    lasers.current.push({ x: playerX.current + 10, y: 310 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isGameOver && !hasWon) {
        // Update invaders
        let hitEdge = false;
        invaders.current.forEach((inv) => {
          if (!inv.alive) return;
          inv.x += invaderDir.current * invaderSpeed.current;
          if (inv.x >= 280 || inv.x <= 20) {
            hitEdge = true;
          }
        });

        if (hitEdge) {
          invaderDir.current *= -1;
          invaders.current.forEach((inv) => {
            inv.y += 12;
            if (inv.alive && inv.y >= 290) {
              soundEngine.playSound('gameover');
              setIsGameOver(true);
            }
          });
        }

        // Update Lasers
        for (let i = lasers.current.length - 1; i >= 0; i--) {
          const l = lasers.current[i];
          l.y -= 7;

          // Check hit
          for (let j = 0; j < invaders.current.length; j++) {
            const inv = invaders.current[j];
            if (inv.alive && Math.hypot(l.x - (inv.x + 12), l.y - (inv.y + 10)) < 15) {
              soundEngine.playSound('hit');
              inv.alive = false;
              lasers.current.splice(i, 1);
              setScore((s) => s + 20);
              break;
            }
          }

          if (l.y < 0) {
            lasers.current.splice(i, 1);
          }
        }

        // Check Win Condition
        if (invaders.current.every((inv) => !inv.alive)) {
          soundEngine.playSound('win');
          confetti({ particleCount: 60, spread: 70 });
          setHasWon(true);
        }
      }

      // Draw Invaders
      invaders.current.forEach((inv) => {
        if (!inv.alive) return;
        ctx.fillStyle = inv.type === 0 ? '#686868' : inv.type === 1 ? '#a6a6a6' : '#7b7b7b';
        ctx.fillRect(inv.x, inv.y, 22, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(inv.x + 4, inv.y + 4, 4, 4);
        ctx.fillRect(inv.x + 14, inv.y + 4, 4, 4);
      });

      // Draw Lasers
      ctx.fillStyle = '#9b9b9b';
      lasers.current.forEach((l) => {
        ctx.fillRect(l.x, l.y, 3, 10);
      });

      // Draw Player Tank
      ctx.fillStyle = '#a6a6a6';
      ctx.fillRect(playerX.current, 320, 24, 14);
      ctx.fillRect(playerX.current + 9, 312, 6, 8);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isGameOver, hasWon]);

  const resetGame = () => {
    soundEngine.playSound('click');
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setHasWon(false);
    initInvaders();
  };

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Status:</span>{' '}
          <span className="font-mono font-bold text-emerald-400">Defense Active</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative my-3 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
        <canvas ref={canvasRef} width={320} height={350} className="block bg-neutral-950" />

        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-black text-rose-500 font-display">DEFENSE BREACHED!</h3>
            <p className="text-xs text-neutral-300 mt-1">Invaders landed on ground base.</p>
            <p className="text-sm font-bold text-amber-400 mt-1">Score: {score} Pts</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Wave
            </button>
          </div>
        )}

        {hasWon && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-xl font-black text-emerald-400 font-display">GALAXY SAVED!</h3>
            <p className="text-xs text-neutral-300 mt-1">All invader armadas neutralized.</p>
            <p className="text-sm font-bold text-amber-400 mt-1">Score: {score} Pts</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Next Sector
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="w-full flex items-center justify-between gap-2 mt-1">
        <button
          onClick={moveLeft}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-neutral-200 font-bold flex items-center justify-center cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={moveRight}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-xl text-neutral-200 font-bold flex items-center justify-center cursor-pointer shadow-md"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={shootLaser}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>FIRE</span>
        </button>
      </div>
    </div>
  );
};
