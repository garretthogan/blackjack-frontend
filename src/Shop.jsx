import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import useDeckStore from './stores/deck';
import useScoreboardStore from './stores/scoreboard';
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
  {
    id: 'copy_adjacent_on_hit',
    text: 'If drawn from Hit, this card becomes the card next to it in your hand.',
  },
];

function createRandomCard() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const shouldHaveEffect = Math.random() < 0.35;
  if (!shouldHaveEffect) return { suit, rank };

  const chosenEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
  return { suit, rank, effect: chosenEffect.text, effectId: chosenEffect.id };
}

function createRandomEffectCard() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const chosenEffect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
  return { suit, rank, effect: chosenEffect.text, effectId: chosenEffect.id };
}

export default function Shop() {
  const navigate = useNavigate();
  const addCardToDeck = useDeckStore(state => state.addCardToDeck);
  const purse = useScoreboardStore(state => state.purse);
  const withdrawFromPurse = useScoreboardStore(state => state.withdrawFromPurse);
  const isDev = import.meta.env.DEV;

  const [tab, setTab] = useState('Packs');
  const [rerollCost, setRerollCost] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [devOnlyEffectPackCards, setDevOnlyEffectPackCards] = useState(false);
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
    if (purse < cost) return;
    withdrawFromPurse(cost);

    if (tab === 'Packs' && item.id.startsWith('pack_')) {
      const count = item.packSize || 4;
      setOpenedPack({
        cards: Array.from({ length: count }, () =>
          isDev && devOnlyEffectPackCards ? createRandomEffectCard() : createRandomCard()
        ),
      });
      setSelectedCard(null);
      return;
    }

    setOwned(o => ({ ...o, [item.id]: true }));
    if (item.id === 'co_reroll+') setDiscount(0.25);
  };

  const reroll = () => {
    const cost = effectiveCost(rerollCost);
    if (purse < cost) return;
    withdrawFromPurse(cost);
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
          Bank: <span style={{ color: 'var(--tui-cyan)' }}>{purse}</span>
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
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCard(c)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCard(c);
                      }
                    }}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  >
                    <Card card={c} />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--tui-pink)',
                      minHeight: 20,
                      visibility: isSelected ? 'visible' : 'hidden',
                    }}
                  >
                    Selected
                  </div>
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
                canBuy={purse >= effectiveCost(it.cost) && !owned[it.id]}
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
            disabled={purse < effectiveCost(rerollCost)}
            style={{ opacity: purse >= effectiveCost(rerollCost) ? 1 : 0.5 }}
          >
            Reroll ({effectiveCost(rerollCost)})
          </button>
          <button className={buttonClass} onClick={() => navigate('/blackjack')}>
            Next Hand
          </button>
        </div>
      )}
      {isDev && (
        <label style={devToggleStyle}>
          <input
            type="checkbox"
            checked={devOnlyEffectPackCards}
            onChange={e => setDevOnlyEffectPackCards(e.target.checked)}
          />
          <span>Packs contain only effect cards</span>
        </label>
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

const devToggleStyle = {
  position: 'fixed',
  left: '50%',
  bottom: 16,
  transform: 'translateX(-50%)',
  zIndex: 60,
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--tui-gap-sm)',
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  background: 'var(--tui-bg)',
  color: 'var(--tui-fg)',
};
