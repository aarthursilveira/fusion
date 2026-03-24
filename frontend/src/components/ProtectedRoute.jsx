import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Simple check for token in cookies (actually we should check via API or state)
  // For now, assume a mock check
  const isAuthenticated = true; // TODO: Implement real auth check

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
