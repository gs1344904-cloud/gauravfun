import React, { useState } from 'react';
import { GameInfo } from '../../data/gamesList';
import { TractorRallyGame } from './TractorRallyGame';
import { FlappyMooseGame } from './FlappyMooseGame';
import { RetroSnakeGame } from './RetroSnakeGame';
import { Game2048 } from './Game2048';
import { WordleGame } from './WordleGame';
import { BrickBreakerGame } from './BrickBreakerGame';
import { BlackjackGame } from './BlackjackGame';
import { CricketSmashGame } from './CricketSmashGame';
import { TractorClickerGame } from './TractorClickerGame';
import { ReactionTimeGame } from './ReactionTimeGame';
import { TypingSpeedGame } from './TypingSpeedGame';
import { ConnectFourGame } from './ConnectFourGame';
import { SimonPatternGame } from './SimonPatternGame';
import { WhackAMoleGame } from './WhackAMoleGame';
import { SoccerPenaltyGame } from './SoccerPenaltyGame';
import { BasketballShooterGame } from './BasketballShooterGame';
import { KnifeThrowGame } from './KnifeThrowGame';
import { TicTacToeGame } from './TicTacToeGame';
import { TowerStackGame } from './TowerStackGame';
import { TetrisMatrixGame } from './TetrisMatrixGame';
import { HigherLowerGame } from './HigherLowerGame';
import { ArcheryDartsGame } from './ArcheryDartsGame';
import { SpaceInvadersGame } from './SpaceInvadersGame';
import { SprintRaceGame } from './SprintRaceGame';
import { SpinWheelGame } from './SpinWheelGame';
import { BubblePopGame } from './BubblePopGame';
import { SudokuGame } from './SudokuGame';
import { CheckersGame } from './CheckersGame';
import { HangmanGame } from './HangmanGame';
import { GuessNumberGame } from './GuessNumberGame';
import { UniversalMiniGame } from './UniversalMiniGame';
import { AdSenseBanner } from '../ads/AdSenseBanner';
import { X, Trophy, Info, Gamepad2, Smartphone, BookOpen, Play } from 'lucide-react';

interface GameModalProps {
  game: GameInfo | null;
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenTerms?: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  onOpenContact,
  onOpenTerms,
}) => {
  const [modalTab, setModalTab] = useState<'play' | 'details' | 'controls'>('play');

  if (!game) return null;

  const renderGameEngine = () => {
    switch (game.slug) {
      // 1. Vehicle Highway & Speed Runners
      case 'highway-turbo-racer':
      case 'tractor-toli-rally':
      case 'subway-track-surfer':
      case 'moto-hill-climb':
      case 'neon-cyber-runner':
      case 'frogger-highway-cross':
        return <TractorRallyGame />;

      // 2. Flight & Gravity Hop Games
      case 'flappy-sky-flight':
      case 'flappy-moose':
      case 'gravity-flip-odyssey':
      case 'color-bounce-arena':
      case 'color-switcher-ring':
        return <FlappyMooseGame />;

      // 3. Snake, Mazes & Labyrinths
      case 'retro-snake-80s':
      case 'pbx-snake-retro':
      case 'pac-dots-labyrinth':
      case 'sokoban-crate-pusher':
      case 'labyrinth-wooden-tilt':
        return <RetroSnakeGame />;

      // 4. Sliding Grid Mergers
      case 'game-2048-legend':
      case 'sliding-puzzle-15':
      case 'tower-of-hanoi':
        return <Game2048 />;

      // 5. Wordle Dictionary Deduction
      case 'wordle-5-letters':
        return <WordleGame />;

      // 6. Brick Breakers & Tabletop Paddle Volleys
      case 'brick-breaker-295':
      case 'breakout-atari-1976':
      case 'brick-breaker-legend':
      case 'breakout-classic-1976':
      case 'table-tennis-solo-rally':
      case 'pinball-wizard-mini':
        return <BrickBreakerGame />;

      // 7. Blackjack 21 Casino Table
      case 'blackjack-21-casino':
        return <BlackjackGame />;

      // 8. Cricket Batting Smash
      case 'cricket-batting-smash':
        return <CricketSmashGame />;

      // 9. Idle Tycoon Clickers
      case 'tractor-farm-clicker':
      case 'coin-pusher-arcade':
        return <TractorClickerGame />;

      // 10. Millisecond Reflex Tests
      case 'reaction-time-reflex':
      case 'balance-gyro-ball':
      case 'boxing-speedbag-reflex':
        return <ReactionTimeGame />;

      // 11. Typing Speed WPM
      case 'typing-speed-hero':
      case 'rhythm-hero-tap':
        return <TypingSpeedGame />;

      // 12. Connect 4 In A Row
      case 'connect-4-ai':
        return <ConnectFourGame />;

      // 13. Acoustic Memory Sequences
      case 'simon-pattern-reflex':
      case 'simon-vintage-tone':
      case 'pattern-memory-simon':
      case 'simon-tone-sequence':
      case 'sequence-matrix-memory':
      case 'lights-out-matrix':
        return <SimonPatternGame />;

      // 14. Reflex Target Blitz
      case 'whack-a-target-blitz':
      case 'whack-a-target':
      case 'rock-paper-scissors-extreme':
        return <WhackAMoleGame />;

      // 15. Soccer Penalty Shootout Hero
      case 'penalty-shootout-hero':
      case 'ice-hockey-slapshot':
        return <SoccerPenaltyGame />;

      // 16. Basketball Free Throw
      case 'basketball-free-throw':
        return <BasketballShooterGame />;

      // 17. Knife Throw Target Master
      case 'knife-hit-master':
      case 'tap-ninja-blade':
        return <KnifeThrowGame />;

      // 18. Tic Tac Toe AI
      case 'tic-tac-toe-ai':
        return <TicTacToeGame />;

      // 19. Skyscraper Tower Stack
      case 'tower-stack-builder':
      case 'jump-king-tower':
        return <TowerStackGame />;

      // 20. Falling Tetromino Blocks Matrix
      case 'tetris-falling-matrix':
        return <TetrisMatrixGame />;

      // 21. Casino Higher or Lower & Card Clashes
      case 'higher-or-lower-cards':
      case 'war-battle-card-clash':
      case 'baccarat-punto-banco':
      case 'texas-holdem-showdown':
      case 'solitaire-klondike':
        return <HigherLowerGame />;

      // 22. Olympic Archery & Darts 501
      case 'archery-olympic-target':
      case 'darts-bullseye-501':
      case 'bowling-strike-champ':
      case 'golf-green-putting':
        return <ArcheryDartsGame />;

      // 23. Space Invaders & Galaga Alien Waves
      case 'space-invaders-galaxy':
      case 'galaga-alien-dive':
      case 'meteor-blaster':
      case 'laser-grid-evasion':
      case 'bullet-hell-evasion':
      case 'tank-duel-ricochet':
      case 'cyber-defense-shield':
        return <SpaceInvadersGame />;

      // 24. Olympic 100m Sprint & Track Clashes
      case '100m-sprint-blitz':
      case 'tug-of-war-muscle':
      case 'kabaddi-raid-reflex':
      case 'speed-dash-geometry':
      case 'skateboard-halfpipe':
        return <SprintRaceGame />;

      // 25. Carnival Spin Wheel
      case 'spin-golden-wheel':
      case 'yahtzee-5-dice':
      case 'ludo-fast-roll':
      case '8-ball-pool-practice':
        return <SpinWheelGame />;

      // 26. Sensory Bubble Wrap & Balloon Pop
      case 'bubble-pop-frenzy':
      case 'balloon-pop-blitz':
      case 'emoji-match-rush':
      case 'catch-falling-stars':
      case 'jigsaw-slice-puzzle':
      case 'color-flood-fill':
        return <BubblePopGame />;

      // 27. Sudoku Number Placement
      case 'sudoku-mini-4x4':
      case 'sudoku-classic-9x9':
      case 'nonogram-picture-cross':
        return <SudokuGame />;

      // 28. Checkers & Tabletop Strategy Boards
      case 'checkers-drafts-mini':
      case 'chess-tactics-bot':
      case 'reversi-othello-flip':
      case 'dots-and-boxes-grid':
      case 'punjabi-seep-trump':
        return <CheckersGame />;

      // 29. Hangman & Word Puzzles
      case 'hangman-word-survival':
      case 'word-scramble-sprint':
      case 'anagram-word-builder':
      case 'clever-riddle-quest':
        return <HangmanGame />;

      // 30. Secret Number & Logic Math
      case 'guess-secret-number':
      case 'math-blitz-rush':
      case 'binary-logic-circuit':
        return <GuessNumberGame />;

      // 31. Universal Fallback & Specialized Sub-engines (Memory Match, 777 Slots, CPS Speed, Trivia)
      default:
        return <UniversalMiniGame game={game} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100 font-display truncate">{game.name}</h2>
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                  #{game.id} · {game.category}
                </span>
              </div>
              <p className="text-xs text-neutral-400 line-clamp-1">{game.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close Game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-4 bg-neutral-950 border-b border-neutral-800/80 text-xs font-semibold">
          <button
            onClick={() => setModalTab('play')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              modalTab === 'play'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Game</span>
          </button>

          <button
            onClick={() => setModalTab('details')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              modalTab === 'details'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Description & Rules</span>
          </button>

          <button
            onClick={() => setModalTab('controls')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              modalTab === 'controls'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phone Controls Guide</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-3 sm:p-5 flex-1 overflow-y-auto bg-neutral-950/60">
          {modalTab === 'play' && (
            <div className="flex flex-col items-center justify-center">
              {renderGameEngine()}
            </div>
          )}

          {modalTab === 'details' && (
            <div className="flex flex-col gap-4 text-xs text-neutral-300 leading-relaxed p-2">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Full Description</span>
                <p className="text-sm font-medium text-neutral-100 mt-1.5">{game.description}</p>
              </div>

              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Gameplay Mechanics & Objectives</span>
                <p className="text-xs text-neutral-300">{game.gameplayDetails}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Category</span>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">{game.category}</div>
                </div>
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Difficulty</span>
                  <div className="text-xs font-bold text-neutral-200 mt-0.5">{game.difficulty}</div>
                </div>
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Total Plays</span>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{game.plays.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Status</span>
                  <div className="text-xs font-bold text-neutral-200 mt-0.5">Free Unblocked</div>
                </div>
              </div>

              <button
                onClick={() => setModalTab('play')}
                className="mt-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" /> Play {game.name}
              </button>
            </div>
          )}

          {modalTab === 'controls' && (
            <div className="flex flex-col gap-4 text-xs text-neutral-300 leading-relaxed p-2">
              <div className="p-4 bg-neutral-900 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Phone Touch Controls (No Keyboard Required)</span>
                </div>
                <p className="text-xs text-neutral-200 font-medium">{game.controls.mobile}</p>
                <p className="text-[11px] text-neutral-400">
                  All interactive touch buttons are calibrated with a minimum 44px hitbox for ergonomic thumb use.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Desktop / Laptop Keyboard Keys</span>
                <p className="text-xs text-neutral-200">{game.controls.desktop}</p>
              </div>

              <button
                onClick={() => setModalTab('play')}
                className="mt-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" /> Return to Game
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Safe Compliant AdSense banner */}
        <div className="px-4 py-2 border-t border-neutral-800 bg-neutral-950/80 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-xs sm:max-w-md">{game.instructions}</span>
            </div>
            <span className="text-neutral-500 shrink-0">#{game.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
