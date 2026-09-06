import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { requireRole } from "@/lib/rbac";
import { UserRole } from "@prisma/client";

export default async function ManagementLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole([UserRole.MANAGEMENT]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="MANAGEMENT" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Institution Governance & Administration" subtitle={`${user.name} • Dean of Placements`} />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
