import { useNavigate } from 'react-router';
import useScoreboardStore, { HANDS_PER_FLOOR } from './stores/scoreboard';
import { buttonClass, buttonRowClass, modalClass, overlayClass } from './theme';
import usePlayerStore from './stores/player';
import useDealerStore from './stores/dealer';

export default function RoundResultModal({ isOpen, onClose }) {
  const {
    lastResult,
    roundsWon,
    roundsLost,
    roundsPlayed,
    endOfRound,
    handsWon,
    handsLost,
    handsPlayed,
    addResult,
    wager,
  } = useScoreboardStore();
  const { playerStood, playerValue } = usePlayerStore();
  const { dealerValue } = useDealerStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const stop = e => e.stopPropagation();

  const outcomeColorMap = {
    ['Blackjack']: 'var(--tui-ok)',
    ['Five-Card Charlie']: 'var(--tui-pink)',
    ['Win']: 'var(--tui-ok)',
    ['Push']: 'var(--tui-cyan)',
    ['Loss']: 'var(--tui-danger)',
  };
  const outcomeColor = (lastResult && outcomeColorMap[lastResult.outcome]) || 'var(--tui-fg)';

  if (playerStood && !lastResult) {
    if (playerValue <= 21 && dealerValue > 21) {
      addResult('Win', 'Dealer busted', playerValue, dealerValue);
    } else if (playerValue === 21) {
      addResult('Win', 'Blackjack!', playerValue, dealerValue);
    } else if (playerValue > 21) {
      addResult('Loss', 'Busted', playerValue, dealerValue);
    } else if (playerValue < 21) {
      if (playerValue < dealerValue) {
        addResult('Loss', 'Dealer wins', playerValue, dealerValue);
      } else if (playerValue > dealerValue) {
        addResult('Win', 'Player wins', playerValue, dealerValue);
      } else if (dealerValue === playerValue) {
        addResult('Push', 'Push', playerValue, dealerValue);
      }
    }
  }

  return (
    <div className={overlayClass}>
      <div className={modalClass} onClick={stop}>
        <div className="py-2">
          <h1 className="text-4xl mb-2 p-2">
            {lastResult.outcome === 'Win' && (
              <span>
                WINNINGS: $<span style={{ color: 'var(--tui-ok)' }}>{wager * 2}</span>
              </span>
            )}
            <p className="text-sm" style={{ color: 'var(--tui-muted)' }}>
              Hands remaining:{' '}
              <span style={{ color: 'var(--tui-cyan)' }}>{HANDS_PER_FLOOR - handsPlayed}</span>
            </p>
          </h1>
        </div>
        {!endOfRound && (
          <div>
            <h2 className="text-lg">Result</h2>
            <p className="text-xs" style={{ color: outcomeColor }}>
              {lastResult?.reason}
            </p>
            <div className="mb-2 text-xl mt-2">
              <p className="mt-0" style={{ color: outcomeColor }}>
                {lastResult?.playerScore ?? '—'} vs Dealer: {lastResult?.dealerScore ?? '—'}
              </p>
            </div>
            <p className="inline">
              W: <span style={{ color: 'var(--tui-ok)' }}>{handsWon}</span>
            </p>
            &nbsp;
            <div className="inline">
              L: <span style={{ color: 'var(--tui-danger)' }}>{handsLost}</span>
            </div>
          </div>
        )}

        {endOfRound && (
          <div>
            <p style={{ color: outcomeColor }}>{lastResult?.reason}</p>
            <p className="mt-0 mb-4" style={{ color: outcomeColor }}>
              {lastResult?.playerScore ?? '—'} vs Dealer: {lastResult?.dealerScore ?? '—'}
            </p>
            <h2 className="mt-2">Round Over</h2>
            {handsWon > handsLost && (
              <p style={{ color: 'var(--tui-ok)' }}>You won this round!</p>
            )}
            {handsWon <= handsLost && (
              <p style={{ color: 'var(--tui-danger)' }}>You lost this round!</p>
            )}
            <div className="mb-2">
              Rounds Won: <p className="inline" style={{ color: 'var(--tui-ok)' }}>{roundsWon}</p> |
              Rounds Lost:{' '}
              <p className="inline" style={{ color: 'var(--tui-danger)' }}>{roundsLost}</p>
            </div>
          </div>
        )}
        <div className={buttonRowClass}>
          {endOfRound && (
            <button className={buttonClass} onClick={() => navigate('/shop')}>
              Shop
            </button>
          )}
          <button className={buttonClass} onClick={() => onClose()}>
            Next Hand
          </button>
        </div>
      </div>
    </div>
  );
}
