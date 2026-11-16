import React, { useState } from 'react';
import StatusPill from './StatusPill';
import PriorityPill from './PriorityPill';
import { STATUS_LIST } from '../data/campusData';
import { timeAgo } from '../utils/logic';

export default function ComplaintTable({ complaints = [], onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [prioFilter, setPrioFilter] = useState('All');

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };

  // Filter complaints
  const filtered = complaints.filter(item => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchPrio = prioFilter === 'All' || item.priority === prioFilter;
    return matchStatus && matchPrio;
  });

  // Sort by Priority (High > Medium > Low), then by Votes (desc), then by Date (desc)
  const sorted = [...filtered].sort((a, b) => {
    const pA = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 2;
    const pB = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 2;
    if (pA !== pB) return pA - pB;
    const vA = a.votes || 1;
    const vB = b.votes || 1;
    if (vB !== vA) return vB - vA;
    return (b.created || 0) - (a.created || 0);
  });

  return (
    <div>
      {/* Table Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{sorted.length}</strong> complaints
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="form-control-custom"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="form-control-custom"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
            value={prioFilter}
            onChange={(e) => setPrioFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Issue & Reporter</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Routed Dept</th>
              <th>Votes</th>
              <th>Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No complaints match the selected filter criteria.
                </td>
              </tr>
            ) : (
              sorted.map(c => {
                const nextStatuses = STATUS_LIST.filter(s => s !== c.status);
                return (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.id}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {timeAgo(c.created)}
                      </div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                        {c.desc}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Reporter: {c.who}
                      </div>
                      {c.photo && (
                        <div style={{ marginTop: '6px' }}>
                          <img
                            src={c.photo}
                            alt="Evidence thumbnail"
                            style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div><strong>{c.blk}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.room}</div>
                    </td>
                    <td>
                      <PriorityPill priority={c.priority} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.dept}</span>
                    </td>
                    <td>
                      <span className="vote-badge">👍 {c.votes || 1}</span>
                    </td>
                    <td>
                      <div style={{ marginBottom: '8px' }}>
                        <StatusPill status={c.status} />
                      </div>
                      <div className="admin-action-btn-group">
                        {nextStatuses.map(s => (
                          <button
                            key={s}
                            type="button"
                            className="action-status-btn"
                            onClick={() => onUpdateStatus(c.id, s)}
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
