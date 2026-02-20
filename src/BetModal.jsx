import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';
import usePlayerStore from './stores/player';
import useScoreboardStore from './stores/scoreboard';
import { overlayClass, modalClass, buttonClass, buttonRowClass } from './theme';

export default function BetModal({ open, onConfirmed }) {
  const navigate = useNavigate();
  const { startHand } = useUser();
  const { purse, setWager } = useScoreboardStore();

  const { setPlayerBet, playerBet } = usePlayerStore();

  useEffect(() => {
    if (open) setPlayerBet(0);
  }, [open]);

  if (!open) return null;

  const add = v => setPlayerBet(Math.min(purse, playerBet + v));
  const clear = () => setPlayerBet(0);
  const autoMin = () => add(25);

  const disabled = playerBet <= 0;

  const confimrBet = () => {
    setWager(playerBet);
    startHand();
    onConfirmed();
  };

  return (
    <div className={overlayClass}>
      <div className={modalClass} onClick={e => e.stopPropagation()}>
        <h3 className="m-0 mb-2 text-lg font-bold" style={{ color: 'var(--tui-fg)' }}>
          Place Your Bet
        </h3>
        <p className="m-0 mb-3 text-sm" style={{ color: 'var(--tui-muted)' }}>
          Balance: ${purse}
        </p>

        <div className="flex gap-3 mb-4 flex-wrap">
          {[25, 100, 500].map(v => (
            <button key={v} className={buttonClass} onClick={() => add(v)}>
              ${v}
            </button>
          ))}
          <button className={buttonClass} onClick={autoMin}>
            Auto
          </button>
        </div>

        <div
          className="flex items-center gap-2 p-3 mb-4"
          style={{
            border: '2px solid var(--tui-line-strong)',
            color: 'var(--tui-fg)',
          }}
        >
          <span>
            Current Bet: <span style={{ color: 'var(--tui-cyan)' }}>${playerBet}</span>
          </span>
          <button
            onClick={clear}
            disabled={playerBet === 0}
            className="ml-auto px-2 py-1"
            style={{
              border: '1px solid var(--tui-line-strong)',
              background: 'transparent',
              color: 'var(--tui-fg)',
              cursor: playerBet === 0 ? 'not-allowed' : 'pointer',
              opacity: playerBet === 0 ? 0.5 : 1,
            }}
          >
            ✕
          </button>
        </div>

        <div className={buttonRowClass}>
          <button
            className={buttonClass}
            onClick={confimrBet}
            disabled={disabled}
            style={{
              borderColor: disabled ? 'var(--tui-line)' : 'var(--tui-pink)',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              minWidth: 140,
            }}
          >
            Place Bet
          </button>
          <button
            className={buttonClass}
            onClick={() => {
              setWager(0);
              navigate('/seat-buy-in');
            }}
            style={{ minWidth: 140 }}
          >
            Reset Bank
          </button>
        </div>
      </div>
    </div>
  );
}
