import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';

export default function AnteScreen() {
  const navigate = useNavigate();
  const { bankCap, setStartingBank } = useUser();
  const presets = [500, 1000, 2000, 5000, 10000];
  const [val, setVal] = useState(bankCap || 1000);

  const confirm = () => {
    setStartingBank(val);
    navigate('/blackjack');
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={title}>Choose Starting Bank</h1>

        <div style={chips}>
          {presets.map(p => (
            <button
              key={p}
              style={chip}
              onClick={() => setVal(p)}
              aria-pressed={val === p}
            >
              ${p}
            </button>
          ))}
        </div>

        <div style={row}>
          <label style={{ opacity: 0.85 }}>Custom</label>
          <input
            type="number"
            min={0}
            value={val}
            onChange={e => setVal(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            style={input}
          />
        </div>

        <div style={actions}>
          <button style={btnPrimary} onClick={confirm}>
            Start
          </button>
          <button style={btn} onClick={() => navigate('/run-hub')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0f5132',
  color: '#eee',
  fontFamily: 'sans-serif',
};

const card = {
  width: 'min(560px, 92vw)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 16,
  padding: 24,
  background: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
};

const title = { margin: 0, marginBottom: 12, fontSize: 24, fontWeight: 800 };

const chips = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 8,
  marginBottom: 16,
};

const chip = {
  minWidth: 96,
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  fontWeight: 800,
  cursor: 'pointer',
};

const row = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 };

const input = {
  width: 160,
  padding: '8px 10px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  fontWeight: 700,
};

const actions = { display: 'flex', gap: 10, justifyContent: 'center' };

const btn = {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  cursor: 'pointer',
};

const btnPrimary = {
  ...btn,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
};
