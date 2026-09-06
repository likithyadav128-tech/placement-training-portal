"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Clock, CheckCircle2, Play, ArrowLeft, Send } from "lucide-react";

export default function AssessmentTakingPage() {
  const params = useParams();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [code, setCode] = useState("def reverse_array(arr: list[int]) -> list[int]:\n    return arr[::-1]\n");
  const [selectedOption, setSelectedOption] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/sandbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          code,
          testCases: [
            { input: "[1, 2, 3, 4, 5]", expected_output: "[5, 4, 3, 2, 1]", is_hidden: false },
            { input: "[10, 20]", expected_output: "[20, 10]", is_hidden: false },
            { input: "[7]", expected_output: "[7]", is_hidden: true },
          ],
        }),
      });
      const data = await res.json();
      setTestOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-slate-300 rounded-2xl shadow-xl p-8 text-center mt-12">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Assessment Submitted!</h2>
        <p className="text-xs font-semibold text-slate-600 mb-6">
          Score: <b>25 / 25 Marks (100%)</b> • Passed all test cases in 12.4 ms
        </p>
        <button
          onClick={() => router.push("/student/assessments")}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-lg text-xs transition"
        >
          Return to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Test Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-black text-slate-900">DSA Core Assessment — Question 1 of 2</h3>
            <p className="text-[11px] font-bold text-slate-500">Problem: Reverse Array In-Place (10 Marks)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-black transition"
          >
            <Send className="w-3.5 h-3.5" /> Submit Assessment
          </button>
        </div>
      </div>

      {/* Problem Statement & IDE Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Problem Details */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Easy</span>
              <span className="text-xs font-extrabold text-slate-500">Marks: 10</span>
            </div>
            <h4 className="text-base font-black text-slate-900 mb-2">Reverse Array In-Place</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Given an integer array <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">arr</code>, write a function to reverse the elements in-place without allocating additional memory for another array.
            </p>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 font-mono text-[11px]">
                <b>Example 1:</b><br />
                Input: arr = [1, 2, 3, 4, 5]<br />
                Output: [5, 4, 3, 2, 1]
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 font-mono text-[11px]">
                <b>Example 2:</b><br />
                Input: arr = [10, 20]<br />
                Output: [20, 10]
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Code Sandbox */}
        <div className="lg:col-span-7 space-y-3">
          <Card className="p-4 bg-slate-900 border-slate-800 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-black text-slate-300 font-mono">Python 3 (Sandboxed Runtime)</span>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-1.5 rounded-md transition"
              >
                <Play className="w-3 h-3" /> {isRunning ? "Executing..." : "Run Test Cases"}
              </button>
            </div>
            <textarea
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none"
            />
          </Card>

          {/* Test Case Output */}
          {testOutput && (
            <Card className="p-4">
              <div className="text-xs font-black text-slate-900 mb-2 flex items-center justify-between">
                <span>Test Execution Results</span>
                <span className="text-emerald-700 font-black">
                  Passed {testOutput.passedCount} of {testOutput.totalCount} Cases ({testOutput.runtimeMs} ms)
                </span>
              </div>
              <div className="space-y-1.5">
                {testOutput.results.map((r: any) => (
                  <div key={r.testCase} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs font-mono">
                    <span>Case {r.testCase}: Input: {r.input}</span>
                    <span className={r.passed ? "text-emerald-700 font-black" : "text-rose-700 font-black"}>
                      {r.passed ? "✅ Passed" : "❌ Failed"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
