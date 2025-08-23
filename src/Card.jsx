import { suitName } from "./helpers";

export default function Card({ card }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className="group relative aspect-[5/7] select-none rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
      style={{ width: "clamp(96px, 12vw, 128px)" }}
      role="img"
      aria-label={`${card.rank} of ${suitName(card.suit)}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_10%,_rgba(255,255,255,0.95),_rgba(235,235,235,0.9))]" />
      <div className="absolute left-2 top-2 text-[min(20px,4.2vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
        <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
      </div>
      <div className="absolute bottom-2 right-2 rotate-180 text-[min(20px,4.2vw)] leading-none">
        <span className={`block font-bold ${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.rank}</span>
        <span className={`${isRed ? 'text-red-600' : 'text-stone-900'}`}>{card.suit}</span>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span className={`${isRed ? 'text-red-500' : 'text-stone-700'} opacity-80`} style={{ fontSize: 'min(64px, 12vw)' }}>
          {card.suit}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}