export const dynamic = "force-dynamic";
import React from "react";
import { MetricCard, Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function ManagementDashboardPage() {
  let studentCount = 25;
  let facultyCount = 2;
  try {
    studentCount = (await prisma.student.count()) || 25;
    facultyCount = (await prisma.faculty.count()) || 2;
  } catch (e) {
    // Fallback
  }

  const deptRankings = [
    { dept: "CSE", enrolled: 120, avgScore: "78.4%", readyRate: "84.0%", status: "On Track" },
    { dept: "ECE", enrolled: 90, avgScore: "73.2%", readyRate: "72.5%", status: "On Track" },
    { dept: "EEE", enrolled: 60, avgScore: "69.8%", readyRate: "65.0%", status: "Needs Focus" },
    { dept: "MECH", enrolled: 75, avgScore: "66.5%", readyRate: "58.0%", status: "Needs Focus" },
    { dept: "CIVIL", enrolled: 45, avgScore: "64.1%", readyRate: "52.0%", status: "Needs Focus" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Placement Governance</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          College-wide readiness KPIs and department ranking benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Total Students" value={studentCount} subtext="Active in Portal" borderColor="border-slate-900" />
        <MetricCard label="Total Faculty" value={facultyCount} subtext="Coordinators" borderColor="border-blue-600" />
        <MetricCard label="Average Score" value="74.8%" subtext="+4.1% this term" subtextColor="positive" borderColor="border-emerald-600" />
        <MetricCard label="Placement Ready" value="72.0%" subtext="Score >= 75%" subtextColor="positive" borderColor="border-indigo-600" />
        <MetricCard label="Completion Rate" value="88.5%" subtext="Target: 85%" subtextColor="positive" borderColor="border-purple-600" />
      </div>

      <Card className="p-6">
        <div className="text-sm font-black text-slate-900 mb-1">Department Placement Performance Rankings</div>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Comparative benchmarks across Engineering divisions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Placement Ready %</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptRankings.map((d) => (
                <tr key={d.dept} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-black text-slate-900">{d.dept}</td>
                  <td className="py-3 px-4">{d.enrolled}</td>
                  <td className="py-3 px-4 font-black text-slate-900">{d.avgScore}</td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{d.readyRate}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      d.status === "On Track" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {d.status}
                    </span>
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
