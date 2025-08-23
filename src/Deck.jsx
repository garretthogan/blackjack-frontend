import React, { useMemo, useState } from "react";
import { btnAccent, btnCls, buildDeck, jitter, shuffle, sortDeck, suitName, uniqBy } from "./helpers";
import GridDeck from "./GridDeck";
import StackedDeck from "./StackedDeck";

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
