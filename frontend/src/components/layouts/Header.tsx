import React, { useState } from 'react';
import { Menu, Bell, User as UserIcon, Shield, Sparkles, Check, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'MANAGEMENT':
        return 'danger';
      case 'FACULTY':
        return 'primary';
      default:
        return 'info';
    }
  };

  const notifications = [
    { id: 1, title: 'New Assessment Published', text: 'DSA Core Assessment is now live for all 4th year students.', time: '10m ago' },
    { id: 2, title: 'Roadmap Target Updated', text: 'Target for Quantitative Aptitude set to 75%.', time: '1h ago' },
    { id: 3, title: 'Placement Mock 01', text: 'Simulation begins this Friday at 10:00 AM.', time: '1d ago' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Mobile Menu / Welcome */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium text-slate-900">Institution:</span>
          <span>College of Engineering & Technology</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Pill */}
        <Badge variant={getRoleBadgeVariant(user.role)} size="md">
          <Shield className="h-3.5 w-3.5" />
          {user.role}
        </Badge>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-brand-600 font-medium cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="font-semibold text-xs text-slate-900">{user.name}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{user.email}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1">
                  <Badge variant="secondary" size="sm">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate(user.role === 'STUDENT' ? '/student/profile' : '/student/profile');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                View Profile
              </button>

              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
