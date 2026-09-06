import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-6 shadow-2xs", className)}>
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  subtext,
  subtextColor = "positive",
  borderColor = "border-slate-900",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  subtextColor?: "positive" | "warning" | "neutral" | "danger";
  borderColor?: string;
}) {
  const colorMap = {
    positive: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
    neutral: "text-slate-600",
  };

  return (
    <div className={cn("bg-white border border-slate-200 border-l-4 rounded-xl p-5 shadow-2xs", borderColor)}>
      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">{label}</div>
      <div className="text-3xl font-black text-slate-900 leading-tight">{value}</div>
      {subtext && <div className={cn("text-xs font-bold mt-1.5", colorMap[subtextColor])}>{subtext}</div>}
    </div>
  );
}
