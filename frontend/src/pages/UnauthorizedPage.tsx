import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackToDashboard = () => {
    if (user?.role === 'STUDENT') navigate('/student/dashboard');
    else if (user?.role === 'FACULTY') navigate('/faculty/dashboard');
    else if (user?.role === 'MANAGEMENT') navigate('/management/dashboard');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">403 — Access Restricted</h1>
          <p className="text-sm text-slate-500">
            You do not have the required permissions or role assignment to view this page.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button onClick={handleBackToDashboard} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
