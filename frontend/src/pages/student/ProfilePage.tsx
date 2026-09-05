import React from 'react';
import { User, Mail, GraduationCap, Building2, Calendar, Award, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Account identity, academic registration details, and institutional role
        </p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6">
            <div className="h-20 w-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {user.email}
                </span>
                <span>•</span>
                <Badge variant="primary" size="sm">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Academic Profile Details if Student */}
          {user.role === 'STUDENT' && user.student_profile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Student Roll ID</span>
                <span className="font-bold text-sm text-slate-900">{user.student_profile.student_id}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Department</span>
                <span className="font-bold text-sm text-slate-900">{user.student_profile.department_name || 'Engineering'}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Academic Year & Section</span>
                <span className="font-bold text-sm text-slate-900">Year {user.student_profile.year} • Section {user.student_profile.section}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Cumulative GPA</span>
                <span className="font-bold text-sm text-slate-900">{user.student_profile.cgpa} / 10.0</span>
              </div>
            </div>
          )}

          {/* Faculty Profile Details if Faculty */}
          {user.role === 'FACULTY' && user.faculty_profile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Employee ID</span>
                <span className="font-bold text-sm text-slate-900">{user.faculty_profile.employee_id}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Designation</span>
                <span className="font-bold text-sm text-slate-900">{user.faculty_profile.designation}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
