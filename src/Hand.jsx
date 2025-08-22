import React, { useMemo } from "react";
import Card from "./Card";

export default function Hand({ cards }) {
    const n = cards.length;
    const spread = useMemo(() => {
        if (n <= 1) return 0;
        return Math.min(100, 16 * (n - 1));
    }, [n]);

    const radiusPx = useMemo(() => {
        const vh = Math.max(420, typeof window !== "undefined" ? window.innerHeight : 800);
        return Math.round(Math.min(0.40 * vh, 340));
    }, [n]);

    return (
        <div style={{ display: 'inline-block' }} >
            {cards.map((card, i) => {
                const angle = n === 1 ? 0 : -spread / 2 + (spread * i) / Math.max(1, n - 1);
                const z = 100 + i;
                return (
                    <div
                        key={`hand-${card.rank}-${card.suit}`}
                        style={{ display: 'inline-block' }}
                    >
                        <div>
                            <Card card={card} />
                        </div>
                    </div>
                );
            })}

            {n === 0 && (
                <div className="grid h-full place-items-center text-emerald-300/70">Your hand is empty. Press “Hit (Draw)”.</div>
            )}
        </div>
    );
}
