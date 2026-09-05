import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Code, Brain, Clock, HelpCircle, CheckCircle, ArrowRight, Search, Filter } from 'lucide-react';
import { assessmentService } from '../../services/api';
import { Assessment } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const AssessmentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'CODING' | 'APTITUDE'>(
    (searchParams.get('type') as any) || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await assessmentService.listAssessments();
        setAssessments(data);
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter((a) => {
    if (selectedTab !== 'ALL' && a.type !== selectedTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    }
    return true;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return <Badge variant="success" size="sm">Easy</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'hard':
        return <Badge variant="danger" size="sm">Hard</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{diff}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your problem solving, data structures, coding speed, and analytical aptitude
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-medium">
          {(['ALL', 'CODING', 'APTITUDE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedTab === tab
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Assessments' : tab === 'CODING' ? 'Coding' : 'Aptitude'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by topic (e.g. DSA, Python, Quantitative)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-sm"
          />
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : filteredAssessments.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-slate-500 font-medium">No assessments match your criteria.</p>
          <p className="text-xs text-slate-400 mt-1">New assessments will appear here when published.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((a) => (
            <Card key={a.id} hover className="flex flex-col justify-between">
              <div>
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <Badge variant={a.type === 'CODING' ? 'primary' : 'warning'} size="sm">
                      {a.type === 'CODING' ? <Code className="h-3 w-3" /> : <Brain className="h-3 w-3" />}
                      {a.type}
                    </Badge>
                    {getDifficultyBadge(a.difficulty)}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{a.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                </div>

                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>{a.questions_count || 3} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{a.duration} Mins</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {a.user_attempt ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Score: {a.user_attempt.score}%</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Not attempted</span>
                )}

                <Button
                  onClick={() => {
                    if (a.type === 'CODING') {
                      navigate(`/student/assessments/${a.id}/coding`);
                    } else {
                      navigate(`/student/assessments/${a.id}/aptitude`);
                    }
                  }}
                  variant={a.user_attempt ? 'outline' : 'primary'}
                  size="sm"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  {a.user_attempt ? 'Retake Test' : 'Start Test'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
