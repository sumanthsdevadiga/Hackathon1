import React from 'react';

export default function StatusPill({ status }) {
  const safeStatus = status || 'Reported';
  const cleanClass = safeStatus.replace(/\s+/g, '');

  return (
    <span className={`pill-badge pill-status-${cleanClass}`}>
      {safeStatus}
    </span>
  );
}
