import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const FlappyMooseGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('flappy_moose_highscore') || '0', 10);
  });

  const stateRef = useRef({
    birdY: 200,
    velocity: 0,
    gravity: 0.38,
    jump: -6.8,
    pipes: [] as { x: number; top: number; bottom: number; passed: boolean }[],
    score: 0,
    isPlaying: false,
    lastPipe: 0,
  });

  const jump = () => {
    if (!stateRef.current.isPlaying) {
      startGame();
      return;
    }
    soundEngine.playSound('jump');
    stateRef.current.velocity = stateRef.current.jump;
  };

  const startGame = () => {
    stateRef.current = {
      birdY: 220,
      velocity: -4,
      gravity: 0.38,
      jump: -6.8,
      pipes: [],
      score: 0,
      isPlaying: true,
      lastPipe: Date.now(),
    };
    setScore(0);
    setGameState('PLAYING');
    soundEngine.playSound('jump');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#171717');
      skyGrad.addColorStop(0.7, '#282828');
      skyGrad.addColorStop(1, '#545454'); // Golden evening fields
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Punjab fields & silhouettes
      ctx.fillStyle = '#464646';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      ctx.fillStyle = '#646464';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 7);

      if (state.isPlaying) {
        state.velocity += state.gravity;
        state.birdY += state.velocity;

        // Spawn pipes
        const now = Date.now();
        if (now - state.lastPipe > 1700) {
          state.lastPipe = now;
          const gap = 125;
          const minHeight = 50;
          const maxHeight = canvas.height - gap - minHeight - 40;
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

          state.pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false,
          });
        }

        // Check boundaries
        if (state.birdY > canvas.height - 45 || state.birdY < 5) {
          endGame();
          return;
        }

        // Draw and update pipes (golden gate pillars)
        for (let i = state.pipes.length - 1; i >= 0; i--) {
          const pipe = state.pipes[i];
          pipe.x -= 2.2;

          // Top pipe
          ctx.fillStyle = '#3a3a3a';
          ctx.fillRect(pipe.x, 0, 52, pipe.top);
          ctx.fillStyle = '#a6a6a6';
          ctx.fillRect(pipe.x - 3, pipe.top - 16, 58, 16); // Pillar cap

          // Bottom pipe
          ctx.fillStyle = '#3a3a3a';
          ctx.fillRect(pipe.x, pipe.bottom, 52, canvas.height - pipe.bottom);
          ctx.fillStyle = '#a6a6a6';
          ctx.fillRect(pipe.x - 3, pipe.bottom, 58, 16); // Pillar cap

          // Check score pass
          if (!pipe.passed && pipe.x + 52 < 70) {
            pipe.passed = true;
            state.score += 1;
            setScore(state.score);
            soundEngine.playSound('score');
          }

          // Check collision with bird (circle radius 15 at x=70)
          const birdX = 70;
          const birdR = 14;

          const inPipeX = birdX + birdR > pipe.x && birdX - birdR < pipe.x + 52;
          const hitTop = inPipeX && state.birdY - birdR < pipe.top;
          const hitBottom = inPipeX && state.birdY + birdR > pipe.bottom;

          if (hitTop || hitBottom) {
            endGame();
            return;
          }

          if (pipe.x < -60) {
            state.pipes.splice(i, 1);
          }
        }
      }

      // Draw Moosewala Microphone Avatar
      const bX = 70;
      const bY = state.birdY;

      // Glow aura
      ctx.fillStyle = 'rgba(166, 166, 166, 0.25)';
      ctx.beginPath();
      ctx.arc(bX, bY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Vintage Shure Microphone Capsule (Iconic Sidhu Stage Mic)
      ctx.fillStyle = '#d4d4d4';
      ctx.beginPath();
      ctx.arc(bX, bY - 4, 11, 0, Math.PI * 2);
      ctx.fill();

      // Mic metal grill lines
      ctx.strokeStyle = '#535353';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bX - 9, bY - 4);
      ctx.lineTo(bX + 9, bY - 4);
      ctx.moveTo(bX, bY - 14);
      ctx.lineTo(bX, bY + 6);
      ctx.stroke();

      // Mic Handle
      ctx.fillStyle = '#3d3d3d'; // Red handle
      ctx.fillRect(bX - 4, bY + 6, 8, 16);

      // Wing feathers
      ctx.fillStyle = '#a6a6a6';
      ctx.beginPath();
      ctx.ellipse(bX - 8, bY + (state.velocity > 0 ? -2 : 4), 8, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
      soundEngine.playSound('hit');
      const final = stateRef.current.score;
      stateRef.current.isPlaying = false;
      setGameState('GAMEOVER');
      if (final > highScore) {
        setHighScore(final);
        localStorage.setItem('flappy_moose_highscore', final.toString());
        confetti({ particleCount: 70, spread: 80 });
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">Best:</span>{' '}
          <span className="font-mono font-semibold text-neutral-200 tabular-nums">{highScore}</span>
        </div>
      </div>

      <div
        onClick={jump}
        className="relative my-3 rounded-lg overflow-hidden border border-neutral-700/60 cursor-pointer shadow-2xl"
      >
        <canvas ref={canvasRef} width={380} height={460} className="block bg-neutral-950" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl mb-2">🎤</span>
            <h3 className="text-xl font-bold text-neutral-100 font-display">FLAPPY MOOSE</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs">
              Tap or hit space to navigate Sidhu&apos;s golden microphone through the pillars.
            </p>
            <button
              onClick={startGame}
              className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-sm"
            >
              Tap to Fly
            </button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-red-500 font-display">GAME OVER</h3>
            <p className="text-sm text-neutral-300 mt-1">
              Score: <span className="text-amber-400 font-bold font-mono">{score}</span>
            </p>
            {score >= highScore && score > 0 && (
              <p className="text-xs text-emerald-400 font-semibold mt-1">⭐ New Personal High Score!</p>
            )}
            <button
              onClick={startGame}
              className="mt-4 px-6 py-2 bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}
      </div>

      <button
        onClick={jump}
        className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-neutral-950 rounded-lg text-sm font-bold text-neutral-200 transition-colors"
      >
        TAP / JUMP (SPACEBAR)
      </button>
    </div>
  );
};
