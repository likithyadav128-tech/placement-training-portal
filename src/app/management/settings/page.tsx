"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Save, CheckCircle2 } from "lucide-react";

export default function ManagementSettingsPage() {
  const [cutoff, setCutoff] = useState(75);
  const [threshold, setThreshold] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">⚙️ Placement System Settings</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Configure readiness cutoffs and automated at-risk trigger thresholds.
        </p>
      </div>

      <Card className="p-6 max-w-xl space-y-6">
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1">
            Placement Readiness Cutoff Benchmark: <b className="text-blue-700">{cutoff}%</b>
          </label>
          <input
            type="range"
            min="50"
            max="95"
            value={cutoff}
            onChange={(e) => setCutoff(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <p className="text-[11px] text-slate-500 mt-1">Students achieving this overall score are classified as 'Placement Ready'.</p>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1">
            At-Risk Alert Trigger Threshold: <b className="text-rose-700">{threshold}%</b>
          </label>
          <input
            type="range"
            min="40"
            max="75"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <p className="text-[11px] text-slate-500 mt-1">Students scoring below this threshold trigger alerts on the Faculty dashboard.</p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-4 rounded-lg text-xs transition"
        >
          <Save className="w-3.5 h-3.5" /> Save Configuration
        </button>
      </Card>
    </div>
  );
}
