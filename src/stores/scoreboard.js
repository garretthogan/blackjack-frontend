import { create } from 'zustand';

export const HANDS_PER_FLOOR = 6;
const useScoreboardStore = create(set => ({
  purse: 0,
  endOfRound: false,
  roundsPlayed: 0,
  roundsWon: 0,
  roundsLost: 0,
  handsPlayed: 0,
  handsWon: 0,
  handsLost: 0,
  handsPushed: 0,
  lastResult: null, // { outcome: 'win'|'lose'|'push', reason: string, playerScore: number, dealerScore: number }
  addResult: (outcome, reason, playerScore, dealerScore) =>
    set(state => {
      let {
        handsPlayed,
        handsWon,
        handsLost,
        handsPushed,
        roundsLost,
        roundsWon,
        roundsPlayed,
        endOfRound,
      } = state;
      handsPlayed += 1;

      if (outcome === 'Win') handsWon += 1;
      else if (outcome === 'Loss') handsLost += 1;
      else if (outcome === 'Push') handsPushed += 1;

      if (handsPlayed % HANDS_PER_FLOOR === 0) {
        endOfRound = true;
        roundsPlayed += 1;

        if (handsWon > handsLost) roundsWon += 1;
        else if (handsWon <= handsLost) roundsLost += 1;

        handsPlayed = 0;
        handsLost = 0;
        handsWon = 0;
      }

      return {
        roundsLost,
        roundsWon,
        roundsPlayed,
        handsPlayed,
        handsWon,
        handsLost,
        handsPushed,
        endOfRound,
        lastResult: { outcome, reason, playerScore, dealerScore },
      };
    }),
  resetScoreboard: () =>
    set(() => ({
      endOfRound: false,
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
    set(state => ({
      purse: amount,
    })),
}));

export default useScoreboardStore;
