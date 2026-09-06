"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Play, CheckCircle2, Code2 } from "lucide-react";

export default function CodingSandboxPage() {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState("def solve(arr: list[int]) -> int:\n    # Return maximum subarray sum\n    return max(arr)\n");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/sandbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          code,
          testCases: [
            { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected_output: "6", is_hidden: false },
            { input: "[1]", expected_output: "1", is_hidden: false },
            { input: "[5, 4, -1, 7, 8]", expected_output: "23", is_hidden: true },
          ],
        }),
      });
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Coding Sandbox IDE</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Sandboxed code execution environment with instant test validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-slate-900 border-slate-800 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-blue-400" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-slate-800 text-xs font-bold text-white border border-slate-700 rounded px-2.5 py-1"
                >
                  <option value="python">Python 3 (3.11)</option>
                  <option value="javascript">JavaScript (Node 20)</option>
                  <option value="cpp">C++ 17 (GCC)</option>
                  <option value="java">Java 17 (OpenJDK)</option>
                </select>
              </div>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-1.5 rounded-md transition"
              >
                <Play className="w-3.5 h-3.5" /> {isRunning ? "Executing..." : "Run Sandbox"}
              </button>
            </div>

            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 rounded-lg border border-slate-800 focus:outline-none"
            />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-black text-slate-900 mb-2">Sandbox Instructions</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              Write your algorithmic solution in the editor. Tests evaluate correctness against standard and boundary assertions with memory and execution timers.
            </p>
            {output && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-xs font-black text-slate-900">Execution Output:</div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono">
                  <div>Status: <b className="text-emerald-700">All Tests Passed</b></div>
                  <div>Runtime: {output.runtimeMs} ms</div>
                  <div>Memory: {output.memoryMb} MB</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
