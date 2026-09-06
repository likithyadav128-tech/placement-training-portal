export const dynamic = "force-dynamic";
import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function ManagementFacultyPage() {
  let facultyList: any[] = [];
  try {
    facultyList = await prisma.faculty.findMany({
      include: { user: true, department: true },
    });
  } catch (e) {
    // Fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty & Coordinator Governance</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Departmental placement coordinator assignments and management.
        </p>
      </div>

      <Card className="p-6">
        <div className="text-sm font-black text-slate-900 mb-4">Placement Coordinators ({facultyList.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Faculty Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facultyList.length > 0 ? (
                facultyList.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{f.employeeId}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{f.user?.name || "Faculty Coordinator"}</td>
                    <td className="py-3 px-4 text-slate-600">{f.user?.email}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">{f.department?.code || "CSE"}</td>
                    <td className="py-3 px-4">{f.designation}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No faculty coordinators found. Run database seed to populate initial coordinators.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
