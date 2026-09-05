import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Radio,
  Mic,
  FileEdit,
  RefreshCw,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Teachers / Mentors list matching the screenshot
  const teachers = [
    { id: 1, name: 'Olga Potapova', subject: 'DSA & Algorithms', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    { id: 2, name: 'Sviatosav Kush', subject: 'System Design', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    { id: 3, name: 'John Daniell', subject: 'Quantitative Aptitude', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    { id: 4, name: 'Irina Silviska', subject: 'Discrete Math & Logic', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces' },
    { id: 5, name: 'Alex Mahak', subject: 'Full Stack & IT', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces' },
  ];

  // Homework / Milestones matching the screenshot
  const homeworks = [
    { id: 1, title: 'Math & Data Structures', progress: 70, color: 'bg-rose-400', textColor: 'text-rose-500', tasks: '10 tasks left' },
    { id: 2, title: 'Physics & Core Systems', progress: 45, color: 'bg-purple-500', textColor: 'text-purple-600', tasks: '04 tasks left' },
  ];

  // Schedule items matching the screenshot
  const todaySchedule = [
    { id: 1, title: 'Book club & DSA Live', time: '11:00 - 12:30', dotColor: 'bg-cyan-500' },
    { id: 2, title: 'Physics & System Design', time: '14:30 - 15:30', dotColor: 'bg-purple-500' },
  ];

  const tomorrowSchedule = [
    { id: 3, title: 'C++ & Aptitude Speed', time: '11:00 - 12:30', dotColor: 'bg-amber-500' },
  ];

  // Events matching the screenshot
  const events = [
    { id: 1, title: 'Robot Fest: Campus Drive', date: 'Friday, 24th January 11:30 PM', icon: RefreshCw },
    { id: 2, title: 'News: Placement Webinar', date: 'Monday, 10th January 02:00 PM', icon: Radio },
    { id: 3, title: 'English Club & HR Mock', date: 'Tuesday, 18th January 11:30 PM', icon: Mic },
    { id: 4, title: 'New Best Placement Tests', date: 'Sunday, 01st January 11:30 PM', icon: FileEdit },
  ];

  // Calendar dates representation
  const calendarDays = [
    { day: 16, current: true },
    { day: 17, current: true },
    { day: 18, current: true, active: true },
    { day: 19, current: true, active: true },
    { day: 20, current: true, active: true },
    { day: 21, current: true, active: true },
    { day: 22, current: true, active: true },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
      {/* =========================================================================
          COLUMN 1: Left-Center Column (~42% on desktop -> col-span-5)
          ========================================================================= */}
      <div className="lg:col-span-5 space-y-5">
        {/* 1. Hero Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8E7CC3] via-[#7B69B3] to-[#6856A1] p-6 text-white shadow-soft">
          <div className="relative z-10 max-w-[240px] space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-200">
              Featured Masterclass
            </span>
            <h2 className="text-lg font-black leading-tight tracking-tight text-white">
              Online lesson with Web designer
            </h2>
            <p className="text-xs text-purple-200 font-medium">19.02.2025</p>

            <button
              onClick={() => navigate('/student/assessments')}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm hover:bg-purple-50 transition-all active:scale-95"
            >
              <span>Register now</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-700" />
            </button>
          </div>

          {/* 3D Character Illustration on Right */}
          <div className="absolute -right-2 bottom-0 w-44 h-48 pointer-events-none flex items-end justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Lightbulb glowing graphic */}
              <div className="absolute top-4 right-10 animate-bounce">
                <div className="h-7 w-7 rounded-full bg-amber-300 flex items-center justify-center shadow-lg shadow-amber-300/50">
                  <Lightbulb className="h-4 w-4 text-amber-900" />
                </div>
              </div>

              {/* Friendly 3D Avatar representation */}
              <div className="w-32 h-36 rounded-full bg-purple-300/30 flex items-center justify-center backdrop-blur-xs relative overflow-hidden border-2 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                  alt="Tutor"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Progress Trajectory Line Chart */}
        <div className="soft-card p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-800">Progress</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full cursor-pointer">
                <span>• {selectedYear}</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* SVG Progress Line Chart */}
          <div className="relative h-44 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Labels */}
              <g className="text-[9px] fill-slate-300 stroke-slate-100 font-sans">
                <line x1="30" y1="10" x2="390" y2="10" strokeDasharray="3 3" />
                <text x="5" y="14">25.0</text>

                <line x1="30" y1="45" x2="390" y2="45" strokeDasharray="3 3" />
                <text x="5" y="49">20.0</text>

                <line x1="30" y1="80" x2="390" y2="80" strokeDasharray="3 3" />
                <text x="5" y="84">15.0</text>

                <line x1="30" y1="115" x2="390" y2="115" strokeDasharray="3 3" />
                <text x="5" y="119">10.0</text>

                <line x1="30" y1="145" x2="390" y2="145" strokeDasharray="3 3" />
                <text x="5" y="149">0.0</text>
              </g>

              {/* Gradient Fill under path */}
              <path
                d="M 40 120 Q 75 140 100 95 T 160 30 T 210 65 T 260 90 T 320 30 T 380 15 L 380 145 L 40 145 Z"
                fill="url(#cyanGradient)"
              />

              {/* Smooth Cyan Line Stroke */}
              <path
                d="M 40 120 Q 75 140 100 95 T 160 30 T 210 65 T 260 90 T 320 30 T 380 15"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Highlight Circle on latest point */}
              <circle cx="380" cy="15" r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-4 mt-1">
              <span>August</span>
              <span>September</span>
              <span>October</span>
              <span>November</span>
              <span>December</span>
              <span>January</span>
            </div>
          </div>
        </div>

        {/* 3. Dual Mini Cards (Rating & Learning Hours) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rating Card */}
          <div className="soft-card p-4 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Rating</h4>
                <span className="text-[9px] text-slate-400">from teachers</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-black text-slate-900">8,5</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">
                  +15% vs last week
                </span>
              </div>
            </div>

            {/* Pink Smooth Sparkline */}
            <div className="h-14 w-full mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 160 50">
                <defs>
                  <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5 45 Q 30 40 50 25 T 90 35 T 130 15 T 155 10 L 155 50 L 5 50 Z"
                  fill="url(#roseGradient)"
                />
                <path
                  d="M 5 45 Q 30 40 50 25 T 90 35 T 130 15 T 155 10"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Learning Hours Card */}
          <div className="soft-card p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">Learning hours</h4>
              <div className="flex items-center gap-0.5 text-[9px] text-slate-400 cursor-pointer">
                <span>this week</span>
                <ChevronDown className="h-2.5 w-2.5" />
              </div>
            </div>

            {/* Vertical Bar Chart with Active Tooltip */}
            <div className="h-20 w-full mt-3 relative flex items-end justify-between px-1">
              {/* Friday active tooltip badge matching screenshot */}
              <div className="absolute top-0 right-7 -translate-x-1/2 bg-purple-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 z-10">
                <span>2,5 hours</span>
              </div>

              {/* Day Bars */}
              {[
                { day: 'Mo', h: '35%', active: false },
                { day: 'Tu', h: '50%', active: false },
                { day: 'We', h: '65%', active: false },
                { day: 'Th', h: '45%', active: false },
                { day: 'Fr', h: '85%', active: true },
                { day: 'Sa', h: '30%', active: false },
                { day: 'Su', h: '40%', active: false },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3.5 rounded-t-md transition-all ${
                      item.active ? 'bg-cyan-500' : 'bg-cyan-100 hover:bg-cyan-200'
                    }`}
                    style={{ height: item.h }}
                  ></div>
                  <span className="text-[9px] text-slate-400 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          COLUMN 2: Center-Right Column (~28% on desktop -> col-span-3 or 4)
          ========================================================================= */}
      <div className="lg:col-span-3 space-y-5">
        {/* 1. Days Report (Semi-circular Gauge) */}
        <div className="soft-card p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-slate-800">Days report</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                <span>Month</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Semi-circular radial gauge */}
          <div className="relative flex flex-col items-center justify-center py-2">
            <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
              <svg className="w-36 h-36 -rotate-90 origin-center" viewBox="0 0 100 100">
                {/* Background arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  strokeDasharray="125.6 125.6"
                  strokeDashoffset="0"
                />
                {/* Active Cyan arc (65%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray="81.6 125.6"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>

              {/* Percentage label in center */}
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-xl font-black text-slate-800">65%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                <span>Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                <span>Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Teachers / Mentors List */}
        <div className="soft-card p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">Teachers</h3>
            <button
              onClick={() => navigate('/faculty/students')}
              className="text-[11px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
            >
              see all
            </button>
          </div>

          <div className="space-y-3">
            {teachers.map((t) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">{t.subject}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Message sent to ${t.name}`)}
                  className="h-7 w-7 rounded-lg border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all"
                  title="Message Mentor"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Homework / Milestones */}
        <div className="soft-card p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">Homework</h3>
            <button
              onClick={() => navigate('/student/roadmap')}
              className="text-[11px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
            >
              see all
            </button>
          </div>

          <div className="space-y-4">
            {homeworks.map((hw) => (
              <div key={hw.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{hw.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{hw.tasks}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${hw.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${hw.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          COLUMN 3: Right Sidebar / Schedule Column (~30% on desktop -> col-span-4)
          ========================================================================= */}
      <div className="lg:col-span-4 space-y-5">
        {/* 1. Mini-Calendar Widget matching screenshot */}
        <div className="soft-card p-5 bg-white">
          {/* Header Month Selector */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">{selectedMonth}</h3>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-1 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Calendar week range with active vertical pill highlight */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-700 relative py-1 items-center">
            {calendarDays.map((d, index) => (
              <div key={index} className="flex justify-center">
                {d.active ? (
                  <div className="w-7 h-7 rounded-xl bg-purple-200 text-purple-900 font-bold flex items-center justify-center shadow-xs">
                    {d.day}
                  </div>
                ) : (
                  <div className="w-7 h-7 flex items-center justify-center text-slate-400 font-medium">
                    {d.day}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Today's Schedule inside calendar card */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Today</span>
              <button
                onClick={() => navigate('/student/mock-tests')}
                className="text-[10px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
              >
                see all
              </button>
            </div>

            <div className="space-y-2">
              {todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.dotColor}`}></span>
                    <span className="font-bold text-slate-700">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-50">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Tomorrow</span>
              {tomorrowSchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.dotColor}`}></span>
                    <span className="font-bold text-slate-700">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Events / Upcoming Drives Widget */}
        <div className="soft-card p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-slate-800">Events</h3>
            <button
              onClick={() => navigate('/student/assessments')}
              className="text-[11px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
            >
              see all
            </button>
          </div>

          <div className="space-y-3.5">
            {events.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="flex items-center justify-between group">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors leading-tight">
                        {evt.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{evt.date}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Registered for ${evt.title}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors flex-shrink-0"
                    title="Event details"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
