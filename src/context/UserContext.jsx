import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { settlementReturn } from '../helpers';

const UserContext = createContext(null);
const STORAGE_KEY = 'bj_user_v1';
const DEFAULT_INITIAL_BANK = 1000;

const toFiniteNumberOrNull = v => (Number.isFinite(v) ? v : null);

function sanitize(capMaybe, balMaybe, fallback) {
  const cap = toFiniteNumberOrNull(capMaybe);
  const baseCap =
    cap && cap > 0 ? cap : toFiniteNumberOrNull(fallback) || DEFAULT_INITIAL_BANK;
  const bal = toFiniteNumberOrNull(balMaybe);
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
  const [round, setRound] = useState(toFiniteNumberOrNull(stored.round) || 1);
  const [currentBet, setCurrentBet] = useState(
    toFiniteNumberOrNull(stored.currentBet) || 0
  );
  const [betMultiplier, setBetMultiplier] = useState(
    toFiniteNumberOrNull(stored.betMultiplier) || 1
  );

  const [ownedItems, setOwnedItems] = useState(stored.ownedItems || {});
  const [wallets, setWallets] = useState(stored.wallets || {});

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        balance,
        bankCap,
        round,
        currentBet,
        betMultiplier,
        ownedItems,
        wallets,
      })
    );
  }, [balance, bankCap, round, currentBet, betMultiplier, ownedItems, wallets]);

  const setStartingBank = useCallback(
    amount => {
      const parsedAmount = Math.floor(Number(amount));
      const next =
        Number.isFinite(parsedAmount) && parsedAmount > 0
          ? parsedAmount
          : toFiniteNumberOrNull(initialBank) || DEFAULT_INITIAL_BANK;
      setBankCap(next);
      setBalance(next);
      setRound(1);
      setCurrentBet(0);
      setBetMultiplier(1);
      setOwnedItems({});
      setWallets({});
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          balance: next,
          bankCap: next,
          round: 1,
          currentBet: 0,
          betMultiplier: 1,
          ownedItems: {},
          wallets: {},
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
      setBalance(previousBalance => previousBalance - wager);
      setCurrentBet(wager);
      setBetMultiplier(1);
      return true;
    },
    [balance]
  );

  const tryDoubleDown = useCallback(() => {
    if (currentBet <= 0) return false;
    if (balance < currentBet) return false;
    setBalance(previousBalance => previousBalance - currentBet);
    setBetMultiplier(previousMultiplier => previousMultiplier + 1);
    return true;
  }, [balance, currentBet]);

  const settleHand = (outcome, message, opts = {}) => {
    const mult = Number.isFinite(opts.multiplier) ? opts.multiplier : betMultiplier;
    const paidBack = settlementReturn(currentBet, outcome, { multiplier: mult });

    setBalance(previousBalance => previousBalance + paidBack);
    setRound(previousRound => previousRound + 1);
    setCurrentBet(0);
    setBetMultiplier(1);
  };

  const getCurrencyBalance = useCallback(() => balance, [balance]);

  const setCurrencyBalance = useCallback(nextValue => {
    const parsedValue = Math.floor(Number(nextValue));
    if (!Number.isFinite(parsedValue)) return;
    setBalance(parsedValue);
  }, []);

  const spendCredits = useCallback(
    amount => {
      const parsedAmount = Math.floor(Number(amount));
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return false;
      if (balance < parsedAmount) return false;
      setBalance(previousBalance => previousBalance - parsedAmount);
      return true;
    },
    [balance]
  );

  const addCredits = useCallback(amount => {
    const parsedAmount = Math.floor(Number(amount));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return false;
    setBalance(previousBalance => previousBalance + parsedAmount);
    return true;
  }, []);

  const hasItem = useCallback(itemId => !!ownedItems[itemId], [ownedItems]);

  const buyShopItem = useCallback(
    item => {
      if (!item || !item.id) return false;
      if (ownedItems[item.id]) return false;

      const parsedCost = Math.floor(Number(item.cost));
      if (!Number.isFinite(parsedCost) || parsedCost < 0) return false;

      const wasSpent = spendCredits(parsedCost);
      if (!wasSpent) return false;

      setOwnedItems(previousOwnedItems => ({ ...previousOwnedItems, [item.id]: true }));
      return true;
    },
    [ownedItems, spendCredits]
  );

  return (
    <UserContext.Provider
      value={{
        balance,
        bankCap,
        round,
        currentBet,
        betMultiplier,
        ownedItems,
        wallets,
        setStartingBank,
        startHand,
        tryDoubleDown,
        settleHand,
        getCurrencyBalance,
        setCurrencyBalance,
        spendCredits,
        addCredits,
        hasItem,
        buyShopItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
