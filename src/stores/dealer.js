import { create } from 'zustand';
import { calcTotal } from '../helpers';

const useDealerStore = create((set, get) => ({
  dealerHand: [],
  isDealerThinking: false,
  maxDealerThinkTime: 500,
  dealerValue: 0,
  startThinking: () => {
    // just a fake timer until we get animations
    set({ isDealerThinking: true });
    setTimeout(() => {
      set({ isDealerThinking: false });
    }, get().maxDealerThinkTime);
  },
  setDealerHand: cards => set({ dealerHand: cards, dealerValue: calcTotal(cards) }),
  addDealerCards: cards =>
    set(state => {
      const newCards = [...state.dealerHand, ...cards];
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
