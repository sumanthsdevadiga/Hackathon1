import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-custom">
        
        <div className="footer-top-row">
          
          <div className="footer-col-brand">
            <div className="brand-text" style={{ color: '#FFFFFF' }}>
              FixIt<span className="brand-dot">.</span>
              <span className="brand-college-tag" style={{ background: 'rgba(255,90,31,0.25)', color: '#FFA41B' }}>CEC</span>
            </div>
            <p>
              Smart Campus Maintenance & Complaint Reporting Portal designed for Canara Engineering College, Benjanapadavu, Bantwal.
            </p>
            <div style={{ marginTop: '16px' }}>
              <span className="footer-hackathon-badge">
                🏆 CEC-HACKSTORM-2026 Prototype
              </span>
            </div>
          </div>

          <div>
            <div className="footer-links-title">Quick Links</div>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/report">Report an Issue</Link></li>
              <li><Link to="/track">Track Complaint</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-links-title">Departments Covered</div>
            <ul className="footer-links-list">
              <li><Link to="/how-it-works">Electrical Engineering Works</Link></li>
              <li><Link to="/how-it-works">Plumbing & Water Sanitation</Link></li>
              <li><Link to="/how-it-works">Campus IT Infrastructure</Link></li>
              <li><Link to="/how-it-works">Housekeeping & Hygiene</Link></li>
              <li><Link to="/how-it-works">Civil, Furniture & Security</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-links-title">Campus Contact</div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              Canara Engineering College<br />
              Benjanapadavu, Bantwal Taluk,<br />
              Mangaluru, Karnataka 574219<br />
              Emergency Facilities Desk: Ext 404
            </p>
          </div>

        </div>

        <div className="footer-bottom-row">
          <div>
            Technical Activity Cell | Canara Engineering College | CEC-HACKSTORM-2026
          </div>
          <div>
            React 18 · Vite · Client-Side Routing
          </div>
        </div>

      </div>
    </footer>
  );
}
