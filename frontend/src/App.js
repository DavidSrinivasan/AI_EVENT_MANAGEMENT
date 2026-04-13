import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VenueSearchPage from './pages/VenueSearchPage';
import { VenueDetailPage, CreateEventPage, DashboardPage, ProfilePage } from './pages/AllPages';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenueSearchPage />} />
        <Route path="/venue/:id" element={<VenueDetailPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
