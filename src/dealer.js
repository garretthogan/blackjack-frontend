import { create } from 'zustand';
import { calcTotal } from './helpers';

const useDealerStore = create(set => ({
  dealerHand: [],
  dealerValue: 0,
  setDealerHand: cards => set({ dealerHand: cards, dealerValue: calcTotal(cards) }),
  addDealerCard: card =>
    set(state => {
      const newCards = [...state.dealerHand, card];
      return {
        dealerHand: newCards,
        dealerValue: calcTotal(newCards),
      };
    }),
  removeDealerCard: index =>
    set(state => {
      const newCards = state.dealerHand.filter((_, i) => i !== index);
      return {
        dealerHand: newCards,
        dealerValue: calcTotal(newCards),
      };
    }),
  resetDealerHand: () =>
    set(() => ({
      dealerHand: [],
      dealerValue: 0,
    })),
}));

export default useDealerStore;
