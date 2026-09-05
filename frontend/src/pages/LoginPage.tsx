import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, GraduationCap, Users, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const { loginAsDemo, loginWithMicrosoft, error, clearError } = useAuth();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'STUDENT',
      email: 'student1@institution.edu',
      name: 'Rohan Verma (CSE, 4th Year)',
      desc: 'Placement Ready • Tier 1 High Performer',
      icon: GraduationCap,
      badge: 'bg-purple-100 text-purple-800',
    },
    {
      role: 'STUDENT',
      email: 'student9@institution.edu',
      name: 'Siddharth Gupta (CSE, 4th Year)',
      desc: 'Needs Support in Quantitative Math',
      icon: GraduationCap,
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      role: 'FACULTY',
      email: 'prof.sharma@institution.edu',
      name: 'Prof. Arvind Sharma',
      desc: 'CSE Department Placement Lead & Mentor',
      icon: Users,
      badge: 'bg-cyan-100 text-cyan-800',
    },
    {
      role: 'MANAGEMENT',
      email: 'admin@institution.edu',
      name: 'Dr. Rajeshwar Rao',
      desc: 'Dean of Placements & System Governance',
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
    alert('Connecting to Microsoft Entra ID OpenID Connect...\n(Use the institutional fast login options below to explore all features instantly)');
  };

  return (
    <div className="min-h-screen bg-[#ECE7F6] relative overflow-hidden flex items-center justify-center p-4 selection:bg-purple-200">
      {/* Pastel background blobs matching UI aesthetic */}
      <div className="absolute top-0 right-0 w-[450px] h-[380px] bg-[#FED7AA]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-[550px] h-[420px] bg-[#D8B4FE]/35 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28"></div>

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/80 overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Left Side: Gradient Brand Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#8E7CC3] via-[#7B69B3] to-[#6856A1] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight font-sans">Robotech</span>
            </div>

            <div className="mt-12 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                University Placement Portal
              </span>
              <h2 className="text-2xl font-black leading-tight text-white">
                Empowering every student to achieve their dream career.
              </h2>
              <p className="text-xs text-purple-100/80 leading-relaxed pt-1">
                Real-time coding IDE, aptitude benchmarks, mentorship workflows, and automated governance.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200 font-medium">
            <span>Enterprise Edition</span>
            <span>Role-Based RBAC</span>
          </div>
        </div>

        {/* Right Side: Fast Login */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-[#F8F9FD]">
          <div className="max-w-md mx-auto w-full space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-800">Institutional Sign In</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Select your role or sign in with university credentials.
              </p>
            </div>

            {error && (
              <Alert variant="error" title="Authentication Error">
                {error}
              </Alert>
            )}

            {/* Microsoft Single Sign-On Button */}
            <button
              onClick={handleMicrosoftLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Continue with Microsoft Entra ID</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200"></div>
              <span className="absolute bg-[#F8F9FD] px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Role Access
              </span>
            </div>

            {/* Demo Fast Login Switcher Cards */}
            <div className="space-y-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isThisLoading = loadingEmail === acc.email;
                return (
                  <button
                    key={acc.email}
                    onClick={() => handleDemoLogin(acc.email)}
                    disabled={!!loadingEmail}
                    className="w-full flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-purple-300 hover:shadow-soft transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 truncate">
                            {acc.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${acc.badge}`}>
                            {acc.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          {acc.desc}
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-300 group-hover:text-purple-600 transition-colors ml-2 flex-shrink-0">
                      {isThisLoading ? (
                        <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
