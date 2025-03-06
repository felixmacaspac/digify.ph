import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();

  const response = new NextResponse(JSON.stringify({ message: "Logged out" }), { status: 200 });

  response.headers.set("Set-Cookie", "sb-access-token=; Path=/; HttpOnly; Secure; Max-Age=0");
  response.headers.set("Set-Cookie", "sb-refresh-token=; Path=/; HttpOnly; Secure; Max-Age=0");

  return response;
}