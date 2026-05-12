import { useState, useEffect, useRef } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth, useTrial } from '../../shared/context';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { exitTrial } = useTrial();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

  // Auto-close mobile sidebar when viewport grows beyond the breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettings = () => {
    closeSidebar();
    navigate('/settings');
  };

  const handleLogout = async () => {
    await logout();
    exitTrial();
    closeSidebar();
    navigate('/');
  };

  const displayName = user?.email?.split('@')[0] ?? 'Account';

  const sidebarClasses = [
    'sidebar',
    isOpen ? 'open' : '',
    isMobileOpen ? 'mobile-active open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Mobile hamburger / close toggle — hidden on desktop via CSS */}
      <button
        className='mobile-sidebar-toggle'
        onClick={toggleMobileSidebar}
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isMobileOpen}>
        <img
          src={buddyLogo}
          alt='Commander Logo'
          className='mobile-buddy-icon'
        />
      </button>

      <button
        type='button'
        className={`sidebar-overlay ${isOpen || isMobileOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-label='Close sidebar'
        aria-hidden={!(isOpen || isMobileOpen)}
        tabIndex={isOpen || isMobileOpen ? 0 : -1}
      />

      <aside
        className={sidebarClasses}
        role='navigation'
        aria-label='Main Sidebar'>
        <div className='sidebar-header'>
          <button
            className='sidebar-toggle'
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
            aria-expanded={isOpen}>
            <div className='toggle-icon-wrapper'>
              <img
                src={buddyLogo}
                alt='Commander Logo'
                className='buddy-icon'
              />
              {!isOpen && !isMobileOpen && (
                <span className='toggle-hint'>MENU</span>
              )}
            </div>
          </button>
          {(isOpen || isMobileOpen) && (
            <span className='sidebar-title'>Commander</span>
          )}
        </div>

        {(isOpen || isMobileOpen) && (
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

            <div
              className='user-section'
              role='group'
              aria-label='User and system controls'
              ref={userMenuRef}>
              {isAuthenticated ? (
                <div className='user-dropdown-wrapper'>
                  <button
                    className={`user-profile ${isUserMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label={`User profile: ${displayName}. Open account menu.`}>
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
                    <svg
                      className={`dropdown-chevron ${isUserMenuOpen ? 'rotated' : ''}`}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <polyline points='6 9 12 15 18 9'></polyline>
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className='user-menu-dropdown'>
                      <button onClick={handleSettings} className='menu-item'>
                        <svg
                          className='menu-icon'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'>
                          <circle cx='12' cy='12' r='3'></circle>
                          <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
                        </svg>
                        <span>Settings</span>
                      </button>
                      <button onClick={handleLogout} className='menu-item'>
                        <svg
                          className='menu-icon'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'>
                          <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
                          <polyline points='16 17 21 12 16 7'></polyline>
                          <line x1='21' y1='12' x2='9' y2='12'></line>
                        </svg>
                        <span>Sign off</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to='/auth'
                  className='user-signin'
                  onClick={closeSidebar}
                  aria-label='Sign in to account'>
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
