import React from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Award, Clock, FileCheck2, ArrowRight } from "lucide-react";

export default function MockTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Placement Mock Exams</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Simulate real campus recruitment tests with sectional timers.
        </p>
      </div>

      <Card className="p-6 border-l-4 border-l-blue-700">
        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Tier-1 Corporate Simulation
        </span>
        <h3 className="text-xl font-black text-slate-900 mt-2 mb-1">Placement Mock Simulation 2026</h3>
        <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed mb-4">
          Complete end-to-end recruitment simulation covering Quantitative Math (15 Qs), Logical Reasoning (15 Qs), Verbal Ability (10 Qs), and Live Coding (2 Problems).
        </p>
        <div className="flex items-center gap-6 text-xs font-bold text-slate-600 mb-6">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-700" /> Duration: 90 Mins</span>
          <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-700" /> Passing Benchmark: 75%</span>
        </div>
        <Link
          href="/student/assessments"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-lg text-xs transition"
        >
          Start Full Mock Exam Simulation <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Card>
    </div>
  );
}
