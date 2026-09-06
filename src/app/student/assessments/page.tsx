import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Code2, Brain, ArrowRight, Clock, Award } from "lucide-react";

export default async function StudentAssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: { questions: { include: { question: true } } },
    orderBy: { createdAt: "desc" },
  });

  const codingAssessments = assessments.filter((a) => a.type === "CODING");
  const aptitudeAssessments = assessments.filter((a) => a.type === "APTITUDE");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Placement Assessments</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Practice curriculum topics under timed corporate exam conditions.
        </p>
      </div>

      {/* Section 1: Coding Tests */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-5 h-5 text-blue-700" />
          <h3 className="text-base font-black text-slate-900">💻 Coding & Algorithmic Assessments</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {codingAssessments.map((ass) => (
            <Card key={ass.id} className="p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {ass.category}
                </span>
                <h4 className="text-base font-black text-slate-900 mt-2 mb-1">{ass.title}</h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3">{ass.description}</p>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ass.duration} Mins</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {ass.totalMarks} Marks</span>
                </div>
              </div>
              <Link
                href={`/student/assessments/${ass.id}`}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition"
              >
                Start Assessment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 2: Aptitude Tests */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-black text-slate-900">🧠 Quantitative & Logical Aptitude</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aptitudeAssessments.map((ass) => (
            <Card key={ass.id} className="p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {ass.category}
                </span>
                <h4 className="text-base font-black text-slate-900 mt-2 mb-1">{ass.title}</h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3">{ass.description}</p>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ass.duration} Mins</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {ass.totalMarks} Marks</span>
                </div>
              </div>
              <Link
                href={`/student/assessments/${ass.id}`}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition"
              >
                Start Aptitude Set <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
