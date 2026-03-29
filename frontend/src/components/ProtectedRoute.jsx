import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
        }
      } catch {
        setAuthState('unauthenticated');
      }
    };
    checkAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-fusion-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-fusion-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return authState === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
