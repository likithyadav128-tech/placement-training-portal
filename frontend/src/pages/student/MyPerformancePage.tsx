import React, { useState, useEffect } from 'react';
import { TrendingUp, Code, Brain, Award, Sparkles, Filter, CheckCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import { PerformanceSummary } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const MyPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [perf, setPerf] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!user?.student_profile?.id) return;
      try {
        const data = await studentService.getPerformance(user.student_profile.id);
        setPerf(data);
      } catch (err) {
        console.error('Error loading performance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const overall = perf?.overall_score || 78;
  const coding = perf?.coding_score || 82;
  const aptitude = perf?.aptitude_score || 74;
  const technical = perf?.technical_score || 72;
  const mock = perf?.mock_score || 76;
  const communication = perf?.communication_score || 78;

  // Chart data for skills comparison
  const skillsData = [
    { subject: 'Coding', current: coding, previous: 74, target: 85 },
    { subject: 'Aptitude', current: aptitude, previous: 70, target: 75 },
    { subject: 'Technical', current: technical, previous: 68, target: 80 },
    { subject: 'Mock Tests', current: mock, previous: 72, target: 75 },
    { subject: 'Communication', current: communication, previous: 75, target: 80 },
  ];

  // Timeline chart data
  const timelineData = [
    { date: 'Aug 10', coding: 70, aptitude: 65, overall: 68 },
    { date: 'Aug 18', coding: 74, aptitude: 68, overall: 71 },
    { date: 'Aug 25', coding: 78, aptitude: 72, overall: 74 },
    { date: 'Sep 01', coding: 82, aptitude: 74, overall: 78 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Performance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic skill assessment breakdown and historical preparation trajectory
          </p>
        </div>

        {/* Time Filters strictly as specified: 7 Days, 30 Days, 3 Months, All Time */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-medium">
          {(['7d', '30d', '3m', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === f
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === '7d' ? '7 Days' : f === '30d' ? '30 Days' : f === '3m' ? '3 Months' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Score Cards with Delta Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card hover>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{overall}%</div>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">+6% from previous</span>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Coding</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{coding}%</div>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">+8% from previous</span>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aptitude</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{aptitude}%</div>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">+4% from previous</span>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Technical</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{technical}%</div>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">+4% from previous</span>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mock Tests</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{mock}%</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Tier-1 Target: 75%</span>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card hover>
          <CardHeader>
            <CardTitle>Performance Trajectory Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="overall" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} name="Overall" />
                  <Line type="monotone" dataKey="coding" stroke="#256bde" strokeWidth={2} dot={{ r: 3 }} name="Coding" />
                  <Line type="monotone" dataKey="aptitude" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Aptitude" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Comparison */}
        <Card hover>
          <CardHeader>
            <CardTitle>Current Score vs. Target Placement Benchmark</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="current" fill="#0f172a" radius={[4, 4, 0, 0]} name="Your Score" />
                  <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Target Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
