import { prisma } from "@/lib/prisma";

export async function logAuditEvent(params: {
  userId?: string;
  userEmail: string;
  userRole: string;
  action: string;
  target: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        userRole: params.userRole,
        action: params.action,
        target: params.target,
        details: params.details,
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
