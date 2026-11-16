import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import StatusPill from '../components/StatusPill';
import PriorityPill from '../components/PriorityPill';
import Timeline from '../components/Timeline';
import { useComplaints } from '../context/ComplaintsContext';
import { formatDateTime, timeAgo } from '../utils/logic';
import { useReveal } from '../hooks/useReveal';
import '../styles/track.css';

export default function Track() {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const { complaints } = useComplaints();
  const revealRef = useReveal();

  const [searchInput, setSearchInput] = useState(urlId || '');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync with URL parameter (e.g. /track/FIX-1001)
  useEffect(() => {
    if (urlId) {
      setSearchInput(urlId);
      const found = complaints.find(c => c.id.toUpperCase() === urlId.toUpperCase());
      setSelectedComplaint(found || null);
      setHasSearched(true);
    } else {
      setSelectedComplaint(null);
      setHasSearched(false);
    }
  }, [urlId, complaints]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;
    navigate(`/track/${query}`);
  };

  const handleSelectSample = (sampleId) => {
    setSearchInput(sampleId);
    navigate(`/track/${sampleId}`);
  };

  // Last 5 recent public complaints (location, category, status only - no personal names)
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div ref={revealRef}>
      <PageBanner
        title="Track Complaint"
        subtitle="Inspect live status, department assignments, and the full audit resolution timeline in real time."
        breadcrumb="Track"
      />

      <div className="container-custom" style={{ paddingBottom: '80px', maxWidth: '880px' }}>
        
        {/* Search Input Box */}
        <div className="track-search-card">
          <form onSubmit={handleSearch}>
            <label className="form-label" htmlFor="trackSearch">
              Enter FixIt Ticket ID
            </label>
            <div className="track-input-group">
              <input
                type="text"
                id="trackSearch"
                className="form-control-custom"
                placeholder="e.g. FIX-1001, FIX-1002"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ textTransform: 'uppercase', fontWeight: 600 }}
              />
              <button type="submit" className="btn-pill btn-primary-coral">
                <span>Track</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </form>

          {/* Quick Sample Chips */}
          <div className="quick-chips-wrapper">
            <span>Try sample complaints:</span>
            <button type="button" className="chip-btn" onClick={() => handleSelectSample('FIX-1001')}>
              FIX-1001 (Electrical)
            </button>
            <button type="button" className="chip-btn" onClick={() => handleSelectSample('FIX-1002')}>
              FIX-1002 (Canteen Tap)
            </button>
            <button type="button" className="chip-btn" onClick={() => handleSelectSample('FIX-1003')}>
              FIX-1003 (Lab Wi-Fi)
            </button>
            <button type="button" className="chip-btn" onClick={() => handleSelectSample('FIX-1004')}>
              FIX-1004 (Cleanliness)
            </button>
          </div>
        </div>

        {/* Search Result Display */}
        {hasSearched && (
          selectedComplaint ? (
            <div className="track-result-card">
              <div className="track-header-row">
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Canara Engineering College · Ticket
                  </span>
                  <div className="track-id-large">{selectedComplaint.id}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <PriorityPill priority={selectedComplaint.priority} />
                  <StatusPill status={selectedComplaint.status} />
                  <span className="vote-badge">👍 {selectedComplaint.votes || 1} Report{(selectedComplaint.votes || 1) > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Grid Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>LOCATION</span>
                  <strong>{selectedComplaint.blk} – {selectedComplaint.room}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>CATEGORY & DEPT</span>
                  <strong>{selectedComplaint.cat}</strong> ({selectedComplaint.dept})
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>LOGGED TIME</span>
                  <span>{formatDateTime(selectedComplaint.created)}</span>
                </div>
              </div>

              {/* Description & Photo */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  ISSUE DESCRIPTION:
                </span>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#F8FAFC', fontWeight: 500 }}>
                  "{selectedComplaint.desc}"
                </p>

                {selectedComplaint.photo && (
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>ATTACHED EVIDENCE:</span>
                    <img
                      src={selectedComplaint.photo}
                      alt="Complaint attachment"
                      style={{ maxHeight: '160px', borderRadius: '10px', border: '1px solid #E5E7EB', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>

              {/* Timeline Component */}
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>
                Resolution Progress & Audit Timeline
              </h4>
              <Timeline logs={selectedComplaint.log} />
            </div>
          ) : (
            <div className="form-card result-box result-error" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#991B1B' }}>Ticket Not Found</h4>
                  <p style={{ margin: 0, fontSize: '0.92rem' }}>
                    No campus complaint was found matching ID <strong>{urlId || searchInput}</strong>.
                    Please double-check your ID or file a new report.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Recent Public Complaints Strip */}
        <div className="recent-complaints-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Public Campus Reports</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Public bulletin (anonymized)</span>
          </div>

          <div className="recent-list">
            {recentComplaints.map(item => (
              <div
                key={item.id}
                className="recent-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectSample(item.id)}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--primary-orange)', marginRight: '8px' }}>
                    {item.id}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {item.blk} · {item.room}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.cat} · {timeAgo(item.created)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusPill status={item.status} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
