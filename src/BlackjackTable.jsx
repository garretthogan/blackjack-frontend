import BetModal from './BetModal';
import Hand from './Hand';
import useDealerStore from './stores/dealer';
import usePlayerStore from './stores/player';
import useDeckStore from './stores/deck';
import RoundResultModal from './RoundResultModal';
import useScoreboardStore from './stores/scoreboard';
import { useEffect } from 'react';
import { overlayClass, modalClass, buttonClass } from './theme';

const handAreaStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--tui-gap-lg)',
  minHeight: 160,
  padding: 'var(--tui-pad-3)',
  border: '1px dashed var(--tui-line)',
  marginBottom: 16,
  width: 'min(740px, 95vw)',
  justifyContent: 'center',
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
  gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
  gap: 'var(--tui-gap-lg)',
  marginBottom: 16,
};

const labelStyle = {
  color: 'var(--tui-muted)',
  fontSize: 'var(--tui-font-size-sm)',
  marginBottom: 'var(--tui-gap-sm)',
};

export default function BlackjackTable({}) {
  const { addResult, lastResult, resetScoreboard } = useScoreboardStore();
  const {
    dealerHand,
    dealerValue,
    addDealerCards,
    resetDealerHand,
    isDealerThinking,
    startThinking,
  } = useDealerStore();
  const { deck, resetDeck, drawCard } = useDeckStore();

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

  const loadShoe = () => {
    resetScoreboard();
    resetPlayerHand();
    resetDealerHand();

    resetDeck();
    addPlayerCards([drawCard(), drawCard()]);
    addDealerCards([drawCard(), drawCard()]);
  };

  const dealCards = () => {
    betPlaced();
    loadShoe();
  };

  useEffect(() => {
    if (playerStood && !lastResult) {
      if (playerValue < 21 && dealerValue <= 17) {
        addDealerCards([drawCard()]);
      }
    }
  }, [playerValue, dealerValue, playerStood, lastResult]);

  if (!playerStood && playerValue > 21 && !lastResult) {
    playerStands();
  }

  if (!playerStood && playerValue === 21 && !lastResult) {
    playerStands();
  }

  if (!playerStood && dealerValue === 21 && !lastResult) {
    playerStands();
  }

  return (
    <div>
      <RoundResultModal
        isOpen={playerStood && !isDealerThinking}
        onClose={startPlacingBet}
      />
      {isDealerThinking && (
        <div className={overlayClass}>
          <div className={modalClass}>Evaluating...</div>
        </div>
      )}
      <div style={labelStyle}>Dealer</div>
      <div style={handAreaStyle} aria-label="Dealer hand">
        <Hand cards={dealerHand} isDealer={true} />
      </div>
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={playerHand} />
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
                addPlayerCards([drawCard()]);
                startThinking();
                if (dealerValue < 17 && playerValue < 21) addDealerCards([drawCard()]);
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
                addPlayerCards([drawCard()]);
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
    </div>
  );
}
