"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Download } from "lucide-react";

export default function ManagementReportsPage() {
  const handleDownloadCsv = () => {
    const csvContent = `Student ID,Name,Department,Year,Overall Score,Coding,Aptitude,Status\n2022CSE101,Likith Yadav,CSE,4,82%,86%,78%,Placement Ready\n2022CSE102,Rohan Verma,CSE,4,78%,82%,74%,Placement Ready\n2022ECE104,Ananya Iyer,ECE,4,74%,75%,72%,In Progress\n2022CSE105,Pooja Hegde,CSE,4,92%,95%,88%,Top Performer\n2022CSE109,Siddharth Gupta,CSE,4,58%,62%,52%,Needs Support`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "placement_performance_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Placement Reports & CSV Export</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Generate and export cohort performance records for institutional accreditation.
          </p>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-lg text-xs transition shadow-sm"
        >
          <Download className="w-4 h-4" /> Download Performance CSV
        </button>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-black text-slate-900 mb-3">Report Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold">2022CSE101</td>
                <td className="py-3 px-4 font-bold text-slate-900">Likith Yadav</td>
                <td className="py-3 px-4">CSE</td>
                <td className="py-3 px-4 font-black text-slate-900">82%</td>
                <td className="py-3 px-4 text-right"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">PLACEMENT READY</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold">2022CSE102</td>
                <td className="py-3 px-4 font-bold text-slate-900">Rohan Verma</td>
                <td className="py-3 px-4">CSE</td>
                <td className="py-3 px-4 font-black text-slate-900">78%</td>
                <td className="py-3 px-4 text-right"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">PLACEMENT READY</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold">2022CSE109</td>
                <td className="py-3 px-4 font-bold text-slate-900">Siddharth Gupta</td>
                <td className="py-3 px-4">CSE</td>
                <td className="py-3 px-4 font-black text-slate-900">58%</td>
                <td className="py-3 px-4 text-right"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-black">NEEDS SUPPORT</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
