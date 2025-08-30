import { useState } from 'react';
import { useNavigate } from 'react-router';
import useDeckStore from './stores/deck';

/** Minimal mock catalog pools */
const POOLS = {
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
    {
      id: 'co_reroll+',
      name: 'Reroll Voucher',
      desc: 'Reroll -25% cost (1x)',
      cost: 100,
    },
    { id: 'co_focus', name: 'Focused Draw', desc: 'Next draw +2 value', cost: 80 },
    { id: 'co_guard', name: 'Bust Guard', desc: 'Prevent next bust', cost: 120 },
  ],
};

export default function Shop() {
  const navigate = useNavigate();
  const addOwnedShopCard = useDeckStore(s => s.addOwnedShopCard);
  const ownedShopCards = useDeckStore(s => s.ownedShopCards);
  const ownedIds = new Set(ownedShopCards.map(c => c.id));

  // state
  const [tab, setTab] = useState('Hexes');
  const [credits, setCredits] = useState(1200);
  const [rerollCost, setRerollCost] = useState(50);
  const [discount, setDiscount] = useState(0); // % discount from voucher
  const [items, setItems] = useState(() => rollShop(tab));

  function rollShop(whichTab) {
    // Simple random selection of up to 6 items from the pool (no dupes)
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
    if (ownedIds.has(item.id)) return;
    const cost = effectiveCost(item.cost);
    if (credits < cost) return;
    setCredits(c => c - cost);
    addOwnedShopCard(item);
    if (item.id === 'co_reroll+') setDiscount(0.25);
  };

  const reroll = () => {
    const cost = effectiveCost(rerollCost);
    if (credits < cost) return;
    setCredits(c => c - cost);
    setItems(rollShop(tab));
    setRerollCost(r => Math.round(r * 1.6)); // escalate cost
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Shop</h1>

      <div style={topBarStyle}>
        <div style={currencyStyle}>Winnings: {credits}</div>
        <div style={discountStyle}>
          {discount > 0 ? `Discount: -${Math.round(discount * 100)}%` : 'No Discount'}
        </div>
      </div>

      <div style={tabsStyle} role="tablist" aria-label="Shop categories">
        {['Hexes', 'Relics'].map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            style={{ ...tabBtnStyle, ...(tab === t ? tabBtnActiveStyle : null) }}
            onClick={() => handleTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={gridStyle}>
        {items.length === 0 ? (
          <div style={{ opacity: 0.8, padding: 16 }}>No items available.</div>
        ) : (
          items.map(it => {
            const isOwned = ownedIds.has(it.id);
            const costNow = effectiveCost(it.cost);
            const canBuy = !isOwned && credits >= costNow;
            return (
              <ItemCard
                key={it.id}
                item={it}
                owned={isOwned}
                effectiveCost={costNow}
                canBuy={canBuy}
                onBuy={() => buyItem(it)}
              />
            );
          })
        )}
      </div>

      <div style={bottomBarStyle}>
        <button
          style={btnStyle}
          onClick={reroll}
          disabled={credits < effectiveCost(rerollCost)}
        >
          Reroll ({effectiveCost(rerollCost)})
        </button>
        <button style={btnStyle} onClick={() => navigate('/run-hub')}>
          Back to Hub
        </button>
      </div>
    </div>
  );
}

function ItemCard({ item, owned, effectiveCost, canBuy, onBuy }) {
  return (
    <div style={cardStyle} aria-label={item.name}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h3 style={cardTitleStyle}>{item.name}</h3>
        <span style={priceStyle}>{owned ? 'Owned' : effectiveCost}</span>
      </div>
      <p style={cardDescStyle}>{item.desc}</p>
      <button
        style={{ ...buyBtnStyle, opacity: canBuy ? 1 : 0.5 }}
        onClick={onBuy}
        disabled={!canBuy || owned}
      >
        {owned ? 'Purchased' : 'Buy'}
      </button>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  gap: 12,
  color: '#eee',
  fontFamily: 'sans-serif',
  alignItems: 'center',
};

const titleStyle = { margin: '8px 0 0', fontSize: 28 };

const topBarStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
};

const currencyStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  fontWeight: 700,
};

const discountStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  opacity: 0.9,
};

const tabsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
  gap: 8,
  width: 'min(760px, 95vw)',
};

const tabBtnStyle = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};

const tabBtnActiveStyle = { outline: '2px solid ' };

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
  width: 'min(960px, 95vw)',
  marginTop: 8,
};

const cardStyle = {
  border: '1px solid ',
  borderRadius: 12,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const cardTitleStyle = { margin: 0, fontSize: 18 };
const priceStyle = { fontWeight: 700, opacity: 0.9 };
const cardDescStyle = { margin: 0, opacity: 0.85, fontSize: 14 };

const buyBtnStyle = {
  alignSelf: 'flex-start',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};

const bottomBarStyle = {
  display: 'flex',
  gap: 12,
  marginTop: 8,
};

const btnStyle = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};
