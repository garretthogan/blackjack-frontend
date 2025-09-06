// src/SeatAndBuyIn.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useScoreboardStore from './stores/scoreboard';
import { containerClass } from './theme';

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
      <h1 className="text-2xl font-bold mb-4">Blackjack</h1>
      <div>
        <section className="w-[520px] max-w-[92vw] rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold tracking-tight">Buy-in</h2>

          <div className="mb-3 flex flex-wrap gap-3">
            {table.presets.map(preset => {
              const disabled = preset > remainingRoom;
              return (
                <button
                  key={preset}
                  onClick={() => addBuyIn(preset)}
                  disabled={disabled}
                  className={
                    'rounded-xl border px-4 py-2 text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
                    (disabled
                      ? 'cursor-not-allowed opacity-40 border-zinc-300'
                      : 'border-zinc-300 hover:bg-white/10')
                  }
                >
                  +${preset}
                </button>
              );
            })}
          </div>

          <p className="mb-2 text-xs opacity-80">
            Min ${table.min}, Max ${table.max}
          </p>

          <div className="mb-4 flex items-center rounded-xl border border-zinc-300 px-3 py-2">
            <span className="text-sm font-medium">Current Buy-in: ${buyIn}</span>
            <button
              onClick={clearBuyIn}
              disabled={!buyIn}
              className={
                'ml-auto h-8 w-8 rounded-lg border text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 ' +
                (!buyIn
                  ? 'cursor-not-allowed opacity-40 border-zinc-300'
                  : 'border-zinc-300 hover:bg-white/10')
              }
              title="Clear"
            >
              ✕
            </button>
          </div>

          <button
            onClick={startRun}
            disabled={!withinLimits}
            className={
              'w-full rounded-2xl px-5 py-3 text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
              (withinLimits
                ? 'text-white focus-visible:ring-zinc-400 border border-zinc-200'
                : 'cursor-not-allowed border border-zinc-200')
            }
          >
            Play
          </button>
        </section>
      </div>
    </div>
  );
}
