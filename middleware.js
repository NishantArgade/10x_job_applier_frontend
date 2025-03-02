import { NextResponse } from "next/server";
import { fetchData } from "@/lib/serverApi";

export async function middleware(req) {
  try {
    const data = await fetchData("/api/v1/auth/check-session");

    if (!data?.authenticated) {
      return handleRedirect(req);
    }

    return handleAuthRoutes(req, true);
  } catch (error) {
    console.error("Session validation failed:", error);
    return handleRedirect(req);
  }
}

function handleRedirect(req) {
  const protectedRoutes = ["/dashboard"];
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  return NextResponse.next();
}

function handleAuthRoutes(req, isAuthenticated) {
  const authRoutes = ["/auth/login", "/auth/register"];
  if (isAuthenticated && authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/auth/login", "/auth/register"],
};
