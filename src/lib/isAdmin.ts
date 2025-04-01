// lib/isAdmin.ts
export async function isAdmin(
  userId: string | null,
  req: Request,
): Promise<boolean> {
  if (!userId) return false;

  try {
    const url = new URL("/api/isadmin", req.url).toString();
    const response = await fetch(url, {
      headers: {
        Cookie: req.headers.get("cookie") || "", // forward auth cookies
      },
    });

    if (!response.ok) {
      console.error("API call to /api/isadmin failed");
      return false;
    }

    const data = await response.json();
    return !!data?.isAdmin;
  } catch (err) {
    console.error("Failed to fetch isAdmin from API", err);
    return false;
  }
}
