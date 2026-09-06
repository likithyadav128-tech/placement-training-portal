import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getCurrentAuthUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect("/auth/signin");
  }
  if (!allowedRoles.includes(user.role)) {
    redirect("/auth/access-denied");
  }
  return user;
}
