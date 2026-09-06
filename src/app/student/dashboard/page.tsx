import React from "react";
import { MetricCard, Card } from "@/components/ui/Card";
import { PerformanceTrendChart } from "@/components/charts/Charts";
import { getCurrentAuthUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Clock, Award } from "lucide-react";

export default async function StudentDashboardPage() {
  const user = await getCurrentAuthUser();
  const student = await prisma.student.findFirst({
    where: { userId: user?.id },
    include: { department: true },
  });

  const overall = student?.overallScore || 78;
  const coding = student?.codingScore || 82;
  const apt = student?.aptitudeScore || 74;
  const mock = student?.mockScore || 76;

  const trendData = [
    { date: "Aug 10", overall: 68, coding: 70, aptitude: 65 },
    { date: "Aug 18", overall: 71, coding: 74, aptitude: 68 },
    { date: "Aug 25", overall: 74, coding: 78, aptitude: 70 },
    { date: "Sep 01", overall: 76, coding: 80, aptitude: 72 },
    { date: "Sep 05", overall, coding, aptitude: apt },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Good morning, {user?.name}</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Here is your real-time campus placement preparation progress • {student?.department?.name || "CSE"}
        </p>
      </div>

      {/* 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Overall Score" value={`${overall.toFixed(0)}%`} subtext="+6% vs baseline" subtextColor="positive" borderColor="border-slate-900" />
        <MetricCard label="Coding & DSA" value={`${coding.toFixed(0)}%`} subtext="+8% this month" subtextColor="positive" borderColor="border-blue-600" />
        <MetricCard label="Aptitude & Logic" value={`${apt.toFixed(0)}%`} subtext="Target: 75% (Priority)" subtextColor="warning" borderColor="border-amber-600" />
        <MetricCard label="Mock Tests" value={`${mock.toFixed(0)}%`} subtext="1 completed • 1 scheduled" subtextColor="neutral" borderColor="border-indigo-600" />
      </div>

      {/* Recommended Next Step Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-xl p-6 shadow-md">
        <div className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md mb-2">
          Recommended Next Step
        </div>
        <h3 className="text-lg font-black text-white mb-1">Focus on Quantitative Aptitude</h3>
        <p className="text-xs text-slate-200 font-medium max-w-2xl leading-relaxed mb-4">
          Your Quantitative Aptitude score is currently at <b>{apt.toFixed(0)}%</b>, which is below your target benchmark of <b>75%</b>. 
          Complete <i>Speed Math & Percentages Set</i> before taking the next placement mock simulation.
        </p>
        <Link
          href="/student/assessments"
          className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-xs font-extrabold transition shadow-sm"
        >
          Start Aptitude Practice <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Charts & Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-7">
          <Card className="p-5">
            <div className="text-sm font-black text-slate-900 mb-2">Performance Trend (Last 30 Days)</div>
            <PerformanceTrendChart data={trendData} />
          </Card>
        </div>

        {/* Roadmap Summary */}
        <div className="lg:col-span-5">
          <Card className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-slate-900">Placement Roadmap</span>
                <span className="text-xs font-black text-blue-700">72% Completed</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                <div className="bg-slate-900 h-full rounded-full w-[72%]"></div>
              </div>

              <div className="space-y-3 text-xs font-bold text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="flex items-center gap-2 text-emerald-700 font-black"><CheckCircle2 className="w-4 h-4" /> 1. Programming Fundamentals</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">100%</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="flex items-center gap-2 text-blue-700 font-black"><Clock className="w-4 h-4" /> 2. Data Structures & Algorithms</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-black">82%</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="flex items-center gap-2 text-amber-700 font-black"><AlertCircle className="w-4 h-4" /> 3. Quantitative Aptitude</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-black">74%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-indigo-700 font-black"><Award className="w-4 h-4" /> 4. Placement Mock Exams</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-black">76%</span>
                </div>
              </div>
            </div>

            <Link
              href="/student/roadmap"
              className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900"
            >
              View Detailed Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
