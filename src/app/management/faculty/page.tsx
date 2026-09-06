import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function ManagementFacultyPage() {
  const facultyList = await prisma.faculty.findMany({
    include: { department: true, user: true, advisedStudents: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Management</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Departmental coordinators and mentorship assignments.
        </p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Assigned Students</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facultyList.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{f.employeeId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{f.user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{f.user.email}</td>
                  <td className="py-3 px-4">{f.department.code}</td>
                  <td className="py-3 px-4">{f.designation}</td>
                  <td className="py-3 px-4 font-bold text-blue-700">{f.advisedStudents.length} Students</td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {f.user.status}
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
