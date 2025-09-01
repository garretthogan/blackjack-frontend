import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import useDeckStore from './stores/deck';
import Card from './Card';

/** Minimal mock catalog pools */
const POOLS = {
  Packs: [
    {
      id: 'pack_standard',
      name: 'Card Pack',
      desc: 'Open 4 cards, choose 1',
      cost: 150,
      packSize: 4,
    },
    {
      id: 'pack_large',
      name: 'Large Pack',
      desc: 'Open 6 cards, choose 1',
      cost: 250,
      packSize: 6,
    },
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
  const [discount, setDiscount] = useState(0); // % discount from voucher
  const [items, setItems] = useState(() => rollShop(tab));
  const [owned, setOwned] = useState({}); // id -> true
  const [openedPack, setOpenedPack] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

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
    if (owned[item.id]) return;
    const cost = effectiveCost(item.cost);
    if (credits < cost) return;
    setCredits(c => c - cost);

    if (tab === 'Packs' && item.id.startsWith('pack_')) {
      const count = item.packSize || 4;
      setOpenedPack({
        cards: Array.from({ length: count }, () => createRandomCard()),
      });
      setSelectedCard(null);
      return;
    }

    setOwned(o => ({ ...o, [item.id]: true }));

    // Simple example effect: voucher applies a discount once.
    if (item.id === 'co_reroll+') {
      setDiscount(0.25); // 25% off
    }
  };

  const reroll = () => {
    const cost = effectiveCost(rerollCost);
    if (credits < cost) return;
    setCredits(c => c - cost);
    setItems(rollShop(tab));
    setRerollCost(r => Math.round(r * 1.6)); // escalate cost
  };

  const confirmSelection = () => {
    if (!selectedCard) return;
    addCardToDeck(selectedCard);
    setOpenedPack(null);
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-6 text-stone-200 font-sans">
      <h1 className="text-3xl mt-2">Shop</h1>

      <div className="flex gap-4 items-center justify-center">
        <div className="px-3 py-1 border rounded-md font-bold">Winnings: {credits}</div>
        <div className="px-3 py-1 border rounded-md opacity-90">
          {discount > 0 ? `Discount: -${Math.round(discount * 100)}%` : 'No Discount'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
        {['Packs', 'Hexes', 'Relics'].map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`px-4 py-2 rounded-md border ${tab === t ? 'outline outline-2' : ''}`}
            onClick={() => handleTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {openedPack ? (
        <div className="mt-8 p-6 border rounded-lg text-center w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-xl mb-6">
            {selectedCard ? 'Selected (confirm to add)' : 'Choose a card'}
          </h2>

          <div className="flex flex-wrap justify-center gap-10 w-full mb-8">
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
                  transition={{
                    delay: index * 0.12,
                    type: 'spring',
                    stiffness: 220,
                    damping: 20,
                  }}
                  className={`flex flex-col items-center gap-3 ${isSelected ? 'z-10' : ''}`}
                >
                  <button onClick={() => setSelectedCard(c)} className="cursor-pointer">
                    <Card card={c} />
                  </button>
                  {isSelected && (
                    <div className="text-sm font-semibold mt-1">Selected</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              className={`px-4 py-2 rounded-md border ${selectedCard ? '' : 'opacity-50 cursor-not-allowed'}`}
              onClick={confirmSelection}
              disabled={!selectedCard}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mt-4">
          {items.length === 0 ? (
            <div className="opacity-80 p-4">No items available.</div>
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
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 rounded-md border"
            onClick={reroll}
            disabled={credits < effectiveCost(rerollCost)}
          >
            Reroll ({effectiveCost(rerollCost)})
          </button>
          <button
            className="px-4 py-2 rounded-md border"
            onClick={() => navigate('/run-hub')}
          >
            Back to Hub
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, owned, effectiveCost, canBuy, onBuy }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-baseline">
        <h3 className="text-lg">{item.name}</h3>
        <span className="font-bold opacity-90">{owned ? 'Owned' : effectiveCost}</span>
      </div>
      <p className="text-sm opacity-80">{item.desc}</p>
      <button
        className={`self-start px-3 py-2 rounded-md border ${canBuy ? '' : 'opacity-50 cursor-not-allowed'}`}
        onClick={onBuy}
        disabled={!canBuy || owned}
      >
        {owned ? 'Purchased' : 'Buy'}
      </button>
    </div>
  );
}
