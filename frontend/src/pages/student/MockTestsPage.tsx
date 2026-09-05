import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, HelpCircle, CheckCircle, ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { assessmentService } from '../../services/api';
import { Assessment } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const MockTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const data = await assessmentService.listAssessments({ type: 'MOCK' });
        setMockTests(data);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMockTests();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Mock Tests</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Full-length simulated placement examinations with sectional timing and composite scoring
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : mockTests.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-slate-500 font-medium">No mock tests currently active.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.map((test) => (
            <Card key={test.id} hover className="flex flex-col justify-between border-slate-200">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="md">
                    <Award className="h-3.5 w-3.5" />
                    SIMULATION EXAM
                  </Badge>
                  <Badge variant="danger" size="sm">Hard</Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{test.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{test.description}</p>
                </div>

                {/* Section tags */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Exam Sections:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Quantitative</span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Logical Reasoning</span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Verbal Ability</span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Coding & DSA</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>{test.questions_count || 8} Total Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{test.duration} Minutes Duration</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
                {test.user_attempt ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Score: {test.user_attempt.score}%</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Not attempted</span>
                )}

                <Button
                  onClick={() => navigate(`/student/assessments/${test.id}/aptitude`)}
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start Mock Test
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
