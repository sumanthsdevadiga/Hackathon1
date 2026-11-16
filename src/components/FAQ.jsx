import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: "How does the smart priority engine determine urgency?",
    a: "The engine runs an offline keyword heuristic scanner. Safety hazards such as sparking, fire, burning smell, short circuits, or exposed wiring score High Priority automatically. Functional disruptions like broken taps, slow Wi-Fi, or empty dispensers receive Medium or Low scores."
  },
  {
    q: "What happens when multiple students report the same issue in the same room?",
    a: "FixIt CEC detects open complaints with the same campus block, room, and category. Instead of clogging the queue with duplicate tickets, subsequent reports automatically merge as “me-too” upvotes, bumping institutional visibility."
  },
  {
    q: "Can I scan a room QR code directly without typing my location?",
    a: "Yes! Every classroom and laboratory has a FixIt QR poster encoding the location (e.g., /report?loc=Main Block|Room 204). Scanning it auto-selects the block and room instantly."
  },
  {
    q: "How fast do Canara Engineering College teams respond to complaints?",
    a: "High Priority electrical, safety, and water flood hazards trigger immediate dispatch within 1 to 2 hours. Routine maintenance requests are addressed within the standard 24-hour campus facilities cycle."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(prev => (prev === idx ? -1 : idx));
  };

  return (
    <div className="faq-accordion" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '18px 24px',
              boxShadow: 'var(--shadow-glass)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => toggle(idx)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>
                {item.q}
              </h4>
              <span style={{ fontSize: '1.4rem', color: 'var(--neon-cyan)', fontWeight: 700, lineHeight: 1 }}>
                {isOpen ? '−' : '+'}
              </span>
            </div>
            {isOpen && (
              <p style={{ margin: '12px 0 0 0', fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
