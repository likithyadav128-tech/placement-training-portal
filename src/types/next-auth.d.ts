import { UserRole, UserStatus } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    status: UserStatus;
    department?: string;
    studentId?: string;
    employeeId?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      status: UserStatus;
      department?: string;
      studentId?: string;
      employeeId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    status: UserStatus;
    department?: string;
    studentId?: string;
    employeeId?: string;
  }
}
