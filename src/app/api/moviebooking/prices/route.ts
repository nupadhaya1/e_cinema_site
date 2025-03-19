import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { prices, showtimes } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { ChildProcess } from "child_process";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const showtimeId = searchParams.get("showtimeId");

  try {
    let data = await db.select().from(showtimes).where(and(
        eq(showtimes.movieId , Number(movieId)),
        
        eq(showtimes.id , Number(showtimeId))

    )).execute();
    //console.log(data);

    if (!data) {
      return NextResponse.json({ error: "price not found" }, { status: 404 });
    }
    let prices = await db.query.prices.findFirst({
        where: (prices, {eq}) => eq(prices.id , Number(data[0]?.pricesId)),
    })
    console.log(prices);
    return NextResponse.json(
        {
            adult: prices?.adultPrice,
            child: prices?.childPrice,
            senior: prices?.seniorPrice
        }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
