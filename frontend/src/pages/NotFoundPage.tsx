import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="h-16 w-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">404 — Page Not Found</h1>
          <p className="text-sm text-slate-500">
            The page you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button onClick={() => navigate('/')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Safety
          </Button>
        </div>
      </div>
    </div>
  );
};
