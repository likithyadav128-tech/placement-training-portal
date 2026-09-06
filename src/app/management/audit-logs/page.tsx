export const dynamic = "force-dynamic";
import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function ManagementAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">📜 Security & System Audit Trail</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Chronological record of all authentication, administrative, and permission modifications.
        </p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.userEmail}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-black">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-blue-700">{log.action}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.target}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
