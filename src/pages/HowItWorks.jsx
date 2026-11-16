import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import FAQ from '../components/FAQ';
import { useReveal } from '../hooks/useReveal';
import '../styles/howItWorks.css';

export default function HowItWorks() {
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      <PageBanner
        title="How FixIt CEC Works"
        subtitle="Explore the intelligent 5-step maintenance pipeline, smart priority engine, duplicate detection, and QR code integration."
        breadcrumb="How It Works"
      />

      <div className="container-custom" style={{ paddingBottom: '80px', maxWidth: '960px' }}>
        
        {/* The 5 Numbered Steps as a Vertical Timeline */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="eyebrow">Pipeline Overview</span>
          <h2 className="section-title">The 5-Step Maintenance Workflow</h2>
        </div>

        <div className="steps-vertical-timeline">
          
          <div className="step-card-vertical">
            <div className="step-num-badge">1</div>
            <div className="step-content">
              <h3>Report</h3>
              <p>
                Students or faculty scan the room's physical QR poster or visit the report portal to enter their name, USN, and issue details.
              </p>
            </div>
          </div>

          <div className="step-card-vertical">
            <div className="step-num-badge">2</div>
            <div className="step-content">
              <h3>Smart Check</h3>
              <p>
                The heuristic scoring engine analyzes description keywords in real time (e.g. <em>spark</em>, <em>fire</em>, <em>burning</em>, <em>flood</em>) to tag urgency as High, Medium, or Low.
              </p>
            </div>
          </div>

          <div className="step-card-vertical">
            <div className="step-num-badge">3</div>
            <div className="step-content">
              <h3>Auto-Route & Duplicate Filter</h3>
              <p>
                If an open complaint already exists for that room, the system merges the submission as an upvote. If unique, it automatically assigns it to the responsible department.
              </p>
            </div>
          </div>

          <div className="step-card-vertical">
            <div className="step-num-badge">4</div>
            <div className="step-content">
              <h3>Resolve</h3>
              <p>
                Facilities crew members receive the task, inspect on-site, and log state transitions (<em>Assigned</em> → <em>In Progress</em> → <em>Resolved</em>) in real time.
              </p>
            </div>
          </div>

          <div className="step-card-vertical">
            <div className="step-num-badge">5</div>
            <div className="step-content">
              <h3>Track</h3>
              <p>
                The reporter and campus community inspect full transparency via the live ticket audit timeline and timestamped resolution events.
              </p>
            </div>
          </div>

        </div>

        {/* Section: Priority Engine Explanation */}
        <div className="feature-deep-dive-card">
          <span className="eyebrow">Heuristic AI Logic</span>
          <h3 style={{ fontSize: '1.4rem', margin: '4px 0 12px 0' }}>
            Smart Priority Engine
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            FixIt runs a fast, offline keyword scoring algorithm that operates reliably without requiring external AI API calls:
          </p>

          <table className="keyword-table">
            <thead>
              <tr>
                <th>Priority Level</th>
                <th>Signal Keywords</th>
                <th>Score Weighting</th>
                <th>Expected Turnaround</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="pill-badge pill-prio-High">High</span></td>
                <td>spark, sparking, short circuit, shock, fire, smoke, burning, exposed wire, flood, gas, leak, unsafe</td>
                <td>+3 pts per keyword (+3 if Safety category, +1 if Electrical)</td>
                <td>Immediate dispatch (1–2 hours)</td>
              </tr>
              <tr>
                <td><span className="pill-badge pill-prio-Medium">Medium</span></td>
                <td>not working, broken, overflow, no water, blocked, slow, dirty, smell, damaged, crack</td>
                <td>+1 pt per keyword</td>
                <td>Standard 24-hour cycle</td>
              </tr>
              <tr>
                <td><span className="pill-badge pill-prio-Low">Low</span></td>
                <td>General cosmetic requests, routine cleaning, loose chair screw</td>
                <td>0 additional keywords</td>
                <td>Scheduled facilities sweep</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section: Duplicate Detection Explanation */}
        <div className="feature-deep-dive-card">
          <span className="eyebrow">Anti-Clutter Innovation</span>
          <h3 style={{ fontSize: '1.4rem', margin: '4px 0 12px 0' }}>
            Intelligent Duplicate Detection
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            When common infrastructure fails (like an auditorium projector or washroom tap), students typically flood registers with repeated complaints. FixIt prevents this with smart merging:
          </p>

          <div className="before-after-box">
            <div className="before-col">
              <h4 style={{ color: '#B91C1C', margin: '0 0 8px 0' }}>❌ Traditional Systems</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#7F1D1D' }}>
                10 students report "Fan sparking in Room 204". Result: 10 separate tickets created, maintenance desk overwhelmed with duplicate tracking and calls.
              </p>
            </div>
            <div className="after-col">
              <h4 style={{ color: '#15803D', margin: '0 0 8px 0' }}>✅ FixIt CEC Smart Merge</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#14532D' }}>
                First report creates <strong>FIX-1005</strong>. Subsequent 9 reports automatically merge as <strong>“Me-Too” upvotes (Total: 10)</strong>, elevating urgency without duplicate clutter!
              </p>
            </div>
          </div>
        </div>

        {/* Section: Room QR Integration */}
        <div className="feature-deep-dive-card">
          <span className="eyebrow">Zero Friction Access</span>
          <h3 style={{ fontSize: '1.4rem', margin: '4px 0 12px 0' }}>
            Classroom QR Code Integration
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Physical posters placed in classrooms encode a deep-link with the block and room parameters:
          </p>
          <div style={{ background: '#1B1B1F', color: '#FFA41B', padding: '14px 20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.95rem' }}>
            https://canara-fixit.edu/report?loc=Main Block|Room 204
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '14px' }}>
            When scanned, the URL parameter automatically pre-populates the <em>Campus Block</em> and <em>Room</em> fields, displaying a verification banner and eliminating typing errors.
          </p>
        </div>

        {/* Section: FAQ Accordion */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="eyebrow">Frequently Asked Questions</span>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>Got Questions? We've Got Answers.</h3>
          </div>
          <FAQ />
        </div>

      </div>
    </div>
  );
}
