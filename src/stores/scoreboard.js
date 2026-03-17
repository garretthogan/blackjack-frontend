import { create } from 'zustand';

const useScoreboardStore = create(set => ({
  purse: 2000,
  handsPlayed: 0,
  handsWon: 0,
  handsLost: 0,
  handsPushed: 0,
  wager: 0,
  lastResult: null, // { outcome: 'win'|'lose'|'push', reason: string, playerScore: number, dealerScore: number }
  addResult: (outcome, reason, playerScore, dealerScore, options = {}) =>
    set(state => {
      let { handsPlayed, handsWon, handsLost, handsPushed, purse } = state;
      handsPlayed += 1;
      const wagerAmount = options.wager ?? state.wager;

      if (typeof options.purseDelta === 'number') {
        purse += options.purseDelta;
      } else if (outcome === 'Win') {
        purse += wagerAmount * 2;
      } else if (outcome === 'Loss') {
        purse -= wagerAmount;
      }

      if (outcome === 'Win') handsWon += 1;
      else if (outcome === 'Loss') handsLost += 1;
      else if (outcome === 'Push') handsPushed += 1;

      return {
        handsPlayed,
        handsWon,
        handsLost,
        handsPushed,
        purse,
        lastResult: { outcome, reason, playerScore, dealerScore },
      };
    }),
  resetScoreboard: () =>
    set(() => ({
      lastResult: null,
    })),
  withdrawFromPurse: amount =>
    set(state => ({
      purse: state.purse - amount,
    })),
  addToPurse: amount =>
    set(state => ({
      purse: state.purse + amount,
    })),
  setStartingPurse: amount =>
    set(() => ({
      purse: amount,
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      wager: 0,
      lastResult: null,
    })),
  setWager: newWager => set(() => ({ wager: newWager })),
}));

export default useScoreboardStore;
