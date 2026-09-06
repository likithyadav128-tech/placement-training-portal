import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { requireRole } from "@/lib/rbac";
import { UserRole } from "@prisma/client";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole([UserRole.FACULTY, UserRole.MANAGEMENT]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="FACULTY" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Faculty Placement Coordinator Hub" subtitle={`${user.name} • ${user.department || "Engineering"} Coordinator`} />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
