import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAdmin(request: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user role
  const { data, error } = await supabase
    .from("customers")
    .select("role")
    .eq("customer_id", user.id)
    .single();

  if (error || !data || data.role !== 1) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // Admin is authorized
}
