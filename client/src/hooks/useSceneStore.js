import { create } from 'zustand';

const API = import.meta.env.VITE_API_URL || 'https://drawing-room.onrender.com/api';

// Generate random position within room bounds
const randomPos = () => ({
  x: (Math.random() - 0.5) * 8,
  y: 0.5,
  z: (Math.random() - 0.5) * 8,
});

// Object type default colors
const TYPE_COLORS = {
  cube: '#4f9eff',
  sphere: '#f59e0b',
  cylinder: '#10b981',
  torus: '#ec4899',
  cone: '#8b5cf6',
  
};

const useSceneStore = create((set, get) => ({
  objects: [],
  selectedId: null,
  isDragging: false,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'error'
  loadStatus: 'idle',

  // Add object to scene
  addObject: (type) => {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const obj = {
      id,
      type,
      position: randomPos(),
      rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: TYPE_COLORS[type] || '#4f9eff',
    };
    set(state => ({ objects: [...state.objects, obj] }));
    return id;
  },

  // Update object position
  updatePosition: (id, position) => {
    set(state => ({
      objects: state.objects.map(obj =>
        obj.id === id ? { ...obj, position } : obj
      ),
    }));
  },

  // Update object scale (for drag effect)
  updateScale: (id, scale) => {
    set(state => ({
      objects: state.objects.map(obj =>
        obj.id === id ? { ...obj, scale } : obj
      ),
    }));
  },

  // Select / deselect
  selectObject: (id) => set({ selectedId: id }),
  deselectAll: () => set({ selectedId: null }),

  // Delete selected
  deleteSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    set(state => ({
      objects: state.objects.filter(o => o.id !== selectedId),
      selectedId: null,
    }));
  },

  // Set dragging state
  setDragging: (val) => set({ isDragging: val }),

  // Save scene to MongoDB
  saveScene: async () => {
    set({ saveStatus: 'saving' });
    try {
      const { objects } = get();
      const res = await fetch(`${API}/scene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ objects }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }
      set({ saveStatus: 'saved' });
      setTimeout(() => set({ saveStatus: 'idle' }), 2500);
    } catch (err) {
      set({ saveStatus: 'error' });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
      throw err;
    }
  },

  // Load scene from MongoDB
  loadScene: async () => {
    set({ loadStatus: 'loading' });
    try {
      const res = await fetch(`${API}/scene`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load scene');
      const data = await res.json();
      set({ objects: data.objects || [], loadStatus: 'loaded' });
    } catch (err) {
      set({ loadStatus: 'error' });
      console.error('Load scene error:', err);
    }
  },

  // Clear scene
  clearScene: () => set({ objects: [], selectedId: null }),
}));

export default useSceneStore;
