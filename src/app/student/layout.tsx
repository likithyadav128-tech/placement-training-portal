export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { requireRole } from "@/lib/rbac";
import { UserRole } from "@prisma/client";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole([UserRole.STUDENT]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="STUDENT" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Student Placement Hub" subtitle={`${user.name} • ${user.department || "Engineering"}`} />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
