import { useNavigate } from 'react-router';
import { useUser } from './context/UserContext';
import useScoreboardStore, { HANDS_PER_FLOOR } from './stores/scoreboard';
import { buttonClass, buttonRowClass, modalClass, overlayClass } from './theme';
import usePlayerStore from './stores/player';
import useDealerStore from './stores/dealer';
import { useEffect } from 'react';

export default function RoundResultModal({ isOpen, onClose }) {
  const {
    lastResult,
    roundsWon,
    roundsLost,
    roundsPlayed,
    endOfRound,
    handsWon,
    handsLost,
    addResult,
  } = useScoreboardStore();
  const { playerStood, playerValue } = usePlayerStore();
  const { dealerValue } = useDealerStore();
  const { balance, setStartingBank, bankCap } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const stop = e => e.stopPropagation();
  const isGameOver = balance <= 0;

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
          <h2 className="text-4xl">Round {roundsPlayed + 1}</h2>
        </div>
        {!endOfRound && (
          <div>
            <h2 className="text-lg">Hand Result</h2>
            <p className={`${outcomeColor}`}>{lastResult?.reason}</p>
            <p className={`mt-0 mb-4 ${outcomeColor}`}>
              {lastResult?.playerScore ?? '—'} vs Dealer: {lastResult?.dealerScore ?? '—'}
            </p>
          </div>
        )}

        {endOfRound && (
          <div>
            <p className={`${outcomeColor}`}>{lastResult?.reason}</p>
            <p className={`mt-0 mb-4 ${outcomeColor}`}>
              {lastResult?.playerScore ?? '—'} vs Dealer: {lastResult?.dealerScore ?? '—'}
            </p>
            <h2 className="mt-2">Round Result</h2>
            {handsWon > handsLost && (
              <p className="text-green-500">You won this round!</p>
            )}
            {handsWon < handsLost && <p className="text-red-500">You lost this round!</p>}
            <div className="mb-2">
              Rounds Won: <p className="inline text-green-500">{roundsWon}</p> | Rounds
              Lost:&nbsp;
              <p className="inline text-red-500">{roundsLost}</p>
            </div>
          </div>
        )}
        {isGameOver ? (
          <div className={buttonRowClass}>
            <button
              className={buttonClass}
              onClick={() => {
                setStartingBank(bankCap || 1000);
                onClose();
              }}
            >
              Restart
            </button>
            <button className={buttonClass} onClick={() => navigate('/')}>
              Main Menu
            </button>
          </div>
        ) : (
          <button className={buttonClass} onClick={() => onClose()}>
            Next Hand
          </button>
        )}
        <p className="py-2 text-xs">1 Round = {HANDS_PER_FLOOR} Hands</p>
      </div>
    </div>
  );
}
