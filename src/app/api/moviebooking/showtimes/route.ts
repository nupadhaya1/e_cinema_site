import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { showtimes } from "~/server/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const date = searchParams.get("date");

  console.log("Raw movieId from URL:", movieId, "Type:", typeof movieId);
  console.log("Parsed movieId:", Number(movieId));
  console.log("Raw date from URL:", date);


  let conditions = [
    eq(showtimes.movieId, Number(movieId)),
    eq(showtimes.archived, false),
  ];
  if (date != null ) {
    const simplifiedDate = date.split("T")[0];
    console.log("Simplified date for ilike match:", simplifiedDate);
    conditions.push(ilike(showtimes.date, `%${simplifiedDate}%`));

    //conditions.push(ilike(showtimes.date, `%${date}%`));
    //console.log(ilike(showtimes.date, `%${date}%`));
  }

  try {
    const dbshowtimes = await db
      .select()
      .from(showtimes)
      .where(
        and(
         ...conditions
        ),
      ).orderBy(
      sql`${showtimes.time}::TIME`
      );
    console.log("Conditions: ", conditions);
    console.log("before");
    console.log(dbshowtimes);
    console.log(dbshowtimes.length)
    console.log("after");

    if (!dbshowtimes) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //console.log(showtimes);
    return NextResponse.json(
      dbshowtimes,
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
