import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { settlementReturn } from '../helpers';

const UserContext = createContext(null);
const STORAGE_KEY = 'bj_user_v1';
const DEFAULT_INITIAL_BANK = 1000;

const n = v => (Number.isFinite(v) ? v : null);

function sanitize(capMaybe, balMaybe, fallback) {
  const cap = n(capMaybe);
  const baseCap = cap && cap > 0 ? cap : n(fallback) || DEFAULT_INITIAL_BANK;
  const bal = n(balMaybe);
  const baseBal = bal && bal > 0 ? bal : baseCap;
  return { baseCap, baseBal };
}

export function UserProvider({ children, initialBank = DEFAULT_INITIAL_BANK }) {
  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  })();

  const { baseCap, baseBal } = sanitize(stored.bankCap, stored.balance, initialBank);

  const [balance, setBalance] = useState(baseBal);
  const [bankCap, setBankCap] = useState(baseCap);
  const [round, setRound] = useState(n(stored.round) || 1);
  const [currentBet, setCurrentBet] = useState(n(stored.currentBet) || 0);
  const [betMultiplier, setBetMultiplier] = useState(n(stored.betMultiplier) || 1);
  const [lastResult, setLastResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ balance, bankCap, round, currentBet, betMultiplier })
    );
  }, [balance, bankCap, round, currentBet, betMultiplier]);

  const setStartingBank = useCallback(
    amount => {
      const v = Math.floor(Number(amount));
      const next =
        Number.isFinite(v) && v > 0 ? v : n(initialBank) || DEFAULT_INITIAL_BANK;
      setBankCap(next);
      setBalance(next);
      setRound(1);
      setCurrentBet(0);
      setBetMultiplier(1);
      setLastResult(null);
      setResultOpen(false);
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          balance: next,
          bankCap: next,
          round: 1,
          currentBet: 0,
          betMultiplier: 1,
        })
      );
    },
    [initialBank]
  );

  const startHand = useCallback(
    bet => {
      const wager = Math.floor(Number(bet));
      if (!Number.isFinite(wager) || wager <= 0) return false;
      if (wager > balance) return false;
      setBalance(b => b - wager);
      setCurrentBet(wager);
      setBetMultiplier(1);
      return true;
    },
    [balance]
  );

  const tryDoubleDown = useCallback(() => {
    if (currentBet <= 0) return false;
    if (balance < currentBet) return false;
    setBalance(b => b - currentBet);
    setBetMultiplier(m => m + 1);
    return true;
  }, [balance, currentBet]);

  const settleHand = (outcome, message, opts = {}) => {
    const mult = Number.isFinite(opts.multiplier) ? opts.multiplier : betMultiplier;
    const paidBack = settlementReturn(currentBet, outcome, { multiplier: mult });
    const delta = paidBack - currentBet * mult;

    setBalance(b => b + paidBack);
    setLastResult({
      outcome,
      delta,
      message,
      playerTotal: n(opts.playerTotal),
      dealerTotal: n(opts.dealerTotal),
    });
    setRound(r => r + 1);
    setCurrentBet(0);
    setBetMultiplier(1);
  };

  return (
    <UserContext.Provider
      value={{
        balance,
        bankCap,
        round,
        currentBet,
        betMultiplier,
        setStartingBank,
        startHand,
        tryDoubleDown,
        settleHand,
        lastResult,
        resultOpen,
        setResultOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
