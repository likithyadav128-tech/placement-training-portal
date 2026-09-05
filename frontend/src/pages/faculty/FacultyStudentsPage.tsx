import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, ExternalLink, GraduationCap } from 'lucide-react';
import { facultyService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const FacultyStudentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState(
    searchParams.get('performance_filter') || ''
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await facultyService.listStudents({
        search: search || undefined,
        department: department || undefined,
        year: year ? Number(year) : undefined,
        performance_filter: performanceFilter || undefined,
        page,
        limit: 10,
      });
      setStudents(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, department, year, performanceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Search, filter, and inspect placement readiness across your assigned departments
        </p>
      </div>

      {/* Search and Filters Card */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or roll ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          {/* Year Filter */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="">All Years</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year (Graduating)</option>
          </select>

          {/* Performance Filter */}
          <select
            value={performanceFilter}
            onChange={(e) => {
              setPerformanceFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="">All Performance Levels</option>
            <option value="top">Top Performers (&gt; 80%)</option>
            <option value="at_risk">At-Risk (&lt; 60%)</option>
          </select>
        </form>
      </Card>

      {/* Students Table */}
      <Card hover>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Dept / Year</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Coding</th>
                  <th className="py-3 px-4">Aptitude</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading student records...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  students.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{stu.student_id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{stu.name}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {stu.department} • Year {stu.year} ({stu.section})
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{stu.overall_score}%</td>
                      <td className="py-3 px-4 text-slate-700">{stu.coding_score}%</td>
                      <td className="py-3 px-4 text-slate-700">{stu.aptitude_score}%</td>
                      <td className="py-3 px-4">
                        <Badge variant={stu.is_at_risk ? 'danger' : 'success'} size="sm">
                          {stu.is_at_risk ? 'At-Risk' : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => navigate(`/faculty/students/${stu.id}`)}
                          variant="ghost"
                          size="sm"
                          rightIcon={<ExternalLink className="h-3 w-3" />}
                        >
                          View Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {students.length} of {total} students
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
              >
                Prev
              </Button>
              <span className="font-semibold text-slate-800">
                Page {page} of {pages || 1}
              </span>
              <Button
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                disabled={page >= pages}
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
