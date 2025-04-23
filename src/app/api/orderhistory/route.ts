import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import {
  users,
  confirmed_bookings,
  movies,
  showtimes,
  seats,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import {
  OrderHistoryType,
  OrderHistoryTypeArray,
} from "~/components/orderhistory/OrderHistory";

export async function GET() {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: OrderHistoryTypeArray = [];
  try {
    const history = await db
      .select()
      .from(confirmed_bookings)
      .where(eq(confirmed_bookings.userId, user.userId))
      .orderBy(confirmed_bookings.id);
    //console.log(history);
    await Promise.all(
      history.map(async (item) => {
        const movie = await db.query.movies.findFirst({
          where: (movies, { eq }) => eq(movies.id, item.movieId),
        });
        const showtime = await db.query.showtimes.findFirst({
          where: (showtimes, { eq }) => eq(showtimes.id, item.showtimeId),
        });
        const price = await db.query.prices.findFirst();
        if (!showtime || !movie || !price) {
          return;
        }

        const seatss = await db
          .select()
          .from(seats)
          .where(
            and(
              eq(seats.showtimeId, showtime.id),
              eq(seats.userId, user.userId),
              eq(seats.booking_id, item.id)
            ),
          );

        data.push({
          booking: item,
          movie: movie,
          showtime: showtime,
          seats: seatss,
          price: price,
        });
      }), //map
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
