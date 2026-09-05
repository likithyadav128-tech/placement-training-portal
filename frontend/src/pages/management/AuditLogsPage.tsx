import React, { useState, useEffect } from 'react';
import { History, Shield, Search, Clock, FileText } from 'lucide-react';
import { managementService } from '../../services/api';
import { AuditLog } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchAction, setSearchAction] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await managementService.getAuditLogs({
        action: searchAction || undefined,
        limit: 100,
      });
      setLogs(data);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [searchAction]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security & System Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit trail for all authorization grants, user state modifications, and administrative events
        </p>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by action (e.g. GRANT_PERMISSION, LOGIN, CREATE_STUDENT)..."
            value={searchAction}
            onChange={(e) => setSearchAction(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card hover>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type / ID</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading audit records...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No audit events recorded.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        {log.user_email || 'SYSTEM'}
                        {log.user_role && (
                          <span className="text-[10px] text-slate-400 font-normal ml-1">({log.user_role})</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            log.action.includes('GRANT')
                              ? 'success'
                              : log.action.includes('REVOKE')
                              ? 'danger'
                              : log.action.includes('LOGIN')
                              ? 'primary'
                              : 'secondary'
                          }
                          size="sm"
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {log.target_type || '-'} {log.target_id ? `(#${log.target_id})` : ''}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-700 max-w-xs truncate">
                        {log.details || '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {log.ip_address || '127.0.0.1'}
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
