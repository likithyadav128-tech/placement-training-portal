import { NextRequest, NextResponse } from "next/server";
import { executeCodeInSandbox } from "@/lib/code-runner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { language, code, testCases } = body;

    if (!code || !testCases || !Array.isArray(testCases)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await executeCodeInSandbox(language || "python", code, testCases);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Sandbox execution error:", err);
    return NextResponse.json({ error: err.message || "Execution failed" }, { status: 500 });
  }
}
