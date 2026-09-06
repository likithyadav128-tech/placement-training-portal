export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";

export const metadata: Metadata = {
  title: "Placement Training Portal",
  description: "Enterprise Campus Placement Training & Student Performance Management Portal",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 font-sans min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
