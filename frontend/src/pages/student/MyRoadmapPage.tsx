import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  PlayCircle,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import { RoadmapData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const MyRoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user?.student_profile?.id) return;
      try {
        const data = await studentService.getRoadmap(user.student_profile.id);
        setRoadmap(data);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Placement Roadmap</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Standardized institutional preparation milestones personalized by your live assessment scores
        </p>
      </div>

      {/* Overview Progress Banner */}
      <Card className="bg-slate-900 text-white border-none shadow-md">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-brand-300" />
              <span className="font-semibold text-sm">Overall Preparation Completion</span>
            </div>
            <span className="text-2xl font-extrabold text-brand-300">
              {roadmap?.overall_progress || 72}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-brand-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${roadmap?.overall_progress || 72}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Roadmap Pipeline */}
      <div className="space-y-4">
        {(roadmap?.steps || []).map((step, idx) => {
          const isCompleted = step.status === 'COMPLETED' || step.progress >= step.target;
          const isNeedsAttention = step.status === 'NEEDS_ATTENTION' || step.progress < 60;

          return (
            <Card key={step.id} hover className="overflow-hidden">
              <div className="p-6 space-y-4">
                {/* Step Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNeedsAttention
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.order}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                        <Badge
                          variant={isCompleted ? 'success' : isNeedsAttention ? 'warning' : 'secondary'}
                          size="sm"
                        >
                          {isCompleted ? 'Completed' : isNeedsAttention ? 'Needs Practice' : 'In Progress'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  {/* Progress vs Target */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Current</span>
                      <span className="font-bold text-slate-900">{step.progress}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target</span>
                      <span className="font-bold text-slate-600">{step.target}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : isNeedsAttention ? 'bg-amber-500' : 'bg-slate-900'
                    }`}
                    style={{ width: `${Math.min(100, step.progress)}%` }}
                  ></div>
                </div>

                {/* Topics Pills */}
                {step.topics && step.topics.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Curriculum Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.topics.map((top, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Action & CTA */}
                <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{step.recommended_action}</span>
                  </div>

                  <Button
                    onClick={() => navigate('/student/assessments')}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    className="flex-shrink-0"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    {isCompleted ? 'Review Topics' : 'Start Practice'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
