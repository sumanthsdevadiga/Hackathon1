import React from 'react';

export default function PriorityPill({ priority }) {
  const safePrio = priority || 'Low';

  return (
    <span className={`pill-badge pill-prio-${safePrio}`}>
      {safePrio} Priority
    </span>
  );
}
