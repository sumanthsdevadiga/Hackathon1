import React from 'react';

export default function StatCard({ value, label, color }) {
  return (
    <div className="admin-metric-card">
      <div className="metric-val" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="metric-title">{label}</div>
    </div>
  );
}
