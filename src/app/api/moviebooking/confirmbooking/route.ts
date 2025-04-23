import { db } from "~/server/db";
import { creditCards } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { seats as seatSchema, confirmed_bookings } from "~/server/db/schema";

export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const jason = await request.json();
  const { movie, showtime, seats, card, total } = jason;

  try {

    let bookingId = await db.insert(confirmed_bookings).values({
      movieId: Number(movie.id),
      showtimeId: Number(showtime.id),
      userId: String(user.userId),
      cardId: String(card),
      total: total
    }).returning({bookingId: confirmed_bookings.id}).execute();

    seats.map(async (seat: any) => {
      //console.log(seat);
      await db.insert(seatSchema).values({
        movieId: Number(movie.id),
        showtimeId: Number(showtime.id),
        seat: seat.row + String(seat.number),
        userId: user.userId + "",
        ageCategory: seat.ageCategory,
        booking_id: bookingId[0]?.bookingId
      });
    });

    //console.log(bookingId);
    return NextResponse.json(bookingId);
  } catch (error) {
    console.error("Error inserting card:", error);
    return NextResponse.json({ error: "Failed to add card" }, { status: 500 });
  }
}
