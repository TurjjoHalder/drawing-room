import React, { useState, useEffect, useRef } from 'react';
import useSceneStore from '../hooks/useSceneStore';
import '../styles/panel.css';

const OBJECT_TYPES = [
  { id: 'cube',     label: 'Cube' },
  { id: 'sphere',   label: 'Sphere' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'torus',    label: 'Torus' },
  { id: 'cone',     label: 'Cone' },
  
];

export default function AddObjectPanel({ onClose }) {
  const [selected, setSelected] = useState('cube');
  const { addObject } = useSceneStore();
  const panelRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // only close if not clicking the "Add Object" button itself
        if (!e.target.closest('.add-btn')) onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleAdd = () => {
    addObject(selected);
    onClose();
  };

  return (
    <div className="add-panel" ref={panelRef}>
      <p className="panel-title">Add Object</p>

      <div className="panel-options">
        {OBJECT_TYPES.map(obj => (
          <label key={obj.id} className="panel-option">
            <input
              type="radio"
              name="objType"
              value={obj.id}
              checked={selected === obj.id}
              onChange={() => setSelected(obj.id)}
            />
            <span className={`radio-dot ${selected === obj.id ? 'checked' : ''}`} />
            {obj.label}
          </label>
        ))}
      </div>

      <button className="panel-add-btn" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}
