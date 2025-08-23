import Card from "./Card";

export default function Hand({ cards }) {
  const n = cards.length;

  return (
    <div style={{ display: 'inline-block' }} >
      {cards.map((card) => {
        return (
          <div key={`hand-${card.rank}-${card.suit}`} style={{ display: 'inline-block' }}>
            <Card card={card} />
          </div>
        );
      })}

      {n === 0 && (
        <div className="grid h-full place-items-center text-emerald-300/70">Your hand is empty. Press “Hit (Draw)”.</div>
      )}
    </div>
  );
}
