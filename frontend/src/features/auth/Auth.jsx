import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import './Auth.css';

export const Auth = () => {
  const location = useLocation();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    if (m === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
  }, [location]);

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <Link to="/" className="back-btn">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </Link>

        <div className="auth-card">
          <div className="auth-logo">
            <img src={buddyLogo} alt="Commander Logo" className="logo-icon-img" />
            <span className="logo-text-small">Commander</span>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-box">
                <input type="email" placeholder="name@example.com" className="auth-input" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-box">
                <input type="password" placeholder="••••••••" className="auth-input" />
              </div>
              {mode === 'login' && (
                <div className="forgot-pass-container">
                  <span className="forgot-pass">Forgot password?</span>
                </div>
              )}
            </div>

            <Link to="/" className="btn-auth-submit">
              {mode === 'login' ? 'Continue' : 'Create Account'}
            </Link>
          </form>

          <p className="auth-footer">
            {mode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <span className="auth-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
