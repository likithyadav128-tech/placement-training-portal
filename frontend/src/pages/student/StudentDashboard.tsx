import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Brain,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import { PerformanceSummary, RoadmapData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [perf, setPerf] = useState<PerformanceSummary | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.student_profile?.id) return;
      try {
        const studentId = user.student_profile.id;
        const [perfData, roadData, recData] = await Promise.all([
          studentService.getPerformance(studentId),
          studentService.getRoadmap(studentId),
          studentService.getRecommendations(studentId),
        ]);
        setPerf(perfData);
        setRoadmap(roadData);
        setRecommendations(recData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  const overall = perf?.overall_score || 78;
  const coding = perf?.coding_score || 82;
  const aptitude = perf?.aptitude_score || 74;
  const mock = perf?.mock_score || 76;

  const topRec = recommendations[0] || {
    category: 'Quantitative Aptitude',
    message: 'Your quantitative aptitude performance is below your target.',
    action_label: 'Practice Now',
    action_url: '/student/assessments?category=Quantitative'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Roll No: {user?.student_profile?.student_id || 'STU001'} • Department of{' '}
            {user?.student_profile?.department_name || 'Engineering'}
          </p>
        </div>
        <Badge variant={overall >= 75 ? 'success' : 'warning'} size="md">
          {overall >= 75 ? 'Placement Ready' : 'In Preparation'}
        </Badge>
      </div>

      {/* Compact Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall */}
        <Card hover className="border-l-4 border-l-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{overall}%</div>
              <span className="text-[10px] text-emerald-600 font-medium">+6% readiness</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Coding */}
        <Card hover className="border-l-4 border-l-brand-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Coding</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{coding}%</div>
              <span className="text-[10px] text-emerald-600 font-medium">+8% this month</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
              <Code className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Aptitude */}
        <Card hover className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aptitude</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{aptitude}%</div>
              <span className="text-[10px] text-amber-600 font-medium">Target: 75%</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Brain className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Mock Tests */}
        <Card hover className="border-l-4 border-l-indigo-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mock Tests</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{mock}%</div>
              <span className="text-[10px] text-slate-500 font-medium">1 attempted</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECOMMENDED NEXT STEP Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <CardContent className="p-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-300" />
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Recommended Next Step
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{topRec.title || topRec.category}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{topRec.message}</p>
          </div>

          <Button
            onClick={() => navigate(topRec.action_url || '/student/assessments')}
            variant="secondary"
            size="md"
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold flex-shrink-0"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {topRec.action_label || 'Practice Now'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROADMAP PROGRESS */}
        <Card hover>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Placement Preparation Roadmap</CardTitle>
              <span className="text-sm font-bold text-slate-900">{roadmap?.overall_progress || 72}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Master Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-slate-900 h-3 rounded-full transition-all duration-500"
                style={{ width: `${roadmap?.overall_progress || 72}%` }}
              ></div>
            </div>

            {/* Steps mini breakdown */}
            <div className="space-y-2.5 pt-2">
              {(roadmap?.steps || []).slice(0, 4).map((step) => (
                <div key={step.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {step.status === 'COMPLETED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : step.status === 'NEEDS_ATTENTION' ? (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500">
                        {step.order}
                      </div>
                    )}
                    <span className="font-medium text-slate-800">{step.title}</span>
                  </div>
                  <span className="font-semibold text-slate-600">{step.progress}%</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/student/roadmap')}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              View Full Placement Roadmap
            </Button>
          </CardContent>
        </Card>

        {/* RECENT ACTIVITY (Latest 3-5 items) */}
        <Card hover>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {(perf?.recent_activity || []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No recent test attempts yet.</div>
              ) : (
                (perf?.recent_activity || []).map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{act.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{act.category}</span>
                        <span>•</span>
                        <span>{act.completed_at || 'Recently'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-800">{act.score}%</span>
                      <Badge variant={act.score >= 70 ? 'success' : 'warning'} size="sm">
                        {act.score >= 70 ? 'Passed' : 'Needs Review'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
