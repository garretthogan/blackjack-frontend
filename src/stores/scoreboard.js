import { create } from 'zustand';

const useScoreboardStore = create(set => ({
  handsPlayed: 0,
  handsWon: 0,
  handsLost: 0,
  handsPushed: 0,
  lastResult: null, // { outcome: 'win'|'lose'|'push', reason: string, playerScore: number, dealerScore: number }
  addResult: (outcome, reason, playerScore, dealerScore) =>
    set(state => {
      let { handsPlayed, handsWon, handsLost, handsPushed } = state;
      handsPlayed += 1;
      if (outcome === 'win') handsWon += 1;
      else if (outcome === 'lose') handsLost += 1;
      else if (outcome === 'push') handsPushed += 1;
      return {
        handsPlayed,
        handsWon,
        handsLost,
        handsPushed,
        lastResult: { outcome, reason, playerScore, dealerScore },
      };
    }),
  resetScoreboard: () =>
    set(() => ({
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      lastResult: null,
    })),
}));

export default useScoreboardStore;
