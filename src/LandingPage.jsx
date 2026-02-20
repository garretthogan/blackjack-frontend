import { useNavigate } from 'react-router';
import { buttonClass } from './theme';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--tui-line)',
          background: 'var(--tui-bg)',
        }}
      >
        <div
          style={{
            maxWidth: '1152px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--tui-pad-2)',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--tui-fg)', cursor: 'pointer' }}>
            Blackjack
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--tui-gap)' }}>
            <button className={buttonClass} onClick={() => alert('Open settings')}>
              Settings
            </button>
            <button className={buttonClass} onClick={() => alert('Show how to play overlay')}>
              How to Play
            </button>
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: '896px',
          margin: '0 auto',
          padding: '48px 16px',
          textAlign: 'center',
          flex: 1,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 48px)',
            fontWeight: 800,
            color: 'var(--tui-fg)',
            letterSpacing: '-0.02em',
          }}
        >
          ROGUELIKE BLACKJACK
        </h1>
        <p
          style={{
            maxWidth: '560px',
            margin: '12px auto 0',
            color: 'var(--tui-muted)',
          }}
        >
          Jump in with Quick Play or choose a table that fits your stakes.
        </p>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--tui-gap-lg)',
          }}
        >
          <button
            className={buttonClass}
            style={{ borderColor: 'var(--tui-pink)' }}
            onClick={() => navigate('/blackjack')}
          >
            Quick Play
          </button>
          <button className={buttonClass} onClick={() => navigate('/seat-buy-in')}>
            Choose Table
          </button>
          <button className={buttonClass} onClick={() => {}}>
            Sign In
          </button>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--tui-line)' }}>
        <div
          style={{
            maxWidth: '1152px',
            margin: '0 auto',
            padding: '24px 16px',
            fontSize: 'var(--tui-font-size-sm)',
            color: 'var(--tui-muted)',
          }}
        />
      </footer>
    </div>
  );
}
