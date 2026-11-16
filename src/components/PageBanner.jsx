import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/banner.css';

export default function PageBanner({ title, subtitle, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="container-custom">
        <div className="banner-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{breadcrumb || title}</span>
        </div>
        <h1 className="banner-title">{title}</h1>
        {subtitle && <p className="banner-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
