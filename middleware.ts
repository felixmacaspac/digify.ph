import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import { createClient } from "./utils/supabase/server";


export async function middleware(request: NextRequest) {

  const userAgent = request.headers.get("user-agent") || "";

  // Basic validation - Reject if User-Agent contains suspicious patterns
  const invalidPatterns = [/script/i, /<|>/, /javascript:/i, /eval/i];

  if (invalidPatterns.some((pattern) => pattern.test(userAgent))) {
    return NextResponse.json(
      { error: "Invalid User-Agent" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith("/admin")) {

    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }


    const {data: userData, error: userError} = await supabase
      .from("customers")
      .select("role")
      .eq("customer_id", user.user?.id)
      .single()

    if (!userData || userError) {
      console.error(userError);
      return NextResponse.redirect(new URL("/error?messsage=An error occured", request.url))
    }


    if (userData.role !== 1) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

  }


  const forbiddenIPs = ["169.254.169.254"];

  // Check if request is trying to access AWS metadata API
  if (forbiddenIPs.some((ip) => request.url.includes(ip))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  const response = await updateSession(request);

  if (!response) {
    return NextResponse.next();
  }



  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
