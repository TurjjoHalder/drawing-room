import React from 'react';
import useSceneStore from '../hooks/useSceneStore';
import '../styles/hud.css';

export default function SceneHUD({ onAddObjects }) {
  const { saveScene, saveStatus, objects, selectedId, deleteSelected } = useSceneStore();

  const handleSave = async () => {
    try {
      await saveScene();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const saveLabel = {
    idle: 'Save Scene',
    saving: 'Saving...',
    saved: '✓ Saved!',
    error: '✗ Error',
  }[saveStatus];

  const saveBtnClass = {
    idle: 'btn-secondary',
    saving: 'btn-secondary',
    saved: 'btn-save-success',
    error: 'btn-danger',
  }[saveStatus];

  return (
    <div className="hud">
      {/* Bottom center controls */}
      <div className="hud-controls">
        <button className="btn btn-primary hud-btn" onClick={onAddObjects}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Add Objects
        </button>

        <button
          className={`btn ${saveBtnClass} hud-btn`}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <><span className="spinner" />Saving...</>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              {saveLabel}
            </>
          )}
        </button>

        {selectedId && (
          <button className="btn btn-danger hud-btn animate-in" onClick={deleteSelected}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        )}
      </div>

      {/* Object counter */}
      <div className="hud-counter">
        <span className="counter-label">Objects</span>
        <span className="counter-value">{objects.length}</span>
      </div>

      {/* Instructions */}
      <div className="hud-instructions">
        <div className="instruction-item">
          <kbd>Drag</kbd> Move objects
        </div>
        <div className="instruction-item">
          <kbd>Click</kbd> Select
        </div>
        <div className="instruction-item">
          <kbd>Orbit</kbd> Right-click drag
        </div>
        <div className="instruction-item">
          <kbd>Scroll</kbd> Zoom
        </div>
      </div>
    </div>
  );
}
