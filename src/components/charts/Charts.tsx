"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function PerformanceTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }} />
          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
          <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} name="Your Score (%)" />
          <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Target Benchmark (75%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BenchmarkBarChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="category" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }} />
          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
          <Bar dataKey="student" fill="#2563eb" radius={[4, 4, 0, 0]} name="Your Score (%)" />
          <Bar dataKey="batchAvg" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Batch Average (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessRadarChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="subject" stroke="#334155" fontSize={11} fontStyle="bold" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
          <Radar name="Student Proficiency" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentBarChart({ data }: { data: any[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="department" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", border: "none" }} />
          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
          <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
          <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Score (%)" />
          <Bar dataKey="attendance" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Attendance (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
