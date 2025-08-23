import { useState } from "react";
import { buildDeck, evaluateBlackjackHand, shuffle, sortDeck } from "./helpers";
import StackedDeck from "./StackedDeck";
import GridDeck from "./GridDeck";
import Hand from "./Hand";
import Controls from "./Controls";

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
    setDeck(() => {
      const initialHand = [deck.pop(), deck.pop()];
      setHand(initialHand);
      const dealerHand = [deck.pop(), deck.pop()];
      setDealerHand(dealerHand);
      setInitialized(true);
      setRemaining(48);

      console.log(evaluateBlackjackHand(initialHand));
      return shuffle(buildDeck());
    });
  }

  return (
    <div >
      <div className="py-2">
          <div className="rounded-md bg-green-900/70 px-6 py-2 text-sm border border-green-950 shadow">
              <div>Dealer</div>
              <Hand cards={dealerHand} />
          </div>


      </div>
      <div className="py-2">
        <div className="rounded-md bg-green-900/70 px-6 py-2 text-sm border border-green-950 shadow" >
          <span>Player</span>
          <Hand cards={hand} />
        </div>
      </div>
      <div>
        <div className="py-2">
          <StackedDeck cards={deck} faceDown={true} />
        </div>
        <Controls drawOne={drawOne} resetDeck={resetDeck} disabled={deck.length === 0} />
      </div>
      <div className="py-4">
        <GridDeck cards={sortDeck(deck.filter(card => {
          return !hand.find(cardInHand => card.id === cardInHand.id) &&
            !dealerHand.find(cardInHand => card.id === cardInHand.id)
        }))} />
      </div>
    </div>
  );
}
