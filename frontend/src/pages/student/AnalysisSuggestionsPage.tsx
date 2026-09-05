import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import { AnalysisData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const AnalysisSuggestionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user?.student_profile?.id) return;
      try {
        const data = await studentService.getAnalysis(user.student_profile.id);
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [user]);

  if (loading || !analysis) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analysis & Suggestions</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent performance analytics and data-grounded placement improvement recommendations
        </p>
      </div>

      {/* Progress Trend Hero Banner */}
      <Card className="bg-slate-900 text-white border-none shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-300" />
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Monthly Progress Trajectory
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{analysis.progress_trend.message}"
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Coding Delta</span>
              <span className="text-emerald-400 font-bold text-sm">{analysis.progress_trend.coding_delta}</span>
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Aptitude Delta</span>
              <span className="text-emerald-400 font-bold text-sm">{analysis.progress_trend.aptitude_delta}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weak Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card hover className="border-t-4 border-t-emerald-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <CardTitle>Identified Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.strengths.map((str, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{str.name}</h4>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Above Target Benchmark ({str.target}%)
                  </span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{str.score}%</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card hover className="border-t-4 border-t-amber-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle>Priority Improvement Areas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.weak_areas.map((w, idx) => (
              <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{w.name}</h4>
                  <span className="text-[11px] text-amber-700 font-medium">
                    Gap: -{Math.round(w.target - w.score)}% to reach target
                  </span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{w.score}%</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Data-Grounded Actionable Recommendations */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600" />
          Data-Grounded Recommendations
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {analysis.recommendations.map((rec, idx) => (
            <Card key={idx} hover className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority === 'HIGH' ? 'danger' : 'warning'} size="sm">
                    {rec.priority} PRIORITY
                  </Badge>
                  <span className="text-xs font-bold text-slate-700">{rec.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{rec.message}</p>
              </div>

              <Button
                onClick={() => navigate(rec.action_url || '/student/assessments')}
                variant="primary"
                size="sm"
                className="flex-shrink-0"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {rec.action_label || 'Take Action'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
