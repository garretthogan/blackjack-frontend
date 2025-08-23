export default function SuitLegend({ title, cards, color }) {
  return (
    <div className="rounded-2xl border border-stone-800/60 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${color.replace('text', 'bg')}`}
        />
        <h3 className="text-sm font-semibold tracking-wide text-stone-200">
          {title}
        </h3>
        <span className="ml-auto text-xs text-stone-400 tabular-nums">
          {cards.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {cards.map(c => (
          <span
            key={`${c.rank}-${c.suit}`}
            className="rounded-md bg-stone-900/60 px-1.5 py-0.5 text-xs text-stone-300 ring-1 ring-stone-700/60"
          >
            {c.rank}
            {c.suit}
          </span>
        ))}
      </div>
    </div>
  );
}
