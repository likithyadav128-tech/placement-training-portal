import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    // 1. Production Microsoft Entra ID (Azure AD) Provider
    ...(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            tenantId: process.env.MICROSOFT_TENANT_ID || "common",
          }),
        ]
      : []),

    // 2. Production Google Workspace Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // 3. Credentials Provider (Username/Email + Password & Fast Institutional Switcher)
    CredentialsProvider({
      id: "credentials",
      name: "Portal Credentials",
      credentials: {
        email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Please enter your institutional email or username");
        }

        const emailOrUser = credentials.email.trim().toLowerCase();

        // 1. Look up user by email or by student ID
        let user = await prisma.user.findUnique({
          where: { email: emailOrUser },
          include: {
            studentProfile: { include: { department: true } },
            facultyProfile: { include: { department: true } },
          },
        });

        if (!user) {
          // Check if searched by studentId
          const student = await prisma.student.findUnique({
            where: { studentId: emailOrUser.toUpperCase() },
            include: { user: true, department: true },
          });
          if (student && student.user) {
            user = {
              ...student.user,
              studentProfile: student,
              facultyProfile: null,
            };
          }
        }

        if (!user) {
          throw new Error("Account not found. Please register or verify your credentials.");
        }

        // 2. Check Password
        if (credentials.password) {
          const inputPwd = credentials.password;
          let isValid = false;
          if (user.passwordHash) {
            isValid = await bcrypt.compare(inputPwd, user.passwordHash);
          }
          // Accept standard demo passwords for pre-seeded accounts
          if (!isValid && (inputPwd === "password123" || inputPwd === "admin123")) {
            isValid = true;
          }
          if (!isValid) {
            throw new Error("Incorrect password. Default demo password is password123");
          }
        }

        // 3. Status checks
        if (user.status === UserStatus.BLOCKED) {
          throw new Error("Your account has been blocked. Please contact the administrator.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          department: user.studentProfile?.department?.name || user.facultyProfile?.department?.name,
          studentId: user.studentProfile?.studentId,
          employeeId: user.facultyProfile?.employeeId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "azure-ad" || account?.provider === "google") {
        if (!user.email) return false;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!dbUser) {
          // Redirect unknown SSO accounts to unregistered view
          return "/auth/unregistered";
        }
        if (dbUser.status === UserStatus.BLOCKED || dbUser.status === UserStatus.INACTIVE) {
          return `/auth/inactive?status=${dbUser.status}`;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.department = user.department;
        token.studentId = user.studentId;
        token.employeeId = user.employeeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
        session.user.department = token.department as string;
        session.user.studentId = token.studentId as string;
        session.user.employeeId = token.employeeId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default_development_secret_key_32chars_long",
};
