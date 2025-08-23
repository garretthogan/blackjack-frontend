import React, { useMemo, useState } from "react";
import Card from "./Card";
import SuitLegend from "./SuitLegend";
export default function GridDeck({ cards }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const spade = useMemo(() => cards.filter((c) => c.suit === "♠"), [cards]);
    const heart = useMemo(() => cards.filter((c) => c.suit === "♥"), [cards]);
    const diamond = useMemo(() => cards.filter((c) => c.suit === "♦"), [cards]);
    const club = useMemo(() => cards.filter((c) => c.suit === "♣"), [cards]);

    return (
        <div>
            Remaining Cards: {cards.length}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                <SuitLegend title="Spades" cards={spade} color="text-stone-200" />
                <SuitLegend title="Hearts" cards={heart} color="text-red-400" />
                <SuitLegend title="Diamonds" cards={diamond} color="text-red-400" />
                <SuitLegend title="Clubs" cards={club} color="text-stone-200" />
            </div>
            <div>
                <button onClick={() => { setIsExpanded(!isExpanded) }}>{isExpanded ? 'Hide Deck' : 'Show Deck'}</button>
            </div>
            <div style={{ maxHeight: isExpanded ? '512px' : '12px', overflow: isExpanded ? 'scroll' : 'hidden', paddingLeft: 24, paddingTop: '12px', borderBottom: isExpanded ? 'none' : '1px solid #FAECE2' }}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                    {cards.map((card) => (
                        <Card key={`${card.rank}-${card.suit}`} card={card} />
                    ))}
                </div>
            </div>
        </div>
    );
}