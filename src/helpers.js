const RANKS_ASC = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];

export function buildDeck() {
  const deck = [];
  for (const s of SUITS)
    for (const r of RANKS_ASC) deck.push({ id: `${r}${s}`, rank: r, suit: s });
  return deck;
}

export function sortDeck(deck) {
  const rankIndex = Object.fromEntries(RANKS_ASC.map((r, i) => [r, i]));
  const suitIndex = Object.fromEntries(SUITS.map((s, i) => [s, i]));
  return deck.slice().sort((a, b) => {
    if (suitIndex[a.suit] !== suitIndex[b.suit])
      return suitIndex[a.suit] - suitIndex[b.suit];
    return rankIndex[a.rank] - rankIndex[b.rank];
  });
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createDeck() {
  return shuffle(buildDeck());
}

export function cardValue(rank) {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

export function calcTotal(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.rank === 'A') aces++;
    total += cardValue(c.rank);
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export function isPair(hand) {
  return hand.length === 2 && hand[0].rank === hand[1].rank;
}

export function checkHandType(hand) {
  const total = calcTotal(hand);
  const blackjack =
    hand.length === 2 &&
    hand.some(c => c.rank === 'A') &&
    hand.some(c => ['10', 'J', 'Q', 'K'].includes(c.rank));
  const fiveCardCharlie = hand.length >= 5 && total <= 21;
  return { total, blackjack, fiveCardCharlie };
}

export function evaluateBlackjackHand(hand) {
  if (hand.length === 0) return { value: 0, message: 'No cards in hand.' };
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.rank === 'A') {
      aces++;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(c.rank)) {
      total += 10;
    } else {
      total += parseInt(c.rank, 10);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  if (hand.length === 2 && total === 21) return { value: total, message: 'Blackjack!' };
  if (total === 21) return { value: total, message: '21!' };
  if (total > 21) return { value: total, message: `Bust with ${total}` };
  return { value: total, message: `Hand total: ${total}` };
}

export function evaluateOutcome(hand) {
  const { total, blackjack, fiveCardCharlie } = checkHandType(hand);
  if (total > 21) return { outcome: 'loss', message: `Busted with ${total}` };
  if (blackjack) return { outcome: 'blackjack', message: 'Blackjack!' };
  if (fiveCardCharlie)
    return { outcome: 'charlie', message: `Five-Card Charlie (${total})` };
  return { outcome: null, message: '' };
}

export function evaluateVsDealer(deck, dealerTotal, playerHand) {
  const playerTotal = calcTotal(playerHand);

  let outcome = 'push';
  let message = `Push at ${playerTotal}`;
  if (playerTotal > 21) {
    outcome = 'loss';
    message = `Busted with ${playerTotal}`;
  } else if (dealerTotal > 21) {
    outcome = 'win';
    message = `Dealer busts (${dealerTotal})`;
  } else if (playerTotal > dealerTotal) {
    outcome = 'win';
    message = `Stood at ${playerTotal}`;
  } else if (playerTotal < dealerTotal) {
    outcome = 'loss';
    message = `Stood at ${playerTotal}`;
  }
  return { outcome, message, playerTotal, dealerTotal };
}

export function suitName(s) {
  switch (s) {
    case '♠':
      return 'spades';
    case '♥':
      return 'hearts';
    case '♦':
      return 'diamonds';
    case '♣':
      return 'clubs';
    default:
      return 'unknown';
  }
}

export function jitter(seed, amplitude = 1) {
  const x = Math.sin(seed * 999) * 43758.5453;
  return (x - Math.floor(x)) * 2 * amplitude - amplitude;
}

export function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function settlementReturn(bet, outcome, { multiplier = 1 } = {}) {
  if (outcome === 'blackjack') return Math.floor(bet * 2.5);
  if (outcome === 'win' || outcome === 'charlie') return bet * (1 + multiplier);
  if (outcome === 'push') return bet * multiplier;
  return 0;
}

export const btnCls =
  'rounded-xl bg-stone-200 px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm transition active:translate-y-px hover:bg-white';
export const btnAccent =
  'rounded-xl bg-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-950 shadow-sm transition active:translate-y-px hover:bg-emerald-300';
