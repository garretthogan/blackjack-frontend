import React from "react";
import Card from "./Card";
export default function GridDeck({ cards }) {

    return (
        <div>
            Remaining Cards: {cards.length}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
                {cards.map((card) => (
                    <Card key={`${card.rank}-${card.suit}`} card={card} />
                ))}
            </div>
        </div>
    );
}