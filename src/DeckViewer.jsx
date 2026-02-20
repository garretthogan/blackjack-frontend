import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { suitName } from './helpers';
import useDeckStore from './stores/deck';
import { containerClass, buttonClass } from './theme';

export default function DeckViewer() {
  const navigate = useNavigate();
  const deck = useDeckStore(state => state.deck);
  const shuffleStoreDeck = useDeckStore(state => state.shuffle);
  const [jokers] = useState(() => generateMockJokers());
  const [query, setQuery] = useState('');

  const filteredDeck = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return deck;
    return deck.filter(c => {
      const suit = suitName(c.suit);
      const label = `${c.rank}${c.suit}`.toLowerCase();
      return (
        String(c.rank).toLowerCase().includes(q) ||
        suit.toLowerCase().includes(q) ||
        label.includes(q)
      );
    });
  }, [deck, query]);

  const sortByRank = () => {
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  };

  return (
    <div className={containerClass} style={{ gap: 'var(--tui-gap-lg)', alignItems: 'center' }}>
      <h1 style={{ margin: 0, fontSize: 28, color: 'var(--tui-fg)' }}>Deck & Jokers</h1>

      <div style={{ display: 'flex', gap: 'var(--tui-gap)', alignItems: 'center' }}>
        <div style={pillStyle}>Deck: {deck.length}</div>
        <div style={pillStyle}>Jokers: {jokers.length}</div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--tui-gap)', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960 }}>
        <input
          placeholder="Filter (e.g., A, hearts, 10♣)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button className={buttonClass} onClick={sortByRank}>
          Sort by Rank
        </button>
        <button className={buttonClass} onClick={shuffleStoreDeck}>
          Shuffle
        </button>
        <button className={buttonClass} onClick={() => setQuery('')}>
          Clear Filter
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tui-gap-lg)', maxWidth: 960, width: '95vw' }}>
        <section style={colStyle} aria-label="Deck list">
          <h2 style={{ margin: '4px 4px 12px', fontSize: 18, color: 'var(--tui-fg)' }}>Deck</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tui-gap)', maxHeight: 420, overflow: 'auto' }}>
            {filteredDeck.map(c => (
              <CardRow key={c.id} card={c} />
            ))}
            {filteredDeck.length === 0 && (
              <div style={{ color: 'var(--tui-muted)', padding: 12 }}>No cards match your filter.</div>
            )}
          </div>
        </section>

        <section style={colStyle} aria-label="Jokers">
          <h2 style={{ margin: '4px 4px 12px', fontSize: 18, color: 'var(--tui-fg)' }}>Jokers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--tui-gap)', maxHeight: 420, overflow: 'auto' }}>
            {jokers.map(j => (
              <div key={j.id} style={jokerCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: 'var(--tui-fg)' }}>{j.name}</h3>
                  <span style={{ color: 'var(--tui-muted)', fontSize: 12 }}>{j.rarity}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--tui-muted)', fontSize: 14 }}>{j.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button className={buttonClass} onClick={() => navigate('/run-hub')}>
        Back to Hub
      </button>
    </div>
  );
}

function CardRow({ card }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  const suitColor = isRed ? 'var(--tui-danger)' : 'var(--tui-fg)';

  return (
    <div style={rowStyle}>
      <div style={{ ...miniCardStyle, color: suitColor }}>
        <div style={{ fontWeight: 700 }}>
          {card.rank}
          {card.suit}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 700, color: 'var(--tui-fg)' }}>
          {card.rank}
          {card.suit} — {card.suitName}
        </div>
        <div style={{ color: 'var(--tui-muted)', fontSize: 12 }}>ID: {card.id}</div>
      </div>
    </div>
  );
}

function generateMockJokers() {
  return [
    { id: 'jk_counter', name: 'Card Counter', rarity: 'Common', desc: '+1x multiplier per card drawn this hand.' },
    { id: 'jk_pit', name: 'Pit Boss', rarity: 'Rare', desc: 'x2 payout if final hand total is exactly 20.' },
    { id: 'jk_ins', name: 'Insurance Salesman', rarity: 'Uncommon', desc: 'Gain small payout on bust.' },
    { id: 'jk_split', name: 'Split Master', rarity: 'Uncommon', desc: 'Pairs can be split for double scoring.' },
  ];
}

const pillStyle = {
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tui-fg)',
};

const inputStyle = {
  flex: '1 1 260px',
  minWidth: 220,
  padding: 'var(--tui-pad-2)',
  border: '2px solid var(--tui-line-strong)',
  background: 'transparent',
  color: 'var(--tui-fg)',
};

const colStyle = {
  border: '1px dashed var(--tui-line)',
  padding: 'var(--tui-pad-3)',
  minHeight: 380,
};

const rowStyle = {
  display: 'flex',
  gap: 'var(--tui-gap)',
  alignItems: 'center',
  padding: 'var(--tui-pad-1)',
  border: '1px solid var(--tui-line)',
};

const miniCardStyle = {
  width: 44,
  height: 60,
  border: '1px solid var(--tui-line-strong)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const jokerCardStyle = {
  border: '1px solid var(--tui-line)',
  padding: 'var(--tui-pad-2)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--tui-gap-sm)',
};
