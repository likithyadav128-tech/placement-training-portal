import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { assessmentService } from '../../services/api';
import { TestAttemptResult } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const TestResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!attemptId) return;
      try {
        const data = await assessmentService.getAttemptResult(Number(attemptId));
        setResult(data);
        if (data.score >= 70) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading || !result) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  const isPassed = result.score >= 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <Card className="text-center p-8 bg-white border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Award className="h-8 w-8 text-brand-300" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assessment Completed
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {result.assessment_title || 'Placement Assessment'}
            </h1>
          </div>

          {/* Primary Score */}
          <div className="pt-3 pb-2">
            <div className="text-5xl font-black text-slate-900 tracking-tight">
              {result.score}%
            </div>
            <Badge variant={isPassed ? 'success' : 'warning'} size="md" className="mt-2">
              {isPassed ? 'Placement Readiness Standard Met' : 'Needs Topic Improvement'}
            </Badge>
          </div>

          {/* Correct / Incorrect / Skipped Metrics */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-4 border-t border-slate-100">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-xs font-semibold text-emerald-800">Correct</span>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">{result.correct_count}</div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <span className="text-xs font-semibold text-rose-800">Incorrect</span>
              <div className="text-xl font-bold text-rose-900 mt-0.5">{result.incorrect_count}</div>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <span className="text-xs font-semibold text-slate-700">Skipped</span>
              <div className="text-xl font-bold text-slate-800 mt-0.5">{result.skipped_count}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Grid: Strong Areas vs Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Strong Areas</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(result.strong_areas || ['Core Syntax & Logic']).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Needs Improvement */}
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" />
              <span>Needs Improvement</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(result.needs_improvement || ['Time Management', 'Edge Cases']).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* RECOMMENDED ACTION */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-300" />
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Recommended Action
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {result.recommended_action}
            </p>
          </div>

          <Button
            onClick={() => navigate('/student/roadmap')}
            variant="secondary"
            size="md"
            className="bg-white text-slate-900 hover:bg-slate-100 flex-shrink-0 font-semibold"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Continue Preparation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
