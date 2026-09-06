export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { MetricCard, Card } from "@/components/ui/Card";
import { PerformanceTrendChart } from "@/components/charts/Charts";
import { prisma } from "@/lib/prisma";
import { Code2, FileCheck2, Lightbulb, Milestone } from "lucide-react";

export default async function StudentDashboardPage() {
  let student: any = null;
  try {
    student = await prisma.student.findFirst({
      include: { user: true, department: true },
    });
  } catch (e) {
    // Fallback
  }

  const trendData = [
    { week: "Week 1", score: 62, benchmark: 75 },
    { week: "Week 2", score: 68, benchmark: 75 },
    { week: "Week 3", score: 71, benchmark: 75 },
    { week: "Week 4", score: 75, benchmark: 75 },
    { week: "Week 5", score: 79, benchmark: 75 },
    { week: "Week 6", score: 83, benchmark: 75 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
            Student Placement Portal &bull; Batch 2026
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Welcome back, {student?.user?.name || "Candidate"}!
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Department of {student?.department?.name || "Computer Science"} &bull; USN: {student?.studentId || "1MS22CS045"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/coding-sandbox"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" /> Live Sandbox
          </Link>
          <Link
            href="/student/mock-tests"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-lg transition shadow-xs flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" /> Mock Tests
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Placement Readiness" value={`${student?.overallScore?.toFixed(0) || 83}%`} subtext="Ready for Tier 1 Drives" subtextColor="positive" borderColor="border-emerald-600" />
        <MetricCard label="Coding Proficiency" value={`${student?.codingScore?.toFixed(0) || 85}%`} subtext="Top 15% of Batch" subtextColor="positive" borderColor="border-blue-600" />
        <MetricCard label="Aptitude & Logic" value={`${student?.aptitudeScore?.toFixed(0) || 78}%`} subtext="+6% improvement" subtextColor="positive" borderColor="border-indigo-600" />
        <MetricCard label="Target CGPA" value={student?.cgpa?.toFixed(2) || "8.75"} subtext="Eligibility: >= 7.50" subtextColor="neutral" borderColor="border-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-slate-900">Score Progression Over Time</div>
                <p className="text-xs text-slate-500 font-medium">Weekly assessment trajectory vs 75% institutional cutoff.</p>
              </div>
            </div>
            <PerformanceTrendChart data={trendData} />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Milestone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Next Milestone</div>
                <div className="text-2xs text-slate-500 font-bold">Amazon SDE-1 Mock Simulation</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Complete your Dynamic Programming & System Design challenge before Friday.
            </p>
            <Link
              href="/student/roadmap"
              className="mt-3.5 block text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold rounded-md transition"
            >
              View Full Roadmap &rarr;
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Recommended Focus</div>
                <div className="text-2xs text-slate-500 font-bold">Graph Theory & BFS/DFS</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Your last aptitude test indicated a 12% lower speed in graph traversal problems.
            </p>
            <Link
              href="/student/analysis"
              className="mt-3.5 block text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold rounded-md transition"
            >
              Review Suggestions &rarr;
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
