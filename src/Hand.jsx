import Card from './Card';
import CardBack from './CardBack';
import useScoreboardStore from './stores/scoreboard';

export default function Hand({ cards, isDealer = false }) {
  const n = cards.length;
  const cardsToShow = isDealer ? cards.slice(0, cards.length - 1) : cards;

  const { lastResult } = useScoreboardStore();

  return (
    <div style={{ display: 'inline-block' }}>
      {cardsToShow.map(card => {
        return (
          <div key={`hand-${card.rank}-${card.suit}`} style={{ display: 'inline-block' }}>
            <Card card={card} />
          </div>
        );
      })}

      {isDealer && !lastResult && (
        <div style={{ display: 'inline-block' }}>
          <CardBack />
        </div>
      )}

      {isDealer && lastResult && (
        <div style={{ display: 'inline-block' }}>
          <Card card={cards[cards.length - 1]} />
        </div>
      )}

      {n === 0 && !isDealer && (
        <div className="grid h-full place-items-center text-emerald-300/70">
          Your hand is empty. Press “Hit (Draw)”.
        </div>
      )}
    </div>
  );
}
