import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Map,
  Lightbulb,
  User,
  LogOut,
  Users,
  GraduationCap,
  Award,
  ShieldCheck,
  FileBarChart,
  History,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Performance', path: '/student/performance', icon: TrendingUp },
    { name: 'Assessments', path: '/student/assessments', icon: BookOpen },
    { name: 'Mock Tests', path: '/student/mock-tests', icon: Award },
    { name: 'My Roadmap', path: '/student/roadmap', icon: Map },
    { name: 'Analysis & Suggestions', path: '/student/analysis', icon: Lightbulb },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const facultyNav = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/faculty/students', icon: Users },
    { name: 'Assessments', path: '/student/assessments', icon: BookOpen },
    { name: 'Analytics', path: '/faculty/analytics', icon: TrendingUp },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const managementNav = [
    { name: 'Dashboard', path: '/management/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/management/students', icon: GraduationCap },
    { name: 'Faculty', path: '/management/faculty', icon: Users },
    { name: 'Assessments', path: '/management/assessments', icon: BookOpen },
    { name: 'Mock Tests', path: '/management/mock-tests', icon: Award },
    { name: 'Roadmaps', path: '/management/roadmaps', icon: Map },
    { name: 'Permissions', path: '/management/permissions', icon: ShieldCheck },
    { name: 'Reports', path: '/management/reports', icon: FileBarChart },
    { name: 'Audit Logs', path: '/management/audit-logs', icon: History },
    { name: 'Settings', path: '/management/settings', icon: Settings },
  ];

  const navItems = user.role === 'STUDENT' ? studentNav : user.role === 'FACULTY' ? facultyNav : managementNav;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Sparkles className="h-4 w-4 text-brand-300" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Placement Portal</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  )
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={async () => {
              onClose();
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
