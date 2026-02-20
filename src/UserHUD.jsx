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
  gap: 'var(--tui-gap-lg)',
  padding: 'var(--tui-pad-2)',
  background: 'var(--tui-bg)',
  border: '2px solid var(--tui-line-strong)',
  color: 'var(--tui-fg)',
  zIndex: 1200,
};

const pillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--tui-gap)',
  padding: 'var(--tui-pad-1) var(--tui-pad-2)',
  border: '1px solid var(--tui-line)',
  background: 'transparent',
  minWidth: 92,
  justifyContent: 'space-between',
};

const labelStyle = {
  fontSize: 'var(--tui-font-size-sm)',
  color: 'var(--tui-muted)',
};

const valueStyle = {
  fontWeight: 700,
  fontSize: 'var(--tui-font-size)',
  color: 'var(--tui-cyan)',
};
