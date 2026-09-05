import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';
import { managementService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { Skeleton } from '../../components/ui/Skeleton';

export const PermissionManagementPage: React.FC = () => {
  const [facultyUsers, setFacultyUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [permissionData, setPermissionData] = useState<any | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = await managementService.listFaculty();
        setFacultyUsers(list);
        if (list.length > 0) {
          setSelectedUserId(list[0].user_id);
        }
      } catch (err) {
        console.error('Error fetching faculty list:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchUserPermissions = async (uid: number) => {
    setLoadingPerms(true);
    try {
      const data = await managementService.getUserPermissions(uid);
      setPermissionData(data);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    } finally {
      setLoadingPerms(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPermissions(selectedUserId);
    }
  }, [selectedUserId]);

  const handleTogglePermission = async (permCode: string, currentEffective: boolean) => {
    if (!selectedUserId) return;
    const nextState = !currentEffective;
    try {
      await managementService.overridePermission(selectedUserId, {
        permission_code: permCode,
        is_granted: nextState,
      });
      setToastMessage(`Permission '${permCode}' successfully ${nextState ? 'granted' : 'revoked'}. Action recorded in audit logs.`);
      fetchUserPermissions(selectedUserId);
    } catch (err) {
      console.error('Error updating permission:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Granular RBAC & Permission Governance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect, grant, and revoke granular security permissions for faculty and staff with instant audit logging
        </p>
      </div>

      {toastMessage && (
        <Alert variant="success" className="py-2.5">
          {toastMessage}
        </Alert>
      )}

      {/* User Selector Header */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select User to Manage
            </span>
            <select
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full sm:w-80 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {facultyUsers.map((f) => (
                <option key={f.user_id} value={f.user_id}>
                  {f.name} ({f.designation} • {f.department})
                </option>
              ))}
            </select>
          </div>

          {permissionData && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                {permissionData.user_name[0]}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{permissionData.user_name}</span>
                <span className="text-slate-500">{permissionData.user_email} • Role: {permissionData.user_role}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Permission Matrix Table */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Permission Access Matrix</CardTitle>
            <span className="text-xs text-slate-400">Granular Role-Based Security Engine</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Permission Name & Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Role Default</th>
                  <th className="py-3 px-4">Effective Status</th>
                  <th className="py-3 px-4 text-right">Action Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingPerms ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Loading permission matrix...
                    </td>
                  </tr>
                ) : !permissionData ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No user selected.
                    </td>
                  </tr>
                ) : (
                  permissionData.permissions.map((p: any) => (
                    <tr key={p.code} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{p.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" size="sm">
                          {p.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 font-medium">
                          {p.is_default_for_role ? 'Granted by Role' : 'Restricted by Role'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          {p.is_effective ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Granted
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-rose-500" />
                              Revoked
                            </span>
                          )}
                          {p.has_override && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200 ml-1">
                              Override Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => handleTogglePermission(p.code, p.is_effective)}
                          variant={p.is_effective ? 'danger' : 'success'}
                          size="sm"
                          leftIcon={p.is_effective ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        >
                          {p.is_effective ? 'Revoke Permission' : 'Grant Permission'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
