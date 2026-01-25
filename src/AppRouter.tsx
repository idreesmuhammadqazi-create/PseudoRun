/**
 * App Router
 * Handles routing for the entire application
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import TryingToGetBacklinks from './components/TryingToGetBacklinks/TryingToGetBacklinks';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tryingtogetbacklinks" element={<TryingToGetBacklinks />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
