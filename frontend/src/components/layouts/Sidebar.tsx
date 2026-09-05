import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  CheckSquare,
  Map,
  Lightbulb,
  User,
  LogOut,
  Users,
  GraduationCap,
  FileCheck,
  Award,
  ShieldCheck,
  FileBarChart,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  // Role-specific navigation items strictly adhering to specification
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
    <aside
      className={clsx(
        'hidden md:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 z-30 select-none',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Sparkles className="h-5 w-5 text-brand-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm text-slate-900 tracking-tight">Placement Portal</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                {user.role} Space
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
            <Sparkles className="h-5 w-5 text-brand-300" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
