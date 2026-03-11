import { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const LogoIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="logo-title">
    <title id="logo-title">Commander Buddy Logo</title>
    {/* Antenna */}
    <line x1="256" y1="130" x2="256" y2="80" stroke="#95c14e" strokeWidth="12" strokeLinecap="round"/>
    <circle cx="256" cy="70" r="15" fill="#95c14e"/>
    {/* Body/Terminal Shell */}
    <rect x="86" y="130" width="340" height="260" rx="40" fill="#95c14e" fillOpacity="0.1" stroke="#95c14e" strokeWidth="20"/>
    {/* Screen Area */}
    <rect x="116" y="160" width="280" height="200" rx="20" fill="#141b1e"/>
    {/* Terminal Prompt Eye (Left) */}
    <path d="M170 220L210 255L170 290" stroke="#95c14e" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Cursor Eye (Right) */}
    <line x1="290" y1="255" x2="340" y2="255" stroke="#95c14e" strokeWidth="18" strokeLinecap="round"/>
    {/* Friendly Mouth */}
    <path d="M210 310C210 335 235 340 256 340C277 340 302 335 302 310" stroke="#95c14e" strokeWidth="14" strokeLinecap="round" fill="none"/>
    {/* Integrated Copy Icon */}
    <g transform="translate(370, 95)">
      <rect x="0" y="8" width="35" height="45" rx="6" stroke="#95c14e" strokeWidth="6" fill="#141b1e"/>
      <rect x="12" y="0" width="35" height="45" rx="6" stroke="#95c14e" strokeWidth="6" fill="#141b1e"/>
    </g>
  </svg>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="sidebar" role="navigation" aria-label="Main Sidebar">
        <div className="logo-group">
          <LogoIcon />
          <span className="logo-text" style={{ fontSize: '18px' }}>Commander</span>
        </div>
        <nav className="nav-links">
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/filter">Filter</CustomLink>
          <CustomLink to="/create">Create</CustomLink>
        </nav>
      </aside>

      <header className="mobile-header" role="banner">
        <div className="logo-group">
          <LogoIcon size={36} />
          <span className="logo-text">Commander</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close Menu" : "Open Menu"} aria-expanded={isOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      </header>

      {isOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <div className="nav-links">
            <CustomLink to="/" onClick={() => setIsOpen(false)}>Home</CustomLink>
            <CustomLink to="/filter" onClick={() => setIsOpen(false)}>Filter</CustomLink>
            <CustomLink to="/create" onClick={() => setIsOpen(false)}>Create</CustomLink>
          </div>
        </nav>
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
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};
