import { create } from 'zustand';

function calculatePlayerValue(cards) {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

const usePlayerStore = create(set => ({
  placingBets: true,
  playerStood: false,
  playerHand: [],
  playerValue: 0,
  playerBet: 0,
  addPlayerCards: cards =>
    set(state => {
      const newCards = [...state.playerHand, ...cards];
      return {
        playerHand: newCards,
        playerValue: calculatePlayerValue(newCards),
      };
    }),
  removePlayerCard: index =>
    set(state => {
      const newCards = state.playerHand.filter((_, i) => i !== index);
      return {
        playerHand: newCards,
        playerValue: calculatePlayerValue(newCards),
      };
    }),
  resetPlayerHand: () =>
    set(() => ({
      playerHand: [],
      playerValue: 0,
      playerStood: false,
    })),
  startPlacingBet: () => set({ placingBets: true }),
  betPlaced: () => set({ placingBets: false }),
  playerStands: () => set({ playerStood: true }),
  startHand: () =>
    set({ playerHand: [], playerValue: 0, playerStood: false, placingBets: true }),
  setPlayerBet: amount => set({ playerBet: amount }),
}));

export default usePlayerStore;
