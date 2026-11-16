import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="site-header">
      <div className="container-custom nav-container">
        
        {/* Logo Wordmark */}
        <Link to="/" className="brand-logo" onClick={closeMobile}>
          <div className="brand-text">
            FixIt<span className="brand-dot">.</span>
            {/* Hand-drawn style decorative swoosh in electric cyan */}
            <svg className="brand-swoosh" viewBox="0 0 70 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navBrandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path d="M2 6C18 1.5 52 1.5 68 5.5" stroke="url(#navBrandGrad)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-college-tag">CEC</span>
        </Link>

        {/* Centered Navigation Links with Active State */}
        <nav>
          <ul className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobile}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobile}>
                Report
              </NavLink>
            </li>
            <li>
              <NavLink to="/track" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobile}>
                Track
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobile}>
                How it Works
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobile}>
                Admin
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="nav-actions">
          <Link to="/report" className="btn-pill btn-primary-coral btn-sm hide-on-mobile">
            <span>Report an Issue</span>
            <span className="btn-arrow">→</span>
          </Link>

          <button className="nav-toggle-btn" onClick={toggleMobile} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
