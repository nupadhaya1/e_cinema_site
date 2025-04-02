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
  let conditions = [
    eq(showtimes.movieId, Number(movieId)),
    eq(showtimes.archived, false),
  ];
  if(date != null ) {
    conditions.push(ilike(showtimes.date, `%${date}%`));
  }

  try {
    let dbshowtimes = await db
      .select()
      .from(showtimes)
      .where(
        and(
         ...conditions
        ),
      ).orderBy(
      sql`${showtimes.time}::TIME`
      );
    console.log(dbshowtimes);

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
