import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // For password recovery, redirect to a reset password page
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  return NextResponse.redirect(new URL("/catalog", request.url));
}
