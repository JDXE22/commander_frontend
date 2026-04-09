import { useState } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleUserClick = () => {
    closeSidebar();
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/');
  };

  const displayName = user?.email?.split('@')[0] ?? 'Account';

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden='true'
      />

      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role='navigation'
        aria-label='Main Sidebar'>
        <div className='sidebar-header'>
          <button
            className='sidebar-toggle'
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
            aria-expanded={isOpen}>
            <img src={buddyLogo} alt='Commander Logo' className='buddy-icon' />
          </button>
          {isOpen && <span className='sidebar-title'>Commander</span>}
        </div>

        {isOpen && (
          <>
            <nav className='nav-links'>
              <CustomLink to='/terminal' onClick={closeSidebar}>
                Terminal
              </CustomLink>
              <CustomLink to='/filter' onClick={closeSidebar}>
                Templates
              </CustomLink>
              <CustomLink to='/create' onClick={closeSidebar}>
                New
              </CustomLink>
              {!isAuthenticated && (
                <CustomLink to='/' onClick={closeSidebar}>
                  Home
                </CustomLink>
              )}
            </nav>

            <div className='user-section'>
              {isAuthenticated ? (
                <>
                  <button
                    className='user-profile'
                    onClick={handleUserClick}
                    aria-label='User settings'>
                    <span className='user-avatar' aria-hidden='true'>
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <circle
                          cx='12'
                          cy='8'
                          r='4'
                          stroke='currentColor'
                          strokeWidth='1.5'
                        />
                        <path
                          d='M4 20c0-4 3.582-7 8-7s8 3 8 7'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </span>
                    <span className='user-name'>{displayName}</span>
                  </button>
                  <button
                    className='user-logout'
                    onClick={handleLogout}
                    aria-label='Logout'>
                    <span className='logout-icon' aria-hidden='true'>
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M15 12H3m0 0l3-3m-3 3l3 3'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M9 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H9'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </span>
                    <span className='logout-text'>Logout</span>
                  </button>
                </>
              ) : (
                <Link to='/auth' className='user-signin' onClick={closeSidebar}>
                  Sign In
                </Link>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

const CustomLink = ({ to, children, onClick, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      {...props}>
      {children}
    </Link>
  );
};
