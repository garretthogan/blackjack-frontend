import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';
import usePlayerStore from './stores/player';

export default function BetModal({ open, onConfirmed }) {
  const navigate = useNavigate();
  const { balance, startHand } = useUser();

  const { setPlayerBet, playerBet } = usePlayerStore();

  useEffect(() => {
    if (open) setPlayerBet(0);
  }, [open]);

  if (!open) return null;

  const add = v => setPlayerBet(Math.min(balance, playerBet + v));
  const clear = () => setPlayerBet(0);
  const autoMin = () => add(25);

  const place = () => {
    if (playerBet <= 0) return;
    const ok = startHand(playerBet);
    if (ok && typeof onConfirmed === 'function') onConfirmed();
  };

  const disabled = playerBet <= 0;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h3 style={titleStyle}>Place Your Bet</h3>
        <p style={balanceStyle}>Balance: ${balance}</p>

        <div style={quickRowStyle}>
          {[25, 100, 500].map(v => (
            <button key={v} style={chipBtnStyle} onClick={() => add(v)}>
              ${v}
            </button>
          ))}
          <button style={chipBtnStyle} onClick={autoMin}>
            Auto
          </button>
        </div>

        <div style={currentRowStyle}>
          <span>Current Bet: ${playerBet}</span>
          <button onClick={clear} disabled={playerBet === 0} style={clearBtnStyle}>
            ✕
          </button>
        </div>

        <div style={actionsRowStyle}>
          <button style={secondaryBtnStyle} onClick={() => navigate('/seat-buy-in')}>
            Reset Bank
          </button>
          <button style={primaryBtnStyle(disabled)} onClick={place} disabled={disabled}>
            Place Bet
          </button>
        </div>
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
  background: '#23272f',
  color: '#e5e7eb',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 14,
  padding: 18,
  width: 420,
  maxWidth: '92vw',
  boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
};

const titleStyle = { margin: 0, marginBottom: 6, fontSize: 18, fontWeight: 700 };

const balanceStyle = { margin: 0, marginBottom: 10, fontSize: 12, opacity: 0.9 };

const quickRowStyle = { display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' };

const chipBtnStyle = {
  padding: '8px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  cursor: 'pointer',
};

const currentRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  marginBottom: 12,
  minHeight: 44,
};

const clearBtnStyle = {
  marginLeft: 'auto',
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'transparent',
  color: '#e5e7eb',
  cursor: 'pointer',
  opacity: 0.9,
};

const actionsRowStyle = { display: 'flex', gap: 10, justifyContent: 'center' };

const primaryBtnStyle = disabled => ({
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  background: disabled ? 'rgba(255,255,255,0.10)' : '#111827',
  color: '#e5e7eb',
  cursor: disabled ? 'not-allowed' : 'pointer',
  minWidth: 140,
});

const secondaryBtnStyle = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'transparent',
  color: '#e5e7eb',
  cursor: 'pointer',
  minWidth: 140,
};
