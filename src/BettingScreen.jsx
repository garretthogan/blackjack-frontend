import React from 'react';
import { useNavigate } from 'react-router';

/**
 * BettingScreen.jsx — casino/roguelite styling only.
 * Logic, shortcuts, and behavior are unchanged.
 * - Circle click = add selected denom; right-click = remove.
 * - +/- adjusts the selected denom.
 * - Chip buttons: click selects; double-click adds one.
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

export default function BettingScreen({ min = 5, max = 500, denoms = [1, 5, 25, 100, 500], onDeal }) {
  const initial = denoms.includes(25) ? 25 : denoms[0];
  const [selectedDenom, setSelectedDenom] = React.useState(initial);
  const [chipCounts, setChipCounts] = React.useState({}); // {25: 3, 100: 1}

  const total = React.useMemo(() => denoms.reduce((sum, d) => sum + d * (chipCounts[d] || 0), 0), [chipCounts, denoms]);

  const withinLimits = total === 0 || (total >= min && total <= max);

  const rootRef = React.useRef(null);
  React.useEffect(() => {
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
    <div ref={rootRef} tabIndex={-1} onKeyDown={onKeyDown} style={containerStyle}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.15)_inset]">
          <div className="mb-6 text-sm font-medium tracking-tight text-emerald-200">Dealer</div>

          {/* Betting spot */}
          <div className="flex flex-col items-center gap-4 py-8">
            {/* Circle (no absolute children) */}
            <div
              role="button"
              tabIndex={0}
              onKeyDown={onCircleKeyDown}
              onClick={() => addChip(selectedDenom)}
              onContextMenu={e => {
                e.preventDefault();
                removeChip(selectedDenom);
              }}
              className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-emerald-400/50 text-center shadow-[inset_0_0_40px_rgba(16,185,129,0.08)] ring-1 ring-emerald-400/10 transition hover:bg-emerald-800/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              aria-label="Betting spot"
              title="Click: add selected chip • Right-click: remove • Space/Enter: add"
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-emerald-200/90">Current Bet</div>
                <div className={`text-2xl font-extrabold ${withinLimits ? 'text-emerald-100' : 'text-amber-300'}`}>${total}</div>
                {!withinLimits && <div className="mt-1 text-xs text-amber-300/90">Out of limits</div>}
              </div>
            </div>

            {/* +/- controls under circle */}
            <div className="mt-1 flex items-center gap-3 rounded-full border border-emerald-700 bg-emerald-900/40 px-3 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.45)] backdrop-blur">
              <button
                onClick={() => removeChip(selectedDenom)}
                className="h-9 w-9 rounded-full border border-emerald-600 bg-gradient-to-b from-emerald-700 to-emerald-800 text-sm font-bold text-emerald-50 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08),0_8px_14px_rgba(0,0,0,0.45)] hover:brightness-110 active:translate-y-[1px]"
                aria-label="Remove selected chip"
                type="button"
              >
                –
              </button>
              <button
                onClick={() => addChip(selectedDenom)}
                className="h-9 w-9 rounded-full border border-emerald-600 bg-gradient-to-b from-emerald-700 to-emerald-800 text-sm font-bold text-emerald-50 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08),0_8px_14px_rgba(0,0,0,0.45)] hover:brightness-110 active:translate-y-[1px]"
                aria-label="Add selected chip"
                type="button"
              >
                +
              </button>
            </div>

            {/* Breakdown */}
            <div className="mt-2 text-xs text-emerald-200">
              {denoms.map(d => (
                <span key={d} className="mr-3">
                  ${d}: <span className="font-medium text-emerald-100">{chipCounts[d] || 0}</span>
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
                    'min-w-[88px] rounded-full px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 ' +
                    (selected
                      ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-emerald-50 ring-emerald-400 border border-emerald-300/60 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.12),0_12px_20px_rgba(0,0,0,0.45)]'
                      : 'bg-emerald-900/30 text-emerald-100 border border-emerald-700/70 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),0_8px_14px_rgba(0,0,0,0.35)] hover:bg-emerald-800/40 hover:border-emerald-600/70')
                  }
                  aria-pressed={selected}
                  title={`Select $${d} chip (shortcut ${i + 1})`}
                  type="button"
                >
                  ${d}
                  <span className="ml-2 text-[10px] opacity-80">[{i + 1}]</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={clearBets}
              className="w-48 rounded-full border border-emerald-600/70 bg-emerald-900/30 px-5 py-3 text-sm font-medium text-emerald-100 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),0_10px_18px_rgba(0,0,0,0.4)] transition hover:bg-emerald-800/40 hover:border-emerald-500/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              title="Backspace/Delete"
              type="button"
            >
              Clear Bets
            </button>
            <button
              onClick={handleDeal}
              disabled={total === 0 || !withinLimits}
              className={
                'w-48 rounded-full px-5 py-3 text-sm font-bold shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08),0_14px_22px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 ' +
                (total === 0 || !withinLimits
                  ? 'cursor-not-allowed border border-emerald-800 bg-emerald-900/30 text-emerald-300/50'
                  : 'border border-emerald-300/60 bg-gradient-to-b from-emerald-600 to-emerald-700 text-emerald-50 hover:brightness-110 focus-visible:ring-emerald-400/70')
              }
              title="Enter"
              type="button"
            >
              Deal
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-emerald-200">
            <kbd>1–{Math.min(9, denoms.length)}</kbd> select chip · <kbd>←/→</kbd> cycle · <kbd>+</kbd>/<kbd>-</kbd> adjust ·{' '}
            <kbd>Enter</kbd> deal · <kbd>Backspace</kbd> clear
          </p>
          <p className="mt-2 text-center text-xs text-emerald-200">
            Table limits: ${min}–${max}
          </p>
        </section>
      </div>
    </div>
  );
}
