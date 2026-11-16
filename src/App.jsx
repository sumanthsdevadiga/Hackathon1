import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Report from './pages/Report';
import Track from './pages/Track';
import HowItWorks from './pages/HowItWorks';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="report" element={<Report />} />
        <Route path="track" element={<Track />} />
        <Route path="track/:id" element={<Track />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
