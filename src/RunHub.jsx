// RunHub.jsx
import React from 'react';
import { useNavigate } from 'react-router';

export default function RunHub() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div className="rounded-2xl border border-zinc-200 p-6">
        <h1 style={titleStyle}>Run Hub</h1>
        <p style={goalStyle}>Current Blind Goal: 600 winnings in 3 hands</p>

        <div style={actionGridStyle}>
          <ActionButton label="Play Hand" onClick={() => navigate('/bet')} />
          <ActionButton label="Shop" onClick={() => navigate('/shop')} />
          <ActionButton label="View Deck" onClick={() => navigate('/deck-viewer')} />
        </div>

        <button style={backButtonStyle} onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button style={actionButtonStyle} onClick={onClick}>
      {label}
    </button>
  );
}

/* Inline styles */
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

const titleStyle = { marginBottom: '8px', fontSize: '28px' };

const goalStyle = {
  marginBottom: '24px',
  fontSize: '16px',
  opacity: 0.85,
};

const actionGridStyle = {
  display: 'grid',
  gap: '16px',
  width: '100%',
  maxWidth: '320px',
  marginBottom: '24px',
};

const actionButtonStyle = {
  padding: '14px 20px',
  borderRadius: '10px',
  border: '1px solid ',
  color: '#eee',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const backButtonStyle = {
  marginTop: '12px',
  padding: '12px 24px',
  borderRadius: '8px',
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};
