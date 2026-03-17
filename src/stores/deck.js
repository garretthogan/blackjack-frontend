import { create } from 'zustand';

// Helper to generate a standard deck
function generateDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Fisher-Yates shuffle
function shuffleDeck(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const useDeckStore = create((set, get) => ({
  deck: [],
  purchasedCards: [],
  devOnlyShopCards: false,
  drawCard: () => {
    const { deck } = get();
    if (deck.length === 0) return null;
    const [card, ...rest] = deck;
    set({ deck: rest });
    return card;
  },
  shuffle: () =>
    set(state => ({
      deck: shuffleDeck(state.deck),
    })),
  resetDeck: () => {
    const { purchasedCards, devOnlyShopCards } = get();
    const nextDeck = devOnlyShopCards ? [...purchasedCards] : [...generateDeck(), ...purchasedCards];
    set({ deck: shuffleDeck(nextDeck) });
  },
  setDevOnlyShopCards: enabled =>
    set(state => ({
      devOnlyShopCards: enabled,
      deck: enabled ? state.deck.filter(card => card.fromShop) : state.deck,
    })),
  addCardToDeck: card =>
    set(state => {
      const purchasedCard = { ...card, fromShop: true };
      return {
        purchasedCards: [...state.purchasedCards, purchasedCard],
        deck: shuffleDeck([...state.deck, purchasedCard]),
      };
    }),
}));

export default useDeckStore;
