import Card from './Card';
import CardBack from './CardBack';
import useScoreboardStore from './stores/scoreboard';

export default function Hand({ cards, isDealer = false, showShopCardOutline = false }) {
  const n = cards.length;
  const cardsToShow = isDealer ? cards.slice(0, cards.length - 1) : cards;

  const { lastResult } = useScoreboardStore();

  return (
    <div style={handStyle}>
      {cardsToShow.map(card => {
        return (
          <div key={`hand-${card.rank}-${card.suit}`} style={cardSlotStyle}>
            <Card card={card} showShopOutline={showShopCardOutline} />
          </div>
        );
      })}

      {isDealer && !lastResult && (
        <div style={cardSlotStyle}>
          <CardBack />
        </div>
      )}

      {isDealer && lastResult && (
        <div style={cardSlotStyle}>
          <Card card={cards[cards.length - 1]} showShopOutline={showShopCardOutline} />
        </div>
      )}

      {n === 0 && !isDealer && (
        <div
          className="grid h-full place-items-center"
          style={{ color: 'var(--tui-muted)' }}
        >
          Your hand is empty. Press "Hit (Draw)".
        </div>
      )}
    </div>
  );
}

const handStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--tui-gap-sm)',
  justifyContent: 'center',
  maxWidth: '100%',
};

const cardSlotStyle = {
  flex: '0 0 auto',
};
