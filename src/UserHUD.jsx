import { useUser } from './context/UserContext';

export default function UserHUD() {
  const { balance, round, currentBet } = useUser();

  return (
    <div style={hudBarStyle}>
      <div style={pillStyle}>
        <span style={labelStyle}>Bank</span>
        <span style={valueStyle}>${balance}</span>
      </div>
      <div style={pillStyle}>
        <span style={labelStyle}>Bet</span>
        <span style={valueStyle}>${currentBet || 0}</span>
      </div>
      <div style={pillStyle}>
        <span style={labelStyle}>Round</span>
        <span style={valueStyle}>{round}</span>
      </div>
    </div>
  );
}

const hudBarStyle = {
  position: 'fixed',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 12,
  padding: 8,
  background: 'rgba(0,0,0,0.55)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 16,
  color: '#eee',
  zIndex: 1200,
  boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
  backdropFilter: 'blur(4px)',
};

const pillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  minWidth: 92,
  justifyContent: 'space-between',
};

const labelStyle = { fontSize: 12, opacity: 0.85 };

const valueStyle = { fontWeight: 800, fontSize: 14 };
