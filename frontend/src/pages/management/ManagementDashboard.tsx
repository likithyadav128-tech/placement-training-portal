import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileBarChart,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { managementService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const ManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await managementService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load management analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { overview, department_performance, students_needing_attention } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institution Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            College-wide placement readiness metrics, department benchmarks, and risk monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/management/reports')}
            variant="outline"
            size="sm"
            leftIcon={<FileBarChart className="h-3.5 w-3.5" />}
          >
            Export Reports
          </Button>
          <Button
            onClick={() => navigate('/management/permissions')}
            variant="primary"
            size="sm"
            leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
          >
            Manage Permissions
          </Button>
        </div>
      </div>

      {/* 5 Institution-Level KPIs Required by Spec */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <Card hover className="border-l-4 border-l-slate-900">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overview.total_students}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Enrolled in Training</span>
          </CardContent>
        </Card>

        {/* Total Faculty */}
        <Card hover className="border-l-4 border-l-indigo-600">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Faculty
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overview.total_faculty}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Department Leads</span>
          </CardContent>
        </Card>

        {/* Average Performance */}
        <Card hover className="border-l-4 border-l-brand-600">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg Performance
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overview.average_performance}%
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">+4.1% this quarter</span>
          </CardContent>
        </Card>

        {/* Placement Readiness */}
        <Card hover className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Placement Ready
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overview.placement_readiness_rate}%
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Score &gt;= 75%</span>
          </CardContent>
        </Card>

        {/* Assessment Completion */}
        <Card hover className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overview.assessment_completion_rate}%
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Institutional Target: 85%</span>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Ranking */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-700" />
              <CardTitle>Department Placement Performance (CSE, ECE, EEE, MECH, CIVIL)</CardTitle>
            </div>
            <span className="text-xs text-slate-500">5 Departments Active</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Students Enrolled</th>
                  <th className="py-3 px-4">Average Score</th>
                  <th className="py-3 px-4">Placement Readiness Rate</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {department_performance.map((dept: any) => (
                  <tr key={dept.code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{dept.code}</td>
                    <td className="py-3 px-4 text-slate-700">{dept.student_count} Students</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{dept.avg_score}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-slate-900 h-2 rounded-full"
                            style={{ width: `${dept.placement_ready_rate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800">{dept.placement_ready_rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={dept.avg_score >= 70 ? 'success' : 'warning'} size="sm">
                        {dept.avg_score >= 70 ? 'On Track' : 'Needs Focus'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts: Students Needing Attention */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <CardTitle>Institution-Wide Priority Students Needing Attention</CardTitle>
            </div>
            <Button
              onClick={() => navigate('/management/reports')}
              variant="outline"
              size="sm"
            >
              Export At-Risk Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Roll ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Current Score</th>
                  <th className="py-3 px-4">Intervention Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students_needing_attention.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{s.student_id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600">{s.department} • Year {s.year}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{s.overall_score}%</td>
                    <td className="py-3 px-4">
                      <Badge variant="danger" size="sm">
                        {s.reason}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
