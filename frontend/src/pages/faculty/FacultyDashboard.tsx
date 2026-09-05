import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { facultyService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await facultyService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching faculty dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { metrics, needs_attention } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor assigned cohorts, track assessment completions, and intervene with at-risk students
          </p>
        </div>

        <Button
          onClick={() => navigate('/faculty/students')}
          variant="outline"
          size="sm"
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          View All Students
        </Button>
      </div>

      {/* 4 Core Metrics Required by Spec */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students Assigned */}
        <Card hover className="border-l-4 border-l-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Students Assigned
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {metrics.students_assigned}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Department Cohort</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Average Performance */}
        <Card hover className="border-l-4 border-l-brand-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Average Performance
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {metrics.average_performance}%
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">+3.2% vs last term</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Assessment Completion */}
        <Card hover className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Assessment Completion
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {metrics.assessment_completion_rate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Target: 80%</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card hover className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Needs Attention
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {metrics.needs_attention_count}
              </div>
              <span className="text-[10px] text-rose-600 font-medium">Requires faculty guidance</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Needing Attention Table */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Students Needing Immediate Attention</CardTitle>
            </div>
            <Button
              onClick={() => navigate('/faculty/students?performance_filter=at_risk')}
              variant="outline"
              size="sm"
            >
              View All At-Risk Students
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Attention Reason</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {needs_attention.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No students currently flagged as needing attention.
                    </td>
                  </tr>
                ) : (
                  needs_attention.map((stu: any) => (
                    <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{stu.student_id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{stu.name}</td>
                      <td className="py-3 px-4 text-slate-600">{stu.department} • Year {stu.year}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-rose-600">{stu.overall_score}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="danger" size="sm">
                          {stu.reason}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => navigate(`/faculty/students/${stu.id}`)}
                          variant="ghost"
                          size="sm"
                          rightIcon={<ExternalLink className="h-3 w-3" />}
                        >
                          Open Profile
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
