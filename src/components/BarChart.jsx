import React from 'react';
import { CATEGORIES } from '../data/campusData';

export default function BarChart({ complaints = [] }) {
  const counts = {};
  CATEGORIES.forEach(cat => { counts[cat] = 0; });

  complaints.forEach(c => {
    if (counts[c.cat] !== undefined) {
      counts[c.cat] += 1;
    } else {
      counts[c.cat] = 1;
    }
  });

  const maxVal = Math.max(...Object.values(counts), 1);

  return (
    <div className="chart-container">
      {Object.entries(counts).map(([cat, count]) => {
        const pct = Math.round((count / maxVal) * 100);
        return (
          <div key={cat} className="chart-row">
            <div style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cat}
            </div>
            <div className="chart-bar-bg">
              <div
                className="chart-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
