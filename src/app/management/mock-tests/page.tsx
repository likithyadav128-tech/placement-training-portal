import React from "react";
import { Card } from "@/components/ui/Card";

export default function ManagementMockTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Placement Mock Tests Manager</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Schedule institutional recruitment simulations and monitor student participation.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-black text-slate-900 mb-3">Active Recruitment Simulation</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-800 space-y-1">
          <div>• <b>Simulation Name:</b> Tier-1 Corporate Placement Mock Exam 2026</div>
          <div>• <b>Duration:</b> 90 Minutes (Sectional timed)</div>
          <div>• <b>Sections:</b> Quantitative (15 Qs), Logical (15 Qs), Verbal (10 Qs), Live Coding (2 Problems)</div>
          <div>• <b>Registered Students:</b> 25 • <b>Status:</b> <span className="text-emerald-700 font-black">Active & Scheduled</span></div>
        </div>
      </Card>
    </div>
  );
}
