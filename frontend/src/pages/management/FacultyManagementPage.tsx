import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { managementService } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const FacultyManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await managementService.listFaculty();
      setFaculty(res);
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await managementService.createUser({
        name,
        email,
        role: 'FACULTY',
        department_code: departmentCode,
        designation,
      });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      fetchFaculty();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create faculty.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Appoint department coordinators, review designations, and configure individual permissions
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Faculty
        </Button>
      </div>

      {/* Faculty Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((f) => (
          <Card key={f.id} hover className="flex flex-col justify-between">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  {f.name[0]}
                </div>
                <Badge variant={f.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                  {f.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{f.name}</h3>
                <p className="text-xs text-brand-600 font-semibold mt-0.5">{f.designation}</p>
                <span className="text-xs text-slate-500 block mt-1">{f.department_name} ({f.department})</span>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">{f.employee_id} • {f.email}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between rounded-b-xl">
              <Button
                onClick={() => navigate('/management/permissions')}
                variant="outline"
                size="sm"
                leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
              >
                Permissions
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Appoint Faculty Member">
        <form onSubmit={handleCreateFaculty} className="space-y-4 text-xs">
          <Input
            label="Faculty Name"
            placeholder="e.g. Dr. Priya Raman"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Institutional Email"
            type="email"
            placeholder="e.g. priya.raman@institution.edu"
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

            <Input
              label="Designation"
              placeholder="e.g. Associate Professor"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={formSubmitting}>
              Appoint Faculty
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
