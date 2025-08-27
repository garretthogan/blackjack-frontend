import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import Hand from './Hand';
import {
  createDeck,
  calcTotal,
  isPair,
  evaluateOutcome,
  evaluateVsDealer,
} from './helpers';
import { useUser } from './context/UserContext';
import UserHUD from './UserHUD';
import RoundResultModal from './RoundResultModal';
import BetModal from './BetModal';
import useDealerStore from './dealer';

export default function Blackjack() {
  return (
    <>
      <BlackjackInner />
      <UserHUD />
      <RoundResultModal />
    </>
  );
}

function BlackjackInner() {
  const navigate = useNavigate();
  const { settleHand, tryDoubleDown, currentBet, resultOpen, setResultOpen } = useUser();

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [stood, setStood] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [betOpen, setBetOpen] = useState(true);

  const {
    dealerHand,
    dealerValue,
    setDealerHand,
    addDealerCard,
    removeDealerCard,
    resetDealerHand,
  } = useDealerStore();

  const prevResultOpen = useRef(resultOpen);

  useEffect(() => {
    resetForBet();
  }, []);

  useEffect(() => {
    if (evaluating || resolved || stood) return;
    if (hand.length === 0) return;
    const { outcome, message } = evaluateOutcome(hand);
    if (outcome === 'loss' || outcome === 'blackjack' || outcome === 'charlie') {
      setStood(true);
      runEvaluation(outcome, message);
    }
  }, [hand, stood, resolved, evaluating]);

  useEffect(() => {
    const wasOpen = prevResultOpen.current;
    prevResultOpen.current = resultOpen;
    if (wasOpen && !resultOpen) resetForBet();
  }, [resultOpen]);

  const dealInitial = useCallback(() => {
    const newDeck = createDeck();
    const p1 = newDeck[newDeck.length - 1];
    const p2 = newDeck[newDeck.length - 2];
    const d1 = newDeck[newDeck.length - 3];
    const d2 = newDeck[newDeck.length - 4];
    setHand([p1, p2]);
    setDealerHand([d1, d2]);
    setDeck(newDeck.slice(0, newDeck.length - 4));
  }, []);

  const resetForBet = () => {
    setDeck(createDeck());
    setHand([]);
    setDealerHand([]);
    setStood(false);
    setResolved(false);
    setEvaluating(false);
    setBetOpen(true);
  };

  const onBetConfirmed = () => {
    setBetOpen(false);
    dealInitial();
  };

  const drawOne = () => {
    setDeck(d => {
      if (d.length === 0) return d;
      const next = d[d.length - 1];
      const rest = d.slice(0, d.length - 1);
      setHand(h => {
        const nextHand = [...h, next];
        const playerTotal = calcTotal(nextHand);
        if (playerTotal < 21) {
          console.log('dealer choosing');
          const dealerTotal = calcTotal(dealerHand);
          if (dealerTotal < 17 || (dealerTotal === 17 && dealerHand.length > 2)) {
            console.log('dealer chose to hit');
            const next = d[d.length - 1];
            addDealerCard(next);
          } else {
            console.log('dealer stands');
          }
        }
        return nextHand;
      });

      return rest;
    });
  };

  const runEvaluation = (outcome, message, extra = {}) => {
    const playerTotal = extra.playerTotal ?? calcTotal(hand);
    setResolved(true);
    // settleHand(outcome, message, { playerTotal, dealerTotal: dealerValue, ...extra });
    setResultOpen(true);
  };

  const onHit = () => {
    if (stood || !currentBet) return;
    drawOne();
  };

  const onStand = () => {
    if (stood || !currentBet) return;

    let nextDeck = deck.slice();
    const d = dealerHand.slice();
    let dealerTotal = calcTotal(d);
    if (dealerTotal < 17 && nextDeck.length) {
      const next = nextDeck[nextDeck.length - 1];
      nextDeck = nextDeck.slice(0, nextDeck.length - 1);
      dealerTotal = calcTotal([...d, next]);
      d.push(next);
      setDeck(nextDeck);
    }
    if (dealerTotal < 17 && nextDeck.length) {
      const next = nextDeck[nextDeck.length - 1];
      nextDeck = nextDeck.slice(0, nextDeck.length - 1);
      dealerTotal = calcTotal([...d, next]);
      d.push(next);
      setDeck(nextDeck);
    }
    if (dealerTotal < 17 && nextDeck.length) {
      const next = nextDeck[nextDeck.length - 1];
      nextDeck = nextDeck.slice(0, nextDeck.length - 1);
      dealerTotal = calcTotal([...d, next]);
      d.push(next);
      setDeck(nextDeck);
    }
    if (dealerTotal < 17 && nextDeck.length) {
      const next = nextDeck[nextDeck.length - 1];
      nextDeck = nextDeck.slice(0, nextDeck.length - 1);
      dealerTotal = calcTotal([...d, next]);
      d.push(next);
      setDeck(nextDeck);
    }

    setDealerHand(d);

    // const r = evaluateVsDealer(deck, dealerTotal, hand);
    // setDeck(r.nextDeck);
    setStood(true);
    // runEvaluation(r.outcome, r.message, {
    //   playerTotal: r.playerTotal,
    //   dealerTotal: dealerTotal,
    // });
  };

  const onDouble = () => {
    if (stood || !currentBet) return;
    const ok = tryDoubleDown();
    if (!ok) return;
    drawOne();
    // setTimeout(() => {
    const r = evaluateVsDealer(deck, dealerHand, hand);
    setDeck(r.nextDeck);
    setDealerHand(r.dealerHand);
    setStood(true);
    runEvaluation(r.outcome, r.message, {
      multiplier: 2,
      playerTotal: r.playerTotal,
      dealerTotal: r.dealerTotal,
    });
    // }, 500);
  };

  const total = calcTotal(hand);
  const canSplit = isPair(hand) && !stood;

  console.log({
    pscore: calcTotal(hand),
    dscore: calcTotal(dealerHand),
    bj: calcTotal(hand) === 21,
    bust: calcTotal(hand) > 21,
    stood,
    hand,
    dhand: dealerHand,
  });

  if (stood && !resultOpen && !resolved) {
    console.log('show results');
    runEvaluation();
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Blackjack</h1>
      <BetModal open={betOpen} onConfirmed={onBetConfirmed} />
      Dealer
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={dealerHand} isDealer={true} />
      </div>
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={hand} />
      </div>
      Player
      <div style={topBarStyle}>
        <div style={modifierStyle}>Modifier: —</div>
        <div style={totalStyle}>Total: {total}</div>
      </div>
      <div style={controlsStyle}>
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={btnStyle}
          onClick={onHit}
          disabled={stood || !currentBet || evaluating}
        >
          Hit
        </button>
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={btnStyle}
          onClick={onStand}
          disabled={stood || !currentBet || evaluating}
        >
          Stand
        </button>
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={btnStyle}
          onClick={onDouble}
          disabled={stood || hand.length === 0 || !currentBet || evaluating}
        >
          Double
        </button>
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={{ ...btnStyle, opacity: canSplit ? 1 : 0.5 }}
          onClick={() => {}}
          disabled={!canSplit || !currentBet || evaluating}
        >
          Split
        </button>
      </div>
      {evaluating && <div style={evaluatingBoxStyle}>Evaluating…</div>}
      <button style={backButtonStyle} onClick={() => navigate('/run-hub')}>
        Back to Hub
      </button>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#eee',
  padding: 24,
  fontFamily: 'sans-serif',
};

const titleStyle = { margin: '16px 0 8px', fontSize: 28 };

const topBarStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
};

const modifierStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  opacity: 0.9,
};

const totalStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  fontWeight: 700,
};

const handAreaStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  minHeight: 160,
  padding: 12,
  border: '1px dashed',
  borderRadius: 12,
  marginBottom: 16,
  width: 'min(740px, 95vw)',
  justifyContent: 'center',
};

const controlsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
  gap: 12,
  width: 'min(640px, 92vw)',
  marginBottom: 16,
};

const btnStyle = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  fontSize: 16,
  cursor: 'pointer',
};

const evaluatingBoxStyle = {
  marginTop: 8,
  padding: 12,
  border: '1px dashed ',
  borderRadius: 10,
  textAlign: 'center',
  width: 'min(420px, 92vw)',
  fontWeight: 700,
  opacity: 0.9,
};

const backButtonStyle = {
  marginTop: 16,
  padding: '10px 20px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};
