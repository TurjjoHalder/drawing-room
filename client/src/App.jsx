import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './hooks/useAuthStore';
import AuthPage from './pages/AuthPage';
import ScenePage from './pages/ScenePage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-void)', gap: '16px',
    }}>
      <div style={{
        width: 48, height: 48, border: '2px solid var(--border-subtle)',
        borderTop: '2px solid var(--accent-primary)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        INITIALIZING...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/scene" element={
        <ProtectedRoute>
          <ScenePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/scene" replace />} />
    </Routes>
  );
}
