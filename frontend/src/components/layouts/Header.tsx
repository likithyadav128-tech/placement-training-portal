import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const firstName = user.name ? user.name.split(' ')[0] : 'Student';

  const notifications = [
    { id: 1, title: 'DSA Live Mock Session', text: 'Live doubt clearing starts at 11:00 AM.', time: '10m ago' },
    { id: 2, title: 'Roadmap Milestone Achieved', text: 'Math & Aptitude progress reached 70%.', time: '1h ago' },
    { id: 3, title: 'Upcoming Campus Drive', text: 'Google Placement Registration open until Friday.', time: '1d ago' },
  ];

  return (
    <header className="h-20 bg-transparent px-4 md:px-7 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Greeting matching screenshot */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl bg-white text-slate-600 shadow-xs hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-sans">
            Hello, {firstName}!
          </h1>
          <p className="text-xs text-slate-400 font-medium">Have a good day!</p>
        </div>
      </div>

      {/* Center: Search Pill matching screenshot */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments, roadmaps, mentors..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 focus:bg-white text-xs rounded-full border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400/30 shadow-xs text-slate-700 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right: User Profile & Notification Bell matching screenshot */}
      <div className="flex items-center gap-3">
        {/* User Pill Capsule */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 bg-white/80 hover:bg-white p-1.5 pr-3 rounded-2xl border border-slate-100 shadow-xs transition-all"
          >
            {/* Warm Yellow Avatar matching screenshot */}
            <div className="h-9 w-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shadow-inner uppercase">
              {user.name ? user.name.slice(0, 2) : 'AN'}
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-slate-800 truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {user.role === 'STUDENT' ? 'Student' : user.role === 'FACULTY' ? 'Mentor' : 'Admin'}
              </span>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
                  {user.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/student/profile');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 text-left"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                Profile Details
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

        {/* Notification Bell Box matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-10 w-10 bg-white/90 hover:bg-white rounded-xl border border-slate-100 shadow-xs flex items-center justify-center text-slate-600 hover:text-purple-600 relative transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                <span className="text-[10px] text-purple-600 font-semibold cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-purple-50/50 transition-colors">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
