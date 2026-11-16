import React from 'react';
import { formatDateTime, timeAgo } from '../utils/logic';

export default function Timeline({ logs = [] }) {
  if (!logs || logs.length === 0) {
    return <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No audit events logged yet.</p>;
  }

  return (
    <div className="timeline">
      {logs.map((step, idx) => {
        const isResolved = step.s && step.s.toLowerCase().includes('resolved');
        const isLatest = idx === logs.length - 1;

        return (
          <div key={idx} className="timeline-item">
            <div className={`timeline-dot ${isResolved ? 'resolved' : ''}`} />
            <div
              className="timeline-content-title"
              style={isLatest ? { color: 'var(--primary-orange)' } : {}}
            >
              {step.s}
            </div>
            <div className="timeline-content-time">
              {formatDateTime(step.t)} ({timeAgo(step.t)})
            </div>
          </div>
        );
      })}
    </div>
  );
}
