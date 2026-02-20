export default function CardBack() {
  return (
    <div
      className="relative aspect-[5/7] select-none"
      style={{
        width: 'clamp(96px, 12vw, 128px)',
        border: '2px solid var(--tui-line-strong)',
        background: 'transparent',
      }}
      aria-label="Card back"
      role="img"
    >
      <div
        className="absolute inset-1"
        style={{
          border: '1px dashed var(--tui-line)',
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="font-mono"
          style={{
            color: 'var(--tui-muted)',
            fontSize: 'min(32px, 6vw)',
          }}
        >
          ?
        </span>
      </div>
    </div>
  );
}
