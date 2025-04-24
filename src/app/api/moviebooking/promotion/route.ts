import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { prices, promotions, showtimes } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { ChildProcess } from "child_process";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("promotion");

  try {
    let data = await db.query.promotions.findFirst({
      where: (promotions, { eq }) => eq(promotions.code, code + ""),
    });

    if (!data) {
      return NextResponse.json(
        { error: "promotion not found" },
        { status: 404 },
      );
    }

    return NextResponse.json([data.discount]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.delete && body.code) {
    try {
      await db.delete(promotions).where(eq(promotions.code, body.code));
      return NextResponse.json({ message: "Promotion deleted" });
    } catch (err) {
      return NextResponse.json(
        { error: "Error deleting promotion" },
        { status: 500 },
      );
    }
  }

  if (!body.code || typeof body.discount !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await db.insert(promotions).values({
      code: body.code,
      discount: body.discount,
    });

    return NextResponse.json({ message: "Promotion added" });
  } catch (err) {
    console.error("Insert error:", err);
    return NextResponse.json(
      { error: "Failed to add promotion" },
      { status: 500 },
    );
  }
}
