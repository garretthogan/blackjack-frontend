import React from 'react';
import { useNavigate } from 'react-router';

/**
 * BettingScreen.jsx (React + Tailwind, JS only)
 * FIX: Avoid nested <button> elements to prevent hydration errors.
 * - The betting "circle" is now a <div role="button">, so the +/- controls
 *   can remain real <button>s inside without violating HTML rules.
 */
export default function BettingScreen({
  min = 5,
  max = 500,
  denoms = [1, 5, 25, 100, 500],
  onDeal,
}) {
  const initial = denoms.includes(25) ? 25 : denoms[0];
  const [selectedDenom, setSelectedDenom] = React.useState(initial);
  const [chipCounts, setChipCounts] = React.useState({}); // {25: 3, 100: 1}

  const total = React.useMemo(
    () => denoms.reduce((sum, d) => sum + d * (chipCounts[d] || 0), 0),
    [chipCounts, denoms]
  );

  const withinLimits = total === 0 || (total >= min && total <= max);

  const rootRef = React.useRef(null);
  React.useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const addChip = (d, n = 1) =>
    setChipCounts(prev => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) + n) }));
  const removeChip = (d, n = 1) =>
    setChipCounts(prev => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) - n) }));
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

  // Key handler for the betting circle (activate with Space/Enter)
  const onCircleKeyDown = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addChip(selectedDenom);
    }
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="min-h-screen outline-none"
    >
      {/* Header */}
      <header className="border-b border-zinc-200 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg" aria-hidden />
            <span className="font-semibold tracking-tight">Blackjack</span>
          </div>
          <div className="text-sm">
            Table Limits: ${min}–${max}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="mb-6 text-sm font-medium tracking-tight">Dealer</div>

          {/* Betting spot */}
          <div className="flex flex-col items-center gap-4 py-8">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={onCircleKeyDown}
              onClick={() => addChip(selectedDenom)}
              onContextMenu={e => {
                e.preventDefault();
                removeChip(selectedDenom);
              }}
              className="relative h-40 w-40 rounded-full border border-dashed border-zinc-300 ring-1 ring-transparent transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              aria-label="Betting spot"
              title="Click: add selected chip • Right-click: remove • Space/Enter: add"
            >
              {/* Bet total in center */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wide">
                    Current Bet
                  </div>
                  <div
                    className={`text-2xl font-bold ${withinLimits ? 'text-zinc-900' : 'text-red-600'}`}
                  >
                    ${total}
                  </div>
                  {!withinLimits && (
                    <div className="mt-1 text-xs text-red-600">
                      Out of limits
                    </div>
                  )}
                </div>
              </div>

              {/* Quick +/- controls */}
              <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeChip(selectedDenom);
                  }}
                  className="h-8 w-8 rounded-full border border-zinc-300 text-sm font-semibold shadow-sm hover:bg-zinc-50"
                  aria-label="Remove selected chip"
                  type="button"
                >
                  –
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    addChip(selectedDenom);
                  }}
                  className="h-8 w-8 rounded-full border border-zinc-300 text-sm font-semibold shadow-sm hover:bg-zinc-50"
                  aria-label="Add selected chip"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="text-xs">
              {denoms.map(d => (
                <span key={d} className="mr-3">
                  ${d}:{' '}
                  <span className="font-medium">{chipCounts[d] || 0}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Chip tray */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {denoms.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelectedDenom(d)}
                onDoubleClick={() => addChip(d)}
                className={
                  'min-w-[72px] rounded-xl border px-4 py-2 text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
                  (selectedDenom === d
                    ? 'border-zinc-900 ring-zinc-400'
                    : 'border-zinc-300')
                }
                aria-pressed={selectedDenom === d}
                title={`Select $${d} chip (shortcut ${i + 1})`}
                type="button"
              >
                ${d}
                <span className="ml-2 text-[10px]">[{i + 1}]</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={clearBets}
              className="w-48 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              title="Backspace/Delete"
              type="button"
            >
              Clear Bets
            </button>
            <button
              onClick={handleDeal}
              disabled={total === 0 || !withinLimits}
              className={
                'w-48 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 ' +
                (total === 0 || !withinLimits
                  ? 'cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400'
                  : 'bg-zinc-900 text-white hover:opacity-95 focus-visible:ring-zinc-400')
              }
              title="Enter"
              type="button"
            >
              Deal
            </button>
          </div>

          <p className="mt-6 text-center text-xs">
            <kbd>1–{Math.min(9, denoms.length)}</kbd> select chip ·{' '}
            <kbd>←/→</kbd> cycle · <kbd>+</kbd>/<kbd>-</kbd> adjust ·{' '}
            <kbd>Enter</kbd> deal · <kbd>Backspace</kbd> clear
          </p>
          <p className="mt-2 text-center text-xs">
            Table limits: ${min}–${max}
          </p>
        </section>
      </main>
    </div>
  );
}
