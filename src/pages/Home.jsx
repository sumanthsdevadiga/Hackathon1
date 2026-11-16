import React from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintsContext';
import { DEPARTMENTS } from '../data/campusData';
import { useReveal } from '../hooks/useReveal';
import '../styles/home.css';

export default function Home() {
  const { stats } = useComplaints();
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-custom">
          <div className="hero-banner">
            
            <div className="hero-content">
              <div className="hero-trust-chip">
                <span>⚡</span> Smart priority · Auto-routing · Live tracking
              </div>

              <h1 className="hero-title">
                Report it. Track it.<br />
                <span className="highlight-gradient">Get it fixed.</span>
              </h1>

              <p className="hero-desc">
                Canara Engineering College's smart campus maintenance portal. Scan room QR codes, 
                report infrastructure problems in seconds, and track real-time resolution by CEC maintenance teams.
              </p>

              <div className="hero-actions">
                <Link to="/report" className="btn-pill btn-primary-coral">
                  <span>Report an Issue</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/track" className="btn-pill btn-outline-light">
                  <span>Track Complaint</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="hero-visual-card">
              <div className="live-badge-pulse">
                <span className="pulse-dot" />
                <span>Canara Operations Live</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                {120 + stats.resolved}+ Issues Fixed
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
                Average campus team dispatch in 24 hours. Intelligent duplicate merging active.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#FFA41B', fontWeight: 700 }}>Active Open</span>
                <span className="pill-badge pill-prio-High">{stats.highOpen} Priority High</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Fix Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div style={{ textAlign: 'center' }}>
            <span className="eyebrow">Campus Support Services</span>
            <h2 className="section-title">What We Fix Across CEC</h2>
            <p className="section-desc">
              From engineering lab setups to hostel water supplies, our dedicated campus units keep Canara Engineering College running without disruption.
            </p>
          </div>

          <div className="cards-grid-4">
            {/* Card 1: Solid Highlighted Cyber Card */}
            <div className="card-item card-highlight-orange">
              <div>
                <div className="card-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: 'var(--neon-cyan)', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '10px' }}>
                  ⚡ Highest Priority
                </span>
                <h3>Electrical & Power</h3>
                <p>
                  Ceiling fan sparking, switchboard burns, UPS failure, lab power cutoffs, and lighting breakdowns.
                </p>
              </div>
              <Link to="/report" className="card-tag">
                <span>Auto-routed to Electrical Dept</span>
                <span>→</span>
              </Link>
            </div>

            {/* Card 2: Plumbing */}
            <div className="card-item">
              <div>
                <div className="card-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <span className="eyebrow">Water Systems</span>
                <h3>Plumbing & Water</h3>
                <p>
                  Leaking washroom taps, canteen wash area overflow, drinking water cooler issues, and pipeline blockages.
                </p>
              </div>
              <Link to="/report" className="card-tag">
                <span>Plumbing Team</span>
                <span>→</span>
              </Link>
            </div>

            {/* Card 3: IT & Network */}
            <div className="card-item">
              <div>
                <div className="card-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <span className="eyebrow">Tech Infrastructure</span>
                <h3>IT & Network</h3>
                <p>
                  Department lab system downtime, slow campus Wi-Fi, classroom projector failures, and LAN wall ports.
                </p>
              </div>
              <Link to="/report" className="card-tag">
                <span>IT Support Center</span>
                <span>→</span>
              </Link>
            </div>

            {/* Card 4: Cleanliness */}
            <div className="card-item">
              <div>
                <div className="card-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757L6.636 6.636" />
                  </svg>
                </div>
                <span className="eyebrow">Sanitation</span>
                <h3>Cleanliness & Hygiene</h3>
                <p>
                  Classroom dustbins, seminar hall tidiness, washroom sanitization, and corridor floor maintenance.
                </p>
              </div>
              <Link to="/report" className="card-tag">
                <span>Housekeeping Unit</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Strip Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="stats-strip">
            <div className="stats-grid-4">
              <div>
                <div className="stat-number">{120 + stats.resolved}+</div>
                <div className="stat-label">Complaints Resolved</div>
              </div>
              <div>
                <div className="stat-number">24h</div>
                <div className="stat-label">Avg Response Time</div>
              </div>
              <div>
                <div className="stat-number">{stats.open}</div>
                <div className="stat-label">Active Open Complaints</div>
              </div>
              <div>
                <div className="stat-number">6</div>
                <div className="stat-label">Dedicated Departments</div>
              </div>
            </div>
          </div>

          {/* Department Strip */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="eyebrow">Operational Readiness</span>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Active Campus Maintenance Teams</h3>
          </div>

          <div className="dept-strip">
            {DEPARTMENTS.map(dept => (
              <div key={dept.name} className="dept-pill-card">
                <span className="dept-pill-icon">{dept.icon}</span>
                <span className="dept-pill-name">{dept.name}</span>
                <span className="dept-pill-status">● {dept.status}</span>
              </div>
            ))}
          </div>

          {/* Call to Action Banner */}
          <div className="cta-banner">
            <h2>Spot a campus problem? Report it in seconds.</h2>
            <p>
              Help keep Canara Engineering College clean, safe and efficient. No login required for students.
            </p>
            <Link to="/report" className="btn-pill btn-primary-coral">
              <span>Open Complaint Form</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
