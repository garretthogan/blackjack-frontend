import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useScoreboardStore from './stores/scoreboard';
import { containerClass, modalClass, buttonClass } from './theme';

export default function SeatAndBuyIn() {
  const table = { min: 25, max: 2000, presets: [25, 100, 250, 500, 1000] };
  const { setStartingPurse, purse } = useScoreboardStore();

  const [buyIn, setBuyIn] = useState(0);
  const navigate = useNavigate();

  const withinLimits = useMemo(
    () => buyIn >= table.min && buyIn <= table.max,
    [buyIn, table.min, table.max]
  );

  const remainingRoom = Math.max(0, table.max - buyIn);

  const addBuyIn = amountToAdd => {
    setBuyIn(prev => Math.min(table.max, prev + amountToAdd));
  };

  const clearBuyIn = () => setBuyIn(0);

  const startRun = () => {
    if (!withinLimits) return;
    setStartingPurse(buyIn);
    navigate('/blackjack');
  };

  return (
    <div className={containerClass}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 'var(--tui-gap-lg)', color: 'var(--tui-fg)' }}>
        Blackjack
      </h1>
      <div className={modalClass} style={{ minWidth: 'min(520px, 92vw)' }}>
        <h2 style={{ marginBottom: 'var(--tui-gap-lg)', fontSize: 16, fontWeight: 600, color: 'var(--tui-fg)' }}>
          Buy-in
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tui-gap)', marginBottom: 'var(--tui-gap)' }}>
          {table.presets.map(preset => {
            const disabled = preset > remainingRoom;
            return (
              <button
                key={preset}
                onClick={() => addBuyIn(preset)}
                disabled={disabled}
                className={buttonClass}
                style={{
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                +${preset}
              </button>
            );
          })}
        </div>

        <p style={{ marginBottom: 'var(--tui-gap)', fontSize: 'var(--tui-font-size-sm)', color: 'var(--tui-muted)' }}>
          Min ${table.min}, Max ${table.max}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--tui-pad-2)',
            marginBottom: 'var(--tui-gap-lg)',
            border: '2px solid var(--tui-line-strong)',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tui-fg)' }}>
            Current Buy-in: <span style={{ color: 'var(--tui-cyan)' }}>${buyIn}</span>
          </span>
          <button
            onClick={clearBuyIn}
            disabled={!buyIn}
            className={buttonClass}
            style={{
              marginLeft: 'auto',
              padding: 'var(--tui-pad-1)',
              opacity: !buyIn ? 0.4 : 1,
              cursor: !buyIn ? 'not-allowed' : 'pointer',
            }}
            title="Clear"
          >
            ✕
          </button>
        </div>

        <button
          onClick={startRun}
          disabled={!withinLimits}
          className={buttonClass}
          style={{
            width: '100%',
            borderColor: withinLimits ? 'var(--tui-pink)' : 'var(--tui-line)',
            opacity: withinLimits ? 1 : 0.5,
            cursor: withinLimits ? 'pointer' : 'not-allowed',
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
