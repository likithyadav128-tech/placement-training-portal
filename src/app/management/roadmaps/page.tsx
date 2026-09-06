import React from "react";
import { Card } from "@/components/ui/Card";

export default function ManagementRoadmapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Roadmaps & Curriculum Manager</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Design 4-tier milestone tracks assigned across student cohorts.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-black text-slate-900 mb-3">Institutional Master Roadmap Template (2026 Batch)</h3>
        <div className="space-y-2 text-xs font-semibold text-slate-800">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">1. Programming Fundamentals (Variables, OOP, Recursion, Time Complexity)</div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">2. Data Structures & Algorithms (Arrays, Hashing, Two-Pointers, Trees, Graphs)</div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">3. Quantitative & Logical Aptitude (Time & Work, Speed Math, Deductions)</div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">4. Placement Mock Exams (End-to-End Corporate Simulations)</div>
        </div>
      </Card>
    </div>
  );
}
