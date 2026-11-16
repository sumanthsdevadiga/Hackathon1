import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintsContext';
import { BLOCKS_CONFIG, CATEGORIES } from '../data/campusData';
import { calculatePriority } from '../utils/logic';
import PriorityPill from './PriorityPill';

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addComplaint } = useComplaints();

  // Form Fields
  const [who, setWho] = useState('');
  const [cat, setCat] = useState('Electrical');
  const [blk, setBlk] = useState('Main Block');
  const [room, setRoom] = useState(BLOCKS_CONFIG['Main Block'][0] || '');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState(null);

  // Status & Feedback States
  const [qrDetected, setQrDetected] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);

  // Available rooms for currently selected block
  const availableRooms = BLOCKS_CONFIG[blk] || [];

  // Parse QR simulation from URL query param: /report?loc=Main Block|Room 204
  useEffect(() => {
    const locParam = searchParams.get('loc');
    if (locParam) {
      const parts = locParam.split('|');
      if (parts.length === 2) {
        const targetBlock = parts[0].trim();
        const targetRoom = parts[1].trim();

        if (BLOCKS_CONFIG[targetBlock] && BLOCKS_CONFIG[targetBlock].includes(targetRoom)) {
          setBlk(targetBlock);
          setRoom(targetRoom);
          setQrDetected(`${targetBlock} – ${targetRoom}`);
        }
      }
    }
  }, [searchParams]);

  // Handle block change -> auto-select first available room
  const handleBlockChange = (newBlock) => {
    setBlk(newBlock);
    const rooms = BLOCKS_CONFIG[newBlock] || [];
    setRoom(rooms[0] || '');
  };

  // Photo Upload Handler with <400KB limit
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPhoto(null);
      return;
    }
    if (file.size > 400 * 1024) {
      alert('⚠️ Photo file size exceeds 400KB limit. Please choose a smaller image.');
      e.target.value = '';
      setPhoto(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Live priority preview
  const livePriority = calculatePriority(desc, cat);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!who.trim()) {
      setFormError('Please enter your Name and USN.');
      return;
    }

    if (desc.trim().length < 8) {
      setFormError('Please provide a description of at least 8 characters.');
      return;
    }

    const res = addComplaint({
      who: who.trim(),
      cat,
      blk,
      room,
      desc: desc.trim(),
      photo
    });

    setSubmitResult(res);
  };

  // Render Success / Merged Result Card
  if (submitResult) {
    const { isDuplicate, complaint } = submitResult;

    if (isDuplicate) {
      return (
        <div className="form-card result-box result-merged">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🤝</div>
            <div>
              <span className="eyebrow" style={{ color: 'var(--neon-cyan)' }}>Duplicate Detected & Merged</span>
              <h3 style={{ margin: '4px 0 8px 0', color: '#BAE6FD' }}>
                Merged as a "Me-Too" Report!
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#93C5FD', fontSize: '0.95rem' }}>
                An active complaint (<strong>{complaint.id}</strong>) is already open for <strong>{complaint.blk} – {complaint.room}</strong> under <strong>{complaint.cat}</strong>.
              </p>
              <p style={{ margin: '0 0 18px 0', color: '#93C5FD', fontSize: '0.95rem' }}>
                Instead of creating duplicate clutter, your report has been added as a <strong>“Me-Too” upvote</strong>. Priority has increased to <strong>{complaint.votes} upvotes</strong>!
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-pill btn-primary-coral btn-sm"
                  onClick={() => navigate(`/track/${complaint.id}`)}
                >
                  Track Complaint {complaint.id} →
                </button>
                <button
                  type="button"
                  className="btn-pill btn-outline-dark btn-sm"
                  onClick={() => {
                    setSubmitResult(null);
                    setDesc('');
                    setPhoto(null);
                  }}
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="form-card result-box result-success">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>✅</div>
          <div style={{ flexGrow: 1 }}>
            <span className="eyebrow" style={{ color: 'var(--neon-emerald)' }}>Registration Confirmed</span>
            <h3 style={{ margin: '4px 0 8px 0', color: '#A7F3D0' }}>
              Complaint Registered Successfully!
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#6EE7B7', fontSize: '0.95rem' }}>
              Your issue has been logged, scored for priority, and automatically routed to the right campus maintenance team.
            </p>

            <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '14px', padding: '18px', marginBottom: '20px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Complaint ID</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{complaint.id}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <PriorityPill priority={complaint.priority} />
                  <span className="pill-badge pill-status-Assigned">Assigned</span>
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#E2E8F0' }}>
                📍 <strong>{complaint.blk} – {complaint.room}</strong> &nbsp;|&nbsp; 🏢 Auto-routed to: <strong>{complaint.dept}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-pill btn-primary-coral btn-sm"
                onClick={() => navigate(`/track/${complaint.id}`)}
              >
                Track this complaint →
              </button>
              <button
                type="button"
                className="btn-pill btn-outline-dark btn-sm"
                onClick={() => {
                  setSubmitResult(null);
                  setDesc('');
                  setPhoto(null);
                }}
              >
                Submit New Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      {/* QR detection alert banner */}
      {qrDetected && (
        <div className="qr-alert-banner">
          <span style={{ fontSize: '1.4rem' }}>📍</span>
          <div>
            Location auto-filled from room QR code: <strong>{qrDetected}</strong>
          </div>
        </div>
      )}

      {formError && (
        <div className="result-box result-error" style={{ marginBottom: '20px', padding: '12px 18px' }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Row 1: Reporter Info & Category */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="whoInput">
              Your Name / USN <small>(Required)</small>
            </label>
            <input
              type="text"
              id="whoInput"
              className="form-control-custom"
              placeholder="e.g. Rahul Shenoy – 4CB22CS014"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="catSelect">
              Issue Category
            </label>
            <select
              id="catSelect"
              className="form-control-custom"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Location Block & Room */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="blkSelect">
              Campus Block
            </label>
            <select
              id="blkSelect"
              className="form-control-custom"
              value={blk}
              onChange={(e) => handleBlockChange(e.target.value)}
            >
              {Object.keys(BLOCKS_CONFIG).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="roomSelect">
              Room / Area
            </label>
            <select
              id="roomSelect"
              className="form-control-custom"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              {availableRooms.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="descInput">
            Describe the Problem <small>(Minimum 8 characters)</small>
          </label>
          <textarea
            id="descInput"
            className="form-control-custom"
            placeholder="e.g. Ceiling fan sparking and burning smell in room 204..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        {/* Real-time Priority Preview Box */}
        <div className="priority-preview-box">
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Priority Engine: </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {livePriority === 'High'
                ? 'Urgent safety hazard signals detected!'
                : livePriority === 'Medium'
                ? 'Standard operational disruption detected.'
                : 'Routine maintenance score.'}
            </span>
          </div>
          <div>
            <PriorityPill priority={livePriority} />
          </div>
        </div>

        {/* Row 4: Photo Upload */}
        <div className="form-group">
          <label className="form-label" htmlFor="photoInput">
            Attach Evidence Photo <small>(Optional, max 400KB)</small>
          </label>
          <input
            type="file"
            id="photoInput"
            className="form-control-custom"
            accept="image/*"
            onChange={handlePhotoUpload}
          />

          {photo && (
            <div className="photo-preview-box">
              <img src={photo} alt="Upload preview" className="photo-preview-thumb" />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>Photo attached</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  onClick={() => setPhoto(null)}
                >
                  Remove photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '28px' }}>
          <button
            type="submit"
            className="btn-pill btn-primary-coral"
            style={{ width: '100%', padding: '15px', fontSize: '1.05rem' }}
          >
            <span>Submit Complaint Now</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
