export const dynamic = "force-dynamic";
import React from "react";
import { Card, MetricCard } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentDeepDivePage({ params }: { params: { id: string } }) {
  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: { user: true, department: true },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/faculty/students" className="text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Deep-Dive: {student.user.name}</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Roll No: {student.studentId} • {student.department.name} • {student.user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard label="Overall Score" value={`${student.overallScore}%`} subtext="Placement Metric" borderColor="border-slate-900" />
        <MetricCard label="Coding & DSA" value={`${student.codingScore}%`} subtext="Algorithmic Speed" borderColor="border-blue-600" />
        <MetricCard label="Aptitude" value={`${student.aptitudeScore}%`} subtext="Speed Math" borderColor="border-amber-600" />
        <MetricCard label="Academic CGPA" value={`${student.cgpa} / 10`} subtext="University CGPA" borderColor="border-emerald-600" />
      </div>

      {/* Mentorship Note */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm mb-2">
          <MessageSquare className="w-4 h-4 text-blue-700" />
          <span>Faculty Mentorship Record</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-800 leading-relaxed mb-4">
          <b>Faculty Note:</b> Strong algorithmic coding capability. High velocity in two-pointer and array traversals. Recommend focused practice in permutations and probability sets before the next corporate simulation.
        </div>
      </Card>
    </div>
  );
}
