import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Volume2, Shield, Zap } from 'lucide-react';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'truck' | 'car' | 'fuel' | 'record';
  lane: number;
}

export const TractorRallyGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(100);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('tractor_rally_highscore') || '0', 10);
  });

  const stateRef = useRef({
    playerLane: 1, // 0: left, 1: center, 2: right
    targetX: 200,
    currentX: 200,
    speed: 5,
    distance: 0,
    fuel: 100,
    score: 0,
    obstacles: [] as Obstacle[],
    lastSpawn: 0,
    roadOffset: 0,
    hasShield: false,
    shieldTimer: 0,
    isPlaying: false,
  });

  const LANE_X = [90, 200, 310];

  const startGame = () => {
    soundEngine.playSound('jump');
    stateRef.current = {
      playerLane: 1,
      targetX: LANE_X[1],
      currentX: LANE_X[1],
      speed: 6,
      distance: 0,
      fuel: 100,
      score: 0,
      obstacles: [],
      lastSpawn: Date.now(),
      roadOffset: 0,
      hasShield: false,
      shieldTimer: 0,
      isPlaying: true,
    };
    setScore(0);
    setFuel(100);
    setGameState('PLAYING');
  };

  const honkHorn = () => {
    soundEngine.playSound('score');
  };

  const moveLane = (dir: 'left' | 'right') => {
    if (!stateRef.current.isPlaying) return;
    soundEngine.playSound('click');
    let nextLane = stateRef.current.playerLane;
    if (dir === 'left' && nextLane > 0) nextLane--;
    if (dir === 'right' && nextLane < 2) nextLane++;
    stateRef.current.playerLane = nextLane;
    stateRef.current.targetX = LANE_X[nextLane];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        moveLane('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        moveLane('right');
      } else if (e.code === 'Space' || e.code === 'KeyH') {
        honkHorn();
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

      // Draw GT Road Background
      // Grass / Mustard Fields on borders
      ctx.fillStyle = '#8e8e8e'; // Mustard gold field left
      ctx.fillRect(0, 0, 40, canvas.height);
      ctx.fillStyle = '#7f7f7f'; // Green crops
      ctx.fillRect(5, 0, 30, canvas.height);

      ctx.fillStyle = '#8e8e8e'; // Mustard gold field right
      ctx.fillRect(360, 0, 40, canvas.height);
      ctx.fillStyle = '#7f7f7f';
      ctx.fillRect(365, 0, 30, canvas.height);

      // Asphalt Road
      ctx.fillStyle = '#282828';
      ctx.fillRect(40, 0, 320, canvas.height);

      // Road boundary lines
      ctx.strokeStyle = '#e7e7e7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(42, 0);
      ctx.lineTo(42, canvas.height);
      ctx.moveTo(358, 0);
      ctx.lineTo(358, canvas.height);
      ctx.stroke();

      // Dashed lane dividers
      if (state.isPlaying) {
        state.roadOffset = (state.roadOffset + state.speed) % 40;
      }
      ctx.strokeStyle = '#c9c9c9';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -state.roadOffset;

      ctx.beginPath();
      ctx.moveTo(145, 0);
      ctx.lineTo(145, canvas.height);
      ctx.moveTo(255, 0);
      ctx.lineTo(255, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      if (state.isPlaying) {
        // Smooth player tractor horizontal movement
        state.currentX += (state.targetX - state.currentX) * 0.25;

        // Drain fuel gradually
        state.fuel -= 0.05;
        state.distance += state.speed * 0.05;
        state.score = Math.floor(state.distance * 10);
        setScore(state.score);
        setFuel(Math.max(0, Math.floor(state.fuel)));

        if (state.fuel <= 0) {
          endGame();
          return;
        }

        // Spawn obstacles
        const now = Date.now();
        if (now - state.lastSpawn > Math.max(700, 1600 - state.score * 0.2)) {
          state.lastSpawn = now;
          const lane = Math.floor(Math.random() * 3);
          const rand = Math.random();
          let type: Obstacle['type'] = 'car';
          if (rand < 0.2) type = 'fuel';
          else if (rand < 0.35) type = 'record';
          else if (rand < 0.7) type = 'truck';

          state.obstacles.push({
            x: LANE_X[lane],
            y: -60,
            width: type === 'truck' ? 44 : 34,
            height: type === 'truck' ? 70 : 50,
            speed: type === 'fuel' || type === 'record' ? 3 : 2,
            type,
            lane,
          });
        }

        // Update and draw obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.y += state.speed - obs.speed;

          // Draw obstacle
          if (obs.type === 'truck') {
            // Desi Truck
            ctx.fillStyle = '#4d4d4d';
            ctx.fillRect(obs.x - obs.width / 2, obs.y, obs.width, obs.height);
            ctx.fillStyle = '#a6a6a6';
            ctx.fillRect(obs.x - obs.width / 2 + 4, obs.y + 4, obs.width - 8, 14); // Windshield
            // Truck art text
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px sans-serif';
            ctx.fillText('PBX', obs.x - 8, obs.y + 36);
          } else if (obs.type === 'car') {
            // Normal car
            ctx.fillStyle = '#606060';
            ctx.fillRect(obs.x - obs.width / 2, obs.y, obs.width, obs.height);
            ctx.fillStyle = '#bebebe';
            ctx.fillRect(obs.x - obs.width / 2 + 3, obs.y + 8, obs.width - 6, 12);
          } else if (obs.type === 'fuel') {
            // Fuel Jerry Can
            ctx.fillStyle = '#919191';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y + 15, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('⚡', obs.x - 5, obs.y + 19);
          } else if (obs.type === 'record') {
            // Gold Vinyl Record
            ctx.fillStyle = '#848484';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y + 15, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y + 15, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Player collision check
          const playerY = canvas.height - 85;
          const playerW = 38;
          const playerH = 65;

          const collideX = Math.abs(state.currentX - obs.x) < (playerW + obs.width) / 2.3;
          const collideY = Math.abs(playerY + playerH / 2 - (obs.y + obs.height / 2)) < (playerH + obs.height) / 2.3;

          if (collideX && collideY) {
            if (obs.type === 'fuel') {
              soundEngine.playSound('powerup');
              state.fuel = Math.min(100, state.fuel + 35);
              state.obstacles.splice(i, 1);
            } else if (obs.type === 'record') {
              soundEngine.playSound('score');
              state.score += 295;
              state.obstacles.splice(i, 1);
            } else {
              // Crash!
              soundEngine.playSound('hit');
              endGame();
              return;
            }
          }

          if (obs.y > canvas.height + 80) {
            state.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Player Tractor (Sidhu's 5911 Tractor)
      const pX = state.currentX;
      const pY = canvas.height - 85;

      // Big Tractor Rear Wheels
      ctx.fillStyle = '#181818';
      ctx.fillRect(pX - 22, pY + 28, 8, 32); // Left rear tire
      ctx.fillRect(pX + 14, pY + 28, 8, 32); // Right rear tire

      // Front Wheels
      ctx.fillRect(pX - 18, pY + 2, 6, 18);
      ctx.fillRect(pX + 12, pY + 2, 6, 18);

      // Red Tractor Body Bonnet
      ctx.fillStyle = '#3d3d3d';
      ctx.fillRect(pX - 12, pY + 5, 24, 45);

      // Tractor Hood Detail / 5911
      ctx.fillStyle = '#a6a6a6';
      ctx.fillRect(pX - 10, pY + 10, 20, 10);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('5911', pX - 8, pY + 18);

      // Silencer / Exhaust Pipe with smoke puffs
      ctx.fillStyle = '#545454';
      ctx.fillRect(pX + 8, pY - 5, 3, 14);

      if (state.isPlaying && Math.random() < 0.4) {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
        ctx.beginPath();
        ctx.arc(pX + 9, pY - 10 - Math.random() * 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Headlights glow
      ctx.fillStyle = '#ececec';
      ctx.beginPath();
      ctx.moveTo(pX - 10, pY);
      ctx.lineTo(pX - 25, pY - 45);
      ctx.lineTo(pX + 25, pY - 45);
      ctx.lineTo(pX + 10, pY);
      ctx.fillStyle = 'rgba(236, 236, 236, 0.12)';
      ctx.fill();

      animId = requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
      soundEngine.playSound('gameover');
      const finalScore = stateRef.current.score;
      stateRef.current.isPlaying = false;
      setGameState('GAMEOVER');
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('tractor_rally_highscore', finalScore.toString());
        confetti({ particleCount: 60, spread: 70 });
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-neutral-400">Diesel:</span>
          <div className="w-16 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${fuel < 25 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>
        <div>
          <span className="text-neutral-400">Record:</span>{' '}
          <span className="font-mono font-semibold text-neutral-200 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* Canvas Game Area */}
      <div className="relative my-3 rounded-lg overflow-hidden border border-neutral-700/60 shadow-2xl">
        <canvas ref={canvasRef} width={400} height={500} className="block bg-neutral-950" />

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl mb-2">🚜</span>
            <h3 className="text-xl font-bold text-neutral-100 font-display">TRACTOR 5911 RALLY</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs">
              Mansa to Brampton GT Road highway! Dodge trucks, collect fuel & golden records.
            </p>
            <button
              onClick={startGame}
              className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-sm"
            >
              Start Engine
            </button>
            <span className="text-[11px] text-neutral-500 mt-3">Controls: Arrow Keys or Left / Right Buttons</span>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-red-500 font-display">RACE OVER</h3>
            <p className="text-sm text-neutral-300 mt-1">
              Final Distance Score: <span className="text-amber-400 font-bold font-mono">{score}</span>
            </p>
            {score >= highScore && score > 0 && (
              <p className="text-xs text-emerald-400 font-semibold mt-1">🏆 New Personal Best!</p>
            )}
            <button
              onClick={startGame}
              className="mt-4 px-6 py-2 bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen Controls for Mobile & Quick Taps */}
      <div className="w-full flex items-center justify-between gap-3 pt-1">
        <button
          onClick={() => moveLane('left')}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          ← LEFT
        </button>
        <button
          onClick={honkHorn}
          className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500 active:text-neutral-950 rounded-lg text-xs font-semibold text-neutral-300 flex items-center gap-1"
        >
          <Volume2 className="w-4 h-4" /> HORN
        </button>
        <button
          onClick={() => moveLane('right')}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-sm font-bold text-neutral-200"
        >
          RIGHT →
        </button>
      </div>
    </div>
  );
};
