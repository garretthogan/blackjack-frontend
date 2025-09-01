import { useState } from 'react';
import { suitName } from './helpers';

export default function Card({ card }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  const [showTooltip, setShowTooltip] = useState(false);
  const hasEffect = !!card.effect;

  return (
    <div
      className={`group relative aspect-[5/7] select-none rounded-2xl bg-white transition-transform duration-200 ease-out hover:-translate-y-1.5 ${
        hasEffect
          ? 'ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.7)]'
          : 'ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]'
      }`}
      style={{ width: 'clamp(96px, 12vw, 128px)' }}
      role="img"
      aria-label={`${card.rank} of ${suitName(card.suit)}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_10%,_rgba(255,255,255,0.95),_rgba(235,235,235,0.9))]" />
      <div className="absolute left-2 top-2 text-[min(20px,4.2vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>
          {card.rank}
        </span>
        <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>
          {card.suit}
        </span>
      </div>
      <div className="absolute bottom-2 right-2 rotate-180 text-[min(20px,4.2vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>
          {card.rank}
        </span>
        <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>
          {card.suit}
        </span>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className={`${isRed ? 'text-red-500' : 'text-stone-700'} opacity-80`}
          style={{ fontSize: 'min(64px, 12vw)' }}
        >
          {card.suit}
        </span>
      </div>

      {hasEffect && (
        <div
          className="absolute top-2 right-2"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-black rounded">
            Effect
          </span>
          {showTooltip && (
            <div className="absolute top-6 right-0 w-40 p-2 text-xs text-black bg-white border border-yellow-400 rounded shadow-lg z-20">
              {card.effect}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
