import { useNavigate } from 'react-router';

export default function RunHub() {
  const navigate = useNavigate();

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Run Hub</h1>
        <p style={subheadingStyle}>Current Blind Goal: 600 winnings in 3 hands</p>

        <div style={primaryActionsGridStyle}>
          <ActionButton label="Play Hand" onClick={() => navigate('/blackjack')} />
          <ActionButton label="Select Deck" onClick={() => navigate('/deck-select')} />
          <ActionButton label="Shop" onClick={() => navigate('/shop')} />
        </div>

        <div style={footerGridStyle}>
          <button style={secondaryButtonStyle} onClick={() => navigate('/')}>
            Back to Menu
          </button>
          <button style={secondaryButtonStyle} onClick={() => navigate('/seat-buy-in')}>
            Change Starting Bank
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button style={primaryButtonStyle} onClick={onClick}>
      {label}
    </button>
  );
}

const pageContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  color: '#eee',
  fontFamily: 'sans-serif',
};

const cardStyle = {
  width: 'min(560px, 92vw)',
  border: '1px solid',
  borderRadius: 16,
  padding: 24,
};

const headingStyle = { margin: 0, marginBottom: 8, fontSize: 28 };

const subheadingStyle = { margin: 0, marginBottom: 20, fontSize: 16, opacity: 0.85 };

const primaryActionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 14,
  width: '100%',
  marginBottom: 18,
};

const primaryButtonStyle = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
  fontSize: 16,
  cursor: 'pointer',
};

const footerGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 14,
  width: '100%',
};

const secondaryButtonStyle = {
  width: '100%',
  padding: '12px 20px',
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
  fontSize: 16,
  cursor: 'pointer',
};
