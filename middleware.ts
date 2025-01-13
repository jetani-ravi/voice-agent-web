import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";
import { publicRoutes } from "./auth.config";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const session = await auth();
  if (!session) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
