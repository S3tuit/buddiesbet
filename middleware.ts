import { auth } from "@/auth";

const PUBLIC_PATHS = ["/", "/login", "/api/expire-bets"];

export default auth((request) => {
  const { nextUrl, auth } = request;
  const { pathname, origin } = nextUrl;

  // If there's no valid session token and we're not on a public route, redirect
  if (!auth && !PUBLIC_PATHS.includes(pathname)) {
    const loginUrl = new URL("/login", origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
