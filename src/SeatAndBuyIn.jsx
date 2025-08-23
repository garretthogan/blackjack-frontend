import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Seat & Buy-In Screen (React + Tailwind)
 * - Pick a seat, choose a buy-in (presets or custom), then confirm.
 * - Keyboard-accessible and responsive.
 * - Drop-in component; replace alert handlers with your navigation/state.
 */
export default function SeatAndBuyIn() {
  // Table config (could come from props/api)
  const table = {
    id: 't-low-1',
    min: 25,
    max: 2000,
    seats: 5,
    presets: [100, 500, 1000],
  };

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [amount, setAmount] = useState('');
  const [customMode, setCustomMode] = useState(false);

  const navigate = useNavigate();

  const isAmountValid = useMemo(() => {
    if (amount === '') return false;
    return amount >= table.min && amount <= table.max;
  }, [amount, table.min, table.max]);

  const canConfirm = selectedSeat !== null && isAmountValid;

  const handlePreset = v => {
    setAmount(v);
    setCustomMode(false);
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    // alert(`Seat ${selectedSeat + 1} reserved. Buy-in: $${amount}.`);
    navigate('/bet');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg" aria-hidden />
            <span
              className="font-semibold tracking-tight cursor-pointer"
              onClick={() => {
                navigate('/');
              }}
            >
              Blackjack
            </span>
          </div>
          <div className="text-sm">
            Table {table.id} • Min ${table.min} • Max $
            {table.max}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-2">
        {/* Table / Seats */}
        <section className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="mb-4 text-sm font-medium tracking-tight">
            Dealer
          </div>
          <div className="relative mx-auto mb-6 h-1 w-full rounded" />

          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: table.seats }).map((_, i) => {
              const active = selectedSeat === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedSeat(i)}
                  className={
                    'aspect-square rounded-full border transition focus:outline-none focus-visible:ring-2 ' +
                    (active
                      ? 'border-zinc-900 ring-zinc-400'
                      : 'border-zinc-300 hover:bg-zinc-50')
                  }
                  aria-pressed={active}
                  aria-label={`Seat ${i + 1}`}
                >
                  <span className="sr-only">Seat {i + 1}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-sm">
            {selectedSeat === null
              ? 'Click a seat to sit'
              : `Selected Seat ${selectedSeat + 1}`}
          </p>
        </section>

        {/* Buy-in */}
        <section className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold tracking-tight">
            Buy-in
          </h2>

          <div className="mb-4 flex flex-wrap gap-3">
            {table.presets.map(v => (
              <button
                key={v}
                onClick={() => handlePreset(v)}
                className={
                  'rounded-xl border px-4 py-2 text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
                  (amount === v
                    ? 'border-zinc-900 ring-zinc-400'
                    : 'border-zinc-300')
                }
                aria-pressed={amount === v}
              >
                ${v}
              </button>
            ))}
            <button
              onClick={() => setCustomMode(true)}
              className={
                'rounded-xl border px-4 py-2 text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
                (customMode
                  ? 'border-zinc-900 ring-zinc-400'
                  : 'border-zinc-300')
              }
              aria-pressed={customMode}
            >
              Custom
            </button>
          </div>

          {/* Custom input */}
          <div className="grid gap-2 sm:max-w-xs">
            <label
              htmlFor="amount"
              className="text-xs font-medium"
            >
              Amount (Min ${table.min}, Max ${table.max})
            </label>
            <input
              id="amount"
              type="number"
              min={table.min}
              max={table.max}
              step={25}
              value={amount}
              onChange={e =>
                setAmount(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-400 focus-visible:ring-2"
              placeholder={`${table.min}`}
            />
            <p className="h-5 text-xs">
              {amount === ''
                ? 'Choose a preset or enter a custom amount.'
                : isAmountValid
                  ? 'Looks good.'
                  : 'Out of limits — adjust amount.'}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={
                'w-full rounded-2xl px-5 py-3 text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 ' +
                (canConfirm
                  ? 'text-white focus-visible:ring-zinc-400 border border-zinc-200'
                  : 'cursor-not-allowed border border-zinc-200')
              }
            >
              Confirm Buy-in & Join Table
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs">
          Tip: Use presets for speed; custom accepts multiples of
          25.
        </div>
      </footer>
    </div>
  );
}
