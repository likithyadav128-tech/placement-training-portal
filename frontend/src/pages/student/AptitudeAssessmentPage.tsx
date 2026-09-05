import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Brain,
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { assessmentService } from '../../services/api';
import { AssessmentDetail, Question } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const AptitudeAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(30 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error('Error starting aptitude test:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

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
        <Skeleton className="h-96 w-full max-w-3xl" />
      </div>
    );
  }

  const currentQ: Question = assessment.questions[currentQuestionIndex];
  const selectedOption = answers[currentQ?.id.toString()] || '';
  const isFlagged = flaggedQuestions.has(currentQ?.id);

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id.toString()]: opt,
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    try {
      await assessmentService.submitAttempt(attemptId, { answers });
      navigate(`/student/attempts/${attemptId}/result`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Test Top Status Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant="warning" size="md">
            <Brain className="h-3.5 w-3.5" />
            APTITUDE TEST
          </Badge>
          <span className="font-bold text-sm text-slate-900 truncate max-w-sm">
            {assessment.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-sm">
            <Clock className="h-3.5 w-3.5 text-brand-300" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            variant="success"
            size="sm"
            rightIcon={<Send className="h-3.5 w-3.5" />}
          >
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Main MCQ Question Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </span>
              <Badge variant="secondary" size="sm">
                {currentQ?.category}
              </Badge>
            </div>

            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                isFlagged
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              {isFlagged ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQ?.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {(currentQ?.options || []).map((opt, i) => {
              const isSelected = selectedOption === opt;
              const optionLetters = ['A', 'B', 'C', 'D', 'E'];
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {optionLetters[i] || i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="md"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            <Button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(assessment.questions.length - 1, prev + 1))
              }
              disabled={currentQuestionIndex === assessment.questions.length - 1}
              variant="primary"
              size="md"
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Next Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Palette / Navigation Grid */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <span>Question Palette</span>
          <span className="text-[11px] text-slate-400 font-normal">
            {Object.keys(answers).length} of {assessment.questions.length} Answered
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {assessment.questions.map((q, idx) => {
            const hasAnswer = !!answers[q.id.toString()];
            const flagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-slate-900 ring-offset-2'
                    : ''
                } ${
                  flagged
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : hasAnswer
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
