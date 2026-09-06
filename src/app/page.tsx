import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = session.user.role;
  if (role === UserRole.STUDENT) {
    redirect("/student/dashboard");
  } else if (role === UserRole.FACULTY) {
    redirect("/faculty/dashboard");
  } else if (role === UserRole.MANAGEMENT) {
    redirect("/management/dashboard");
  }

  redirect("/auth/signin");
}
