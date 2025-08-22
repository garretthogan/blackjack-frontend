import React, { useMemo, useState } from "react";
import { btnAccent, btnCls, buildDeck, jitter, shuffle, sortDeck, suitName, uniqBy } from "./helpers";

/**
 * DeckOfCards — displays a full 52-card deck.
 * Supports grid view or stacked face-down draw pile, with a visible drawn/reveal area.
 */
export default function DeckOfCards({
    defaultShuffled = false,
    showControls = true,
    layout = 'grid',
    faceDown: faceDownProp,
    enableDraw: enableDrawProp,
    onDraw,
}) {
    const initialDeck = defaultShuffled ? shuffle(buildDeck()) : sortDeck(buildDeck());
    const [cards, setCards] = useState(initialDeck);
    const [drawn, setDrawn] = useState([]);
    const [drawCount, setDrawCount] = useState(0);

    const faceDown = faceDownProp ?? (layout === 'stack');
    const enableDraw = enableDrawProp ?? (layout === 'stack');

    function doShuffle() {
        setCards((c) => shuffle(c));
    }
    function sortBySuitThenRank() {
        setCards(() => sortDeck(buildDeck()));
        setDrawn([]);
        setDrawCount(0);
    }
    function resetFullDeck() {
        const full = defaultShuffled ? shuffle(buildDeck()) : sortDeck(buildDeck());
        setCards(full);
        setDrawn([]);
        setDrawCount(0);
    }

    function drawOne() {
        if (!enableDraw || cards.length === 0) return;
        // Guard against double-append of the same physical card (e.g., accidental double invocation)
        setCards((prev) => {
            if (prev.length === 0) return prev;
            const next = prev.slice();
            const card = next.pop();
            if (!card) return prev;
            setDrawn((d) => {
                const last = d[d.length - 1];
                if (last && last.rank === card.rank && last.suit === card.suit) {
                    // same physical card already pushed; ignore duplicate
                    return d;
                }
                return [
                    ...d,
                    { ...card, uid: `${card.rank}-${card.suit}-${d.length + 1}` },
                ];
            });
            onDraw?.(card);
            return next;
        });
    }

    const spade = useMemo(() => cards.filter((c) => c.suit === "♠"), [cards]);
    const heart = useMemo(() => cards.filter((c) => c.suit === "♥"), [cards]);
    const diamond = useMemo(() => cards.filter((c) => c.suit === "♦"), [cards]);
    const club = useMemo(() => cards.filter((c) => c.suit === "♣"), [cards]);

    return (
        <div className="w-full rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black p-4 text-stone-100">
            {showControls && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <button onClick={doShuffle} className={btnCls}>Shuffle</button>
                    <button onClick={sortBySuitThenRank} className={btnCls}>Sort</button>
                    <button onClick={resetFullDeck} className={btnCls}>Reset</button>
                    {layout === 'stack' && enableDraw && (
                        <button onClick={drawOne} className={btnAccent}>Draw</button>
                    )}
                    <span className="ml-auto text-sm text-stone-300/80">
                        {layout === 'stack' ? (
                            <>Pile: {cards.length} • Drawn: {drawn.length}</>
                        ) : (
                            <>{cards.length} cards</>
                        )}
                    </span>
                </div>
            )}

            {layout === 'grid' ? (
                <GridDeck cards={cards} />
            ) : (
                <StackedDeck cards={cards} faceDown={faceDown} onDrawClick={enableDraw ? drawOne : undefined} />
            )}

            {layout === 'stack' && (
                <RevealArea drawn={drawn} />
            )}

            {showControls && layout === 'grid' && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                    <SuitLegend title="Spades" cards={spade} color="text-stone-200" />
                    <SuitLegend title="Hearts" cards={heart} color="text-red-400" />
                    <SuitLegend title="Diamonds" cards={diamond} color="text-red-400" />
                    <SuitLegend title="Clubs" cards={club} color="text-stone-200" />
                </div>
            )}
        </div>
    );
}

function GridDeck({ cards }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
            {cards.map((card) => (
                <Card key={`${card.rank}-${card.suit}`} card={card} />
            ))}
        </div>
    );
}

function StackedDeck({ cards, faceDown, onDrawClick }) {
    const count = cards.length;
    const maxVisible = Math.min(count, 52);

    return (
        <div className="relative mx-auto grid h-[54vh] max-h-[520px] min-h-[280px] place-items-center">
            <div className="relative h-[70%] w-[min(80vw,420px)]">
                {cards.slice(0, maxVisible).map((card, idx) => {
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
                            className="absolute left-1/2 top-1/2"
                            style={style}
                        >
                            {faceDown ? <CardBack /> : <Card card={card} />}
                        </div>
                    );
                })}

                {onDrawClick && count > 0 && (
                    <button
                        onClick={onDrawClick}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/0 px-6 py-8 text-xs text-white/60 hover:bg-white/5"
                        aria-label="Draw top card"
                        title="Draw top card"
                    >
                        Draw
                    </button>
                )}

                <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-black/40 blur-2xl" />
            </div>
        </div>
    );
}

function RevealArea({ drawn }) {
    const top = drawn[drawn.length - 1];
    const prevRaw = drawn.slice(-6, -1);
    // De-duplicate by physical card identity (rank+suit) to avoid duplicate entries in StrictMode or rapid clicks
    const prev = uniqBy(prevRaw, (c) => `${c.rank}-${c.suit}`);

    return (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-800/60 p-4">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-stone-200">Top of Drawn Pile</h3>
                <div className="flex items-center justify-center">
                    {top ? <Card key={`${top.uid}_top`} card={top} /> : <span className="text-stone-400">(none yet)</span>}
                </div>
            </div>
            <div className="rounded-2xl border border-stone-800/60 p-4 md:col-span-2">
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-stone-200">Previously Drawn</h3>
                <div className="relative h-40">
                    {prev.map((c, i) => {
                        const angle = -8 + (16 * i) / Math.max(1, prev.length - 1);
                        const z = 10 + i;
                        return (
                            <div key={`${c.uid}_prev`} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)`, zIndex: z }}>
                                <div style={{ transform: `rotate(${-angle}deg)` }}>
                                    <Card card={c} />
                                </div>
                            </div>
                        );
                    })}
                    {prev.length === 0 && (
                        <div className="grid h-full place-items-center text-stone-500">Draw a few to see history</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SuitLegend({ title, cards, color }) {
    return (
        <div className="rounded-2xl border border-stone-800/60 p-3">
            <div className="mb-2 flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${color.replace('text', 'bg')}`} />
                <h3 className="text-sm font-semibold tracking-wide text-stone-200">{title}</h3>
                <span className="ml-auto text-xs text-stone-400 tabular-nums">{cards.length}</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {cards.map((c) => (
                    <span key={`${c.rank}-${c.suit}`} className="rounded-md bg-stone-900/60 px-1.5 py-0.5 text-xs text-stone-300 ring-1 ring-stone-700/60">
                        {c.rank}{c.suit}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Card({ card }) {
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
        <div
            className="group relative aspect-[5/7] select-none rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
            style={{ width: "clamp(96px, 12vw, 128px)" }}
            role="img"
            aria-label={`${card.rank} of ${suitName(card.suit)}`}
        >
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_10%,_rgba(255,255,255,0.95),_rgba(235,235,235,0.9))]" />
            <div className="absolute left-2 top-2 text-[min(20px,4.2vw)] leading-none">
                <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
                <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
            </div>
            <div className="absolute bottom-2 right-2 rotate-180 text-[min(20px,4.2vw)] leading-none">
                <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
                <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
            </div>
            <div className="absolute inset-0 grid place-items-center">
                <span className={`${isRed ? 'text-red-500' : 'text-stone-700'} opacity-80`} style={{ fontSize: 'min(64px, 12vw)' }}>
                    {card.suit}
                </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent" />
        </div>
    );
}

function CardBack() {
    return (
        <div
            className="relative aspect-[5/7] select-none rounded-2xl ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
            style={{ width: "clamp(96px, 12vw, 128px)" }}
            aria-label="Card back"
            role="img"
        >
            <div className="absolute inset-0 rounded-2xl bg-white" />
            <div className="absolute inset-1 rounded-xl bg-emerald-900" />
            <div className="absolute inset-2 overflow-hidden rounded-lg">
                <div className="absolute inset-0 opacity-90"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)",
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,_rgba(255,255,255,0.08),_transparent)]" />
            </div>
            <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm tracking-wider text-white/90">
                    ★★
                </div>
            </div>
        </div>
    );
}
