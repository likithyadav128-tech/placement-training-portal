import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, Filter, Building2, AlertTriangle, Users } from 'lucide-react';
import { managementService, facultyService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ReportsPage: React.FC = () => {
  const [department, setDepartment] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await facultyService.listStudents({ department: department || undefined, limit: 50 });
        setStudents(res.items);
      } catch (err) {
        console.error('Error fetching students for report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [department]);

  const handleExportCSV = () => {
    managementService.exportPerformanceCSV();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Placement Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export verified institutional performance reports for accreditation and corporate recruitment
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="primary"
          size="sm"
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export CSV Performance Report
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Filter Department:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="">All Departments (Institution-wide)</option>
            <option value="CSE">CSE - Computer Science</option>
            <option value="ECE">ECE - Electronics & Comm</option>
            <option value="EEE">EEE - Electrical & Electronics</option>
            <option value="MECH">MECH - Mechanical Engg</option>
            <option value="CIVIL">CIVIL - Civil Engg</option>
          </select>
        </div>
        <span className="text-xs text-slate-500 font-medium">{students.length} Records Generated</span>
      </Card>

      {/* Generated Report Table */}
      <Card hover>
        <CardHeader>
          <CardTitle>Cohort Readiness Report Preview</CardTitle>
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
                  <th className="py-3 px-4">Coding Score</th>
                  <th className="py-3 px-4">Aptitude Score</th>
                  <th className="py-3 px-4">Mock Score</th>
                  <th className="py-3 px-4 text-right">Recruitment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{s.student_id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600">{s.department} • Y{s.year}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.overall_score}%</td>
                    <td className="py-3 px-4 text-slate-700">{s.coding_score}%</td>
                    <td className="py-3 px-4 text-slate-700">{s.aptitude_score}%</td>
                    <td className="py-3 px-4 text-slate-700">{s.mock_score}%</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={s.overall_score >= 75 ? 'success' : s.overall_score < 60 ? 'danger' : 'warning'} size="sm">
                        {s.overall_score >= 75 ? 'Placement Ready' : s.overall_score < 60 ? 'Needs Support' : 'Moderate'}
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
