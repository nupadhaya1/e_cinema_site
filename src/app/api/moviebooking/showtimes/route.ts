import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  //console.log(request.url);
  const movieId = searchParams.get("movieId");

  try {
    let showtimes = await db.query.showtimes.findMany({
      where: (showtimes, { eq }) => eq(showtimes.movieId, Number(movieId)),
    });

    if (!showtimes) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //console.log(showtimes);
    return NextResponse.json(
      showtimes.map((showtime) => {
        return { id: showtime.id, time: showtime.time };
      }),
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
