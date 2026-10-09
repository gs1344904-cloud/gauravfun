import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export const RetroSnakeGame: React.FC = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 18;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });
  const [isRunning, setIsRunning] = useState(false);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const spawnFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const startGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDir({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
    soundEngine.playSound('click');
  };

  const changeDir = (newX: number, newY: number) => {
    if (!isRunning || isGameOver) return;
    const current = dirRef.current;
    if (newX !== -current.x && newY !== -current.y) {
      setDir({ x: newX, y: newY });
      soundEngine.playSound('click');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'KeyW') changeDir(0, -1);
      else if (e.key === 'ArrowDown' || e.key === 'KeyS') changeDir(0, 1);
      else if (e.key === 'ArrowLeft' || e.key === 'KeyA') changeDir(-1, 0);
      else if (e.key === 'ArrowRight' || e.key === 'KeyD') changeDir(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          endGame();
          return prev;
        }

        // Self collision
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          endGame();
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          soundEngine.playSound('coin');
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('snake_highscore', next.toString());
            }
            return next;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 130);

    const endGame = () => {
      soundEngine.playSound('hit');
      setIsGameOver(true);
      setIsRunning(false);
    };

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, food, highScore]);

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

      <div className="relative my-3 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 p-2 shadow-2xl">
        <div
          className="grid gap-[1px] bg-neutral-900/60"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-[2px] transition-colors ${
                  isHead
                    ? 'bg-amber-400 shadow-xs'
                    : isBody
                    ? 'bg-emerald-500'
                    : isFood
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-neutral-950/40'
                }`}
              />
            );
          })}
        </div>

        {!isRunning && !isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl mb-2">🐍</span>
            <h3 className="text-xl font-bold text-neutral-100 font-display">PBX RETRO SNAKE</h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-xs">
              Guide the snake to swallow glowing records. Avoid borders & your tail!
            </p>
            <button
              onClick={startGame}
              className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-sm"
            >
              Start Game
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-red-500 font-display">SNAKE COLLISION</h3>
            <p className="text-sm text-neutral-300 mt-1">
              Final Score: <span className="text-amber-400 font-bold font-mono">{score}</span>
            </p>
            <button
              onClick={startGame}
              className="mt-4 px-6 py-2 bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-lg transition-transform active:scale-95 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Buttons */}
      <div className="w-44 flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => changeDir(0, -1)}
          className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded text-neutral-200 font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => changeDir(-1, 0)}
            className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded text-neutral-200 font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => changeDir(0, 1)}
            className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded text-neutral-200 font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => changeDir(1, 0)}
            className="w-12 h-10 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded text-neutral-200 font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
