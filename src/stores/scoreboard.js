import { create } from 'zustand';

const HANDS_PER_FLOOR = 5;
const useScoreboardStore = create(set => ({
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
      let { handsPlayed, handsWon, handsLost, handsPushed, roundsLost, roundsWon } =
        state;
      handsPlayed += 1;
      if (outcome === 'win') handsWon += 1;
      else if (outcome === 'lose') handsLost += 1;
      else if (outcome === 'push') handsPushed += 1;

      if (handsPlayed % HANDS_PER_FLOOR === 0) {
        roundsPlayed += 1;
        if (handsWon > handsLost) roundsWon += 1;
        else if (handsWon < handsLost) roundsLost += 1;

        handsWon = 0;
        handsLost = 0;
        handsPushed = 0;
      }

      console.log({ roundsLost, roundsWon, roundsPlayed });

      return {
        roundsLost,
        roundsWon,
        roundsPlayed,
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
