import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';
import { containerClass, modalClass, buttonClass } from './theme';

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
    <div className={containerClass}>
      <div className={modalClass} style={{ minWidth: 'min(560px, 92vw)' }}>
        <h1 style={{ margin: 0, marginBottom: 'var(--tui-gap-lg)', fontSize: 24, fontWeight: 800, color: 'var(--tui-fg)' }}>
          Choose Starting Bank
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tui-gap)', marginBottom: 'var(--tui-gap-lg)' }}>
          {presets.map(p => (
            <button
              key={p}
              className={buttonClass}
              style={{
                minWidth: 96,
                borderColor: val === p ? 'var(--tui-pink)' : undefined,
              }}
              onClick={() => setVal(p)}
              aria-pressed={val === p}
            >
              ${p}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tui-gap)', marginBottom: 'var(--tui-gap-lg)' }}>
          <label style={{ color: 'var(--tui-muted)' }}>Custom</label>
          <input
            type="number"
            min={0}
            value={val}
            onChange={e => setVal(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            style={{
              width: 160,
              padding: 'var(--tui-pad-1) var(--tui-pad-2)',
              border: '2px solid var(--tui-line-strong)',
              background: 'transparent',
              color: 'var(--tui-fg)',
              fontWeight: 700,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--tui-gap)', justifyContent: 'center' }}>
          <button
            className={buttonClass}
            style={{ borderColor: 'var(--tui-pink)' }}
            onClick={confirm}
          >
            Start
          </button>
          <button className={buttonClass} onClick={() => navigate('/run-hub')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
