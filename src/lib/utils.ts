import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatScoreBadge(score: number) {
  if (score >= 75) return { label: "Placement Ready", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  if (score >= 60) return { label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-300" };
  return { label: "Needs Support", color: "bg-amber-100 text-amber-800 border-amber-300" };
}
