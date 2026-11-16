import React, { useState } from 'react';
import PageBanner from '../components/PageBanner';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';
import ComplaintTable from '../components/ComplaintTable';
import { useComplaints } from '../context/ComplaintsContext';
import { useReveal } from '../hooks/useReveal';
import '../styles/admin.css';

export default function Admin() {
  const { complaints, stats, updateStatus, resetDemo, isAdmin, login, logout } = useComplaints();
  const revealRef = useReveal();

  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(pinInput);
    if (!success) {
      setErrorMsg('Incorrect PIN! For the demo, use PIN: 1234');
    } else {
      setPinInput('');
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Are you sure you want to restore the 4 default seed complaints?')) {
      resetDemo();
      alert('Demo data restored successfully!');
    }
  };

  return (
    <div ref={revealRef}>
      <PageBanner
        title="Admin Command Center"
        subtitle="Facilities Management & Operations Control Desk · Canara Engineering College"
        breadcrumb="Admin"
      />

      <div className="container-custom" style={{ paddingBottom: '80px' }}>
        
        {/* Protected Dashboard Check */}
        {!isAdmin ? (
          /* Login PIN Card */
          <div className="admin-login-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔐</div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>Facilities Admin Login</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
              Authorized campus personnel only. Demo PIN: <strong>1234</strong>
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label className="form-label" htmlFor="adminPin">Enter PIN Code</label>
                <input
                  type="password"
                  id="adminPin"
                  className="form-control-custom"
                  placeholder="••••"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.25em' }}
                  required
                />
              </div>

              {errorMsg && (
                <div className="result-box result-error" style={{ padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-pill btn-primary-coral" style={{ width: '100%' }}>
                <span>Authorize Login</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard View */
          <div className="admin-dashboard-container">
            
            {/* Top Controls: Reset & Logout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className="eyebrow">Session Active</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Facilities Operations Panel</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-pill btn-outline-dark btn-sm"
                  onClick={handleResetDemo}
                >
                  🔄 Reset Demo Data
                </button>
                <button
                  type="button"
                  className="btn-pill btn-outline-dark btn-sm"
                  onClick={logout}
                >
                  🔒 Logout
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="admin-metric-grid">
              <StatCard value={stats.total} label="Total Complaints" />
              <StatCard value={stats.open} label="Active / Open" color="var(--primary-orange)" />
              <StatCard value={stats.highOpen} label="High Priority Open" color="#DC2626" />
              <StatCard value={stats.resolved} label="Resolved Tickets" color="#059669" />
            </div>

            {/* CSS Bar Chart Card */}
            <div className="admin-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>Complaints by Category</h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Real-time category breakdown across all Canara Engineering College sectors.
                  </p>
                </div>
                <span className="pill-badge pill-status-InProgress">CSS Native Chart</span>
              </div>
              <BarChart complaints={complaints} />
            </div>

            {/* Complaints Management Table */}
            <div className="admin-section-card">
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0' }}>
                  All Complaints
                  <small style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>
                    (Sorted by Priority, then Upvotes)
                  </small>
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Click any action button to transition ticket state and append to student timeline.
                </p>
              </div>

              <ComplaintTable
                complaints={complaints}
                onUpdateStatus={updateStatus}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
