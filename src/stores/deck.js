import { create } from 'zustand';

// Helper to generate a standard deck
function generateDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (const suit of suits)
    for (const rank of ranks) deck.push({ suit, rank, id: `${rank}${suit}` });
  return deck;
}

// Fisher-Yates shuffle
function shuffleDeck(deck) {
  const a = [...deck];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mapItemToCard(item) {
  return {
    id: `shop_${item.id}`,
    rank: '★',
    suit: '☆',
    name: item.name,
    suitName: item.name,
  };
}

function defaultsFor(id) {
  const name = id === 'standard' ? 'Standard Deck' : 'Custom Deck';
  const desc =
    id === 'standard'
      ? 'A standard 52 card deck. So it would seem...'
      : 'Build a custom deck from owned cards.';
  return { name, desc };
}

const useDeckStore = create((set, get) => ({
  baseDeck: generateDeck(),
  deck: [],
  ownedShopCards: [],
  activeDeckId: 'standard',
  decks: {
    standard: {
      id: 'standard',
      name: 'Standard Deck',
      desc: 'A standard 52 card deck. So it would seem...',
      loadout: [],
    },
  },
  loadout: [],

  editor: { deckId: null, name: '', desc: '', isOpen: false },

  deckExists: id => !!get().decks[String(id)],
  getDisplayName: id => get().decks[String(id)]?.name || defaultsFor(String(id)).name,
  getDisplayDesc: id => get().decks[String(id)]?.desc || defaultsFor(String(id)).desc,

  ensureDeck: deckId =>
    set(state => {
      const id = String(deckId);
      if (state.decks[id]) return state;
      const { name, desc } = defaultsFor(id);
      return { decks: { ...state.decks, [id]: { id, name, desc, loadout: [] } } };
    }),

  updateDeck: (deckId, patch) =>
    set(state => {
      const id = String(deckId);
      const base = state.decks[id] || { id, ...defaultsFor(id), loadout: [] };
      const updated = { ...base, ...patch };
      const decks = { ...state.decks, [id]: updated };
      const syncActive =
        id === state.activeDeckId && patch.loadout ? { loadout: patch.loadout } : {};
      return { decks, ...syncActive };
    }),

  renameDeck: (deckId, name) =>
    get().updateDeck(deckId, { name: String(name || '').slice(0, 40) }),

  setDeckDesc: (deckId, desc) =>
    get().updateDeck(deckId, { desc: String(desc || '').slice(0, 220) }),

  setLoadoutFor: (deckId, items) =>
    get().updateDeck(deckId, { loadout: Array.isArray(items) ? [...items] : [] }),

  openEditor: deckId => {
    const id = String(deckId);
    const state = get();
    const base = state.decks[id] || { id, ...defaultsFor(id), loadout: [] };
    set({ editor: { deckId: id, name: base.name, desc: base.desc, isOpen: true } });
  },

  setEditorField: (field, value) =>
    set(state => ({
      editor: {
        ...state.editor,
        [field]:
          field === 'name' ? String(value).slice(0, 40) : String(value).slice(0, 220),
      },
    })),

  saveEditor: () =>
    set(state => {
      const { deckId, name, desc, isOpen } = state.editor;
      if (!isOpen || !deckId) return {};
      const trimmedName = String(name || '').trim();
      const trimmedDesc = String(desc || '').trim();
      const base = state.decks[deckId] || {
        id: deckId,
        ...defaultsFor(deckId),
        loadout: [],
      };
      const next = {
        ...base,
        name: trimmedName || base.name,
        desc: trimmedDesc,
      };
      return {
        decks: { ...state.decks, [deckId]: next },
        editor: { deckId: null, name: '', desc: '', isOpen: false },
      };
    }),

  cancelEditor: () =>
    set({ editor: { deckId: null, name: '', desc: '', isOpen: false } }),

  setActiveDeck: deckId =>
    set(state => {
      const id = String(deckId || 'standard');
      const next = state.decks[id] || { id, ...defaultsFor(id), loadout: [] };
      return {
        activeDeckId: id,
        decks: { ...state.decks, [id]: next },
        loadout: next.loadout,
      };
    }),

  drawCard: () => {
    const { deck } = get();
    if (deck.length === 0) return null;
    const [card, ...rest] = deck;
    set({ deck: rest });
    return card;
  },

  shuffle: () => set(state => ({ deck: shuffleDeck(state.deck) })),

  resetDeck: () => {
    const { baseDeck, loadout } = get();
    const extras = loadout.map(mapItemToCard);
    set({ deck: shuffleDeck([...baseDeck, ...extras]) });
  },

  buildAndShuffle: deckId => {
    const state = get();
    const id = deckId || state.activeDeckId;
    const selected = state.decks[id] || { id, ...defaultsFor(id), loadout: [] };
    const extras = selected.loadout.map(mapItemToCard);
    set({
      activeDeckId: id,
      decks: { ...state.decks, [id]: selected },
      loadout: selected.loadout,
      deck: shuffleDeck([...state.baseDeck, ...extras]),
    });
  },

  addOwnedShopCard: item =>
    set(state => {
      if (state.ownedShopCards.find(x => x.id === item.id)) return state;
      return { ownedShopCards: [...state.ownedShopCards, item] };
    }),

  addToLoadout: id =>
    set(state => {
      const deckId = state.activeDeckId;
      const selected = state.decks[deckId] || {
        id: deckId,
        ...defaultsFor(deckId),
        loadout: [],
      };
      if (selected.loadout.length >= 10) return state;
      if (selected.loadout.find(x => x.id === id)) return state;
      const item = state.ownedShopCards.find(x => x.id === id);
      if (!item) return state;
      const nextLoadout = [...selected.loadout, item];
      return {
        decks: { ...state.decks, [deckId]: { ...selected, loadout: nextLoadout } },
        loadout: nextLoadout,
      };
    }),

  removeFromLoadout: id =>
    set(state => {
      const deckId = state.activeDeckId;
      const selected = state.decks[deckId] || {
        id: deckId,
        ...defaultsFor(deckId),
        loadout: [],
      };
      const nextLoadout = selected.loadout.filter(x => x.id !== id);
      return {
        decks: { ...state.decks, [deckId]: { ...selected, loadout: nextLoadout } },
        loadout: nextLoadout,
      };
    }),

  addToLoadoutFor: (deckId, id) =>
    set(state => {
      const key = String(deckId);
      const base = state.decks[key] || { id: key, ...defaultsFor(key), loadout: [] };
      if (base.loadout.length >= 10) return state;
      if (base.loadout.find(x => x.id === id)) return state;
      const item = state.ownedShopCards.find(x => x.id === id);
      if (!item) return state;
      const nextLoadout = [...base.loadout, item];
      const updatedDecks = { ...state.decks, [key]: { ...base, loadout: nextLoadout } };
      const syncActive = key === state.activeDeckId ? { loadout: nextLoadout } : {};
      return { decks: updatedDecks, ...syncActive };
    }),

  removeFromLoadoutFor: (deckId, id) =>
    set(state => {
      const key = String(deckId);
      const base = state.decks[key] || { id: key, ...defaultsFor(key), loadout: [] };
      const nextLoadout = base.loadout.filter(x => x.id !== id);
      const updatedDecks = { ...state.decks, [key]: { ...base, loadout: nextLoadout } };
      const syncActive = key === state.activeDeckId ? { loadout: nextLoadout } : {};
      return { decks: updatedDecks, ...syncActive };
    }),
}));

export default useDeckStore;
