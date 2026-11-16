import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: '1 0 auto' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
