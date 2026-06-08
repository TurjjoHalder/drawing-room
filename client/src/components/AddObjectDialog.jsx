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


    addObject(selected);
   




  return (
    <div className="dialog-backdrop" onClick={handleBackdrop}>
      <div className="dialog animate-in" role="dialog" aria-modal="true" aria-label="Add Object">
      </div>
    </div>
  );
}
