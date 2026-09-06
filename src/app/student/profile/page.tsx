import React from "react";
import { Card } from "@/components/ui/Card";
import { getCurrentAuthUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function StudentProfilePage() {
  const user = await getCurrentAuthUser();
  const student = await prisma.student.findFirst({
    where: { userId: user?.id },
    include: { department: true, facultyAdvisor: { include: { user: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Your registered institutional student record.
        </p>
      </div>

      <Card className="p-6 max-w-xl">
        <h3 className="text-xl font-black text-slate-900 mb-1">{user?.name}</h3>
        <div className="text-xs font-bold text-slate-500 mb-4">{user?.email}</div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-800 pt-3 border-t border-slate-200">
          <div>• <b>Roll Number:</b> {student?.studentId || "STU001"}</div>
          <div>• <b>Department:</b> {student?.department?.name || "Computer Science"}</div>
          <div>• <b>Year & Section:</b> Year {student?.year || 4} - Section {student?.section || "A"}</div>
          <div>• <b>Academic CGPA:</b> {student?.cgpa?.toFixed(1) || "8.9"} / 10.0</div>
          <div>• <b>Faculty Advisor:</b> {student?.facultyAdvisor?.user?.name || "Prof. Arvind Sharma"}</div>
          <div>• <b>Readiness Status:</b> <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded text-[10px]">PLACEMENT READY</span></div>
        </div>
      </Card>
    </div>
  );
}
