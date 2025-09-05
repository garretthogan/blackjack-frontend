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

  const outcomeColor =
    (lastResult &&
      {
        ['Blackjack']: 'text-green-500',
        ['Five-Card Charlie']: 'text-pink-500',
        ['Win']: 'text-green-500',
        ['Push']: 'text-amber-500',
        ['Loss']: 'text-red-500',
      }[lastResult.outcome]) ||
    'text-white';

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
                WINNINGS: $<span className="text-green-500">{wager * 2}</span>
              </span>
            )}
            <p className="text-sm">
              Hands remaining:&nbsp;
              <span className="text-yellow-500">{HANDS_PER_FLOOR - handsPlayed}</span>
            </p>
          </h1>
        </div>
        {!endOfRound && (
          <div>
            <h2 className="text-lg">Result</h2>
            <p className={`${outcomeColor} text-xs`}>{lastResult?.reason}</p>
            <div className="mb-2 text-xl mt-2">
              <p className={`mt-0 ${outcomeColor}`}>
                {lastResult?.playerScore ?? '—'} vs Dealer:{' '}
                {lastResult?.dealerScore ?? '—'}
              </p>
            </div>
            <p className="inline">
              W:&nbsp;<span className="text-green-500 mt-2">{handsWon}</span>
            </p>
            &nbsp;
            <div className="inline">
              L:&nbsp;<span className="text-red-500">{handsLost}</span>
            </div>
          </div>
        )}

        {endOfRound && (
          <div>
            <p className={`${outcomeColor}`}>{lastResult?.reason}</p>
            <p className={`mt-0 mb-4 ${outcomeColor}`}>
              {lastResult?.playerScore ?? '—'} vs Dealer: {lastResult?.dealerScore ?? '—'}
            </p>
            <h2 className="mt-2">Round Over</h2>
            {handsWon > handsLost && (
              <p className="text-green-500">You won this round!</p>
            )}
            {handsWon <= handsLost && (
              <p className="text-red-500">You lost this round!</p>
            )}
            <div className="mb-2">
              Rounds Won: <p className="inline text-green-500">{roundsWon}</p> | Rounds
              Lost:&nbsp;
              <p className="inline text-red-500">{roundsLost}</p>
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
