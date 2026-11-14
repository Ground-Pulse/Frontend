/**
 * Optimistic role-based route guard (FEA section 5 "Navigation Guards").
 *
 * Reads the non-sensitive `gp_role` cookie written at login and redirects to
 * /login or the user's own home before the page renders. This is UX only —
 * the NestJS API enforces RBAC on every request (CASL guards).
 */
import { NextResponse, type NextRequest } from "next/server";

type Role = "OWNER" | "INSPECTOR" | "ADMIN" | "PROVIDER";

const HOME: Record<Role, string> = {
  OWNER: "/dashboard",
  INSPECTOR: "/inspections",
  ADMIN: "/admin/dashboard",
  PROVIDER: "/provider/jobs",
};

/** first path segment → roles allowed */
const ACCESS: Record<string, Role[] | "ANY"> = {
  dashboard: ["OWNER"],
  schedule: ["OWNER"],
  issues: ["OWNER"],
  property: ["OWNER", "ADMIN"],
  inspections: ["INSPECTOR"],
  inspection: ["INSPECTOR"],
  admin: ["ADMIN"],
  provider: ["PROVIDER"],
  issue: "ANY",
  report: ["OWNER", "INSPECTOR", "ADMIN"],
  notifications: "ANY",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1] ?? "";

  // onboarding/add-property is owner-only; onboarding/welcome is public
  const rule = pathname.startsWith("/onboarding/add-property") ? (["OWNER"] as Role[]) : ACCESS[segment];
  if (!rule) return NextResponse.next();

  const role = request.cookies.get("gp_role")?.value as Role | undefined;
  if (!role || !(role in HOME)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (rule !== "ANY" && !rule.includes(role)) {
    return NextResponse.redirect(new URL(HOME[role], request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/schedule/:path*",
    "/issues/:path*",
    "/property/:path*",
    "/inspections/:path*",
    "/inspection/:path*",
    "/admin/:path*",
    "/provider/:path*",
    "/issue/:path*",
    "/report/:path*",
    "/notifications/:path*",
    "/onboarding/add-property",
  ],
};
