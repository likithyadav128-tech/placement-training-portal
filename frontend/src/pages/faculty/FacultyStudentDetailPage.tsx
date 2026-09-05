import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Code,
  Brain,
  Award,
  Sparkles,
  Mail
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { studentService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const FacultyStudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<any | null>(null);
  const [perf, setPerf] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        const [stuRes, perfRes, anaRes] = await Promise.all([
          studentService.getStudentDetail(Number(id)),
          studentService.getPerformance(Number(id)),
          studentService.getAnalysis(Number(id)),
        ]);
        setStudent(stuRes);
        setPerf(perfRes);
        setAnalysis(anaRes);
      } catch (err) {
        console.error('Error fetching student detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading || !student || !perf) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const timelineData = [
    { date: 'Aug 10', score: 68 },
    { date: 'Aug 18', score: 71 },
    { date: 'Aug 25', score: 74 },
    { date: 'Sep 01', score: perf.overall_score },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/faculty/students')}
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to Students Directory
      </Button>

      {/* Student Banner Card */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
              {student.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                <Badge variant={perf.overall_score >= 70 ? 'success' : 'warning'} size="sm">
                  {perf.overall_score >= 70 ? 'Ready' : 'Needs Support'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Roll ID: <span className="font-semibold text-slate-800">{student.student_id}</span> • {student.department_name} • Year {student.year} (Section {student.section}) • CGPA: {student.cgpa}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Placement Readiness Score
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{perf.overall_score}%</div>
          </div>
        </CardContent>
      </Card>

      {/* 3 Core Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Coding & DSA</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{perf.coding_score}%</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
              <Code className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Aptitude & Logic</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{perf.aptitude_score}%</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Brain className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Mock Exam Simulation</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{perf.mock_score}%</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trajectory Chart & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover>
          <CardHeader>
            <CardTitle>Historical Performance Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="score" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} name="Readiness" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {perf.recent_activity.map((act: any) => (
                <div key={act.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{act.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{act.completed_at || 'Recently'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{act.score}%</span>
                    <Badge variant={act.score >= 70 ? 'success' : 'warning'} size="sm">
                      {act.score >= 70 ? 'Passed' : 'Needs Review'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grounded Recommendations & Interventions */}
      {analysis?.recommendations && (
        <Card hover>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <CardTitle>Faculty Guidance & Recommended Interventions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{rec.title}</span>
                  <Badge variant={rec.priority === 'HIGH' ? 'danger' : 'secondary'} size="sm">
                    {rec.priority} Priority
                  </Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
