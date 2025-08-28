import { useState } from 'react';
import { useNavigate } from 'react-router';
import BlackjackTable from './BlackjackTable';

export default function Blackjack() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <BlackjackTable />
      <button style={backButtonStyle} onClick={() => navigate('/seat-buy-in')}>
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
  color: '#eee',
  padding: 24,
  fontFamily: 'sans-serif',
};

const evaluatingBoxStyle = {
  marginTop: 8,
  padding: 12,
  border: '1px dashed ',
  borderRadius: 10,
  textAlign: 'center',
  width: 'min(420px, 92vw)',
  fontWeight: 700,
  opacity: 0.9,
};

const backButtonStyle = {
  marginTop: 16,
  padding: '10px 20px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
};
