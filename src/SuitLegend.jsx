export default function SuitLegend({ title, cards, color }) {
  const isRed = color?.includes('red');
  const textColor = isRed ? 'var(--tui-danger)' : 'var(--tui-fg)';

  return (
    <div
      style={{
        border: '1px solid var(--tui-line)',
        padding: 'var(--tui-pad-2)',
      }}
    >
      <div
        style={{
          marginBottom: 'var(--tui-gap)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--tui-gap)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            height: 8,
            width: 8,
            background: textColor,
          }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--tui-font-size-sm)',
            fontWeight: 600,
            color: 'var(--tui-fg)',
          }}
        >
          {title}
        </h3>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 'var(--tui-font-size-sm)',
            color: 'var(--tui-muted)',
          }}
        >
          {cards.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tui-gap-sm)' }}>
        {cards.map(c => (
          <span
            key={`${c.rank}-${c.suit}`}
            style={{
              padding: '2px 6px',
              fontSize: 'var(--tui-font-size-sm)',
              color: textColor,
              border: '1px solid var(--tui-line)',
            }}
          >
            {c.rank}
            {c.suit}
          </span>
        ))}
      </div>
    </div>
  );
}
