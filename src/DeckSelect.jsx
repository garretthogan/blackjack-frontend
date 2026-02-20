import { useNavigate } from 'react-router';
import { containerClass, modalClass, buttonClass } from './theme';

export default function DeckSelect() {
  const navigate = useNavigate();

  const handleSelect = deck => {
    console.log('Selected deck:', deck);
    navigate('/seat-buy-in');
  };

  return (
    <div className={containerClass}>
      <div className={modalClass} style={{ minWidth: 'min(720px, 92vw)' }}>
        <h1 style={{ marginBottom: 24, fontSize: 28, color: 'var(--tui-fg)' }}>Choose Your Deck</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--tui-gap-lg)',
            marginBottom: 24,
          }}
        >
          <DeckCard
            title="Standard Deck"
            description="A standard 52 card deck. So it would seem..."
            onSelect={() => handleSelect('standard')}
          />
          <DeckCard title="Coming soon..." description="..." onSelect={() => handleSelect('face-heavy')} />
          <DeckCard title="Coming soon..." description="..." onSelect={() => handleSelect('ace-stacker')} />
        </div>

        <button className={buttonClass} onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

function DeckCard({ title, description, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        border: '2px solid var(--tui-line-strong)',
        padding: 'var(--tui-pad-3)',
        textAlign: 'left',
        cursor: 'pointer',
        color: 'var(--tui-fg)',
        background: 'transparent',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--tui-cyan)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--tui-line-strong)')}
    >
      <h2 style={{ margin: '0 0 8px', fontSize: 18, color: 'var(--tui-fg)' }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--tui-muted)' }}>{description}</p>
    </button>
  );
}
