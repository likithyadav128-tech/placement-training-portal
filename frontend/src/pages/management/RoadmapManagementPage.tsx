import React, { useState, useEffect } from 'react';
import { Map, Plus, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const RoadmapManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const standardRoadmap = [
    {
      order: 1,
      title: 'Programming Fundamentals',
      description: 'Core syntax, OOP concepts, control flow, functions in Python/Java/C++.',
      target: 100,
      topics: ['Variables & Data Types', 'Control Structures', 'Object-Oriented Programming', 'File I/O'],
    },
    {
      order: 2,
      title: 'Data Structures & Algorithms (DSA)',
      description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching.',
      target: 85,
      topics: ['Arrays & Two Pointers', 'Binary Trees & BST', 'Dynamic Programming', 'Graph Traversal'],
    },
    {
      order: 3,
      title: 'Quantitative & Logical Aptitude',
      description: 'Percentages, Profit & Loss, Time-Speed-Distance, Syllogisms, Data Interpretation.',
      target: 75,
      topics: ['Time & Work', 'Percentages & Profit/Loss', 'Syllogisms & Deductions', 'Data Interpretation Tables'],
    },
    {
      order: 4,
      title: 'Placement Mock Exam Simulation',
      description: 'Full-length institutional mock tests matching MNC and Product company patterns.',
      target: 75,
      topics: ['Placement Mock Test 01', 'Placement Mock Test 02', 'Sectional Time Management'],
    },
    {
      order: 5,
      title: 'Technical Core & HR Interview Prep',
      description: 'OS, DBMS, Computer Networks, Resume review, and Behavioral HR responses.',
      target: 80,
      topics: ['Operating Systems (Processes/Threads)', 'SQL Queries & Indexing', 'System Design Basics', 'STAR Technique for HR'],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Standard Placement Roadmaps</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure institutional training milestones. Students receive automated progress tracking based on scores.
          </p>
        </div>
      </div>

      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-brand-600" />
              <CardTitle>Campus Placement Preparation Master Pipeline (Active)</CardTitle>
            </div>
            <Badge variant="success" size="sm">5 Milestones Configured</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {standardRoadmap.map((step) => (
            <div key={step.order} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {step.order}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">Target: {step.target}%</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {step.topics.map((t, idx) => (
                  <span key={idx} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
