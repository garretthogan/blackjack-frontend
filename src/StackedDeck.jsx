import React from "react";
import { jitter } from "./helpers";
import CardBack from "./CardBack";

export default function StackedDeck({ cards, faceDown }) {
    const count = cards.length;
    const maxVisible = Math.min(count, 52);

    return (
        <div style={{ display: 'inline-block' }} >
            <div  >
                {/* {cards.slice(0, maxVisible).map((card, idx) => {
                    const z = idx + 1;
                    const jx = jitter(idx, 1.4);
                    const jy = jitter(idx + 99, 1.4);
                    const rot = jitter(idx + 199, 1.2);
                    const lift = Math.min(24, idx * 0.25);
                    const style = {
                        zIndex: z,
                        transform: `translate(-50%, -50%) translate(${jx}px, ${-lift + jy}px) rotate(${rot}deg)`,
                    };
                    return (
                        <div
                            key={`${card.rank}-${card.suit}-${idx}`}
                        // className="absolute left-1/2 top-1/2"
                        // style={style}
                        >
                            {faceDown ? <CardBack /> : <Card card={card} />}
                        </div>
                    );
                })} */}

                <CardBack />

                {/* {onDrawClick && count > 0 && (
                    <button
                        onClick={onDrawClick}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/0 px-6 py-8 text-xs text-white/60 hover:bg-white/5"
                        aria-label="Draw top card"
                        title="Draw top card"
                    >
                        Draw
                    </button>
                )} */}

                <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-black/40 blur-2xl" />
            </div>
        </div>
    );
}