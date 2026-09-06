export const dynamic = "force-dynamic";
import React from "react";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, Clock, AlertCircle, Award } from "lucide-react";

export default function StudentRoadmapPage() {
  const steps = [
    { num: "1", title: "Programming Fundamentals", status: "COMPLETED", pct: "100%", desc: "Variables, OOP, recursion, and core complexity analysis.", color: "text-emerald-700", bg: "bg-emerald-100" },
    { num: "2", title: "Data Structures & Algorithms", status: "IN_PROGRESS", pct: "82%", desc: "Arrays, two-pointers, hash tables, linked lists, and binary trees.", color: "text-blue-700", bg: "bg-blue-100" },
    { num: "3", title: "Quantitative & Logical Aptitude", status: "NEEDS_PRACTICE", pct: "74%", desc: "Time & work, permutations, speed math, and logical puzzles.", color: "text-amber-700", bg: "bg-amber-100" },
    { num: "4", title: "Placement Mock Exams", status: "IN_PROGRESS", pct: "76%", desc: "Full-length corporate simulation exams with sectional timing.", color: "text-indigo-700", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Placement Roadmap</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Curated 4-stage preparation trajectory for campus placements.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-none last:pb-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${s.bg} ${s.color}`}>
                {s.status === "COMPLETED" ? "✓" : s.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-black text-slate-900">{s.title}</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${s.bg} ${s.color}`}>{s.pct} {s.status.replace("_", " ")}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
