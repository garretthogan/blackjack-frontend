import { useState } from 'react';
import { suitName } from './helpers';

export default function Card({ card }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  const [showTooltip, setShowTooltip] = useState(false);
  const hasEffect = !!card.effect;

  const suitColor = isRed ? 'var(--tui-danger)' : 'var(--tui-fg)';
  const borderColor = hasEffect ? 'var(--tui-cyan)' : 'var(--tui-line-strong)';

  return (
    <div
      className="group relative aspect-[5/7] select-none transition-transform duration-200 ease-out hover:-translate-y-1.5"
      style={{
        width: 'clamp(96px, 12vw, 128px)',
        border: `2px solid ${borderColor}`,
        background: 'transparent',
        boxShadow: hasEffect ? '0 0 12px var(--tui-cyan)' : 'none',
      }}
      role="img"
      aria-label={`${card.rank} of ${suitName(card.suit)}`}
    >
      <div
        className="absolute left-2 top-2 leading-none font-mono"
        style={{ fontSize: 'min(20px, 4.2vw)' }}
      >
        <span className="block font-bold" style={{ color: suitColor }}>
          {card.rank}
        </span>
        <span style={{ color: suitColor }}>{card.suit}</span>
      </div>
      <div
        className="absolute bottom-2 right-2 rotate-180 leading-none font-mono"
        style={{ fontSize: 'min(20px, 4.2vw)' }}
      >
        <span className="block font-bold" style={{ color: suitColor }}>
          {card.rank}
        </span>
        <span style={{ color: suitColor }}>{card.suit}</span>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span
          style={{
            fontSize: 'min(64px, 12vw)',
            color: suitColor,
            opacity: 0.6,
          }}
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
          <span
            className="px-1.5 py-0.5 text-[10px] font-bold"
            style={{
              border: '1px solid var(--tui-cyan)',
              color: 'var(--tui-cyan)',
              background: 'transparent',
            }}
          >
            FX
          </span>
          {showTooltip && (
            <div
              className="absolute top-6 right-0 w-40 p-2 text-xs z-20"
              style={{
                border: '1px solid var(--tui-cyan)',
                background: 'var(--tui-bg)',
                color: 'var(--tui-fg)',
              }}
            >
              {card.effect}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
