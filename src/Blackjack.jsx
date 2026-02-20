import { useNavigate } from 'react-router';
import BlackjackTable from './BlackjackTable';
import { buttonClass } from './theme';

export default function Blackjack() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <BlackjackTable />
      <button className={buttonClass} style={{ marginTop: 16 }} onClick={() => navigate('/seat-buy-in')}>
        Reset Bank
      </button>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'var(--tui-fg)',
  padding: 24,
  fontFamily: 'var(--tui-font)',
};
