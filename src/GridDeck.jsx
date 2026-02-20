import { useMemo, useState } from 'react';
import Card from './Card';
import SuitLegend from './SuitLegend';
import { btnCls } from './helpers';

export default function GridDeck({ cards }) {
  const [isDeckTrayOpen, setIsDeckTrayOpen] = useState(false);
  const [isLegendTrayOpen, setIsLegendTrayOpen] = useState(true);

  const spade = useMemo(() => cards.filter(c => c.suit === '♠'), [cards]);
  const heart = useMemo(() => cards.filter(c => c.suit === '♥'), [cards]);
  const diamond = useMemo(() => cards.filter(c => c.suit === '♦'), [cards]);
  const club = useMemo(() => cards.filter(c => c.suit === '♣'), [cards]);

  return (
    <div style={{ padding: 'var(--tui-pad-3) 0' }}>
      <div>
        <button
          className={btnCls}
          onClick={() => setIsLegendTrayOpen(!isLegendTrayOpen)}
        >
          Legend
        </button>
      </div>
      {isLegendTrayOpen && (
        <div
          style={{
            marginTop: 'var(--tui-gap-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--tui-gap)',
            fontSize: 'var(--tui-font-size-sm)',
          }}
        >
          <SuitLegend title="Spades" cards={spade} color="text-fg" />
          <SuitLegend title="Hearts" cards={heart} color="text-red" />
          <SuitLegend title="Diamonds" cards={diamond} color="text-red" />
          <SuitLegend title="Clubs" cards={club} color="text-fg" />
        </div>
      )}
      <div style={{ padding: '48px 0' }}>
        <button
          className={btnCls}
          onClick={() => setIsDeckTrayOpen(!isDeckTrayOpen)}
        >
          {isDeckTrayOpen ? 'Hide Cards' : 'Show Cards in Deck'}
        </button>
      </div>
      {isDeckTrayOpen && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 'var(--tui-gap)',
            maxHeight: 512,
            overflow: 'auto',
          }}
        >
          {cards.map(card => (
            <Card key={`${card.rank}-${card.suit}`} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
