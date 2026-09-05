import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  Clock,
  Code,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { assessmentService } from '../../services/api';
import { AssessmentDetail, Question, CodeExecutionResult } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const CodingAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');

  // Code state per question ID
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(45 * 60); // 45 mins
  const [loading, setLoading] = useState(true);

  // Initialize assessment and attempt
  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        const [assDetail, attemptRes] = await Promise.all([
          assessmentService.getAssessmentDetail(Number(id)),
          assessmentService.startAttempt(Number(id)),
        ]);
        setAssessment(assDetail);
        setAttemptId(attemptRes.attempt_id);
        setTimeLeftSeconds(assDetail.duration * 60);

        // Pre-fill starter templates
        const initialCode: Record<string, string> = {};
        assDetail.questions.forEach((q) => {
          initialCode[q.id.toString()] = q.code_template || '# Write your solution here\n';
        });
        setCodeAnswers(initialCode);
      } catch (err) {
        console.error('Error starting coding test:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeftSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !assessment) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  const currentQ: Question = assessment.questions[currentQuestionIndex];
  const currentCode = codeAnswers[currentQ?.id.toString()] || '';

  const handleCodeChange = (newCode: string) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [currentQ.id.toString()]: newCode,
    }));
  };

  const handleRunCode = async () => {
    if (!id || !currentQ) return;
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const res = await assessmentService.runCode(Number(id), {
        code: currentCode,
        language: selectedLanguage,
        question_id: currentQ.id,
      });
      setExecutionResult(res);
    } catch (err) {
      console.error('Code execution failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    try {
      const submitRes = await assessmentService.submitAttempt(attemptId, {
        answers: codeAnswers,
        code_languages: Object.keys(codeAnswers).reduce((acc, key) => {
          acc[key] = selectedLanguage;
          return acc;
        }, {} as Record<string, string>),
      });
      navigate(`/student/attempts/${attemptId}/result`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-3 pb-2">
      {/* Top Test Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            <Code className="h-3.5 w-3.5" />
            CODING TEST
          </Badge>
          <span className="font-bold text-sm text-slate-900 truncate max-w-xs md:max-w-md">
            {assessment.title}
          </span>
        </div>

        {/* Question Selector & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-xs font-semibold text-slate-800">
            <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-sm">
            <Clock className="h-3.5 w-3.5 text-brand-300" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <Button
            onClick={handleSubmitAssessment}
            isLoading={isSubmitting}
            variant="success"
            size="sm"
            rightIcon={<Send className="h-3.5 w-3.5" />}
          >
            Submit Test
          </Button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* LEFT COLUMN: Problem Statement & Test Cases (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Problem {currentQuestionIndex + 1}
              </span>
              <Badge variant="secondary" size="sm">
                Marks: {currentQ?.marks}
              </Badge>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {currentQ?.question}
            </h2>

            {/* Test Cases / Examples */}
            {currentQ?.test_cases && currentQ.test_cases.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sample Test Cases
                </span>
                {currentQ.test_cases.map((tc, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono space-y-1">
                    <div className="text-slate-500">Input: <span className="text-slate-900 font-semibold">{tc.input}</span></div>
                    <div className="text-slate-500">Expected: <span className="text-emerald-700 font-semibold">{tc.expected_output}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Question Pager */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(assessment.questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === assessment.questions.length - 1}
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor & Execution Results (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3 min-h-0">
          {/* Editor Container */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm min-h-0">
            {/* Editor Top Bar */}
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <FileCode className="h-4 w-4 text-brand-400" />
                <span className="font-mono">Solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'cpp' ? 'cpp' : 'java'}</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="cpp">C++ 17</option>
                  <option value="java">Java 17</option>
                </select>
              </div>
            </div>

            {/* Code Textarea / IDE */}
            <div className="flex-1 p-3 bg-slate-900 min-h-0">
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="# Write your clean solution here..."
                spellCheck={false}
                className="w-full h-full bg-slate-900 text-slate-100 font-mono text-xs p-2 leading-relaxed focus:outline-none resize-none selection:bg-brand-700 selection:text-white"
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Sandboxed Safe Execution Engine</span>
              <Button
                onClick={handleRunCode}
                isLoading={isRunning}
                variant="primary"
                size="sm"
                className="bg-brand-600 hover:bg-brand-500 text-white shadow-sm"
                leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}
              >
                Run Code
              </Button>
            </div>
          </div>

          {/* Test Case Execution Output Panel */}
          {executionResult && (
            <div className="h-44 bg-white border border-slate-200 rounded-xl p-3.5 overflow-y-auto shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">Execution Results</span>
                    <Badge variant={executionResult.all_passed ? 'success' : 'danger'} size="sm">
                      {executionResult.passed_test_cases} / {executionResult.total_test_cases} Passed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Runtime: {executionResult.execution_time_ms} ms</span>
                    <span>Memory: {executionResult.memory_usage_mb} MB</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {executionResult.test_cases.map((tc) => (
                    <div
                      key={tc.case_number}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        tc.status === 'PASSED'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span>Case {tc.case_number}</span>
                        <span className={tc.status === 'PASSED' ? 'text-emerald-700' : 'text-rose-700'}>
                          {tc.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600">Expected: {tc.expected}</div>
                      <div className="text-[10px] text-slate-600">Actual: {tc.actual}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
