import { useNavigate } from 'react-router';

/**
 * Usage:
 * <MainMenuRouter
 *   title="Blackjack Roguelike"
 *   items={[
 *     { id: "start", label: "Start Run", to: "/deck-select" },
 *     { id: "daily", label: "Daily Challenge", to: "/daily" },
 *     { id: "collection", label: "Collection", to: "/collection" },
 *     { id: "settings", label: "Settings", to: "/settings" },
 *     { id: "quit", label: "Quit", to: "/quit" }, // or attach a custom onClick
 *   ]}
 * />
 *
 */
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#eee',
  padding: '24px',
  fontFamily: 'sans-serif',
};
export default function MainMenu({}) {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div className="rounded-2xl border border-zinc-200 p-6">
        <header style={headerStyle}>
          <h1 style={titleStyle}>Main Menu</h1>
        </header>

        <nav aria-label="Main menu">
          <MenuButton label={'Start Run'} onActivate={() => navigate('/deck-select')} />
          <MenuButton label={'Continue'} onActivate={() => navigate('/run-hub')} />
        </nav>
      </div>
    </div>
  );
}

function MenuButton({ label, onActivate, refFn }) {
  return (
    <div className="p-4">
      <button
        ref={refFn}
        type="button"
        onClick={onActivate}
        style={buttonStyle}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <span style={buttonLabelStyle}>{label}</span>
      </button>
    </div>
  );
}

/* Inline styles (same look, drop-in) */

const headerStyle = { textAlign: 'center', marginBottom: '12px' };
const titleStyle = { margin: 0, fontSize: '32px', letterSpacing: '0.5px' };
const subtitleStyle = { margin: '8px 0 0', opacity: 0.8, fontSize: '14px' };
const menuStyle = { width: '100%', maxWidth: '420px', display: 'grid', gap: '12px' };

const buttonStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid',
  color: '#eaeaea',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '0.3px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
};

const buttonLabelStyle = { display: 'inline-block' };
