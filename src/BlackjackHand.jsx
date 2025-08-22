import React, { useEffect, useMemo, useState } from "react";
import { btnAccent, btnCls, buildDeck, evaluateBlackjackHand, shuffle, suitName } from "./helpers";
import StackedDeck from "./StackedDeck";

export default function BlackjackHand() {
    const [deck, setDeck] = useState(() => shuffle(buildDeck()));
    const [hand, setHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [initialized, setInitialized] = useState(false);

    if (!initialized) {
        autoInitialDeal();
        setInitialized(true);
    }

    function autoInitialDeal() {
        setDeck((prev) => {
            const next = prev.slice();
            const drawn = next.splice(-2, 2);
            const dealerHand = next.splice(-2, 2);
            setHand(drawn);
            setDealerHand(dealerHand);
            console.log(evaluateBlackjackHand(drawn));
            return next;
        });
    }

    function drawOne() {
        const nextCard = deck.pop();
        const nextDeck = deck.slice();
        const nextHand = [...hand, nextCard];
        setHand(nextHand);
        setDeck(nextDeck);

        console.log(evaluateBlackjackHand(nextHand));
    }

    function resetDeck() {
        setDeck(shuffle(buildDeck()));
        const initialHand = [deck.pop(), deck.pop()];
        setHand(initialHand);
        const dealerHand = [deck.pop(), deck.pop()];
        setDealerHand(dealerHand);
        setInitialized(true);

        console.log(evaluateBlackjackHand(initialHand));
    }

    return (
        <div >
            <h2>Dealer Hand</h2>
            <HandFan cards={dealerHand} />
            <h2 >Your Hand</h2>
            <div >
                <span >Deck: {deck.length}</span>&nbsp;
                <span >Hand: {hand.length}</span>
            </div>
            <StackedDeck cards={deck} faceDown={true} />
            <HandFan cards={hand} />
            <div>
                <button onClick={drawOne} className={btnAccent} disabled={deck.length === 0}>Hit (Draw)</button>
                <button onClick={resetDeck} className={btnCls}>Reset Deck</button>
            </div>
        </div>
    );
}

// ========= Hand (fanned) =========
function HandFan({ cards }) {
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
                    // className="absolute bottom-1 left-1/2 origin-bottom"
                    // style={{ transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radiusPx}px)`, zIndex: z }}
                    >
                        <div>
                            <CardFace card={card} />
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

// ========= Card visuals =========
function CardFace({ card }) {
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
        <div
            className="relative aspect-[5/7] select-none rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
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
