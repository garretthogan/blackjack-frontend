import React, { useMemo, useState, useEffect } from 'react'
import DeckOfCards from './Deck'
import BlackjackHand from './BlackjackHand'

export default function App() {

  const [count, setCount] = useState(7)
  const [cards, setCards] = useState(() => deal(count))

  function redeal(n = count) {
    setCards(deal(n))
  }

  useEffect(() => {
    setCards(prev => (prev.length === count ? prev : deal(count)))
  }, [count])

  return (
    // <div className="min-h-screen w-full bg-gradient-to-b from-emerald-900 via-emerald-950 to-black text-emerald-50 antialiased">
    //   <div className="mx-auto max-w-5xl px-4 pt-10">
    <BlackjackHand />
    //   </div>
    // </div>
  )
}

function Hand({ cards }) {
  const n = cards.length
  const spread = useMemo(() => {
    if (n <= 1) return 0
    return Math.min(100, 14 * (n - 1))
  }, [n])

  const radiusPx = useMemo(() => {
    const vh = Math.max(480, typeof window !== 'undefined' ? window.innerHeight : 800)
    return Math.round(Math.min(0.42 * vh, 360))
  }, [n])

  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="relative mb-4 h-[90%] w-full">
        {cards.map((card, i) => {
          const angle = n === 1 ? 0 : -spread / 2 + (spread * i) / (n - 1)
          const z = 100 + i
          return (
            <div
              key={card.id}
              className="group absolute bottom-1 left-1/2 origin-bottom transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radiusPx}px)`,
                zIndex: z,
              }}
            >
              <div
                className="relative select-none rounded-2xl bg-white shadow-[0_6px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                style={{
                  transform: `rotate(${-angle}deg)`,
                  width: cardSize.width,
                  height: cardSize.height,
                }}
                aria-label={`${card.rank} of ${suitName(card.suit)}`}
                role="img"
              >
                <CardFace card={card} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CardFace({ card }) {
  const isRed = card.suit === '♥' || card.suit === '♦'
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_10%,_rgba(255,255,255,0.9),_rgba(230,230,230,0.9))]" />

      <div className="absolute left-2 top-2 text-[min(22px,4.4vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
        <span className={`-mt-1 block ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
      </div>

      <div className="absolute bottom-2 right-2 rotate-180 text-[min(22px,4.4vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
        <span className={`-mt-1 block ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <span className={`${isRed ? 'text-red-500' : 'text-stone-700'} opacity-80`} style={{ fontSize: 'min(80px,16vw)' }}>
          {card.suit}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  )
}

const cardSize = {
  width: 'clamp(84px, 12vw, 120px)',
  height: 'clamp(120px, 18vw, 168px)',
}

const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS = ['♠', '♥', '♦', '♣']

function buildDeck() {
  const deck = []
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ id: `${r}${s}`, rank: r, suit: s })
    }
  }
  return deck
}

function deal(n) {
  const deck = shuffle(buildDeck())
  return deck.slice(0, Math.max(1, Math.min(n, deck.length)))
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function suitName(s) {
  switch (s) {
    case '♠': return 'spades'
    case '♥': return 'hearts'
    case '♦': return 'diamonds'
    case '♣': return 'clubs'
    default: return 'unknown'
  }
}
