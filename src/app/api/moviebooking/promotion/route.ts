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
        where: (promotions, {eq}) => eq(promotions.code, code+"")
    })

    if (!data) {
      return NextResponse.json({ error: "promotion not found" }, { status: 404 });
    }

    return NextResponse.json(
      [data.discount]
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
