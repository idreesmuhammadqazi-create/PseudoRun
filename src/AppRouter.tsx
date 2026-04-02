/**
 * App Router
 * Handles routing for the entire application
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import TryingToGetBacklinks from './components/TryingToGetBacklinks/TryingToGetBacklinks';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import { useAuth } from './contexts/AuthContext';

function ProtectedAdminRoute() {
  const { currentUser, loading, isAdmin } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);
  const [adminAllowed, setAdminAllowed] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!currentUser) {
      setAdminChecked(true);
      setAdminAllowed(false);
      return;
    }
    isAdmin().then((allowed) => {
      setAdminAllowed(allowed);
      setAdminChecked(true);
    });
  }, [currentUser, loading]);

  if (!adminChecked) {
    return <div>Loading...</div>;
  }

  if (!adminAllowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tryingtogetbacklinks" element={<TryingToGetBacklinks />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
