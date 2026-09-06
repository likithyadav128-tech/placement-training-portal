import React from "react";
import { MetricCard, Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertTriangle, ArrowRight, UserCheck } from "lucide-react";

export default async function FacultyDashboardPage() {
  const students = await prisma.student.findMany({
    include: { department: true, user: true },
    orderBy: { overallScore: "asc" },
  });

  const atRiskStudents = students.filter((s) => s.overallScore < 65);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Coordinator Overview</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Real-time cohort performance and automated student risk alerts.
        </p>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Assigned Students" value={students.length} subtext="Cohort CSE/ECE 4th Year" borderColor="border-slate-900" />
        <MetricCard label="Average Score" value="74.8%" subtext="+3.2% vs last term" subtextColor="positive" borderColor="border-blue-600" />
        <MetricCard label="Assessment Completion" value="86.4%" subtext="Target: 80%" subtextColor="positive" borderColor="border-emerald-600" />
        <MetricCard label="Needs Attention" value={atRiskStudents.length} subtext="At-Risk (<65% score)" subtextColor="danger" borderColor="border-rose-600" />
      </div>

      {/* Students Needing Attention Alert Table */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-rose-800 font-black text-sm mb-3">
          <AlertTriangle className="w-5 h-5" />
          <span>⚠️ Students Needing Immediate Attention</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Students below the 65% placement readiness threshold requiring mentorship intervention.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Priority Reason</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atRiskStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.studentId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.user.name}</td>
                  <td className="py-3 px-4">{s.department.code}</td>
                  <td className="py-3 px-4">
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-black text-[11px]">{s.overallScore}%</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Aptitude Math ({s.aptitudeScore}%) below benchmark</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/faculty/students/${s.id}`}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-extrabold"
                    >
                      Deep-Dive <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
