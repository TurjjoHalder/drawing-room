import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';
import '../styles/auth.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && !formData.username.trim()) errs.username = 'Username required';
    if (mode === 'signup' && formData.username.length < 3) errs.username = 'At least 3 characters';
    if (!formData.email.trim()) errs.email = 'Email required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password required';
    if (formData.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.username, formData.email, formData.password);
      }
      navigate('/scene');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setErrors({});
    setApiError('');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      {/* Background grid */}
      <div className="auth-grid" aria-hidden="true" />
      <div className="auth-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="auth-container animate-in">
        {/* Logo */}
        <div className="auth-logo">
        
          <h1 className="logo-title">Scene Studio</h1>
          
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Create Account
          </button>
          <div className={`auth-tab-indicator ${mode === 'signup' ? 'right' : ''}`} />
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="alert alert-error animate-in">{apiError}</div>
          )}

          {mode === 'signup' && (
            <div className="form-group animate-in">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className={`input-field ${errors.username ? 'error' : ''}`}
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`input-field ${errors.password ? 'error' : ''}`}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter password'}
              value={formData.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Enter Scene' : 'Create & Enter'
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="auth-hint">
          {mode === 'login' ? (
            <>Don't have an account? <button className="link-btn" onClick={switchMode}>Sign up</button></>
          ) : (
            <>Already have an account? <button className="link-btn" onClick={switchMode}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
