import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';
import useScoreboardStore from './stores/scoreboard';

export default function RoundResultModal({ isOpen, onClose }) {
  const { lastResult } = useScoreboardStore();
  const { balance, setStartingBank, bankCap } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const stop = e => e.stopPropagation();
  const isGameOver = balance <= 0;

  const outcomeTitle =
    {
      blackjack: 'Blackjack',
      charlie: 'Five-Card Charlie',
      win: 'Win',
      push: 'Push',
      loss: 'Loss',
    }[lastResult.outcome] || 'Result';

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} onClick={stop}>
        <h2 style={titleStyle}>{outcomeTitle}</h2>
        <p style={messageStyle}>{lastResult.reason}</p>
        <p style={totalsStyle}>
          Player {lastResult.playerScore ?? '—'} vs Dealer {lastResult.dealerScore ?? '—'}
        </p>

        {isGameOver ? (
          <div style={buttonRowStyle}>
            <button
              style={buttonStyle}
              onClick={() => {
                setStartingBank(bankCap || 1000);
                onClose();
              }}
            >
              Restart Round
            </button>
            <button style={buttonStyle} onClick={() => navigate('/')}>
              Main Menu
            </button>
          </div>
        ) : (
          <button style={buttonStyle} onClick={() => onClose()}>
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

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
  background: '#222',
  padding: 24,
  borderRadius: 12,
  color: '#eee',
  textAlign: 'center',
  minWidth: 340,
  border: '1px solid #555',
};

const titleStyle = { marginTop: 0, marginBottom: 4, fontSize: 22 };

const messageStyle = { margin: 0, opacity: 0.95 };

const totalsStyle = { marginTop: 6, marginBottom: 0, fontWeight: 700 };

const deltaStyle = { marginTop: 8, fontWeight: 800, fontSize: 18 };

const buttonRowStyle = {
  marginTop: 14,
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #555',
  background: '#333',
  color: '#eee',
  cursor: 'pointer',
};
