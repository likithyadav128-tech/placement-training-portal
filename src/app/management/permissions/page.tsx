import React from "react";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { ShieldCheck } from "lucide-react";

export default async function ManagementPermissionsPage() {
  const permissions = await prisma.permission.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">🛡️ Granular RBAC & Permission Matrix</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Inspect role defaults and grant granular administrative overrides.
        </p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Permission Code</th>
                <th className="py-3 px-4">Permission Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Default Role</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-slate-600">{p.category}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-black">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
