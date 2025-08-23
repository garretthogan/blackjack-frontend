import { btnAccent, btnCls } from './helpers';

export default function Controls({ drawOne, resetDeck, disabled }) {
  return (
    <div>
      <div className="px-2" style={{ display: 'inline-block' }}>
        <button
          onClick={drawOne}
          className={btnAccent}
          disabled={disabled}
        >
          Hit (Draw)
        </button>
      </div>

      <div className="px-2" style={{ display: 'inline-block' }}>
        <button onClick={resetDeck} className={btnCls}>
          Reset Deck
        </button>
      </div>
    </div>
  );
}
