export const dynamic = "force-dynamic";
import React from "react";
import { Card } from "@/components/ui/Card";
import { getCurrentAuthUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function FacultyProfilePage() {
  const user = await getCurrentAuthUser();
  const faculty = await prisma.faculty.findFirst({
    where: { userId: user?.id },
    include: { department: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Profile</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Institutional Faculty Coordinator Record.
        </p>
      </div>

      <Card className="p-6 max-w-xl">
        <h3 className="text-xl font-black text-slate-900 mb-1">{user?.name}</h3>
        <div className="text-xs font-bold text-slate-500 mb-4">{user?.email}</div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-800 pt-3 border-t border-slate-200">
          <div>• <b>Employee ID:</b> {faculty?.employeeId || "FAC-CSE-101"}</div>
          <div>• <b>Department:</b> {faculty?.department?.name || "Computer Science & Engineering"}</div>
          <div>• <b>Designation:</b> {faculty?.designation || "Professor & Placement Coordinator"}</div>
          <div>• <b>Role:</b> <span className="bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded text-[10px]">FACULTY COORDINATOR</span></div>
        </div>
      </Card>
    </div>
  );
}
