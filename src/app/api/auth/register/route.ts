import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { name, email, password, role = "STUDENT", departmentCode = "CSE", rollNumber } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required registration fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const department = await prisma.department.findUnique({
      where: { code: departmentCode },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role as any,
        status: "ACTIVE",
        ...(role === "STUDENT" && {
          studentProfile: {
            create: {
              studentId: rollNumber || `STD-${Date.now().toString().slice(-6)}`,
              year: 4,
              section: "A",
              cgpa: 8.5,
              overallScore: 75.0,
              codingScore: 80.0,
              aptitudeScore: 74.0,
              mockScore: 76.0,
              readinessStatus: "PLACEMENT_READY",
              department: {
                connect: { code: departmentCode || "CSE" },
              },
            },
          },
        }),
        ...(role === "FACULTY" && {
          facultyProfile: {
            create: {
              employeeId: `FAC-${Date.now().toString().slice(-4)}`,
              designation: "Placement Coordinator",
              department: {
                connect: { code: departmentCode || "CSE" },
              },
            },
          },
        }),
      },
    });

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "USER_REGISTERED",
      target: `USER:${user.id}`,
      details: JSON.stringify({ role, departmentCode }),
    });

    return NextResponse.json({
      success: true,
      message: "Account registered successfully. You can now sign in.",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 });
  }
}
