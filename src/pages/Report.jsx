import React from 'react';
import PageBanner from '../components/PageBanner';
import ComplaintForm from '../components/ComplaintForm';
import { CATEGORIES } from '../data/campusData';
import { useReveal } from '../hooks/useReveal';
import '../styles/report.css';

export default function Report() {
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      <PageBanner
        title="Report an Issue"
        subtitle="Log a campus maintenance fault or hazard. Our smart priority engine notifies the right CEC department instantly."
        breadcrumb="Report"
      />

      <div className="container-custom" style={{ paddingBottom: '80px' }}>
        <div className="report-layout-grid">
          
          {/* Main Form on Left */}
          <div>
            <ComplaintForm />
          </div>

          {/* Tips Side Panel on Right */}
          <aside className="report-side-panel">
            <div className="side-panel-card">
              <h3 className="side-panel-title">
                <span>💡</span> Add a Clear Description
              </h3>
              <p className="side-panel-text">
                Be specific about what is happening (e.g., "fan sparking", "tap leaking continuously"). Detailed descriptions help technicians bring the correct spare parts on the first visit.
              </p>
            </div>

            <div className="side-panel-card">
              <h3 className="side-panel-title">
                <span>📸</span> Attach a Photo
              </h3>
              <p className="side-panel-text">
                An image is worth a thousand words. Attach a quick snapshot (under 400KB) to help facilities identify the exact make or location of the damaged equipment.
              </p>
            </div>

            <div className="side-panel-card">
              <h3 className="side-panel-title">
                <span>⚡</span> How Priority is Decided
              </h3>
              <p className="side-panel-text">
                Our offline NLP engine scans your text for hazard keywords. Words like <em>spark</em>, <em>burning</em>, <em>fire</em>, <em>shock</em>, and <em>flood</em> trigger High Priority automatically.
              </p>
            </div>

            <div className="side-panel-card">
              <h3 className="side-panel-title">
                <span>🏷️</span> Supported Categories
              </h3>
              <div className="category-chip-list">
                {CATEGORIES.map(c => (
                  <span key={c} className="cat-pill">{c}</span>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
