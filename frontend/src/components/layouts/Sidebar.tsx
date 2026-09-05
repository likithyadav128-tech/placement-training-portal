import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Folder,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Award,
  Map,
  Lightbulb,
  User,
  LogOut,
  Users,
  ShieldCheck,
  FileBarChart,
  History,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Layers
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

  // Navigation items styled to match the screenshot exactly
  const studentNav = [
    { name: 'My schedule', path: '/student/mock-tests', icon: Calendar },
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Message', path: '/student/analysis', icon: MessageSquare },
    { name: 'Projects', path: '/student/assessments', icon: Folder },
    { name: 'Grades', path: '/student/performance', icon: GraduationCap },
  ];

  const facultyNav = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/faculty/students', icon: Users },
    { name: 'Assessments', path: '/student/assessments', icon: Folder },
    { name: 'Analytics', path: '/faculty/analytics', icon: TrendingUp },
  ];

  const managementNav = [
    { name: 'Dashboard', path: '/management/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/management/students', icon: GraduationCap },
    { name: 'Faculty', path: '/management/faculty', icon: Users },
    { name: 'Assessments', path: '/management/assessments', icon: Folder },
    { name: 'Permissions', path: '/management/permissions', icon: ShieldCheck },
    { name: 'Reports', path: '/management/reports', icon: FileBarChart },
    { name: 'Audit Logs', path: '/management/audit-logs', icon: History },
  ];

  const navItems = user.role === 'STUDENT' ? studentNav : user.role === 'FACULTY' ? facultyNav : managementNav;

  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col bg-white border-r border-slate-100 transition-all duration-300 z-30 select-none py-5 px-3.5 justify-between',
        collapsed ? 'w-20' : 'w-60'
      )}
    >
      <div>
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-sm">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight font-sans">
                Robotech
              </span>
            </div>
          ) : (
            <div className="mx-auto h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <Layers className="h-5 w-5 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group',
                    isActive
                      ? 'bg-[#EAE5F8] text-[#7C3AED] font-semibold shadow-xs'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-slate-100"></div>

        {/* Secondary Navigation (Settings & Logout) */}
        <div className="space-y-1.5">
          <NavLink
            to={user.role === 'MANAGEMENT' ? '/management/settings' : '/student/profile'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group',
                isActive
                  ? 'bg-[#EAE5F8] text-[#7C3AED] font-semibold shadow-xs'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )
            }
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title={collapsed ? 'Log out' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* Bottom Pinned Support */}
      <div className="pt-4 px-2">
        <button
          onClick={() => alert('Support & Help Desk: support@institution.edu')}
          className="flex items-center gap-2.5 text-xs font-medium text-slate-400 hover:text-purple-600 transition-colors"
          title={collapsed ? 'Support' : undefined}
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Support</span>}
        </button>
      </div>
    </aside>
  );
};
