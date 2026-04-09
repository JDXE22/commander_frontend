import { useState } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import buddyLogo from "../../assets/buddy.svg";
import { useAuth } from "../../shared/context/AuthContext";
import "./Navbar.css";

export const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate('/');
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`} role="navigation" aria-label="Main Sidebar">
        <div className="logo-group">
          <button className="buddy-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <img src={buddyLogo} alt="Commander Logo" className="logo-img" />
          </button>
          {!isCollapsed && <span className="logo-text">Commander</span>}
        </div>
        
        <nav className="nav-links">
          <CustomLink to="/terminal" collapsed={isCollapsed}>
            <span className="nav-icon">T</span>
            <span className="nav-text">Terminal</span>
          </CustomLink>
          <CustomLink to="/filter" collapsed={isCollapsed}>
            <span className="nav-icon">P</span>
            <span className="nav-text">Templates</span>
          </CustomLink>
          <CustomLink to="/create" collapsed={isCollapsed}>
            <span className="nav-icon">N</span>
            <span className="nav-text">New</span>
          </CustomLink>
        </nav>

        <div className="nav-links secondary">
          {!isCollapsed && !isAuthenticated && (
            <CustomLink to="/" collapsed={isCollapsed}>
              <span className="nav-icon">H</span>
              <span className="nav-text">Home</span>
            </CustomLink>
          )}
          
          {isAuthenticated ? (
            <button 
              className={`nav-item logout-btn ${isCollapsed ? "collapsed" : ""}`} 
              onClick={handleLogout}
              title={isCollapsed ? `Logout (${user?.email?.split('@')[0]})` : ""}
            >
              <span className="nav-icon">L</span>
              {!isCollapsed && <span className="nav-text">Logout ({user?.email?.split('@')[0]})</span>}
            </button>
          ) : (
             !isCollapsed && (
               <CustomLink to="/auth" collapsed={isCollapsed}>
                 <span className="nav-icon">S</span>
                 <span className="nav-text">Sign In</span>
               </CustomLink>
             )
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header" role="banner">
        <div className="logo-group">
          <img src={buddyLogo} alt="Commander Logo" className="logo-img" />
          <span className="logo-text">Commander</span>
        </div>
        <button className="buddy-toggle mobile" onClick={toggleMobileMenu} aria-label={isMobileOpen ? "Close Menu" : "Open Menu"} aria-expanded={isMobileOpen}>
          <img src={buddyLogo} alt="Buddy Toggle" className="mobile-buddy-icon" />
        </button>
      </header>

      {/* Mobile Nav */}
      {isMobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <div className="nav-links">
            <CustomLink to="/terminal" onClick={() => setIsMobileOpen(false)}>Terminal</CustomLink>
            <CustomLink to="/filter" onClick={() => setIsMobileOpen(false)}>Templates</CustomLink>
            <CustomLink to="/create" onClick={() => setIsMobileOpen(false)}>New</CustomLink>
            <div className="mobile-nav-divider"></div>
            {!isAuthenticated && <CustomLink to="/" onClick={() => setIsMobileOpen(false)}>Home</CustomLink>}
            {isAuthenticated ? (
              <button className="nav-item logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <CustomLink to="/auth" onClick={() => setIsMobileOpen(false)}>Sign In</CustomLink>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

const CustomLink = ({ to, children, onClick, collapsed, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link 
      to={to} 
      className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};
