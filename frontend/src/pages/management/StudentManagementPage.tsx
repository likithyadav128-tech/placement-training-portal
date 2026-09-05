import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  UserCheck,
  UserX,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { facultyService, managementService } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [year, setYear] = useState('4');
  const [section, setSection] = useState('A');
  const [cgpa, setCgpa] = useState('8.0');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await facultyService.listStudents({ limit: 50 });
      setStudents(res.items);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (user_id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await managementService.updateUserStatus(user_id, nextStatus);
      setToastMessage(`Student account has been ${nextStatus === 'ACTIVE' ? 'reactivated' : 'deactivated'}.`);
      fetchStudents();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await managementService.createUser({
        name,
        email,
        role: 'STUDENT',
        department_code: departmentCode,
        year: Number(year),
        section,
        cgpa: Number(cgpa),
      });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setToastMessage('New student successfully provisioned.');
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create student.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision students, assign department cohorts, and manage active enrollment status
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Student
        </Button>
      </div>

      {toastMessage && (
        <Alert variant="success" className="py-2.5">
          {toastMessage}
        </Alert>
      )}

      {/* Table */}
      <Card hover>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Dept / Year / Sec</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{s.student_id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600">{s.email}</td>
                    <td className="py-3 px-4 text-slate-600">{s.department} • Y{s.year} ({s.section})</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{s.cgpa}</td>
                    <td className="py-3 px-4">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(s.user_id, s.status)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          s.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Provision New Student">
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="e.g. rsharma@institution.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-slate-900"
              >
                <option value="3">3rd Year</option>
                <option value="4">4th Year (Graduating)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Section"
              placeholder="e.g. A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
            <Input
              label="Current CGPA"
              type="number"
              step="0.1"
              placeholder="e.g. 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={formSubmitting}>
              Provision Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
