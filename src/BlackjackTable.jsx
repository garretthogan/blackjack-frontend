import BetModal from './BetModal';
import Hand from './Hand';
import useDealerStore from './stores/dealer';
import usePlayerStore from './stores/player';
import useDeckStore from './stores/deck';
import RoundResultModal from './RoundResultModal';
import useScoreboardStore from './stores/scoreboard';
import { useEffect, useState } from 'react';
import { overlayClass, modalClass, buttonClass } from './theme';
import { calcTotal } from './helpers';

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
  flexWrap: 'wrap',
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
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 'var(--tui-gap)',
  marginBottom: 16,
  width: '100%',
  maxWidth: 740,
};

const labelStyle = {
  color: 'var(--tui-muted)',
  fontSize: 'var(--tui-font-size-sm)',
  marginBottom: 'var(--tui-gap-sm)',
  width: '100%',
  maxWidth: 740,
  boxSizing: 'border-box',
  paddingInline: 4,
};

const TARGET_DEALER_BLACKJACK_ODDS = 1 / 50;
const TARGET_PLAYER_BLACKJACK_ODDS = 1 / 15;
const TARGET_PLAYER_SPLIT_ODDS = 1 / 10;
const STANDARD_SINGLE_DECK_DEALER_BLACKJACK_ODDS = 128 / 2652;
const STANDARD_SINGLE_DECK_SPLIT_ODDS = 96 / 1326;

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

function isSplitPair(cards) {
  if (!cards || cards.length !== 2) return false;
  return cards[0]?.rank === cards[1]?.rank;
}

function tunePlayerOpeningSplitOdds(initialCards, drawCards) {
  if (isSplitPair(initialCards)) return initialCards;
  if (TARGET_PLAYER_SPLIT_ODDS <= STANDARD_SINGLE_DECK_SPLIT_ODDS) return initialCards;

  const boostChance =
    (TARGET_PLAYER_SPLIT_ODDS - STANDARD_SINGLE_DECK_SPLIT_ODDS) /
    (1 - STANDARD_SINGLE_DECK_SPLIT_ODDS);

  if (Math.random() >= boostChance) return initialCards;

  const maxAttempts = 24;
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = drawCards(2);
    if (candidate.length < 2) return initialCards;
    if (isSplitPair(candidate)) return candidate;
  }

  return initialCards;
}

function evaluateHandOutcome(playerTotal, dealerTotal) {
  if (playerTotal > 21) return { outcome: 'Loss', reason: 'Busted' };
  if (playerTotal <= 21 && dealerTotal > 21)
    return { outcome: 'Win', reason: 'Dealer busted' };
  if (playerTotal === 21) return { outcome: 'Win', reason: 'Blackjack!' };
  if (playerTotal < dealerTotal) return { outcome: 'Loss', reason: 'Dealer wins' };
  if (playerTotal > dealerTotal) return { outcome: 'Win', reason: 'Player wins' };
  return { outcome: 'Push', reason: 'Push' };
}

function purseDeltaForOutcome(outcome, wager) {
  if (outcome === 'Win') return wager * 2;
  if (outcome === 'Loss') return -wager;
  return 0;
}

export default function BlackjackTable({}) {
  const [showShopCardOutline, setShowShopCardOutline] = useState(false);
  const [onlyShopCardsInDeck, setOnlyShopCardsInDeck] = useState(false);
  const [showRoundResultModal, setShowRoundResultModal] = useState(false);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [splitHands, setSplitHands] = useState([]);
  const [activeSplitHandIndex, setActiveSplitHandIndex] = useState(0);
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
    setPlayerHand,
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
    setIsSplitMode(false);
    setSplitHands([]);
    setActiveSplitHandIndex(0);

    resetDeck();
    let playerCards = drawCards(2);
    playerCards = tunePlayerOpeningBlackjackOdds(playerCards, drawCards);
    playerCards = tunePlayerOpeningSplitOdds(playerCards, drawCards);
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
    if (!isSplitMode || !playerStood || isDealerThinking || lastResult) return;
    if (splitHands.length !== 2) return;

    const firstTotal = calcTotal(splitHands[0]);
    const secondTotal = calcTotal(splitHands[1]);
    const firstResult = evaluateHandOutcome(firstTotal, dealerValue);
    const secondResult = evaluateHandOutcome(secondTotal, dealerValue);
    const netPurseDelta =
      purseDeltaForOutcome(firstResult.outcome, playerBet) +
      purseDeltaForOutcome(secondResult.outcome, playerBet);
    const overallOutcome =
      netPurseDelta > 0 ? 'Win' : netPurseDelta < 0 ? 'Loss' : 'Push';
    const reason = `Split: H1 ${firstResult.outcome} (${firstTotal}) | H2 ${secondResult.outcome} (${secondTotal})`;

    addResult(
      overallOutcome,
      reason,
      `${firstTotal} | ${secondTotal}`,
      dealerValue,
      { purseDelta: netPurseDelta }
    );
  }, [
    isSplitMode,
    playerStood,
    isDealerThinking,
    lastResult,
    splitHands,
    dealerValue,
    playerBet,
    addResult,
  ]);

  useEffect(() => {
    if (playerStood || lastResult) return;
    if (playerValue < 21 && dealerValue !== 21) return;

    if (!isSplitMode) {
      playerStands();
      return;
    }

    if (activeSplitHandIndex === 0) {
      setActiveSplitHandIndex(1);
      setPlayerHand(splitHands[1] || []);
      return;
    }

    playerStands();
  }, [
    playerStood,
    playerValue,
    dealerValue,
    lastResult,
    playerStands,
    isSplitMode,
    activeSplitHandIndex,
    splitHands,
    setPlayerHand,
  ]);

  const canSplit =
    !isSplitMode &&
    !playerStood &&
    !!playerBet &&
    playerHand.length === 2 &&
    playerHand[0]?.rank === playerHand[1]?.rank;

  return (
    <div style={tableStyle}>
      <RoundResultModal
        isOpen={showRoundResultModal}
        skipAutoEvaluate={isSplitMode}
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
        {!isSplitMode && (
          <Hand cards={playerHand} showShopCardOutline={isDev && showShopCardOutline} />
        )}
        {isSplitMode && (
          <div style={splitHandsStyle}>
            {splitHands.map((hand, index) => (
              <div
                key={`split-hand-${index}`}
                style={{
                  ...splitHandPanelStyle,
                  borderColor:
                    index === activeSplitHandIndex
                      ? 'var(--tui-pink)'
                      : 'var(--tui-line)',
                }}
              >
                <div style={splitHandLabelStyle}>Hand {index + 1}</div>
                <Hand cards={hand} showShopCardOutline={isDev && showShopCardOutline} />
              </div>
            ))}
          </div>
        )}
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
                if (playerDraw) {
                  const nextCard = resolveHitCardEffect(playerDraw, playerHand);
                  if (!isSplitMode) {
                    addPlayerCards([nextCard]);
                  } else {
                    const updatedHand = [...splitHands[activeSplitHandIndex], nextCard];
                    const updatedSplitHands = splitHands.map((hand, i) =>
                      i === activeSplitHandIndex ? updatedHand : hand
                    );
                    setSplitHands(updatedSplitHands);
                    setPlayerHand(updatedHand);
                  }
                }
                startThinking();
                if (dealerValue < 17 && playerValue < 21) {
                  const dealerDraw = drawOne();
                  if (dealerDraw) addDealerCards([dealerDraw]);
                }
                else console.log('dealer stays');
              }}
              disabled={playerStood || !playerBet}
              style={{ width: '100%' }}
            >
              Hit
            </button>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                if (!isSplitMode) {
                  playerStands();
                  startThinking();
                  return;
                }

                if (activeSplitHandIndex === 0) {
                  setActiveSplitHandIndex(1);
                  setPlayerHand(splitHands[1]);
                  return;
                }

                playerStands();
                startThinking();
              }}
              disabled={playerStood || !playerBet}
              style={{ width: '100%' }}
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
              style={{ width: '100%' }}
            >
              Double
            </button>
            <button
              className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                if (!canSplit) return;
                const [firstCard, secondCard] = playerHand;
                const firstHand = [firstCard];
                const secondHand = [secondCard];

                const firstDraw = drawOne();
                const secondDraw = drawOne();
                if (firstDraw) firstHand.push(firstDraw);
                if (secondDraw) secondHand.push(secondDraw);

                setIsSplitMode(true);
                setSplitHands([firstHand, secondHand]);
                setActiveSplitHandIndex(0);
                setPlayerHand(firstHand);
              }}
              disabled={!canSplit}
              style={{ opacity: canSplit ? 1 : 0.5, width: '100%' }}
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
  boxSizing: 'border-box',
  paddingInline: 4,
};

const splitHandsStyle = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'var(--tui-gap)',
};

const splitHandPanelStyle = {
  border: '2px solid var(--tui-line)',
  padding: 'var(--tui-pad-2)',
};

const splitHandLabelStyle = {
  marginBottom: 'var(--tui-gap-sm)',
  color: 'var(--tui-muted)',
  fontSize: 'var(--tui-font-size-sm)',
};
