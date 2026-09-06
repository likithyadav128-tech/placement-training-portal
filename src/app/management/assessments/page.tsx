import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function ManagementAssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: { createdBy: true, questions: true, attempts: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Authoring & Editor</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Create, publish, and configure placement tests and scoring weights.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">Pass Benchmark</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{a.title}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-black">
                      {a.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{a.duration} Mins</td>
                  <td className="py-3 px-4">{a.totalMarks} Marks</td>
                  <td className="py-3 px-4">{a.passingScore}%</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.attempts.length}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {a.status}
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
