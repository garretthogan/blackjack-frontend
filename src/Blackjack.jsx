import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Hand from './Hand';
import { makeShuffledDeck, handTotal, isStartingPair, analyzeBlackjackHand } from './helpers';

export default function Blackjack() {
  const navigate = useNavigate();

  // --- state ---
  const [deck, setDeck] = useState(() => makeShuffledDeck());
  const [hand, setHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [stood, setStood] = useState(false);
  const [message, setMessage] = useState('');

  // deal hand on mount
  useEffect(() => {
    startNewHand();
  }, []);

  const drawOne = useCallback(() => {
    setDeck(d => {
      if (d.length === 0) return d;
      const next = d[d.length - 1];
      const rest = d.slice(0, d.length - 1);
      setHand(h => [...h, next]);
      return rest;
    });
  }, []);

  const startNewHand = () => {
    const newDeck = makeShuffledDeck();
    setDeck(newDeck);
    // player first
    setHand([newDeck[newDeck.length - 1], newDeck[newDeck.length - 2]]);
    // then dealer
    setDealerHand([newDeck[newDeck.length - 3], newDeck[newDeck.length - 4]]);
    setDeck(newDeck.slice(0, newDeck.length - 4));
    setStood(false);
    setMessage('');
    // navigate("/bet");
  };

  // --- actions ---
  const onHit = () => {
    if (stood) return;
    drawOne();
  };

  const onStand = () => {
    if (stood) return;
    setStood(true);
    const { total, isBlackjack, isFiveCardCharlie } = analyzeBlackjackHand(hand);
    if (total > 21) {
      setMessage(`Bust with ${total}.`);
    } else if (isBlackjack) {
      setMessage('Blackjack! (Ace + 10-value)');
    } else if (isFiveCardCharlie) {
      setMessage(`Five-Card Charlie (${total}).`);
    } else {
      setMessage(`Stood at ${total}.`);
    }
  };

  const onDouble = () => {
    if (stood) return;
    // Simple version: draw one, then stand automatically
    drawOne();
    // Let state update then evaluate after a tick
    setTimeout(onStand, 0);
  };

  const onSplit = () => {
    // Placeholder: disabled unless first two are a pair
    alert('Split not implemented in this minimal demo.');
  };

  // compute derived
  const total = handTotal(hand);
  const canSplit = isStartingPair(hand) && !stood;
  const isBust = total > 21;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Blackjack</h1>
      Dealer
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={dealerHand} />
      </div>
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={hand} />
      </div>
      Player
      <div style={topBarStyle}>
        {/* Placeholder for boss/modifier info */}
        <div style={modifierStyle}>Modifier: —</div>
        <div style={totalStyle}>Total: {total}</div>
      </div>
      <div style={controlsStyle}>
        <button style={btnStyle} onClick={onHit} disabled={stood || isBust}>
          Hit
        </button>
        <button style={btnStyle} onClick={onStand} disabled={stood}>
          Stand
        </button>
        <button style={btnStyle} onClick={onDouble} disabled={stood || hand.length === 0}>
          Double
        </button>
        <button style={{ ...btnStyle, opacity: canSplit ? 1 : 0.5 }} onClick={onSplit} disabled={!canSplit}>
          Split
        </button>
      </div>
      {(stood || isBust) && (
        <div style={resultBoxStyle}>
          <p style={{ margin: 0 }}>{message}</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button style={btnStyle} onClick={startNewHand}>
              Next Hand
            </button>
            <button style={btnStyle} onClick={() => navigate('/run-hub')}>
              Return to Hub
            </button>
            <button
              style={btnStyle}
              onClick={() => {
                navigate('/bet');
              }}
            >
              Change Bet
            </button>
          </div>
        </div>
      )}
      <button style={backButtonStyle} onClick={() => navigate('/run-hub')}>
        Back to Hub
      </button>
    </div>
  );
}

/* Styles */
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

const resultBoxStyle = {
  marginTop: 8,
  padding: 12,
  border: '1px solid ',
  borderRadius: 10,
  textAlign: 'center',
  width: 'min(420px, 92vw)',
};

const backButtonStyle = {
  marginTop: 16,
  padding: '10px 20px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};

/* Card visuals */
const cardStyle = {
  width: 90,
  height: 130,
  borderRadius: 10,
  border: '1px solid ',
  color: '#111',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 8,
};

const cornerStyle = { fontWeight: 700, fontSize: 14 };
const centerPipStyle = {
  alignSelf: 'center',
  fontSize: 20,
  fontWeight: 700,
  opacity: 0.9,
};
