export const dynamic = "force-dynamic";
import React from "react";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function StudentAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analysis & AI Suggestions</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Personalized performance feedback based on recent assessments and mock tests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Strengths */}
        <Card className="p-6 border-t-4 border-t-emerald-600">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>Identified Strengths</span>
          </div>
          <div className="space-y-3 text-xs font-semibold text-slate-700 leading-relaxed">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <b>Coding & Problem Solving (82%)</b><br />
              High test case pass rate and quick implementation in Array & String tasks.
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <b>Verbal Ability (80%)</b><br />
              Strong vocabulary and reading comprehension accuracy.
            </div>
          </div>
        </Card>

        {/* Priority Weaknesses */}
        <Card className="p-6 border-t-4 border-t-amber-600">
          <div className="flex items-center gap-2 text-amber-800 font-black text-sm mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Priority Weaknesses</span>
          </div>
          <div className="space-y-3 text-xs font-semibold text-slate-700 leading-relaxed">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <b>Quantitative Math (74%)</b><br />
              Currently below the 75% cutoff. Focus on Time & Work formula shortcuts.
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <b>Operating Systems Core (68%)</b><br />
              Review memory paging, process scheduling, and deadlock handling.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
