import React, { useState } from 'react';
import useSceneStore from '../hooks/useSceneStore';
import '../styles/dialog.css';

const OBJECT_TYPES = [
  {
    id: 'cube',
    label: 'Cube',
    description: 'Basic geometric cube',
    icon: '⬛',
    color: '#4f9eff',
  },
  {
    id: 'sphere',
    label: 'Sphere',
    description: 'Smooth sphere object',
    icon: '🔵',
    color: '#f59e0b',
  },
  {
    id: 'cylinder',
    label: 'Cylinder',
    description: 'Cylindrical shape',
    icon: '🔷',
    color: '#10b981',
  },
  {
    id: 'torus',
    label: 'Torus',
    description: 'Donut-shaped ring',
    icon: '💿',
    color: '#ec4899',
  },
  {
    id: 'cone',
    label: 'Cone',
    description: 'Pointed cone shape',
    icon: '🔺',
    color: '#8b5cf6',
  },
  
];

export default function AddObjectDialog({ onClose }) {
  const [selected, setSelected] = useState('cube');
  const { addObject } = useSceneStore();

  const handleAdd = () => {
    addObject(selected);
    onClose();
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="dialog-backdrop" onClick={handleBackdrop}>
      <div className="dialog animate-in" role="dialog" aria-modal="true" aria-label="Add Object">
        {/* Header */}
        <div className="dialog-header">
          <div>
            <h2 className="dialog-title">Add Object</h2>
            <p className="dialog-subtitle">Select a shape or model to place in the scene</p>
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Object grid */}
        <div className="dialog-body">
          <div className="object-grid">
            {OBJECT_TYPES.map(obj => (
              <label key={obj.id} className={`object-card ${selected === obj.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="objectType"
                  value={obj.id}
                  checked={selected === obj.id}
                  onChange={() => setSelected(obj.id)}
                />
                <div className="object-icon" style={{ '--obj-color': obj.color }}>
                  {obj.icon}
                </div>
                <div className="object-info">
                  <span className="object-label">{obj.label}</span>
                  <span className="object-desc">{obj.description}</span>
                </div>
                {obj.isGltf && <span className="gltf-badge">GLTF</span>}
                <div className="selected-indicator" />
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            Add to Scene
          </button>
        </div>
      </div>
    </div>
  );
}
