import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';

export default function NotFound() {
  return (
    <div>
      <PageBanner
        title="404 – Page Not Found"
        subtitle="The page you are looking for does not exist on FixIt CEC."
        breadcrumb="404"
      />

      <div className="container-custom" style={{ paddingBottom: '80px', textAlign: 'center' }}>
        <div className="form-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚧</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Lost on Campus?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '1rem' }}>
            We couldn't locate the requested FixIt portal path. You can return to the main dashboard or report an issue.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-pill btn-primary-coral">
              <span>Back to Home</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/report" className="btn-pill btn-outline-dark">
              <span>Report an Issue</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
