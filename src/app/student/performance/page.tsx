export const dynamic = "force-dynamic";
import React from "react";
import { Card, MetricCard } from "@/components/ui/Card";
import { BenchmarkBarChart, ReadinessRadarChart } from "@/components/charts/Charts";
import { getCurrentAuthUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function StudentPerformancePage() {
  const user = await getCurrentAuthUser();
  const student = await prisma.student.findFirst({
    where: { userId: user?.id },
  });

  const benchmarkData = [
    { skill: "Coding", score: student?.codingScore || 82, benchmark: 85 },
    { skill: "Aptitude", score: student?.aptitudeScore || 74, benchmark: 75 },
    { skill: "Technical", score: 72, benchmark: 80 },
    { skill: "Mock Tests", score: student?.mockScore || 76, benchmark: 75 },
    { skill: "Verbal", score: 80, benchmark: 75 },
  ];

  const radarData = [
    { subject: "Coding & DSA", score: student?.codingScore || 82 },
    { subject: "Aptitude", score: student?.aptitudeScore || 74 },
    { subject: "System Design", score: 72 },
    { subject: "Mock Tests", score: student?.mockScore || 76 },
    { subject: "Verbal Ability", score: 80 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Performance Analytics</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Detailed breakdown of skills, benchmarks, and readiness index.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Overall Score" value={`${(student?.overallScore || 78).toFixed(0)}%`} subtext="+6% vs baseline" subtextColor="positive" />
        <MetricCard label="Coding & DSA" value={`${(student?.codingScore || 82).toFixed(0)}%`} subtext="+8% this term" subtextColor="positive" />
        <MetricCard label="Aptitude" value={`${(student?.aptitudeScore || 74).toFixed(0)}%`} subtext="Priority area" subtextColor="warning" />
        <MetricCard label="Mock Score" value={`${(student?.mockScore || 76).toFixed(0)}%`} subtext="Target: 80%" subtextColor="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-5">
            <div className="text-sm font-black text-slate-900 mb-2">Skill vs Placement Benchmark (%)</div>
            <BenchmarkBarChart data={benchmarkData} />
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-5">
            <div className="text-sm font-black text-slate-900 mb-2">Placement Readiness Index</div>
            <ReadinessRadarChart data={radarData} />
          </Card>
        </div>
      </div>
    </div>
  );
}
