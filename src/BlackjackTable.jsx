import { useNavigate } from 'react-router';
import BetModal from './BetModal';
import Hand from './Hand';
import useDealerStore from './stores/dealer';
import usePlayerStore from './stores/player';
import useDeckStore from './stores/deck';
import RoundResultModal from './RoundResultModal';
import useScoreboardStore from './stores/scoreboard';
import UserHUD from './UserHUD';

export default function BlackjackTable() {
  const navigate = useNavigate();

  const { addResult, lastResult, resetScoreboard } = useScoreboardStore();
  const {
    dealerHand,
    dealerValue,
    addDealerCards,
    resetDealerHand,
    isDealerThinking,
    startThinking,
  } = useDealerStore();
  const { resetDeck, drawCard } = useDeckStore();

  const {
    addPlayerCards,
    playerHand,
    playerValue,
    placingBets,
    betPlaced,
    playerStood,
    playerBet,
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

  if (playerStood && !lastResult) {
    if (playerValue < 21 && dealerValue <= 17) {
      addDealerCards([drawCard()]);
    } else if (playerValue <= 21 && dealerValue > 21) {
      addResult('Win', 'Dealer busted', playerValue, dealerValue);
    } else if (playerValue === 21) {
      addResult('Win', 'Blackjack!', playerValue, dealerValue);
    } else if (playerValue > 21) {
      addResult('Loss', 'Busted', playerValue, dealerValue);
    } else if (playerValue < 21) {
      if (playerValue < dealerValue) {
        addResult('Loss', 'Dealer wins', playerValue, dealerValue);
      } else if (playerValue > dealerValue) {
        addResult('Win', 'Player wins', playerValue, dealerValue);
      } else if (dealerValue === playerValue) {
        addResult('Push', 'Push', playerValue, dealerValue);
      }
    }
  }

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
      <button style={backButtonStyle} onClick={() => navigate('/run-hub')}>
        Back to Run Hub
      </button>
      <UserHUD />
      <RoundResultModal
        isOpen={playerStood && lastResult && !isDealerThinking}
        onClose={startPlacingBet}
      />
      {isDealerThinking && (
        <div style={overlayStyle}>
          <div style={modalStyle}>Evaluating...</div>
        </div>
      )}
      Dealer
      <div style={handAreaStyle} aria-label="Dealer hand">
        <Hand cards={dealerHand} isDealer={true} />
      </div>
      <div style={handAreaStyle} aria-label="Player hand">
        <Hand cards={playerHand} />
      </div>
      Player
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
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              style={btnStyle}
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
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              style={btnStyle}
              onClick={() => {
                playerStands();
                startThinking();
              }}
              disabled={playerStood || !playerBet}
            >
              Stand
            </button>
            <button
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              style={btnStyle}
              disabled={true}
            >
              Double
            </button>
            <button
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              style={{ ...btnStyle, opacity: 0.5 }}
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

const titleStyle = { margin: '16px 0 8px', fontSize: 28 };

const handAreaStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  minHeight: 160,
  padding: 12,
  border: '1px dashed',
  borderRadius: 12,
  marginBottom: 16,
  width: 'min(740px, 95vw)',
  justifyContent: 'center',
};

const topBarStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
};

const modifierStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  opacity: 0.9,
};

const totalStyle = {
  padding: '8px 12px',
  border: '1px solid ',
  borderRadius: 8,
  fontWeight: 700,
};

const controlsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
  gap: 12,
  marginBottom: 16,
};

const btnStyle = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  fontSize: 16,
  cursor: 'pointer',
};

const backButtonStyle = {
  position: 'fixed',
  top: 16,
  left: 16,
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
  zIndex: 1200,
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#23272f',
  color: '#e5e7eb',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 14,
  padding: 18,
  width: 420,
  maxWidth: '92vw',
  boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
};
