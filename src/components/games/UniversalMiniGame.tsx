import React, { useState, useEffect, useRef } from 'react';
import { GameInfo } from '../../data/gamesList';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Play, CheckCircle2, XCircle } from 'lucide-react';

interface UniversalMiniGameProps {
  game: GameInfo;
}

export const UniversalMiniGame: React.FC<UniversalMiniGameProps> = ({ game }) => {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem(`game_${game.slug}_high`) || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Mini-game specific states
  // 1. Trivia Quiz State
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaQuestions] = useState([
    {
      q: 'Which legendary 1980 arcade game was created by Toru Iwatani featuring yellow dot chomping?',
      options: ['Pac-Man', 'Space Invaders', 'Galaga', 'Donkey Kong'],
      correct: 0,
    },
    {
      q: 'In which decade was the original classic game Tetris invented by Alexey Pajitnov?',
      options: ['1970s', '1980s (1984)', '1990s', '2000s'],
      correct: 1,
    },
    {
      q: 'What is the highest possible hand total in the game of Blackjack without going bust?',
      options: ['20', '21', '22', '25'],
      correct: 1,
    },
    {
      q: 'Which famous brick-breaker game was co-designed by Steve Wozniak for Atari in 1976?',
      options: ['Breakout', 'Pong', 'Asteroids', 'Centipede'],
      correct: 0,
    },
    {
      q: 'In cricket, what is the maximum number of runs scored from a single legal ball hit over boundary on the full?',
      options: ['4 Runs', '6 Runs', '8 Runs', '10 Runs'],
      correct: 1,
    },
  ]);

  // 2. Memory Match State
  const [memoryCards, setMemoryCards] = useState<
    { id: number; symbol: string; flipped: boolean; matched: boolean }[]
  >([]);

  // 3. Slot Machine State
  const [reels, setReels] = useState<string[]>(['7️⃣', '7️⃣', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // 4. CPS Test State
  const [cpsClicks, setCpsClicks] = useState<number>(0);
  const [cpsTimeLeft, setCpsTimeLeft] = useState<number>(5);

  // 5. Canvas Arcade Engine Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize specific sub-engines
  const initGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    soundEngine.playSound('click');

    if (game.slug === 'memory-match-tiles' || game.slug === 'higher-or-lower') {
      const symbols = ['🚜', '🎤', '💿', '👑', '⚡', '🦁', '🔥', '🎵'];
      const deck = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((sym, idx) => ({ id: idx, symbol: sym, flipped: false, matched: false }));
      setMemoryCards(deck);
    } else if (game.slug === 'click-speed-test-cps') {
      setCpsClicks(0);
      setCpsTimeLeft(5);
    } else if (game.slug === 'sidhu-trivia-master') {
      setTriviaIndex(0);
    }
  };

  const updateHighScore = (val: number) => {
    if (val > highScore) {
      setHighScore(val);
      localStorage.setItem(`game_${game.slug}_high`, val.toString());
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  // --- TRIVIA HANDLER ---
  const handleTriviaAnswer = (selectedIndex: number) => {
    const q = triviaQuestions[triviaIndex];
    if (selectedIndex === q.correct) {
      soundEngine.playSound('score');
      const nextScore = score + 20;
      setScore(nextScore);
      updateHighScore(nextScore);
    } else {
      soundEngine.playSound('hit');
    }

    if (triviaIndex + 1 < triviaQuestions.length) {
      setTriviaIndex((i) => i + 1);
    } else {
      setIsGameOver(true);
      setIsPlaying(false);
      soundEngine.playSound('win');
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  // --- MEMORY MATCH HANDLER ---
  const handleCardClick = (id: number) => {
    const flippedUnmatched = memoryCards.filter((c) => c.flipped && !c.matched);
    if (flippedUnmatched.length >= 2) return;

    soundEngine.playSound('click');
    const updated = memoryCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setMemoryCards(updated);

    const nowFlipped = updated.filter((c) => c.flipped && !c.matched);
    if (nowFlipped.length === 2) {
      if (nowFlipped[0].symbol === nowFlipped[1].symbol) {
        soundEngine.playSound('score');
        setScore((s) => s + 25);
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.symbol === nowFlipped[0].symbol ? { ...c, matched: true } : c))
          );
        }, 300);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === nowFlipped[0].id || c.id === nowFlipped[1].id ? { ...c, flipped: false } : c))
          );
        }, 900);
      }
    }
  };

  // --- SLOT MACHINE SPIN ---
  const spinSlots = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundEngine.playSound('click');
    const symbols = ['7️⃣', '🚜', '👑', '💎', '🔥', '🎵'];

    let spins = 0;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      spins++;
      if (spins > 15) {
        clearInterval(interval);
        setIsSpinning(false);

        // Check payouts
        const r1 = symbols[Math.floor(Math.random() * symbols.length)];
        const r2 = symbols[Math.floor(Math.random() * symbols.length)];
        const r3 = symbols[Math.floor(Math.random() * symbols.length)];
        setReels([r1, r2, r3]);

        if (r1 === r2 && r2 === r3) {
          soundEngine.playSound('win');
          confetti({ particleCount: 80, spread: 80 });
          setScore((s) => {
            const next = s + 500;
            updateHighScore(next);
            return next;
          });
        } else if (r1 === r2 || r2 === r3) {
          soundEngine.playSound('score');
          setScore((s) => s + 50);
        }
      }
    }, 80);
  };

  // --- CPS TEST CLICK ---
  const handleCpsClick = () => {
    if (!isPlaying) {
      initGame();
      return;
    }
    soundEngine.playSound('click');
    setCpsClicks((c) => c + 1);
  };

  useEffect(() => {
    if (game.slug === 'click-speed-test-cps' && isPlaying && cpsTimeLeft > 0) {
      const timer = setInterval(() => {
        setCpsTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            setIsPlaying(false);
            setIsGameOver(true);
            soundEngine.playSound('win');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, cpsTimeLeft, game.slug]);

  // --- UNIVERSAL ARCADE CANVAS ENGINE FOR ALL REMAINING ARCADE/ACTION/SPORTS GAMES ---
  useEffect(() => {
    if (
      game.slug === 'sidhu-trivia-master' ||
      game.slug === 'memory-match-tiles' ||
      game.slug === 'slot-machine-777' ||
      game.slug === 'click-speed-test-cps'
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let playerX = 180;
    let playerY = 320;
    let projectiles: { x: number; y: number; vx: number; vy: number; color: string }[] = [];
    let targets: { x: number; y: number; r: number; vy: number; color: string }[] = [];
    let localScore = 0;
    let localOver = false;

    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      soundEngine.playSound('laser');
      // Fire projectile toward click
      const angle = Math.atan2(clickY - playerY, clickX - playerX);
      projectiles.push({
        x: playerX,
        y: playerY,
        vx: Math.cos(angle) * 7,
        vy: Math.sin(angle) * 7,
        color: '#f59e0b',
      });
    };

    canvas.addEventListener('click', onCanvasClick);

    let lastSpawn = Date.now();

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber Arcade Grid Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#1e293b30';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isPlaying && !localOver) {
        // Spawn moving targets / obstacles
        if (Date.now() - lastSpawn > 900) {
          lastSpawn = Date.now();
          targets.push({
            x: 20 + Math.random() * (canvas.width - 40),
            y: 0,
            r: 14 + Math.random() * 8,
            vy: 1.8 + Math.random() * 2,
            color: Math.random() > 0.5 ? '#ef4444' : '#3b82f6',
          });
        }

        // Update Projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
          const p = projectiles[i];
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Check hit against targets
          for (let j = targets.length - 1; j >= 0; j--) {
            const t = targets[j];
            const dist = Math.hypot(p.x - t.x, p.y - t.y);
            if (dist < t.r + 4) {
              soundEngine.playSound('score');
              targets.splice(j, 1);
              projectiles.splice(i, 1);
              localScore += 10;
              setScore(localScore);
              updateHighScore(localScore);
              break;
            }
          }

          if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            projectiles.splice(i, 1);
          }
        }

        // Update Targets
        for (let i = targets.length - 1; i >= 0; i--) {
          const t = targets[i];
          t.y += t.vy;

          ctx.fillStyle = t.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          ctx.fill();

          // Check bottom crash
          if (t.y > canvas.height) {
            targets.splice(i, 1);
          }
        }

        // Draw Player Turret / Vessel
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(playerX - 3, playerY - 24, 6, 12);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', onCanvasClick);
    };
  }, [isPlaying, game.slug]);

  return (
    <div className="flex flex-col items-center select-none bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md mx-auto">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
        <div>
          <span className="text-neutral-400">Score:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-neutral-400">High:</span>{' '}
          <span className="font-mono font-semibold text-neutral-300 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* 1. TRIVIA QUIZ */}
      {game.slug === 'sidhu-trivia-master' && (
        <div className="w-full my-4 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
          {!isGameOver ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-amber-400 font-bold">
                Question {triviaIndex + 1} of {triviaQuestions.length}
              </span>
              <h4 className="text-sm font-semibold text-neutral-100 leading-snug">
                {triviaQuestions[triviaIndex].q}
              </h4>
              <div className="flex flex-col gap-2 mt-2">
                {triviaQuestions[triviaIndex].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleTriviaAnswer(oIdx)}
                    className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-left text-xs text-neutral-200 border border-neutral-800 hover:border-amber-500/50 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <h4 className="text-lg font-bold text-amber-400 font-display">QUIZ COMPLETED!</h4>
              <p className="text-xs text-neutral-300 mt-1">Final Score: {score} / 100</p>
              <button
                onClick={initGame}
                className="mt-4 px-5 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. MEMORY MATCH */}
      {game.slug === 'memory-match-tiles' && (
        <div className="my-4">
          <div className="grid grid-cols-4 gap-2.5">
            {memoryCards.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl border transition-all ${
                  c.flipped || c.matched
                    ? 'bg-neutral-800 border-amber-500/60'
                    : 'bg-neutral-950 border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                {c.flipped || c.matched ? c.symbol : '?'}
              </button>
            ))}
          </div>
          <button
            onClick={initGame}
            className="mt-4 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold"
          >
            Reset Memory Board
          </button>
        </div>
      )}

      {/* 3. SLOT MACHINE */}
      {game.slug === 'slot-machine-777' && (
        <div className="my-4 flex flex-col items-center">
          <div className="flex gap-3 p-4 bg-neutral-950 rounded-2xl border-2 border-amber-500/60 shadow-2xl">
            {reels.map((sym, idx) => (
              <div
                key={idx}
                className="w-18 h-24 bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-center text-4xl shadow-inner"
              >
                {sym}
              </div>
            ))}
          </div>
          <button
            onClick={spinSlots}
            disabled={isSpinning}
            className="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-extrabold rounded-lg text-sm transition-transform shadow-lg disabled:opacity-50"
          >
            {isSpinning ? 'SPINNING...' : 'PULL LEVER / SPIN'}
          </button>
        </div>
      )}

      {/* 4. CPS CLICK SPEED TEST */}
      {game.slug === 'click-speed-test-cps' && (
        <div className="my-4 flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full mb-3 text-xs">
            <span className="text-neutral-400">Time Left: {cpsTimeLeft}s</span>
            <span className="text-amber-400 font-bold">
              CPS: {cpsTimeLeft === 0 ? (cpsClicks / 5).toFixed(1) : (cpsClicks / Math.max(0.1, 5 - cpsTimeLeft)).toFixed(1)}
            </span>
          </div>

          <button
            onClick={handleCpsClick}
            className="w-full h-44 bg-gradient-to-br from-amber-600/30 via-neutral-900 to-amber-700/20 border-2 border-amber-500/60 rounded-2xl flex flex-col items-center justify-center hover:scale-101 active:scale-98 transition-transform shadow-2xl"
          >
            <span className="text-4xl font-extrabold font-mono text-amber-400">{cpsClicks}</span>
            <span className="text-xs text-neutral-300 font-bold mt-1">CLICK AS FAST AS YOU CAN!</span>
          </button>

          {isGameOver && (
            <div className="mt-4 text-center">
              <p className="text-emerald-400 font-bold text-sm">
                Score: {cpsClicks} Clicks ({(cpsClicks / 5).toFixed(1)} CPS)!
              </p>
              <button
                onClick={initGame}
                className="mt-2 px-6 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
              >
                Test Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. UNIVERSAL INTERACTIVE ARCADE CANVAS FOR OTHER CATALOG GAMES */}
      {game.slug !== 'sidhu-trivia-master' &&
        game.slug !== 'memory-match-tiles' &&
        game.slug !== 'slot-machine-777' &&
        game.slug !== 'click-speed-test-cps' && (
          <div className="w-full flex flex-col items-center">
            <div className="relative my-3 rounded-lg overflow-hidden border border-neutral-700/60 shadow-2xl">
              <canvas ref={canvasRef} width={360} height={360} className="block bg-neutral-950 cursor-crosshair" />

              {!isPlaying && (
                <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                  <h4 className="text-lg font-bold text-neutral-100 font-display">{game.name}</h4>
                  <p className="text-xs text-neutral-400 mt-2 max-w-xs">{game.description}</p>
                  <button
                    onClick={initGame}
                    className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Launch Game
                  </button>
                  <span className="text-[11px] text-neutral-500 mt-2">{game.instructions}</span>
                </div>
              )}
            </div>

            {/* Mobile Touch Gamepad Controls for Smartphones */}
            <div className="w-full max-w-sm mt-1 p-2 bg-neutral-950/70 border border-neutral-800 rounded-xl flex items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      canvas.dispatchEvent(new MouseEvent('click', { clientX: 100, clientY: 200 }));
                    }
                  }}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-xs font-bold text-neutral-200"
                >
                  ◀ LEFT
                </button>
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      canvas.dispatchEvent(new MouseEvent('click', { clientX: 260, clientY: 200 }));
                    }
                  }}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg text-xs font-bold text-neutral-200"
                >
                  RIGHT ▶
                </button>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      canvas.dispatchEvent(new MouseEvent('click', { clientX: 180, clientY: 100 }));
                    }
                  }}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-black rounded-lg text-xs shadow-md"
                >
                  ⚡ FIRE / ACTION
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
