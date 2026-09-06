import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default async function FacultyStudentsDirectoryPage() {
  const students = await prisma.student.findMany({
    include: { department: true, user: true },
    orderBy: { studentId: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Students Directory</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Comprehensive roster of students under your mentorship track.
        </p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Coding</th>
                <th className="py-3 px-4">Aptitude</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.studentId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.user.name}</td>
                  <td className="py-3 px-4">{s.department.code}</td>
                  <td className="py-3 px-4">Year {s.year}</td>
                  <td className="py-3 px-4 font-black text-slate-900">{s.overallScore}%</td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{s.codingScore}%</td>
                  <td className="py-3 px-4 text-amber-700 font-bold">{s.aptitudeScore}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      s.overallScore >= 75 ? "bg-emerald-100 text-emerald-800" : s.overallScore >= 60 ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {s.readinessStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/faculty/students/${s.id}`}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-extrabold"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
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
