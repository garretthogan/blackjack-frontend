import React, { useMemo, useState } from "react";
import Card from "./Card";
import SuitLegend from "./SuitLegend";
import { btnCls } from "./helpers";
import ExpandableTray from "./ExpandableTray";
export default function GridDeck({ cards }) {
    const [isDeckTrayOpen, setIsDeckTrayOpen] = useState(false);
    const [isLegendTrayOpen, setIsLegendTrayOpen] = useState(true);

    const spade = useMemo(() => cards.filter((c) => c.suit === "♠"), [cards]);
    const heart = useMemo(() => cards.filter((c) => c.suit === "♥"), [cards]);
    const diamond = useMemo(() => cards.filter((c) => c.suit === "♦"), [cards]);
    const club = useMemo(() => cards.filter((c) => c.suit === "♣"), [cards]);

    return (
        <div className="py-4">
            <div>
                <button className={btnCls} onClick={() => { setIsLegendTrayOpen(!isLegendTrayOpen) }}>Legend</button>
            </div>
            <ExpandableTray isExpanded={isLegendTrayOpen} maxHeightExpanded={'256px'}>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                    <SuitLegend title="Spades" cards={spade} color="text-stone-200" />
                    <SuitLegend title="Hearts" cards={heart} color="text-red-400" />
                    <SuitLegend title="Diamonds" cards={diamond} color="text-red-400" />
                    <SuitLegend title="Clubs" cards={club} color="text-stone-200" />
                </div>
            </ExpandableTray>
            <div className="py-12">
                <button className={btnCls} onClick={() => { setIsDeckTrayOpen(!isDeckTrayOpen) }}>{isDeckTrayOpen ? 'Hide Cards' : 'Show Cards in Deck'}</button>
            </div>
            <ExpandableTray isExpanded={isDeckTrayOpen} maxHeightExpanded={'512px'}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                    {cards.map((card) => (
                        <Card key={`${card.rank}-${card.suit}`} card={card} />
                    ))}
                </div>
            </ExpandableTray>
        </div>
    );
}