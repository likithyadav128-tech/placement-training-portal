import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Clock, HelpCircle, CheckCircle, Award } from 'lucide-react';
import { assessmentService, managementService } from '../../services/api';
import { Assessment } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AssessmentManagementPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'CODING' | 'APTITUDE' | 'MOCK'>('CODING');
  const [category, setCategory] = useState('Data Structures');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('45');
  const [passingScore, setPassingScore] = useState('60');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.listAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await managementService.createAssessment({
        title,
        description,
        type,
        category,
        difficulty,
        duration: Number(duration),
        passing_score: Number(passingScore),
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchAssessments();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create assessment.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessment Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Author coding evaluations, aptitude speed tests, and configure scoring criteria
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create Assessment
        </Button>
      </div>

      {/* Grid of Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((a) => (
          <Card key={a.id} hover className="flex flex-col justify-between">
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={a.type === 'CODING' ? 'primary' : 'warning'} size="sm">
                  {a.type}
                </Badge>
                <Badge variant={a.status === 'PUBLISHED' ? 'success' : 'secondary'} size="sm">
                  {a.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {a.duration} Mins
                </span>
                <span>•</span>
                <span>Pass: {a.passing_score}%</span>
                <span>•</span>
                <span>{a.difficulty}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between rounded-b-xl text-xs">
              <span className="font-semibold text-slate-600">{a.category}</span>
              <Badge variant="outline" size="sm">
                ID #{a.id}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assessment">
        <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
          <Input
            label="Assessment Title"
            placeholder="e.g. Dynamic Programming & Recursion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a concise objective for this assessment..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              >
                <option value="CODING">CODING</option>
                <option value="APTITUDE">APTITUDE</option>
                <option value="MOCK">MOCK</option>
              </select>
            </div>

            <Input
              label="Category"
              placeholder="e.g. Algorithms"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <Input
              label="Duration (Mins)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />

            <Input
              label="Passing Score %"
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={formSubmitting}>
              Publish Assessment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
