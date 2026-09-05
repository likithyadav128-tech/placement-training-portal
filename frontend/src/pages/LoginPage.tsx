import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Shield, User, GraduationCap, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const { loginAsDemo, loginWithMicrosoft, error, clearError } = useAuth();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const demoAccounts = [
    {
      role: 'STUDENT (Tier 1 High Performer)',
      email: 'student1@institution.edu',
      name: 'Rohan Verma (CSE, 4th Year)',
      icon: GraduationCap,
      badge: 'bg-sky-100 text-sky-800',
    },
    {
      role: 'STUDENT (Needs Support)',
      email: 'student9@institution.edu',
      name: 'Siddharth Gupta (CSE, 4th Year)',
      icon: GraduationCap,
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      role: 'FACULTY COORDINATOR',
      email: 'prof.sharma@institution.edu',
      name: 'Prof. Arvind Sharma (CSE Placement Lead)',
      icon: Users,
      badge: 'bg-indigo-100 text-indigo-800',
    },
    {
      role: 'DEAN / MANAGEMENT ADMIN',
      email: 'admin@institution.edu',
      name: 'Dr. Rajeshwar Rao (Dean Placements)',
      icon: Shield,
      badge: 'bg-rose-100 text-rose-800',
    },
  ];

  const handleDemoLogin = async (email: string) => {
    clearError();
    setLoadingEmail(email);
    try {
      const loggedInUser = await loginAsDemo(email);
      if (loggedInUser.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (loggedInUser.role === 'FACULTY') {
        navigate('/faculty/dashboard');
      } else if (loggedInUser.role === 'MANAGEMENT') {
        navigate('/management/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleMicrosoftLogin = () => {
    // Standard OAuth2 redirect simulation for Entra ID
    alert('Connecting to Microsoft Entra ID OpenID Connect endpoint...\n(Use the institutional fast login cards below to test any role instantly)');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* LEFT SIDE: Brand & Value Proposition */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-brand-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">Placement Training Portal</span>
          </div>

          <div className="mt-16 lg:mt-24 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Prepare smarter. <br />
              Perform better. <br />
              <span className="text-brand-300">Get placement ready.</span>
            </h1>
            <p className="mt-4 text-slate-300 text-sm lg:text-base leading-relaxed">
              An institutional platform engineered for universities. Real-time coding assessments,
              data-driven aptitude analysis, personalized roadmaps, and administrative governance.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Enterprise University Edition</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Card */}
      <div className="lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Institutional Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your authentication method or institutional role.
            </p>
          </div>

          {error && (
            <Alert variant="error" title="Authentication Error">
              {error}
            </Alert>
          )}

          {/* Microsoft Login Card */}
          <Card className="border-slate-300 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <button
                onClick={handleMicrosoftLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Continue with Microsoft
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>Secure institutional authentication (Entra ID / OAuth 2.0)</span>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Fast-Login Test Switcher */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-slate-50 px-3 font-semibold text-slate-500 tracking-wider">
                  Or Instant Demo Role Access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isThisLoading = loadingEmail === acc.email;
                return (
                  <button
                    key={acc.email}
                    onClick={() => handleDemoLogin(acc.email)}
                    disabled={!!loadingEmail}
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-card-hover transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {acc.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${acc.badge}`}>
                            {acc.role.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {acc.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-400 group-hover:text-slate-900 transition-colors ml-2">
                      {isThisLoading ? (
                        <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
