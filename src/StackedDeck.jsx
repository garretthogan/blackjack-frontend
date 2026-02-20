import CardBack from './CardBack';

export default function StackedDeck({ cards, faceDown }) {
  const count = cards.length;
  const maxVisible = Math.min(count, 52);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <CardBack />
    </div>
  );
}
