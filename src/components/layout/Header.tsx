"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Bell, Shield } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-semibold mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{session?.user?.role}</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
