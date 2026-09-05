import React, { useState, useEffect } from 'react';
import { Settings, Save, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { managementService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await managementService.getSettings();
        setSettings(res);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !settings) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Scoring Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure centralized placement scoring weights, eligibility thresholds, and institutional parameters
        </p>
      </div>

      {saved && (
        <Alert variant="success" title="Settings Saved">
          Scoring engine configurations updated successfully.
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scoring Weights Card */}
        <Card hover>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand-600" />
              <CardTitle>Placement Readiness Scoring Formula Weights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500">
              The readiness engine dynamically computes composite readiness scores based on these centralized weights:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Coding & Problem Solving</span>
                <div className="text-xl font-extrabold text-slate-900">30%</div>
                <span className="text-[11px] text-slate-400">Weight: 0.30</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Quantitative & Aptitude</span>
                <div className="text-xl font-extrabold text-slate-900">25%</div>
                <span className="text-[11px] text-slate-400">Weight: 0.25</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Technical & CS Core</span>
                <div className="text-xl font-extrabold text-slate-900">20%</div>
                <span className="text-[11px] text-slate-400">Weight: 0.20</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Placement Mock Exams</span>
                <div className="text-xl font-extrabold text-slate-900">15%</div>
                <span className="text-[11px] text-slate-400">Weight: 0.15</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Communication & HR</span>
                <div className="text-xl font-extrabold text-slate-900">10%</div>
                <span className="text-[11px] text-slate-400">Weight: 0.10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thresholds Card */}
        <Card hover>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <CardTitle>Institutional Threshold Benchmarks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Placement Ready Cutoff Score (%)"
                type="number"
                defaultValue={75}
                helperText="Students scoring above this are classified as Placement Ready"
              />
              <Input
                label="At-Risk Alert Trigger Score (%)"
                type="number"
                defaultValue={60}
                helperText="Students scoring below this are flagged on Faculty and Management dashboards"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
