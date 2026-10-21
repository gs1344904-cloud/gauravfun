import React, { useState } from 'react';
import { soundEngine } from '../../utils/audioEngine';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  val: number;
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const RANKS = [
  { r: '2', v: 2 },
  { r: '3', v: 3 },
  { r: '4', v: 4 },
  { r: '5', v: 5 },
  { r: '6', v: 6 },
  { r: '7', v: 7 },
  { r: '8', v: 8 },
  { r: '9', v: 9 },
  { r: '10', v: 10 },
  { r: 'J', v: 10 },
  { r: 'Q', v: 10 },
  { r: 'K', v: 10 },
  { r: 'A', v: 11 },
];

export const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStage, setGameStage] = useState<'BETTING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'RESOLVED'>('BETTING');
  const [chips, setChips] = useState<number>(1000);
  const [bet, setBet] = useState<number>(50);
  const [outcome, setOutcome] = useState<string>('');

  const createDeck = (): Card[] => {
    const d: Card[] = [];
    SUITS.forEach((suit) => {
      RANKS.forEach(({ r, v }) => {
        d.push({ suit, rank: r, val: v });
      });
    });
    // Shuffle
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
  };

  const calculateHand = (hand: Card[]) => {
    let sum = 0;
    let aces = 0;
    hand.forEach((c) => {
      sum += c.val;
      if (c.rank === 'A') aces++;
    });
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const dealInitialHand = () => {
    if (bet > chips) return;
    soundEngine.playSound('click');
    const newDeck = createDeck();
    const p1 = newDeck.pop()!;
    const d1 = newDeck.pop()!;
    const p2 = newDeck.pop()!;
    const d2 = newDeck.pop()!;

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setChips((c) => c - bet);
    setGameStage('PLAYER_TURN');
    setOutcome('');

    // Check instant blackjack
    if (calculateHand(pHand) === 21) {
      resolveGame(pHand, dHand, 'BLACKJACK');
    }
  };

  const hit = () => {
    soundEngine.playSound('click');
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateHand(newHand);
    if (score > 21) {
      resolveGame(newHand, dealerHand, 'BUST');
    }
  };

  const stand = () => {
    soundEngine.playSound('click');
    setGameStage('DEALER_TURN');

    // Dealer hits on soft 16, stands on 17+
    let currentDeck = [...deck];
    let dHand = [...dealerHand];

    while (calculateHand(dHand) < 17) {
      const card = currentDeck.pop()!;
      dHand.push(card);
    }

    setDeck(currentDeck);
    setDealerHand(dHand);

    const pScore = calculateHand(playerHand);
    const dScore = calculateHand(dHand);

    if (dScore > 21) {
      resolveGame(playerHand, dHand, 'DEALER_BUST');
    } else if (pScore > dScore) {
      resolveGame(playerHand, dHand, 'PLAYER_WIN');
    } else if (pScore < dScore) {
      resolveGame(playerHand, dHand, 'DEALER_WIN');
    } else {
      resolveGame(playerHand, dHand, 'PUSH');
    }
  };

  const resolveGame = (pHand: Card[], dHand: Card[], result: string) => {
    setGameStage('RESOLVED');
    if (result === 'BLACKJACK') {
      soundEngine.playSound('win');
      confetti({ particleCount: 50, spread: 60 });
      setChips((c) => c + Math.floor(bet * 2.5));
      setOutcome('Blackjack! You win 3:2 payout!');
    } else if (result === 'PLAYER_WIN' || result === 'DEALER_BUST') {
      soundEngine.playSound('win');
      setChips((c) => c + bet * 2);
      setOutcome(result === 'DEALER_BUST' ? 'Dealer busts! You win!' : 'You beat the dealer!');
    } else if (result === 'PUSH') {
      soundEngine.playSound('click');
      setChips((c) => c + bet);
      setOutcome('Push! Bet returned.');
    } else {
      soundEngine.playSound('hit');
      setOutcome(result === 'BUST' ? 'Bust! Over 21.' : 'Dealer wins.');
    }
  };

  const renderCard = (card: Card, hidden: boolean = false) => {
    if (hidden) {
      return (
        <div className="w-12 h-18 sm:w-14 sm:h-20 bg-blue-900 border-2 border-white rounded-lg flex items-center justify-center text-blue-300 font-bold text-lg shadow-md">
          PBX
        </div>
      );
    }
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-12 h-18 sm:w-14 sm:h-20 bg-white border border-neutral-300 rounded-lg p-1.5 flex flex-col justify-between shadow-md">
        <span className={`text-xs font-bold ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>{card.rank}</span>
        <span className={`text-lg text-center ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>{card.suit}</span>
        <span className={`text-xs font-bold text-right ${isRed ? 'text-red-600' : 'text-neutral-900'}`}>
          {card.rank}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none bg-emerald-950 border border-emerald-800/80 rounded-xl p-4 max-w-md mx-auto shadow-2xl">
      <div className="w-full flex items-center justify-between pb-3 border-b border-emerald-800 text-xs">
        <div>
          <span className="text-emerald-300">Chips:</span>{' '}
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">${chips}</span>
        </div>
        <div>
          <span className="text-emerald-300">Current Bet:</span>{' '}
          <span className="font-mono font-semibold text-white tabular-nums">${bet}</span>
        </div>
      </div>

      {/* Felt Table */}
      <div className="w-full my-4 py-4 px-3 bg-emerald-900/90 rounded-xl border border-emerald-700/60 flex flex-col items-center gap-4">
        {/* Dealer Hand */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-emerald-200">
            Dealer Hand ({gameStage === 'PLAYER_TURN' ? '?' : calculateHand(dealerHand)})
          </span>
          <div className="flex gap-2 min-h-20">
            {dealerHand.map((c, i) => (
              <React.Fragment key={i}>
                {renderCard(c, gameStage === 'PLAYER_TURN' && i === 1)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {outcome && (
          <div className="py-1 px-4 bg-neutral-950/80 rounded-full text-xs font-bold text-amber-400 border border-amber-500/40">
            {outcome}
          </div>
        )}

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-emerald-200">Your Hand ({calculateHand(playerHand)})</span>
          <div className="flex gap-2 min-h-20">
            {playerHand.map((c, i) => (
              <React.Fragment key={i}>{renderCard(c, false)}</React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {gameStage === 'BETTING' || gameStage === 'RESOLVED' ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex gap-2">
            {[25, 50, 100, 250].map((amt) => (
              <button
                key={amt}
                onClick={() => setBet(amt)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  bet === amt
                    ? 'bg-amber-400 text-neutral-950 border-amber-300'
                    : 'bg-emerald-900 text-emerald-100 border-emerald-700 hover:bg-emerald-800'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <button
            onClick={dealInitialHand}
            disabled={chips < bet}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-lg text-sm transition-transform shadow-lg disabled:opacity-50"
          >
            {gameStage === 'RESOLVED' ? 'Deal Next Hand' : 'Deal Cards'}
          </button>
        </div>
      ) : (
        <div className="flex gap-4 w-full">
          <button
            onClick={hit}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-sm shadow-md"
          >
            HIT
          </button>
          <button
            onClick={stand}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 active:bg-red-400 text-neutral-950 font-bold rounded-lg text-sm shadow-md"
          >
            STAND
          </button>
        </div>
      )}
    </div>
  );
};
