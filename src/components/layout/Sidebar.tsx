"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  GraduationCap, 
  LayoutDashboard, 
  TrendingUp, 
  Code2, 
  FileCheck2, 
  Milestone, 
  Lightbulb, 
  UserCircle, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  FileSpreadsheet, 
  History, 
  Settings,
  LogOut,
  FolderKanban
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar({ role }: { role: "STUDENT" | "FACULTY" | "MANAGEMENT" }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Performance", href: "/student/performance", icon: TrendingUp },
    { label: "Assessments", href: "/student/assessments", icon: Code2 },
    { label: "Coding Sandbox", href: "/student/coding-sandbox", icon: Code2 },
    { label: "Mock Tests", href: "/student/mock-tests", icon: FileCheck2 },
    { label: "My Roadmap", href: "/student/roadmap", icon: Milestone },
    { label: "Analysis & Suggestions", href: "/student/analysis", icon: Lightbulb },
    { label: "Profile", href: "/student/profile", icon: UserCircle },
  ];

  const facultyNav: NavItem[] = [
    { label: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
    { label: "Students Directory", href: "/faculty/students", icon: Users },
    { label: "Cohort Analytics", href: "/faculty/analytics", icon: TrendingUp },
    { label: "Profile", href: "/faculty/profile", icon: UserCircle },
  ];

  const managementNav: NavItem[] = [
    { label: "Dashboard", href: "/management/dashboard", icon: LayoutDashboard },
    { label: "Student Management", href: "/management/students", icon: Users },
    { label: "Faculty Management", href: "/management/faculty", icon: UserCircle },
    { label: "Assessment Authoring", href: "/management/assessments", icon: BookOpen },
    { label: "Mock Tests Manager", href: "/management/mock-tests", icon: FileCheck2 },
    { label: "Roadmaps Manager", href: "/management/roadmaps", icon: FolderKanban },
    { label: "Permission Matrix (RBAC)", href: "/management/permissions", icon: ShieldCheck },
    { label: "Reports & CSV Export", href: "/management/reports", icon: FileSpreadsheet },
    { label: "Audit Logs", href: "/management/audit-logs", icon: History },
    { label: "System Settings", href: "/management/settings", icon: Settings },
  ];

  const items = role === "STUDENT" ? studentNav : role === "FACULTY" ? facultyNav : managementNav;

  const roleBadge = 
    role === "STUDENT" 
      ? { label: "STUDENT SPACE", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" }
      : role === "FACULTY"
      ? { label: "FACULTY SPACE", bg: "bg-blue-100 text-blue-800 border-blue-300" }
      : { label: "MANAGEMENT SPACE", bg: "bg-rose-100 text-rose-800 border-rose-300" };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm font-black text-xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 leading-tight text-base">Placement Portal</h1>
          <p className="text-xs text-slate-500 font-semibold">Prepare smarter. Perform better.</p>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-5 pt-4 pb-2">
        <span className={cn("text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border", roleBadge.bg)}>
          🛡️ {roleBadge.label}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="mb-3">
          <div className="font-extrabold text-sm text-slate-900 truncate">{session?.user?.name || "User"}</div>
          <div className="text-xs text-slate-500 font-medium truncate">{session?.user?.email}</div>
          {session?.user?.department && (
            <div className="text-[11px] text-blue-700 font-bold mt-0.5 truncate">{session.user.department}</div>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
