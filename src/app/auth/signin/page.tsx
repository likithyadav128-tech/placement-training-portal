"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  Users,
  Code2,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "FACULTY" | "MANAGEMENT">("STUDENT");
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [rollNumber, setRollNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("An unexpected sign in error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
          departmentCode: selectedDept,
          rollNumber: selectedRole === "STUDENT" ? rollNumber : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register account");
      }

      setSuccessMsg("Account created! Signing you in automatically...");
      // Auto sign in
      const signinRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signinRes?.error) {
        setTab("signin");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register");
      setIsLoading(false);
    }
  };

  const quickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-4 md:p-8">
      {/* Background Decor */}
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero / Brand Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-inner">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">PLACEMENT PORTAL</h1>
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Enterprise Edition</p>
              </div>
            </div>

            <div className="space-y-6 my-8">
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/10 rounded-lg shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Database-Driven RBAC</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Strict role resolution for Students, Faculty Coordinators, and Academic Management.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/10 rounded-lg shrink-0 mt-0.5">
                  <Code2 className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Live Multi-Language Sandbox</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Execute Python, JavaScript, C++, and Java with real-time test verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-white/10 rounded-lg shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Institutional Analytics</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Real-time cohort readiness, department benchmarks, and audit trail logs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-slate-400">
            Deployed on Vercel Edge Network &bull; High Reliability
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("signin");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
                  tab === "signin" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
                  tab === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* SSO Buttons */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9H11z" />
                  <path fill="#ffb900" d="M11 11h9v9H11z" />
                </svg>
                <span>Continue with Microsoft (Entra ID)</span>
              </button>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold transition shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-600 absolute">
                Or with Credentials
              </span>
            </div>

            {tab === "signin" ? (
              <form onSubmit={handleCredentialsSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoading ? "Authenticating..." : "Sign In to Portal"}
                </button>

                {/* 1-Click Demo Accounts */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-2xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                    Quick Demo Switcher
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-2xs">
                    <button
                      type="button"
                      onClick={() => quickDemoLogin("likith@student.college.edu")}
                      className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-bold text-center"
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => quickDemoLogin("coordinator@college.edu")}
                      className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-bold text-center"
                    >
                      👨‍🏫 Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => quickDemoLogin("dean@college.edu")}
                      className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-bold text-center"
                    >
                      🏛️ Management
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@college.edu"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Portal Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="MANAGEMENT">Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>
                  </div>
                </div>

                {selectedRole === "STUDENT" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">USN / Roll Number</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="1MS22CS001"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-lg text-sm transition shadow-sm mt-2"
                >
                  {isLoading ? "Creating Account..." : "Create Account & Sign In"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
