import { useNavigate } from 'react-router';
import useScoreboardStore from './stores/scoreboard';
import { containerClass, modalClass, buttonClass } from './theme';

export default function RunHub() {
  const navigate = useNavigate();
  const { purse, handsPlayed, handsWon, handsLost } = useScoreboardStore();

  return (
    <div className={containerClass}>
      <div className={modalClass} style={{ minWidth: 'min(560px, 92vw)' }}>
        <h1 style={{ margin: 0, marginBottom: 'var(--tui-gap)', fontSize: 28, color: 'var(--tui-fg)' }}>
          Run Hub
        </h1>
        <p style={{ margin: 0, marginBottom: 'var(--tui-gap)', color: 'var(--tui-muted)' }}>
          Bank: <span style={{ color: 'var(--tui-cyan)' }}>${purse}</span>
        </p>
        <p style={{ margin: 0, marginBottom: 'var(--tui-gap-lg)', color: 'var(--tui-muted)' }}>
          Hands: <span style={{ color: 'var(--tui-fg)' }}>{handsPlayed}</span> | W:{' '}
          <span style={{ color: 'var(--tui-ok)' }}>{handsWon}</span> / L:{' '}
          <span style={{ color: 'var(--tui-danger)' }}>{handsLost}</span>
        </p>

        <div style={{ display: 'grid', gap: 'var(--tui-gap-lg)', marginBottom: 'var(--tui-gap-lg)' }}>
          <button className={buttonClass} onClick={() => navigate('/blackjack')}>
            Play Hand
          </button>
          <button className={buttonClass} onClick={() => navigate('/shop')}>
            Shop
          </button>
          <button className={buttonClass} onClick={() => navigate('/deck-viewer')}>
            View Deck
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tui-gap-lg)' }}>
          <button className={buttonClass} onClick={() => navigate('/')}>
            Back to Menu
          </button>
          <button className={buttonClass} onClick={() => navigate('/seat-buy-in')}>
            Change Starting Bank
          </button>
        </div>
      </div>
    </div>
  );
}
