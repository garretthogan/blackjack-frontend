import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { shuffle, suitName as suitNameFromSymbol } from './helpers';

export default function DeckViewer({ cards, jokers, title = 'Deck & Jokers' }) {
  const navigate = useNavigate();

  const isLiveMode = Array.isArray(cards) || Array.isArray(jokers);
  const [mockDeck, setMockDeck] = useState(() => (isLiveMode ? [] : generateMockDeck()));
  const [mockJokers] = useState(() => (isLiveMode ? [] : generateMockJokers()));

  const deck = useMemo(() => {
    const source = isLiveMode ? cards || [] : mockDeck;
    return source.map(card =>
      card && card.suitName ? card : { ...card, suitName: safeSuitName(card?.suit) }
    );
  }, [isLiveMode, cards, mockDeck]);

  const jokers = isLiveMode ? jokers || [] : mockJokers;

  const [query, setQuery] = useState('');
  const filteredDeck = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.rank.toLowerCase().includes(q) ||
      c.suitName.toLowerCase().includes(q) ||
      (c.rank + c.suit).toLowerCase().includes(q)
    );
  }, [deck, query]);

  const sortByRank = () => {
    if (isLiveMode) return;
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    setMockDeck(d =>
      [...d].sort((a, b) => order.indexOf(a.rank) - order.indexOf(b.rank))
    );
  };

  const shuffleDeck = () => {
    if (isLiveMode) return;
    setMockDeck(d => shuffle(d));
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{title}</h1>

      <div style={metaBarStyle}>
        <div style={badgeStyle}>Deck: {deck.length}</div>
        <div style={badgeStyle}>Jokers: {jokers.length}</div>
      </div>

      <div style={controlsStyle}>
        <input
          placeholder="Filter (e.g., A, hearts, 10♣)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={inputStyle}
        />
        {!isLiveMode && (
          <>
            <button style={buttonStyle} onClick={sortByRank}>
              Sort by Rank
            </button>
            <button style={buttonStyle} onClick={shuffleDeck}>
              Shuffle
            </button>
          </>
        )}
        <button style={buttonStyle} onClick={() => setQuery('')}>
          Clear Filter
        </button>
      </div>

      <div style={columnsStyle}>
        <section style={deckColStyle} aria-label="Deck list">
          <h2 style={sectionTitleStyle}>{isLiveMode ? 'Remaining Deck' : 'Deck'}</h2>
          <div style={deckListStyle}>
            {filteredDeck.map(c => (
              <CardRow key={c.id} card={c} />
            ))}
            {filteredDeck.length === 0 && (
              <div style={{ opacity: 0.8, padding: 12 }}>No cards match your filter.</div>
            )}
          </div>
        </section>

        <section style={jokerColStyle} aria-label="Jokers">
          <h2 style={sectionTitleStyle}>Jokers</h2>
          <div style={jokerGridStyle}>
            {jokers.map(j => (
              <div key={j.id} style={jokerCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={jokerTitleStyle}>{j.name}</h3>
                  <span style={rarityStyle}>{j.rarity || 'Owned'}</span>
                </div>
                <p style={jokerDescStyle}>{j.desc}</p>
              </div>
            ))}
            {jokers.length === 0 && (
              <div style={{ opacity: 0.8, padding: 12 }}>No jokers.</div>
            )}
          </div>
        </section>
      </div>

      <button style={backButtonStyle} onClick={() => navigate('/run-hub')}>
        Back to Hub
      </button>
    </div>
  );
}

/* --- Small components --- */
function CardRow({ card }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  return (
    <div style={rowStyle}>
      <div style={{ ...miniCardStyle, color: isRed ? '#b00020' : '#111' }}>
        <div style={{ fontWeight: 700 }}>
          {card.rank}
          {card.suit}
        </div>
      </div>
      <div style={rowTextStyle}>
        <div style={{ fontWeight: 700 }}>
          {card.rank}
          {card.suit} — {card.suitName || card.name}
        </div>
        <div style={{ opacity: 0.8, fontSize: 12 }}>ID: {card.id}</div>
      </div>
    </div>
  );
}

function safeSuitName(symbol) {
  try {
    return suitNameFromSymbol(symbol);
  } catch {
    return symbol === '☆' ? 'Shop Card' : '';
  }
}

function generateMockDeck() {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠', '♥', '♦', '♣'];
  const sample = [];
  for (let i = 0; i < 16; i++) {
    const rank = ranks[(i * 3) % ranks.length];
    const suit = suits[(i * 5) % suits.length];
    sample.push({
      id: `c_${i}_${rank}${suit}`,
      rank,
      suit,
      suitName: safeSuitName(suit),
    });
  }
  return sample;
}

function generateMockJokers() {
  return [
    {
      id: 'jk_counter',
      name: 'Card Counter',
      rarity: 'Common',
      desc: '+1x multiplier per card drawn this hand.',
    },
    {
      id: 'jk_pit',
      name: 'Pit Boss',
      rarity: 'Rare',
      desc: 'x2 payout if final hand total is exactly 20.',
    },
    {
      id: 'jk_ins',
      name: 'Insurance Salesman',
      rarity: 'Uncommon',
      desc: 'Gain small payout on bust.',
    },
    {
      id: 'jk_split',
      name: 'Split Master',
      rarity: 'Uncommon',
      desc: 'Pairs can be split for double scoring.',
    },
  ];
}

/* --- Styles --- */
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  color: '#eee',
  padding: 24,
  fontFamily: 'sans-serif',
  alignItems: 'center',
};

const titleStyle = { margin: 0, fontSize: 28 };

const metaBarStyle = { display: 'flex', gap: 8, alignItems: 'center' };

const badgeStyle = {
  padding: '6px 10px',
  border: '1px solid ',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const controlsStyle = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: 'min(960px, 95vw)',
};

const inputStyle = {
  flex: '1 1 260px',
  minWidth: 220,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
};

const buttonStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};

const columnsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  width: 'min(960px, 95vw)',
};

const deckColStyle = {
  border: '1px dashed #333',
  borderRadius: 12,
  padding: 12,
  minHeight: 380,
};

const jokerColStyle = { ...deckColStyle };

const sectionTitleStyle = { margin: '4px 4px 12px', fontSize: 18 };

const deckListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: 420,
  overflow: 'auto',
  paddingRight: 4,
};

const rowStyle = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  padding: 8,
  borderRadius: 10,
  border: '1px solid ',
};

const miniCardStyle = {
  width: 44,
  height: 60,
  borderRadius: 6,
  border: '1px solid ',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const rowTextStyle = { display: 'flex', flexDirection: 'column' };

const jokerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
  maxHeight: 420,
  overflow: 'auto',
  paddingRight: 4,
};

const jokerCardStyle = {
  border: '1px solid ',
  borderRadius: 12,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const jokerTitleStyle = { margin: 0, fontSize: 16 };

const rarityStyle = { opacity: 0.9, fontSize: 12, alignSelf: 'flex-start' };

const jokerDescStyle = { margin: 0, opacity: 0.85, fontSize: 14 };

const backButtonStyle = {
  marginTop: 4,
  padding: '10px 20px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};
