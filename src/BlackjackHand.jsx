import React, { useEffect, useMemo, useState } from "react";
import { btnAccent, btnCls, buildDeck, evaluateBlackjackHand, shuffle, sortDeck, suitName } from "./helpers";
import StackedDeck from "./StackedDeck";
import GridDeck from "./GridDeck";
import Hand from "./Hand";

export default function BlackjackHand() {
    const [deck, setDeck] = useState(() => shuffle(buildDeck()));
    const [hand, setHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [remaining, setRemaining] = useState(52);

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
            setRemaining(48);
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
        setRemaining(remaining - 1);

        console.log(evaluateBlackjackHand(nextHand));
    }

    function resetDeck() {
        setDeck(shuffle(buildDeck()));
        const initialHand = [deck.pop(), deck.pop()];
        setHand(initialHand);
        const dealerHand = [deck.pop(), deck.pop()];
        setDealerHand(dealerHand);
        setInitialized(true);
        setRemaining(48);

        console.log(evaluateBlackjackHand(initialHand));
    }

    return (
        <div >
            <div>
                <button onClick={drawOne} className={btnAccent} disabled={deck.length === 0}>Hit (Draw)</button>
                <button onClick={resetDeck} className={btnCls}>Reset Deck</button>
            </div>
            <h2>Dealer's Hand</h2>
            <Hand cards={dealerHand} />
            <div >
                <span >Your Hand: {hand.length}</span>
            </div>
            <Hand cards={hand} />
            <StackedDeck cards={deck} faceDown={true} />
            <div>
                <GridDeck cards={sortDeck(deck.filter(card => {
                    return !hand.find(cardInHand => card.id === cardInHand.id) &&
                        !dealerHand.find(cardInHand => card.id === cardInHand.id)
                }))} />
            </div>
        </div>
    );
}
