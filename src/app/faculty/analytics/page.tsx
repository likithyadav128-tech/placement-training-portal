import React from "react";
import { Card } from "@/components/ui/Card";
import { DepartmentBarChart } from "@/components/charts/Charts";

export default function FacultyAnalyticsPage() {
  const deptData = [
    { department: "CSE", avgScore: 78.4, placementReady: 84.0 },
    { department: "ECE", avgScore: 73.2, placementReady: 72.5 },
    { department: "EEE", avgScore: 69.8, placementReady: 65.0 },
    { department: "MECH", avgScore: 66.5, placementReady: 58.0 },
    { department: "CIVIL", avgScore: 64.1, placementReady: 52.0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cohort Placement Analytics</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Comparative department benchmarks and placement readiness rates.
        </p>
      </div>

      <Card className="p-6">
        <div className="text-sm font-black text-slate-900 mb-4">Department Placement Performance Rankings</div>
        <DepartmentBarChart data={deptData} />
      </Card>
    </div>
  );
}
