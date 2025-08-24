import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Seat & Buy-In Screen (React + Tailwind)
 * - Pick a seat, choose a buy-in (presets or custom), then confirm.
 * - Keyboard-accessible and responsive.
 * - Drop-in component; replace alert handlers with your navigation/state.
 */
const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#eee",
    padding: "24px",
    fontFamily: "sans-serif",
};

export default function SeatAndBuyIn() {
    // Table config (could come from props/api)
    const table = {
        id: 't-low-1',
        min: 25,
        max: 2000,
        seats: 5,
        presets: [100, 500, 1000],
    };

    const [amount, setAmount] = useState('');
    const [customMode, setCustomMode] = useState(false);

    const navigate = useNavigate();

    const isAmountValid = useMemo(() => {
        if (amount === '') return false;
        return amount >= table.min && amount <= table.max;
    }, [amount, table.min, table.max]);

    const canConfirm = isAmountValid;

    const handlePreset = v => {
        setAmount(v);
        setCustomMode(false);
    };

    const handleConfirm = () => {
        if (!canConfirm) return;
        navigate('/run-hub');
    };

    return (
        <div style={containerStyle}>
            <div >
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
                        <label htmlFor="amount" className="text-xs font-medium">
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
                                setAmount(e.target.value === '' ? '' : Number(e.target.value))
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
                            Start Run
                        </button>
                    </div>
                </section>
            </div>

        </div>
    );
}
