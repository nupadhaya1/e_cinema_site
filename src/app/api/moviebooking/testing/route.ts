import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { prices, seats, showtimes } from "~/server/db/schema";

export async function GET(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const times = [
    "10:00 AM" ,
    "1:00 PM" ,
    "4:00 PM" ,
    "7:00 PM" ,
    "10:00 PM" ,
  ]
  const taken = ["A5", "C6", "B2"]


  try {
    await db.insert(prices).values({
        childPrice: 10.00,
        seniorPrice: 15.00,
        adultPrice: 20.00
    });
    let priceId = await db.query.prices.findFirst();

    let data = await db.query.movies.findMany();
    data.map(async (movie)=> {
        times.map(async (time)=> {
            await db.insert(showtimes).values({
                movieId: movie.id,
                time: time,
                pricesId: priceId?.id,

            })
        });

        let s = await db.query.showtimes.findMany();
        s.map((show) => {
          taken.map(async (t) => {
            await db.insert(seats).values({
              seat: t, 
              movieId: movie.id,
              userId: user.userId,
              showtimeId: show.id
            })
          })
        })
    })

    return NextResponse.json(
      "ok"
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
