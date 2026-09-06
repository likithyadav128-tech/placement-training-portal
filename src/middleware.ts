import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Check status
    if (token?.status === "BLOCKED" || token?.status === "INACTIVE") {
      return NextResponse.redirect(new URL(`/auth/inactive?status=${token.status}`, req.url));
    }

    // 2. Strict Role Protection
    if (path.startsWith("/student") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/auth/access-denied", req.url));
    }

    if (path.startsWith("/faculty") && token?.role !== "FACULTY" && token?.role !== "MANAGEMENT") {
      return NextResponse.redirect(new URL("/auth/access-denied", req.url));
    }

    if (path.startsWith("/management") && token?.role !== "MANAGEMENT") {
      return NextResponse.redirect(new URL("/auth/access-denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/student/:path*", "/faculty/:path*", "/management/:path*"],
};
