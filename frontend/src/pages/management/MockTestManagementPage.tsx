import React, { useState, useEffect } from 'react';
import { Award, Plus, Clock, Layers } from 'lucide-react';
import { assessmentService, managementService } from '../../services/api';
import { Assessment } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const MockTestManagementPage: React.FC = () => {
  const [mockTests, setMockTests] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('60');
  const [passingScore, setPassingScore] = useState('75');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchMocks = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.listAssessments({ type: 'MOCK' });
      setMockTests(data);
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  const handleCreateMock = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await managementService.createAssessment({
        title,
        description,
        type: 'MOCK',
        category: 'Placement Mock Test',
        difficulty: 'Hard',
        duration: Number(duration),
        passing_score: Number(passingScore),
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchMocks();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create mock exam.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Exam Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure multi-section simulated placement exams and test scoring thresholds
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create Mock Exam
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTests.map((m) => (
          <Card key={m.id} hover className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="md">
                <Award className="h-3.5 w-3.5" />
                MOCK EXAM
              </Badge>
              <Badge variant="success" size="sm">{m.status}</Badge>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{m.description}</p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {m.duration} Mins
              </span>
              <span>•</span>
              <span>Pass Score: {m.passing_score}%</span>
              <span>•</span>
              <span>4 Sections (Aptitude, Logical, Verbal, Coding)</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Mock Test">
        <form onSubmit={handleCreateMock} className="space-y-4 text-xs">
          <Input
            label="Mock Test Title"
            placeholder="e.g. Placement Mock Test 03 (Product Company Pattern)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description & Format
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Multi-section placement exam covering Aptitude, Logical Reasoning, Verbal, and Live Coding..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              Publish Mock Exam
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
