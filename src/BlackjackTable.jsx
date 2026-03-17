import BetModal from './BetModal';
import Hand from './Hand';
import useDealerStore from './stores/dealer';
import usePlayerStore from './stores/player';
import useDeckStore from './stores/deck';
import RoundResultModal from './RoundResultModal';
import useScoreboardStore from './stores/scoreboard';
import { useEffect, useState } from 'react';
import { overlayClass, modalClass, buttonClass } from './theme';

const handAreaStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--tui-gap-lg)',
  minHeight: 160,
  padding: 'var(--tui-pad-3)',
  border: '1px dashed var(--tui-line)',
  marginBottom: 16,
  width: '100%',
  maxWidth: 740,
  justifyContent: 'center',
  boxSizing: 'border-box',
};

const topBarStyle = {
  display: 'flex',
  gap: 'var(--tui-gap-lg)',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
};

const modifierStyle = {
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  color: 'var(--tui-muted)',
};

const totalStyle = {
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '2px solid var(--tui-line-strong)',
  fontWeight: 700,
  color: 'var(--tui-cyan)',
};

const controlsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: 'var(--tui-gap-lg)',
  marginBottom: 16,
  width: 'min(740px, 95vw)',
};

const labelStyle = {
  color: 'var(--tui-muted)',
  fontSize: 'var(--tui-font-size-sm)',
  marginBottom: 'var(--tui-gap-sm)',
};

const TARGET_DEALER_BLACKJACK_ODDS = 1 / 50;
const TARGET_PLAYER_BLACKJACK_ODDS = 1 / 15;
const STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS = 128 / 2652;

function resolveHitCardEffect(card, playerHand) {
  if (!card || card.effectId !== 'copy_adjacent_on_hit') return card;
  if (playerHand.length === 0) return card;

  const adjacentCard = playerHand[playerHand.length - 1];
  if (!adjacentCard) return card;

  return {
    ...card,
    rank: adjacentCard.rank,
    suit: adjacentCard.suit,
  };
}

function isNaturalBlackjack(cards) {
  if (!cards || cards.length !== 2) return false;
  const [a, b] = cards;
  if (!a || !b) return false;
  const isAce = c => c.rank === 'A';
  const isTenValue = c => ['10', 'J', 'Q', 'K'].includes(c.rank);
  return (isAce(a) && isTenValue(b)) || (isAce(b) && isTenValue(a));
}

function tuneDealerOpeningBlackjackOdds(initialCards, drawOne) {
  if (!isNaturalBlackjack(initialCards)) return initialCards;

  const keepChance = Math.min(
    1,
    TARGET_DEALER_BLACKJACK_ODDS / STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS
  );
  if (Math.random() < keepChance) return initialCards;

  const [firstCard] = initialCards;
  let replacement = drawOne();
  while (replacement && isNaturalBlackjack([firstCard, replacement])) {
    replacement = drawOne();
  }

  if (!replacement) return initialCards;
  return [firstCard, replacement];
}

function tunePlayerOpeningBlackjackOdds(initialCards, drawCards) {
  if (isNaturalBlackjack(initialCards)) return initialCards;

  if (TARGET_PLAYER_BLACKJACK_ODDS <= STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS) {
    return initialCards;
  }

  const boostChance =
    (TARGET_PLAYER_BLACKJACK_ODDS - STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS) /
    (1 - STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS);

  if (Math.random() >= boostChance) return initialCards;

  const maxAttempts = 20;
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = drawCards(2);
    if (candidate.length < 2) return initialCards;
    if (isNaturalBlackjack(candidate)) return candidate;
  }

  return initialCards;
}

export default function BlackjackTable({}) {
  const [showShopCardOutline, setShowShopCardOutline] = useState(false);
  const [onlyShopCardsInDeck, setOnlyShopCardsInDeck] = useState(false);
  const [showRoundResultModal, setShowRoundResultModal] = useState(false);
  const isDev = import.meta.env.DEV;
  const { addResult, lastResult, resetScoreboard } = useScoreboardStore();
  const {
    dealerHand,
    dealerValue,
    addDealerCards,
    resetDealerHand,
    isDealerThinking,
    startThinking,
  } = useDealerStore();
  const { deck, resetDeck, drawCard, setDevOnlyShopCards } = useDeckStore();

  const {
    addPlayerCards,
    playerHand,
    playerValue,
    placingBets,
    betPlaced,
    playerStood,
    playerBet,
    setPlayerBet,
    playerStands,
    startPlacingBet,
    resetPlayerHand,
  } = usePlayerStore();

  useEffect(() => {
    setDevOnlyShopCards(isDev && onlyShopCardsInDeck);
  }, [isDev, onlyShopCardsInDeck, setDevOnlyShopCards]);

  const drawCards = count => {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const card = drawCard();
      if (card) drawn.push(card);
    }
    return drawn;
  };

  const drawOne = () => drawCards(1)[0] || null;

  const loadShoe = () => {
    resetScoreboard();
    resetPlayerHand();
    resetDealerHand();
    setShowRoundResultModal(false);

    resetDeck();
    const playerCards = tunePlayerOpeningBlackjackOdds(drawCards(2), drawCards);
    const dealerCards = tuneDealerOpeningBlackjackOdds(drawCards(2), drawOne);
    if (playerCards.length) addPlayerCards(playerCards);
    if (dealerCards.length) addDealerCards(dealerCards);
  };

  const dealCards = () => {
    betPlaced();
    loadShoe();
  };

  useEffect(() => {
    if (playerStood && !lastResult) {
      if (playerValue < 21 && dealerValue <= 17) {
        const dealerDraw = drawOne();
        if (dealerDraw) addDealerCards([dealerDraw]);
      }
    }
  }, [playerValue, dealerValue, playerStood, lastResult]);

  useEffect(() => {
    if (playerStood && !isDealerThinking) {
      setShowRoundResultModal(true);
    }
  }, [playerStood, isDealerThinking]);

  useEffect(() => {
    if (playerStood || lastResult) return;
    if (playerValue >= 21 || dealerValue === 21) {
      playerStands();
    }
  }, [playerStood, playerValue, dealerValue, lastResult, playerStands]);

  return (
    <div style={tableStyle}>
      <RoundResultModal
        isOpen={showRoundResultModal}
        onClose={() => {
          setShowRoundResultModal(false);
          startPlacingBet();
        }}
      />
      {isDealerThinking && (
        <div className={overlayClass}>
          <div className={modalClass}>Evaluating...</div>
        </div>
      )}
      <div style={labelStyle}>Dealer</div>
      <div style={handAreaStyle} aria-label="Dealer hand">
        <Hand
          cards={dealerHand}
          isDealer={true}
          showShopCardOutline={isDev && showShopCardOutline}
        />
      </div>
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={playerHand} showShopCardOutline={isDev && showShopCardOutline} />
      </div>
      <div style={labelStyle}>Player</div>
      {!isDealerThinking && (
        <div>
          <BetModal open={placingBets} onConfirmed={dealCards} />

          <div>
            <div style={topBarStyle}>
              <div style={modifierStyle}>Modifier: —</div>
              <div style={totalStyle}>Total: {playerValue}</div>
            </div>
          </div>
          <div style={controlsStyle}>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                const playerDraw = drawOne();
                if (playerDraw) addPlayerCards([resolveHitCardEffect(playerDraw, playerHand)]);
                startThinking();
                if (dealerValue < 17 && playerValue < 21) {
                  const dealerDraw = drawOne();
                  if (dealerDraw) addDealerCards([dealerDraw]);
                }
                else console.log('dealer stays');
              }}
              disabled={playerStood || !playerBet}
            >
              Hit
            </button>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                playerStands();
                startThinking();
              }}
              disabled={playerStood || !playerBet}
            >
              Stand
            </button>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={!playerHand.length === 2}
              onClick={() => {
                setPlayerBet(playerBet * 2);
                const playerDraw = drawOne();
                if (playerDraw) addPlayerCards([playerDraw]);
                playerStands();
                startThinking();
              }}
            >
              Double
            </button>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ opacity: 0.5 }}
              disabled={true}
            >
              Split
            </button>
          </div>
        </div>
      )}
      {isDev && (
        <div style={devToggleContainerStyle}>
          <label style={devToggleStyle}>
            <input
              type="checkbox"
              checked={showShopCardOutline}
              onChange={e => setShowShopCardOutline(e.target.checked)}
            />
            <span>Highlight shop cards on table</span>
          </label>
          <label style={devToggleStyle}>
            <input
              type="checkbox"
              checked={onlyShopCardsInDeck}
              onChange={e => setOnlyShopCardsInDeck(e.target.checked)}
            />
            <span>Only draw purchased cards</span>
          </label>
        </div>
      )}
    </div>
  );
}

const devToggleContainerStyle = {
  position: 'fixed',
  left: '50%',
  bottom: 16,
  transform: 'translateX(-50%)',
  zIndex: 60,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--tui-gap-sm)',
};

const devToggleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--tui-gap-sm)',
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  background: 'var(--tui-bg)',
  color: 'var(--tui-fg)',
};

const tableStyle = {
  width: '100%',
  maxWidth: 760,
};
