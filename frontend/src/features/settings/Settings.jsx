import { useState } from 'react';
import { useAuth } from '../../shared/context';
import { forgotPassword } from '../auth/api/apiAuth';
import { sileo } from 'sileo';
import './Settings.css';

export const Settings = () => {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const handleResetPassword = async () => {
    if (isSending || !user?.email) return;

    setIsSending(true);
    try {
      const result = await forgotPassword(user.email);
      if (result?.error) {
        sileo.error({
          title: 'Request failed',
          description: result.message,
          fill: '#ef4444',
          styles: {
            title: 'sileo-text-white',
            description: 'sileo-text-white',
            badge: 'sileo-badge-fill sileo-badge-fix',
          },
        });
      } else {
        setHasSent(true);
        sileo.success({
          title: 'Reset link sent',
          description: 'Check your email to set a new password.',
          fill: '#171717',
          styles: {
            description: 'sileo-text-white',
            badge: 'sileo-badge-fix',
          },
        });
      }
    } catch {
      sileo.error({
        title: 'Something went wrong',
        description: 'Try again in a moment.',
        fill: '#ef4444',
        styles: {
          title: 'sileo-text-white',
          description: 'sileo-text-white',
          badge: 'sileo-badge-fill sileo-badge-fix',
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className='main-content'>
      <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'red', color: 'white', padding: '20px', zIndex: 999999, fontSize: '24px' }}>
        IF YOU CAN READ THIS, SETTINGS IS MOUNTED
      </div>
      <div className='page-container settings-container'>
        <div className='settings-header'>
          <h1 className='settings-title'>Settings</h1>
          <p className='settings-subtitle'>Manage your account preferences</p>
        </div>

        <section className='settings-section' aria-labelledby='security-heading'>
          <div className='section-header'>
            <svg
              className='section-icon'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'>
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
            <h2 id='security-heading' className='section-title'>Security</h2>
          </div>

          <div className='settings-card'>
            <div className='setting-row'>
              <div className='setting-info'>
                <span className='setting-label'>Password</span>
                <span className='setting-description'>
                  Send a reset link to <strong>{user?.email}</strong> to set a new password.
                </span>
              </div>
              <button
                className='btn-reset-password'
                onClick={handleResetPassword}
                disabled={isSending || hasSent}
                aria-label='Send password reset link to your email'>
                {isSending ? (
                  <span className='btn-loading'>
                    <span className='spinner' aria-hidden='true' />
                    Sending…
                  </span>
                ) : hasSent ? (
                  <span className='btn-sent'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      aria-hidden='true'>
                      <polyline points='20 6 9 17 4 12' />
                    </svg>
                    Link sent
                  </span>
                ) : (
                  'Reset password'
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
