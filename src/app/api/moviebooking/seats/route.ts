import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { seats } from "~/server/db/schema";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  //console.log(request.url);
  const showTimeId = searchParams.get("showTimeId");

  try {
    let seats = await db.query.seats.findMany({
      where: (seats, { eq }) => eq(seats.showtimeId, Number(showTimeId)),
    });

    if (!seats) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let data: any = [];
    seats.map((seat) => data.push(seat.seat));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
