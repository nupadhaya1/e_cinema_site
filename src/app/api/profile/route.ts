import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    let userData = await request.json();
    // await db.insert(users).values({
    //   userID: user.userId,
    //   isAdmin: false, // default role (adjust as needed)
    // });
    await db.update(users).set({
       ...userData
    }).where(eq(users.userID, user.userId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updataing profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.userID, user.userId),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    //console.log(userData);
    let data = {
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      promotions: userData.promotions
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
