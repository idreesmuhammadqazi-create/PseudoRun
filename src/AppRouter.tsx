/**
 * App Router
 * Handles routing for the entire application
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import TryingToGetBacklinks from './components/TryingToGetBacklinks/TryingToGetBacklinks';
import TechnicalDeepDive from './components/TechnicalDeepDive/TechnicalDeepDive';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/how-it-works" element={<TechnicalDeepDive />} />
        <Route path="/tryingtogetbacklinks" element={<TryingToGetBacklinks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
