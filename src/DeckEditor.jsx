import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useDeckStore from './stores/deck';

export default function DeckEditor() {
  const navigate = useNavigate();
  const { deckId = 'standard' } = useParams();

  const {
    decks: decksById,
    ownedShopCards,
    addToLoadoutFor,
    removeFromLoadoutFor,
    setActiveDeck,
    buildAndShuffle,
    getDisplayName,
    getDisplayDesc,
    openEditor,
    setEditorField,
    saveEditor,
    cancelEditor,
    editor,
  } = useDeckStore();

  const currentDeck = decksById[deckId] || { id: deckId, loadout: [] };
  const loadoutIds = new Set(currentDeck.loadout.map(card => card.id));
  const loadoutCount = currentDeck.loadout.length;

  const name = getDisplayName(deckId);
  const desc = getDisplayDesc(deckId);
  const isEditing = editor.isOpen && editor.deckId === deckId;

  const [filterQuery, setFilterQuery] = useState('');
  const filteredOwned = useMemo(() => {
    const term = filterQuery.trim().toLowerCase();
    if (!term) return ownedShopCards;
    return ownedShopCards.filter(
      c =>
        (c.name || '').toLowerCase().includes(term) ||
        (c.desc || '').toLowerCase().includes(term)
    );
  }, [filterQuery, ownedShopCards]);

  const filteredOwnedNotInDeck = useMemo(
    () => filteredOwned.filter(c => !loadoutIds.has(c.id)),
    [filteredOwned, loadoutIds]
  );

  const handleAdd = id => addToLoadoutFor(deckId, id);
  const handleRemove = id => removeFromLoadoutFor(deckId, id);

  const handleSaveDeck = () => {
    setActiveDeck(deckId);
    buildAndShuffle(deckId);
    navigate('/deck-select');
  };

  return (
    <div style={pageWrapStyle}>
      <div style={outerCardStyle}>
        <div style={titleBarStyle}>
          <div style={{ minWidth: 0 }}>
            {isEditing ? (
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
            ) : (
              <h1 style={editorTitleStyle} title={name}>
                {name}
              </h1>
            )}
          </div>

          {!isEditing ? (
            <button style={smallBtnStyle} onClick={() => openEditor(deckId)}>
              Edit
            </button>
          ) : (
            <div style={topButtonsRowRightStyle}>
              <button style={smallBtnStyle} onClick={cancelEditor}>
                Cancel
              </button>
              <button style={smallBtnStyle} onClick={saveEditor}>
                Save
              </button>
            </div>
          )}
        </div>

        <div style={headerBarStyle}>
          <span style={pillStyle}>Loadout {loadoutCount}/10</span>
        </div>

        <div style={descRowStyle}>
          {isEditing ? (
            <>
              <textarea
                value={editor.desc}
                onChange={e => setEditorField('desc', e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') cancelEditor();
                }}
                style={descTextareaStyle}
                rows={4}
                placeholder="Description"
              />
              <div />
            </>
          ) : (
            <>
              <div style={descBoxStyle} title={desc}>
                <p style={descTextStyle}>{desc}</p>
              </div>
              <div />
            </>
          )}
        </div>

        <div style={controlBarStyle}>
          <input
            placeholder="Filter owned cards"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            style={inputStyle}
          />
          <span style={{ opacity: 0.8, fontSize: 12 }}>
            Owned: {ownedShopCards.length}
          </span>
        </div>

        <div style={columnsStyle}>
          <section style={columnStyle}>
            <h2 style={sectionTitleStyle}>Owned</h2>
            <div style={tileScrollAreaStyle}>
              <div style={tileGridStyle}>
                {filteredOwnedNotInDeck.map(card => (
                  <div key={card.id} style={tileStyle}>
                    <div style={tileHeaderStyle}>
                      <h3 style={cardTitleStyle}>{card.name}</h3>
                      <span style={tagStyle}>Owned</span>
                    </div>
                    <p style={descriptionTextStyle}>{card.desc}</p>
                    <button
                      style={actionButtonStyle}
                      onClick={() => handleAdd(card.id)}
                      disabled={loadoutCount >= 10}
                    >
                      Add
                    </button>
                  </div>
                ))}
                {filteredOwnedNotInDeck.length === 0 && (
                  <div style={{ opacity: 0.8, padding: 12 }}>
                    {ownedShopCards.length === 0
                      ? 'Buy cards in the Shop first.'
                      : filterQuery
                        ? 'No owned cards match your filter.'
                        : 'All owned cards are already in this deck.'}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section style={columnStyle}>
            <h2 style={sectionTitleStyle}>Current Loadout</h2>
            <div style={tileScrollAreaStyle}>
              <div style={tileGridStyle}>
                {currentDeck.loadout.map(card => (
                  <div key={card.id} style={tileStyle}>
                    <div style={tileHeaderStyle}>
                      <h3 style={cardTitleStyle}>{card.name}</h3>
                      <span style={tagStyle}>In Deck</span>
                    </div>
                    <p style={descriptionTextStyle}>{card.desc}</p>
                    <button
                      style={actionButtonStyle}
                      onClick={() => handleRemove(card.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {currentDeck.loadout.length === 0 && (
                  <div style={{ opacity: 0.8, padding: 12 }}>No cards added yet.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div style={footerBarStyle}>
          <div style={footerRightGroupStyle}>
            <button
              style={footerRightButtonStyle}
              onClick={() => navigate('/deck-select')}
            >
              Back
            </button>
            <button
              style={footerRightButtonStyle}
              onClick={handleSaveDeck}
              disabled={loadoutCount === 0}
            >
              Save Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TILE_H = 180;
const TILE_GAP = 10;
const VISIBLE = 3;
const LIST_H = TILE_H * VISIBLE + TILE_GAP * (VISIBLE - 1);

const pageWrapStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  color: '#eee',
  fontFamily: 'sans-serif',
};

const outerCardStyle = {
  width: 'min(1000px, 96vw)',
  border: '1px solid',
  borderRadius: 16,
  padding: 24,
  display: 'grid',
  gap: 12,
  gridTemplateRows: 'auto auto auto auto auto 1fr auto',
  boxSizing: 'border-box',
};

const editorTitleStyle = { margin: 0, fontSize: 28 };

const titleBarStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: 8,
};

const headerBarStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const pillStyle = {
  padding: '6px 10px',
  border: '1px solid',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const descRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'start',
  gap: 8,
};

const descBoxStyle = {
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 10,
  padding: '10px 12px',
  height: 96,
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

const topButtonsRowRightStyle = {
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
};

const controlBarStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const inputStyle = {
  flex: '1 1 260px',
  minWidth: 220,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
};

const columnsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  alignItems: 'start',
};

const columnStyle = {
  border: '1px dashed #333',
  borderRadius: 12,
  padding: 12,
  display: 'grid',
  gridTemplateRows: 'auto auto',
  boxSizing: 'border-box',
};

const sectionTitleStyle = { margin: '4px 0 8px', fontSize: 18 };

const tileScrollAreaStyle = { height: LIST_H, maxHeight: LIST_H, overflowY: 'auto' };

const tileGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: TILE_GAP,
  alignContent: 'start',
  paddingRight: 4,
};

const tileStyle = {
  border: '1px solid',
  borderRadius: 12,
  padding: 12,
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  height: TILE_H,
  gap: 6,
  boxSizing: 'border-box',
};

const tileHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
};

const cardTitleStyle = { margin: 0, fontSize: 16 };

const tagStyle = { opacity: 0.9, fontSize: 12, alignSelf: 'flex-start' };

const descriptionTextStyle = {
  margin: 0,
  opacity: 0.85,
  fontSize: 14,
  overflow: 'hidden',
};

const actionButtonStyle = {
  height: 60,
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
  cursor: 'pointer',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const footerBarStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: 8,
};

const footerRightGroupStyle = {
  display: 'flex',
  gap: 10,
};

const footerLeftButtonStyle = {
  height: 60,
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
  cursor: 'pointer',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const footerRightButtonStyle = {
  height: 60,
  borderRadius: 10,
  border: '1px solid',
  color: '#eee',
  cursor: 'pointer',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const renameInputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#eee',
  background: 'transparent',
  fontSize: 20,
  boxSizing: 'border-box',
};

const descTextareaStyle = {
  width: '100%',
  height: 96,
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
  border: '1px solid',
  color: '#eee',
  cursor: 'pointer',
  width: 'fit-content',
  minWidth: 112,
};
