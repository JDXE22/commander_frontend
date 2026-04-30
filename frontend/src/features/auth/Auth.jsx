import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import { loginUser, registerUser, forgotPassword, resetPassword } from './api/apiAuth';
import { sileo } from 'sileo';
import './Auth.css';

const GOOGLE_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/auth/google`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [authMode, setAuthMode] = useState('login'); 
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    const tokenParam = queryParams.get('token');
    const errorParam = queryParams.get('error');

    if (errorParam === 'oauth_failed') {
      sileo.error({
        title: 'Google sign-in failed',
        description: 'Something went wrong with Google authentication. Please try again.',
        fill: '#ef4444',
      });
    }

    if (modeParam === 'register') {
      setAuthMode('register');
    } else if (modeParam === 'reset' || tokenParam) {
      setAuthMode('reset');
      if (tokenParam) setRecoveryToken(tokenParam);
    } else if (modeParam === 'forgot') {
      setAuthMode('forgot');
    } else {
      setAuthMode('login');
    }
  }, [location]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let authResponse;
      if (authMode === 'login') {
        authResponse = await loginUser(emailInput, passwordInput);
      } else if (authMode === 'register') {
        authResponse = await registerUser(emailInput, passwordInput);
      } else if (authMode === 'forgot') {
        authResponse = await forgotPassword(emailInput);
      } else if (authMode === 'reset') {
        if (passwordInput !== confirmPasswordInput) {
          sileo.error({ title: 'Passwords don\'t match', description: 'Re-enter your new password in both fields.', fill: '#ef4444' });
          setIsSubmitting(false);
          return;
        }
        if (!recoveryToken) {
          sileo.error({ title: 'Link expired', description: 'This reset link is no longer valid. Request a new one.', fill: '#ef4444' });
          setIsSubmitting(false);
          return;
        }
        authResponse = await resetPassword(recoveryToken, passwordInput);
      }

      if (authResponse.error) {
        sileo.error({ title: 'Couldn\'t sign you in', description: authResponse.message, fill: '#ef4444' });
      } else {
        if (authMode === 'forgot') {
          sileo.success({ 
            title: 'Reset Link Sent!', 
            description: 'Check your email to recover your password.',
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
        } else if (authMode === 'reset') {
          sileo.success({ 
            title: 'Password updated',
            description: 'Taking you to sign in...',
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
          setTimeout(() => {
            navigate('/auth?mode=login');
            setAuthMode('login');
          }, 3000);
        } else {
          login(authResponse);
          sileo.success({ 
            title: 'Welcome Back!', 
            description: 'Redirecting to terminal...', 
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
          navigate('/terminal');
        }
      }
    } catch (error) {
      sileo.error({ title: 'Something went wrong', description: 'Try again in a moment. If this keeps happening, refresh the page.', fill: '#ef4444' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const isForgotPasswordMode = authMode === 'forgot';
  const isResetPasswordMode = authMode === 'reset';

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

          {!isForgotPasswordMode && !isResetPasswordMode && (
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
                type="button"
              >
                Sign up
              </button>
            </div>
          )}

          {!isForgotPasswordMode && !isResetPasswordMode && (
            <>
              <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="auth-divider">
                <span className="auth-divider-line" />
                <span className="auth-divider-text">or</span>
                <span className="auth-divider-line" />
              </div>
            </>
          )}

          {isForgotPasswordMode && (
            <div className="auth-header-special">
              <h2 className="auth-title-special">Recover Password</h2>
              <p className="auth-subtitle-special">We'll send you a link to get back into your account</p>
            </div>
          )}

          {isResetPasswordMode && (
            <div className="auth-header-special">
              <h2 className="auth-title-special">Set new password</h2>
              <p className="auth-subtitle-special">Choose a new password for your account</p>
            </div>
          )}

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {!isResetPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-box">
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="auth-input" 
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {!isForgotPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">{isResetPasswordMode ? 'New Password' : 'Password'}</label>
                <div className="auth-input-box">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="auth-input" 
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    required
                  />
                </div>
                {authMode === 'login' && (
                  <div className="forgot-pass-container">
                    <span className="forgot-pass" onClick={() => setAuthMode('forgot')}>
                      Forgot password?
                    </span>
                  </div>
                )}
              </div>
            )}

            {isResetPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">Confirm New Password</label>
                <div className="auth-input-box">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="auth-input" 
                    value={confirmPasswordInput}
                    onChange={(event) => setConfirmPasswordInput(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
              {isSubmitting 
                ? 'Processing...' 
                : isForgotPasswordMode 
                  ? 'Send reset link'
                  : isResetPasswordMode
                    ? 'Set new password'
                    : authMode === 'login' 
                      ? 'Continue' 
                      : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            {isForgotPasswordMode || isResetPasswordMode ? (
              <span className="auth-link" onClick={() => {
                setAuthMode('login');
                navigate('/auth?mode=login');
              }}>
                Back to Sign in
              </span>
            ) : (
              <>
                {authMode === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <span className="auth-link" onClick={() => {
                  const nextMode = authMode === 'login' ? 'register' : 'login';
                  setAuthMode(nextMode);
                  navigate(`/auth?mode=${nextMode}`);
                }}>
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
