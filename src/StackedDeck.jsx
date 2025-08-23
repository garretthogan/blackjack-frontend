import CardBack from "./CardBack";

export default function StackedDeck({ cards, faceDown }) {
  const count = cards.length;
  const maxVisible = Math.min(count, 52);

  return (
    <div style={{ display: 'inline-block' }} >
      <div>
        <CardBack />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-black/40 blur-2xl" />
      </div>
    </div>
  );
}