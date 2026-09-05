import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'FACULTY':
      return <Navigate to="/faculty/dashboard" replace />;
    case 'MANAGEMENT':
      return <Navigate to="/management/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};
