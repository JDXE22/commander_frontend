import { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="sidebar">
        <div className="logo-group">
          <div className="logo-icon"></div>
          <span className="logo-text">Commander</span>
        </div>
        <nav className="nav-links">
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/filter">Filter</CustomLink>
          <CustomLink to="/create">Create</CustomLink>
        </nav>
      </aside>

      <div className="mobile-header">
        <div className="logo-group">
          <div className="logo-icon" style={{ width: '28px', height: '28px' }}></div>
          <span className="logo-text">Commander</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="mobile-nav">
          <nav className="nav-links">
            <CustomLink to="/" onClick={() => setIsOpen(false)}>Home</CustomLink>
            <CustomLink to="/filter" onClick={() => setIsOpen(false)}>Filter</CustomLink>
            <CustomLink to="/create" onClick={() => setIsOpen(false)}>Create</CustomLink>
          </nav>
        </div>
      )}
    </>
  );
};

const CustomLink = ({ to, children, onClick, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link 
      to={to} 
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};
