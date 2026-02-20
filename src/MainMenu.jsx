import { useNavigate } from 'react-router';
import { containerClass, buttonClass, modalClass } from './theme';

export default function MainMenu({}) {
  const navigate = useNavigate();

  return (
    <div className={containerClass}>
      <div className={modalClass} style={{ minWidth: 320 }}>
        <header style={{ textAlign: 'center', marginBottom: 'var(--tui-gap-lg)' }}>
          <h1 style={{ margin: 0, fontSize: 32, color: 'var(--tui-fg)' }}>Main Menu</h1>
        </header>

        <nav aria-label="Main menu" style={{ display: 'grid', gap: 'var(--tui-gap-lg)' }}>
          <button className={buttonClass} onClick={() => navigate('/deck-select')}>
            Start Run
          </button>
          <button className={buttonClass} onClick={() => navigate('/run-hub')}>
            Continue
          </button>
        </nav>
      </div>
    </div>
  );
}
