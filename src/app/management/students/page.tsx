import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { UserPlus, Search } from "lucide-react";

export default async function ManagementStudentsPage() {
  const students = await prisma.student.findMany({
    include: { department: true, user: true, facultyAdvisor: { include: { user: true } } },
    orderBy: { studentId: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Management</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Provision, update, and manage institutional student accounts.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Advisor</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.studentId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{s.user.email}</td>
                  <td className="py-3 px-4">{s.department.code}</td>
                  <td className="py-3 px-4">{s.cgpa.toFixed(1)}</td>
                  <td className="py-3 px-4 text-slate-600">{s.facultyAdvisor?.user.name || "Unassigned"}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {s.user.status}
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
