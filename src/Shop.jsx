import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import useDeckStore from './stores/deck';
import Card from './Card';
import { containerClass, buttonClass } from './theme';

const POOLS = {
  Packs: [
    { id: 'pack_standard', name: 'Card Pack', desc: 'Open 4 cards, choose 1', cost: 150, packSize: 4 },
    { id: 'pack_large', name: 'Large Pack', desc: 'Open 6 cards, choose 1', cost: 250, packSize: 6 },
  ],
  Hexes: [
    { id: 'jk_counter', name: 'Card Counter', desc: '+1x per card drawn', cost: 150 },
    { id: 'jk_pit', name: 'Pit Boss', desc: 'x2 if total is 20', cost: 220 },
    { id: 'jk_ins', name: 'Insurance Salesman', desc: 'Gain on bust', cost: 180 },
    { id: 'jk_split', name: 'Split Master', desc: 'Pairs can split', cost: 200 },
  ],
  Relics: [
    { id: 'r_doub', name: 'Double Down Token', desc: 'First Double is free', cost: 180 },
    { id: 'r_safe', name: 'Safe Hit', desc: 'First 22 splits into two aces.', cost: 240 },
    { id: 'r_pair', name: 'Pair Engine', desc: '+x on pairs', cost: 210 },
    { id: 'co_reroll+', name: 'Reroll Voucher', desc: 'Reroll -25% cost (1x)', cost: 100 },
    { id: 'co_focus', name: 'Focused Draw', desc: 'Next draw +2 value', cost: 80 },
    { id: 'co_guard', name: 'Bust Guard', desc: 'Prevent next bust', cost: 120 },
  ],
};

const EFFECTS = [
  '+25 chips if this card makes 21',
  '+10 chips per Ace in hand',
  'x2 multiplier if part of a Blackjack',
  '+15 chips if this card is a face card',
  'Prevent bust once per round if this card is in hand',
  '+20 chips if this card is drawn first',
  'x1.5 multiplier if paired with same rank',
  '+30 chips if this card wins against dealer',
];

function createRandomCard() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const effect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
  return { suit, rank, effect };
}

export default function Shop() {
  const navigate = useNavigate();
  const addCardToDeck = useDeckStore(state => state.addCardToDeck);

  const [tab, setTab] = useState('Packs');
  const [credits, setCredits] = useState(1200);
  const [rerollCost, setRerollCost] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState(() => rollShop(tab));
  const [owned, setOwned] = useState({});
  const [openedPack, setOpenedPack] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  function rollShop(whichTab) {
    const pool = POOLS[whichTab] || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(6, shuffled.length));
  }

  const handleTab = newTab => {
    setTab(newTab);
    setItems(rollShop(newTab));
  };

  const effectiveCost = base => Math.max(0, Math.round(base * (1 - discount)));

  const buyItem = item => {
    if (owned[item.id]) return;
    const cost = effectiveCost(item.cost);
    if (credits < cost) return;
    setCredits(c => c - cost);

    if (tab === 'Packs' && item.id.startsWith('pack_')) {
      const count = item.packSize || 4;
      setOpenedPack({ cards: Array.from({ length: count }, () => createRandomCard()) });
      setSelectedCard(null);
      return;
    }

    setOwned(o => ({ ...o, [item.id]: true }));
    if (item.id === 'co_reroll+') setDiscount(0.25);
  };

  const reroll = () => {
    const cost = effectiveCost(rerollCost);
    if (credits < cost) return;
    setCredits(c => c - cost);
    setItems(rollShop(tab));
    setRerollCost(r => Math.round(r * 1.6));
  };

  const confirmSelection = () => {
    if (!selectedCard) return;
    addCardToDeck(selectedCard);
    setOpenedPack(null);
    setSelectedCard(null);
  };

  return (
    <div className={containerClass} style={{ gap: 'var(--tui-gap-lg)' }}>
      <h1 style={{ fontSize: 28, marginTop: 8, color: 'var(--tui-fg)' }}>Shop</h1>

      <div style={{ display: 'flex', gap: 'var(--tui-gap-lg)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={pillStyle}>
          Winnings: <span style={{ color: 'var(--tui-cyan)' }}>{credits}</span>
        </div>
        <div style={pillStyle}>
          {discount > 0 ? `Discount: -${Math.round(discount * 100)}%` : 'No Discount'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--tui-gap)', maxWidth: 672, width: '100%' }}>
        {['Packs', 'Hexes', 'Relics'].map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={buttonClass}
            style={{ borderColor: tab === t ? 'var(--tui-pink)' : undefined }}
            onClick={() => handleTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {openedPack ? (
        <div
          style={{
            marginTop: 32,
            padding: 24,
            border: '2px solid var(--tui-line-strong)',
            textAlign: 'center',
            maxWidth: 896,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 24, color: 'var(--tui-fg)' }}>
            {selectedCard ? 'Selected (confirm to add)' : 'Choose a card'}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
            {openedPack.cards.map((c, index) => {
              const isSelected = selectedCard && c === selectedCard;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: isSelected ? -12 : 0,
                    scale: isSelected ? 1.06 : 1,
                    filter: isSelected ? 'none' : 'brightness(0.95)',
                  }}
                  transition={{ delay: index * 0.12, type: 'spring', stiffness: 220, damping: 20 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: isSelected ? 10 : 1 }}
                >
                  <button onClick={() => setSelectedCard(c)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                    <Card card={c} />
                  </button>
                  {isSelected && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tui-pink)' }}>Selected</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 'var(--tui-gap)' }}>
            <button
              className={buttonClass}
              onClick={confirmSelection}
              disabled={!selectedCard}
              style={{ opacity: selectedCard ? 1 : 0.5, cursor: selectedCard ? 'pointer' : 'not-allowed' }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--tui-gap-lg)', maxWidth: 1200, width: '100%', marginTop: 16 }}>
          {items.length === 0 ? (
            <div style={{ color: 'var(--tui-muted)', padding: 16 }}>No items available.</div>
          ) : (
            items.map(it => (
              <ItemCard
                key={it.id}
                item={it}
                owned={!!owned[it.id]}
                effectiveCost={effectiveCost(it.cost)}
                canBuy={credits >= effectiveCost(it.cost) && !owned[it.id]}
                onBuy={() => buyItem(it)}
              />
            ))
          )}
        </div>
      )}

      {!openedPack && (
        <div style={{ display: 'flex', gap: 'var(--tui-gap-lg)', marginTop: 24 }}>
          <button
            className={buttonClass}
            onClick={reroll}
            disabled={credits < effectiveCost(rerollCost)}
            style={{ opacity: credits >= effectiveCost(rerollCost) ? 1 : 0.5 }}
          >
            Reroll ({effectiveCost(rerollCost)})
          </button>
          <button className={buttonClass} onClick={() => navigate('/run-hub')}>
            Back to Hub
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, owned, effectiveCost, canBuy, onBuy }) {
  return (
    <div style={{ border: '1px solid var(--tui-line)', padding: 'var(--tui-pad-3)', display: 'flex', flexDirection: 'column', gap: 'var(--tui-gap)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0, fontSize: 18, color: 'var(--tui-fg)' }}>{item.name}</h3>
        <span style={{ fontWeight: 700, color: owned ? 'var(--tui-ok)' : 'var(--tui-cyan)' }}>
          {owned ? 'Owned' : effectiveCost}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--tui-muted)' }}>{item.desc}</p>
      <button
        className={buttonClass}
        onClick={onBuy}
        disabled={!canBuy || owned}
        style={{
          alignSelf: 'flex-start',
          opacity: canBuy && !owned ? 1 : 0.5,
          cursor: canBuy && !owned ? 'pointer' : 'not-allowed',
        }}
      >
        {owned ? 'Purchased' : 'Buy'}
      </button>
    </div>
  );
}

const pillStyle = {
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  fontWeight: 700,
  color: 'var(--tui-fg)',
};
