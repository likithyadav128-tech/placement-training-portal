"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-2xl shadow-xl p-8 text-center border-t-4 border-t-rose-600">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 font-black">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied (403)</h1>
        <p className="text-sm font-semibold text-slate-600 mb-6">
          You do not have the required institutional authorization to access this section of the portal.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Dashboard
        </Link>
      </div>
    </div>
  );
}
