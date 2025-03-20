import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users, creditCards } from "~/server/db/schema";
import { useUser } from "@clerk/nextjs";

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userID, user.userId),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ isAdmin: userData.isAdmin });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 },
    );
  }
}
