import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';
import useSceneStore from '../hooks/useSceneStore';
import SceneCanvas from '../components/SceneCanvas';
import AddObjectPanel from '../components/AddObjectPanel';
import '../styles/scene.css';

export default function ScenePage() {
  const { user, logout } = useAuthStore();
  const { loadScene, loadStatus, saveScene, saveStatus, selectedId, deleteSelected } = useSceneStore();
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadScene();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleSave = async () => {
    try { await saveScene(); } catch (e) { console.error(e); }
  };

  const saveLabel = { idle: 'Save', saving: 'Saving…', saved: '✓ Saved', error: '✗ Error' }[saveStatus];

  return (
    <div className="scene-page">
      {/* Room background image */}
      <div className="room-bg" />

      {/* Three.js canvas overlaid on top */}
      <div className="canvas-layer">
        <SceneCanvas />
      </div>

      {/* ── TOP-LEFT: Save button ── */}
      <button
        className={`corner-btn save-btn ${saveStatus === 'saved' ? 'saved' : ''} ${saveStatus === 'error' ? 'errored' : ''}`}
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        style={{ top: 18, left: 18 }}
      >
        {saveStatus === 'saving' ? <span className="btn-spinner" /> : null}
        {saveLabel}
        <span className="btn-arrow">▶</span>
      </button>

      {/* ── TOP-RIGHT: Add Object button + inline panel ── */}
      <div className="add-object-wrapper" style={{ top: 18, right: 100 }}>
        <button
          className="corner-btn add-btn"
          onClick={() => setShowPanel(p => !p)}
        >
          Add Object
        </button>

        {showPanel && (
          <AddObjectPanel onClose={() => setShowPanel(false)} />
        )}
      </div>

      {/* ── Delete button appears when object selected ── */}
      {selectedId && (
        <button
          className="corner-btn delete-btn animate-in"
          onClick={deleteSelected}
          style={{ top: 18, left: '50%', transform: 'translateX(-50%)' }}
        >
          ✕ Delete Selected
        </button>
      )}

      {/* ── Top bar: username + logout ── */}
      <div className="scene-topbar">
        <span className="topbar-user">● {user?.username}</span>
        <button className="topbar-logout" onClick={handleLogout}>Exit</button>
      </div>

      {/* ── Loading overlay ── */}
      {loadStatus === 'loading' && (
        <div className="load-overlay">
          <div className="load-spinner" />
          <p>Loading scene…</p>
        </div>
      )}
    </div>
  );
}
