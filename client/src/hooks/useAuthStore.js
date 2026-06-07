import { create } from 'zustand';

const API = '/api';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Check current session
  checkAuth: async () => {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  signup: async (username, email, password) => {
    set({ error: null });
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    set({ user: data.user });
    return data;
  },

  login: async (email, password) => {
    set({ error: null });
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    set({ user: data.user });
    return data;
  },

  logout: async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    set({ user: null });
  },
}));

export default useAuthStore;
