import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import useScoreboardStore from './stores/scoreboard';
import { buttonClass, buttonRowClass, modalClass, overlayClass } from './theme';
import usePlayerStore from './stores/player';
import useDealerStore from './stores/dealer';

export default function RoundResultModal({ isOpen, onClose, skipAutoEvaluate = false }) {
  const {
    lastResult,
    handsWon,
    handsLost,
    purse,
    addResult,
    wager,
  } = useScoreboardStore();
  const { playerStood, playerValue } = usePlayerStore();
  const { dealerValue } = useDealerStore();
  const navigate = useNavigate();

  const stop = e => e.stopPropagation();

  const outcomeColorMap = {
    ['Blackjack']: 'var(--tui-ok)',
    ['Five-Card Charlie']: 'var(--tui-pink)',
    ['Win']: 'var(--tui-ok)',
    ['Push']: 'var(--tui-cyan)',
    ['Loss']: 'var(--tui-danger)',
  };
  const outcomeColor = (lastResult && outcomeColorMap[lastResult.outcome]) || 'var(--tui-fg)';
  const isGameOver = purse <= 0;

  useEffect(() => {
    if (skipAutoEvaluate || !isOpen || !playerStood || lastResult) return;

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
  }, [
    skipAutoEvaluate,
    isOpen,
    playerStood,
    lastResult,
    playerValue,
    dealerValue,
    addResult,
  ]);

  if (!isOpen) return null;

  if (!lastResult) {
    return (
      <div className={overlayClass}>
        <div className={modalClass} onClick={stop}>
          <div className="py-2">Calculating result...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={overlayClass}>
      <div className={modalClass} onClick={stop}>
        <div className="py-2">
          <h1 className="text-4xl mb-2 p-2">
            {isGameOver ? (
              <span style={{ color: 'var(--tui-danger)' }}>GAME OVER</span>
            ) : (
              lastResult?.outcome === 'Win' && (
                <span>
                  WINNINGS: $<span style={{ color: 'var(--tui-ok)' }}>{wager * 2}</span>
                </span>
              )
            )}
            <p className="text-sm" style={{ color: 'var(--tui-muted)' }}>
              Bank: <span style={{ color: 'var(--tui-cyan)' }}>${purse}</span>
            </p>
          </h1>
        </div>
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
        <div className={buttonRowClass}>
          <button className={buttonClass} onClick={() => navigate('/shop')}>
            Shop
          </button>
          {!isGameOver && (
            <button className={buttonClass} onClick={() => onClose()}>
              Place Next Bet
            </button>
          )}
          {isGameOver && (
            <button className={buttonClass} onClick={() => navigate('/seat-buy-in')}>
              New Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
