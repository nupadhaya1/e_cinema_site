// app/api/clerk-user/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const userId = "user_2ub1N1TfLTuVKkcXqLC67WkawgL";

  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to fetch user: ${response.statusText}` },
      { status: response.status },
    );
  }

  const userData = await response.json();
  return NextResponse.json(userData);
}
