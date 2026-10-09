import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  alive: boolean;
}

export const BrickBreakerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('START');
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    paddleX: 160,
    paddleW: 75,
    ballX: 200,
    ballY: 340,
    ballVx: 3.5,
    ballVy: -4,
    ballR: 6,
    bricks: [] as Brick[],
    isPlaying: false,
    score: 0,
  });

  const initBricks = () => {
    const rows = 5;
    const cols = 7;
    const brickW = 46;
    const brickH = 16;
    const padding = 6;
    const offsetLeft = 14;
    const offsetTop = 40;
    const colors = ['#dc2626', '#ea580c', '#eab308', '#16a34a', '#2563eb'];

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color: colors[r],
          alive: true,
        });
      }
    }
    return bricks;
  };

  const startGame = () => {
    stateRef.current = {
      paddleX: 160,
      paddleW: 75,
      ballX: 200,
      ballY: 330,
      ballVx: (Math.random() > 0.5 ? 1 : -1) * 3.5,
      ballVy: -4,
      ballR: 6,
      bricks: initBricks(),
      isPlaying: true,
      score: 0,
    };
    setScore(0);
    setGameState('PLAYING');
    soundEngine.playSound('click');
  };

  const movePaddle = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - stateRef.current.paddleW / 2;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, x));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#ffffff20';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Draw Paddle
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(state.paddleX, canvas.height - 24, state.paddleW, 10);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(state.paddleX + 15, canvas.height - 24, state.paddleW - 30, 3);

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
      ctx.fill();

      if (state.isPlaying) {
        state.ballX += state.ballVx;
        state.ballY += state.ballVy;

        // Wall collisions
        if (state.ballX + state.ballR > canvas.width || state.ballX - state.ballR < 0) {
          state.ballVx = -state.ballVx;
          soundEngine.playSound('click');
        }
        if (state.ballY - state.ballR < 0) {
          state.ballVy = -state.ballVy;
          soundEngine.playSound('click');
        }

        // Paddle collision
        const paddleY = canvas.height - 24;
        if (
          state.ballY + state.ballR >= paddleY &&
          state.ballY - state.ballR <= paddleY + 10 &&
          state.ballX >= state.paddleX &&
          state.ballX <= state.paddleX + state.paddleW
        ) {
          soundEngine.playSound('jump');
          state.ballVy = -Math.abs(state.ballVy);
          // Angle ball based on where it hit paddle
          const hitOffset = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
          state.ballVx = hitOffset * 4.5;
        }

        // Brick collisions
        let remaining = 0;
        state.bricks.forEach((b) => {
          if (!b.alive) return;
          remaining++;
          if (
            state.ballX + state.ballR > b.x &&
            state.ballX - state.ballR < b.x + b.w &&
            state.ballY + state.ballR > b.y &&
            state.ballY - state.ballR < b.y + b.h
          ) {
            b.alive = false;
            state.ballVy = -state.ballVy;
            state.score += 20;
            setScore(state.score);
            soundEngine.playSound('score');
          }
        });

        // Check Victory
        if (remaining === 0) {
          state.isPlaying = false;
          setGameState('VICTORY');
          soundEngine.playSound('win');
          confetti({ particleCount: 70, spread: 70 });
          return;
        }

        // Ball fell down
        if (state.ballY > canvas.height + 20) {
          state.isPlaying = false;
          setGameState('GAMEOVER');
          soundEngine.playSound('gameover');
          return;
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <span className="text-neutral-400 text-xs">Move mouse or drag paddle</span>
      </div>

      <div
        onMouseMove={(e) => movePaddle(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) movePaddle(e.touches[0].clientX);
        }}
        className="relative my-3 rounded-lg overflow-hidden border border-neutral-700/60 shadow-2xl cursor-none"
      >
        <canvas ref={canvasRef} width={380} height={420} className="block bg-neutral-950" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl mb-2">🧱</span>
            <h3 className="text-xl font-bold text-neutral-100 font-display">BRICK BREAKER 295</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs">
              Shatter the brick wall by bouncing the silver ball off your paddle!
            </p>
            <button
              onClick={startGame}
              className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-sm"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-red-500 font-display">GAME OVER</h3>
            <p className="text-sm text-neutral-300 mt-1">Score: {score}</p>
            <button
              onClick={startGame}
              className="mt-4 px-6 py-2 bg-neutral-100 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}

        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-emerald-400 font-display">WALL CLEARED!</h3>
            <p className="text-sm text-neutral-300 mt-1">Magnificent! Score: {score}</p>
            <button
              onClick={startGame}
              className="mt-4 px-6 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
            >
              Next Level
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            stateRef.current.paddleX = Math.max(0, stateRef.current.paddleX - 40);
          }}
          className="px-6 py-2 bg-neutral-800 rounded font-bold text-neutral-200"
        >
          ← LEFT
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) {
              stateRef.current.paddleX = Math.min(canvas.width - stateRef.current.paddleW, stateRef.current.paddleX + 40);
            }
          }}
          className="px-6 py-2 bg-neutral-800 rounded font-bold text-neutral-200"
        >
          RIGHT →
        </button>
      </div>
    </div>
  );
};
