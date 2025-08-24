import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';

/**
 * BettingScreen.jsx
 * - Unified smooth hover fade + click animation for all buttons.
 * - Deal button now clearly looks disabled: pale gray, low contrast, no hover/active effects.
 * - Prevents text selection for rapid clicking.
 * - Back to Menu button (top-right) -> routes to '/'.
 */
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#eee',
  padding: '24px',
  fontFamily: 'sans-serif',
};

export default function BettingScreen({ min = 5, max = 500, denoms = [1, 5, 25, 100, 500] }) {
  const initial = denoms.includes(25) ? 25 : denoms[0];
  const [selectedDenom, setSelectedDenom] = useState(initial);
  const [chipCounts, setChipCounts] = useState({});

  const total = useMemo(() => denoms.reduce((sum, d) => sum + d * (chipCounts[d] || 0), 0), [chipCounts, denoms]);

  const withinLimits = total === 0 || (total >= min && total <= max);

  const rootRef = useRef(null);
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const addChip = (d, n = 1) => setChipCounts(prev => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) + n) }));
  const removeChip = (d, n = 1) => setChipCounts(prev => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) - n) }));
  const clearBets = () => setChipCounts({});

  const navigate = useNavigate();

  const handleDeal = () => {
    if (total === 0 || !withinLimits) return;
    navigate('/blackjack');
  };

  const cycleDenom = dir => {
    const i = denoms.indexOf(selectedDenom);
    const next = (i + dir + denoms.length) % denoms.length;
    setSelectedDenom(denoms[next]);
  };

  const onKeyDown = e => {
    const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const idx = numberKeys.indexOf(e.key);
    if (idx !== -1 && idx < denoms.length) {
      setSelectedDenom(denoms[idx]);
      return;
    }
    if (e.key === 'ArrowRight') cycleDenom(+1);
    else if (e.key === 'ArrowLeft') cycleDenom(-1);
    else if (e.key === '+') addChip(selectedDenom);
    else if (e.key === '-') removeChip(selectedDenom);
    else if (e.key === 'Backspace' || e.key === 'Delete') clearBets();
    else if (e.key === 'Enter') handleDeal();
  };

  const onCircleKeyDown = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addChip(selectedDenom);
    }
  };

  return (
    <div ref={rootRef} tabIndex={-1} onKeyDown={onKeyDown} style={containerStyle} className="select-none">
      {/* Back to Menu button (top-right) */}
      <div className="absolute right-4 top-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border border-zinc-300 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 shadow-sm
                     transition-colors duration-400 ease-out hover:bg-white/15
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:translate-y-[1px]"
          type="button"
        >
          Back to Menu
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="mb-6 text-sm font-medium tracking-tight">Dealer</div>

          {/* Betting spot */}
          <div className="flex flex-col items-center gap-4 py-8">
            {/* Circle */}
            <div
              role="button"
              tabIndex={0}
              onKeyDown={onCircleKeyDown}
              onClick={() => addChip(selectedDenom)}
              onContextMenu={e => {
                e.preventDefault();
                removeChip(selectedDenom);
              }}
              className="grid h-40 w-40 place-items-center rounded-full border border-zinc-400/50
                         bg-white/5 text-center
                         transition-colors duration-400 ease-out
                         hover:bg-white/15
                         active:scale-[0.98] active:bg-white/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              aria-label="Betting spot"
              title="Click: add selected chip • Right-click: remove • Space/Enter: add"
            >
              <div>
                <div className="text-xs uppercase tracking-wide">Current Bet</div>
                <div className={`text-2xl font-bold ${withinLimits ? 'text-zinc-900' : 'text-red-600'}`}>${total}</div>
                {!withinLimits && <div className="mt-1 text-xs text-red-600">Out of limits</div>}
              </div>
            </div>

            {/* +/- controls */}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => removeChip(selectedDenom)}
                className="h-8 w-12 rounded-full border border-zinc-300 bg-white/5 text-sm font-semibold shadow-sm
                           transition-colors duration-400 ease-out hover:bg-white/15
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:translate-y-[1px]"
                type="button"
              >
                –
              </button>
              <button
                onClick={() => addChip(selectedDenom)}
                className="h-8 w-12 rounded-full border border-zinc-300 bg-white/5 text-sm font-semibold shadow-sm
                           transition-colors duration-400 ease-out hover:bg-white/15
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:translate-y-[1px]"
                type="button"
              >
                +
              </button>
            </div>

            {/* Breakdown */}
            <div className="text-xs">
              {denoms.map(d => (
                <span key={d} className="mr-3">
                  ${d}: <span className="font-medium">{chipCounts[d] || 0}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Chip tray */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {denoms.map((d, i) => {
              const selected = selectedDenom === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDenom(d)}
                  onDoubleClick={() => addChip(d)}
                  className={
                    'min-w-[72px] rounded-xl border px-4 py-2 text-sm shadow-sm transition-colors duration-400 ease-out focus:outline-none focus-visible:ring-2 active:translate-y-[1px] ' +
                    (selected
                      ? 'border-zinc-900 ring-zinc-400 bg-white/10 hover:bg-white/20'
                      : 'border-zinc-300 bg-white/5 hover:bg-white/15')
                  }
                  aria-pressed={selected}
                  type="button"
                >
                  ${d}
                  <span className="ml-2 text-[10px]">[{i + 1}]</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={clearBets}
              className="w-48 rounded-xl border border-zinc-300 bg-white/5 px-5 py-3 text-sm font-medium shadow-sm
                         transition-colors duration-400 ease-out hover:bg-white/15
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:translate-y-[1px]"
              type="button"
            >
              Clear Bets
            </button>
            <button
              onClick={handleDeal}
              disabled={total === 0 || !withinLimits}
              className={
                'w-48 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 transition-colors duration-400 ease-out ' +
                (total === 0 || !withinLimits
                  ? 'cursor-not-allowed border border-zinc-200 bg-zinc-200 text-zinc-400'
                  : 'border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 active:translate-y-[1px] focus-visible:ring-zinc-400')
              }
              type="button"
            >
              Deal
            </button>
          </div>

          <p className="mt-6 text-center text-xs">
            <kbd>1–{Math.min(9, denoms.length)}</kbd> select chip · <kbd>←/→</kbd> cycle · <kbd>+</kbd>/<kbd>-</kbd> adjust ·{' '}
            <kbd>Enter</kbd> deal · <kbd>Backspace</kbd> clear
          </p>
          <p className="mt-2 text-center text-xs">
            Table limits: ${min}–${max}
          </p>
        </section>
      </div>
    </div>
  );
}
