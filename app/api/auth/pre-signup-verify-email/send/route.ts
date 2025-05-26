import { type NextRequest, NextResponse } from "next/server";
import { sendPreSignupCode, signUp } from "@/app/api/services/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const result = await sendPreSignupCode({ email });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Verification process error:", error);

    return NextResponse.json(
      { error: error.message || "An error occurred during verification process" },
      { status: 500 }
    );
  }
}
