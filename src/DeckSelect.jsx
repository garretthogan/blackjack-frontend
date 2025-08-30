import { useState } from 'react';
import { useNavigate } from 'react-router';
import useDeckStore from './stores/deck';

export default function DeckSelect() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const decksById = useDeckStore(s => s.decks);
  const ownedShopCards = useDeckStore(s => s.ownedShopCards);
  const deckExists = useDeckStore(s => s.deckExists);
  const getDisplayName = useDeckStore(s => s.getDisplayName);
  const getDisplayDesc = useDeckStore(s => s.getDisplayDesc);

  const openEditor = useDeckStore(s => s.openEditor);
  const setEditorField = useDeckStore(s => s.setEditorField);
  const saveEditor = useDeckStore(s => s.saveEditor);
  const cancelEditor = useDeckStore(s => s.cancelEditor);
  const editor = useDeckStore(s => s.editor);

  const handleSelect = () => navigate('/run-hub');
  const goEdit = id => navigate(`/deck-edit/${encodeURIComponent(id)}`);

  const deckSlots = ['standard', 'custom-1', 'custom-2'];

  return (
    <div style={containerStyle}>
      <div style={outerCardStyle}>
        <div style={headerRowStyle}>
          <h1 style={titleStyle}>Choose Your Deck</h1>
          <button style={navButtonStyle} onClick={() => navigate('/shop')}>
            Shop
          </button>
        </div>

        <div style={ownedBarStyle}>
          <span style={pillStyle}>Owned Cards: {ownedShopCards.length}</span>
          <div style={ownedPreviewRowStyle}>
            {ownedShopCards.slice(0, 12).map(card => (
              <span key={card.id} style={ownedPillStyle} title={card.name}>
                {card.name}
              </span>
            ))}
            {ownedShopCards.length > 12 && (
              <span style={ownedMoreStyle}>+{ownedShopCards.length - 12} more</span>
            )}
          </div>
        </div>

        <div style={deckGridStyle}>
          {deckSlots.map(slotId => {
            const exists = deckExists(slotId);
            const name = getDisplayName(slotId);
            const desc = getDisplayDesc(slotId);
            const isHovered = hoveredId === slotId;
            const isEditing = editor.isOpen && editor.deckId === slotId;

            return (
              <div key={slotId} style={tileWrapStyle}>
                <div
                  style={{ ...deckCardStyle, cursor: isEditing ? 'default' : 'pointer' }}
                  onMouseEnter={() => setHoveredId(slotId)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (isEditing) return;
                    if (exists) goEdit(slotId);
                    else openEditor(slotId);
                  }}
                >
                  {!isEditing ? (
                    <div style={cardInnerStyle}>
                      <div style={titleRowStyle}>
                        <h2 style={deckTitleStyle} title={name}>
                          {name}
                        </h2>
                      </div>

                      <div style={descRowStyle}>
                        <div style={descBoxStyle} title={exists ? desc : 'Empty slot'}>
                          <p style={descTextStyle}>{exists ? desc : 'Empty slot'}</p>
                        </div>
                        <div />
                      </div>

                      <div style={metricsRowStyle}>
                        <span style={metricPillStyle}>
                          Loadout: {decksById[slotId]?.loadout?.length || 0}/10
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={cardInnerStyle}>
                      <div style={titleRowStyle}>
                        <input
                          value={editor.name}
                          onChange={e => setEditorField('name', e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditor();
                            if (e.key === 'Escape') cancelEditor();
                          }}
                          autoFocus
                          style={renameInputStyle}
                          placeholder="Deck name"
                        />
                      </div>
                      <div style={descRowStyle}>
                        <textarea
                          value={editor.desc}
                          onChange={e => setEditorField('desc', e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Escape') cancelEditor();
                          }}
                          style={descTextareaStyle}
                          rows={5}
                          placeholder="Description"
                        />
                        <div />
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div
                      style={{
                        ...hoverOverlayStyle,
                        opacity: isHovered ? 1 : 0,
                      }}
                    >
                      <div style={hoverOverlayShadeStyle} />
                      <div style={hoverOverlayTextStyle}>
                        {exists ? 'EDIT' : 'CREATE'}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div style={tileButtonsRowRightStyle}>
                    <button style={smallBtnStyle} onClick={cancelEditor}>
                      Cancel
                    </button>
                    <button style={smallBtnStyle} onClick={saveEditor}>
                      Save
                    </button>
                  </div>
                ) : (
                  exists && (
                    <div style={singleButtonRowStyle}>
                      <button style={selectButtonStyle} onClick={handleSelect}>
                        Select Deck
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div style={footerBarStyle}>
          <div style={rightButtonGroupStyle}>
            <button style={navButtonStyle} onClick={() => navigate('/')}>
              Back to Menu
            </button>
            <button style={navButtonStyle} onClick={() => navigate('/run-hub')}>
              Run Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DESC_HEIGHT = 96;

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#eee',
  padding: 24,
  fontFamily: 'sans-serif',
};

const outerCardStyle = {
  width: 'min(1000px, 96vw)',
  border: '1px solid',
  borderRadius: 16,
  padding: 24,
};

const headerRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  marginBottom: 8,
};

const titleStyle = { margin: 0, fontSize: 28 };

const ownedBarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 16,
};

const pillStyle = {
  padding: '6px 10px',
  border: '1px solid ',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  alignSelf: 'flex-start',
};

const ownedPreviewRowStyle = { display: 'flex', flexWrap: 'wrap', gap: 6 };

const ownedPillStyle = {
  padding: '4px 8px',
  border: '1px solid ',
  borderRadius: 999,
  fontSize: 12,
  opacity: 0.9,
  maxWidth: 160,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const ownedMoreStyle = { padding: '4px 8px', fontSize: 12, opacity: 0.8 };

const deckGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 16,
  width: '100%',
  marginBottom: 16,
};

const tileWrapStyle = { display: 'grid', gridTemplateRows: '1fr auto', minHeight: 360 };

const deckCardStyle = {
  position: 'relative',
  border: '1px solid ',
  borderRadius: 12,
  padding: 16,
  textAlign: 'left',
  color: '#eee',
  height: 300,
  overflow: 'hidden',
  transition: 'filter .4s ease',
};

const cardInnerStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateRows: 'auto auto 1fr',
  alignContent: 'start',
  height: '100%',
};

const titleRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: 8,
  minHeight: 36,
};

const descRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'start',
  gap: 8,
  minHeight: DESC_HEIGHT,
};

const deckTitleStyle = {
  margin: 0,
  fontSize: 18,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const descBoxStyle = {
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 10,
  padding: '10px 12px',
  height: DESC_HEIGHT,
  boxSizing: 'border-box',
  overflowY: 'auto',
  background: 'transparent',
};

const descTextStyle = {
  margin: 0,
  fontSize: 14,
  opacity: 0.9,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.3,
};

const metricsRowStyle = { display: 'flex', gap: 8, marginTop: 'auto' };

const metricPillStyle = {
  padding: '4px 8px',
  border: '1px solid ',
  borderRadius: 999,
  fontSize: 12,
};

const tileButtonsRowRightStyle = {
  display: 'flex',
  gap: 8,
  marginTop: 8,
  justifyContent: 'flex-end',
};

const singleButtonRowStyle = { display: 'grid', marginTop: 8 };

const selectButtonStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
  width: '100%',
  minWidth: 112,
};

const footerBarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 27,
};

const rightButtonGroupStyle = { display: 'flex', gap: 10 };

const navButtonStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
  minWidth: 96,
};

const hoverOverlayStyle = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  transition: 'opacity .4s ease',
  pointerEvents: 'none',
};

const hoverOverlayShadeStyle = {
  position: 'absolute',
  inset: 0,
  borderRadius: 12,
  background: 'rgba(0,0,0,0.45)',
};

const hoverOverlayTextStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: 1,
};

const renameInputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#eee',
  background: 'transparent',
  fontSize: 16,
  boxSizing: 'border-box',
};

const descTextareaStyle = {
  width: '100%',
  height: DESC_HEIGHT,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#eee',
  background: 'transparent',
  fontSize: 14,
  resize: 'none',
  boxSizing: 'border-box',
  lineHeight: 1.3,
};

const smallBtnStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid ',
  color: '#eee',
  cursor: 'pointer',
  width: 'fit-content',
  minWidth: 112,
};
