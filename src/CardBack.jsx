export default function CardBack() {
  return (
    <div
      className="relative aspect-[5/7] select-none rounded-2xl ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
      style={{ width: 'clamp(96px, 12vw, 128px)' }}
      aria-label="Card back"
      role="img"
    >
      <div className="absolute inset-0 rounded-2xl bg-white" />
      <div className="absolute inset-1 rounded-xl bg-emerald-900" />
      <div className="absolute inset-2 overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,_rgba(255,255,255,0.08),_transparent)]" />
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm tracking-wider text-white/90">
          ★
        </div>
      </div>
    </div>
  );
}
