import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isAdmin } from "~/lib/isAdmin";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoute(req)) {
    if (!userId) return Response.redirect(new URL("/", req.url));

    if (req.nextUrl.pathname.startsWith("/admin")) {
      const adminStatus = await isAdmin(userId, req);
      if (!adminStatus) {
        return Response.redirect(new URL("/", req.url));
      }
    }
  }
});
