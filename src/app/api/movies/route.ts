import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db/index";
import { movies, Showtime, showtimes } from "~/server/db/schema";
import { eq, and, ne, not } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
import { Item } from "@radix-ui/react-select";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      console.error("No ID provided in query");
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      console.error("Invalid ID format:", id);
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const movie = await db.select().from(movies).where(eq(movies.id, parsedId));
    //.limit(1);
    if (!movie.length) {
      console.error("Movie not found for ID:", parsedId);
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    //console.log("Fetched movie:", JSON.stringify(movie[0], null, 2));
    return NextResponse.json(movie[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //console.log("Received movie data:", JSON.stringify(body, null, 2));

    const requiredFields = [
      "name",
      "url",
      "category",
      "genre",
      "cast",
      "director",
      "producer",
      "synopsis",
      "trailerUrl",
      "imdb",
      "mpaa",
      "showdate",
      //"showtime",
    ];
    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null,
    );
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const movieData = {
      name: body.name as string,
      url: body.url as string,
      category: body.category as string,
      genre: body.genre as string,
      cast: JSON.stringify(body.cast as string[]),
      director: body.director as string,
      producer: body.producer as string,
      synopsis: body.synopsis as string,
      trailerUrl: body.trailerUrl as string,
      imdb: Number(body.imdb) as number,
      mpaa: body.mpaa as string,
      reviews: body.reviews?.length ? JSON.stringify(body.reviews) : null,
    };

    // console.log(
    //   "Transformed movie data for DB:",
    //   JSON.stringify(movieData, null, 2),
    // );

    const newMovie = await db
      .insert(movies)
      .values(movieData)
      .returning()
      .execute();
    //console.log(body.showdate);

    let insertConflicts: any[] = [];
    //console.log(insertConflicts);

    await Promise.all(
      body.showdate.map(async (showtime: Showtime) => {
        //console.log(showtime);
        let conflicts = await db
          .select()
          .from(showtimes)
          .where(
            and(
              //ne(showtimes.movieId, showtime.movieId!),
              eq(showtimes.date, showtime.date),
              eq(showtimes.time, showtime.time),
              eq(showtimes.showroom, showtime.showroom!),
              eq(showtimes.archived, false),
            ),
          );
    
        if (conflicts.length > 0) {
        //insertConflicts = await [...insertConflicts, ...conflicts];
        insertConflicts.push(showtime);
        //console.log(insertConflicts);
        }
      }),
    );
    //console.log(insertConflicts.length);

    if (insertConflicts.length > 0) {
      //console.log("hello");

      return NextResponse.json(
        {
          error: `Movie created sucessfully\n !!!!!HOWEVER!!!!\nFollowing Showtimes have conflicts with existing entries: \n${JSON.stringify(insertConflicts)}\n please edit on the follwing page.`,
          movieId: newMovie[0]?.id,
        },
        { status: 418 },
      );
    }
    body.showdate.map(async (item: Showtime) => {
      let movieId = newMovie[0]?.id;
      await db.insert(showtimes).values({
        time: item.time,
        date: item.date,
        movieId: movieId,
        pricesId: 6,
        archived: false,
      });
    });

    //console.log("Inserted movie:", JSON.stringify(newMovie[0], null, 2));
    return NextResponse.json(newMovie[0], { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      {
        error: `Failed to create movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("Received update data:", JSON.stringify(body, null, 2));

    const id = body.id;
    if (!id) {
      console.error("No ID provided in request body");
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      console.error("Invalid ID format:", id);
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const requiredFields = [
      "name",
      "url",
      "category",
      "genre",
      "cast",
      "director",
      "producer",
      "synopsis",
      "trailerUrl",
      "imdb",
      "mpaa",
      "showdate",
    ];
    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null,
    );
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const movieData = {
      name: body.name as string,
      url: body.url as string,
      category: body.category as string,
      genre: body.genre as string,
      cast: JSON.stringify(body.cast as string[]),
      director: body.director as string,
      producer: body.producer as string,
      synopsis: body.synopsis as string,
      trailerUrl: body.trailerUrl as string,
      imdb: Number(body.imdb) as number,
      mpaa: body.mpaa as string,
      // showdate: JSON.stringify(
      //   body.showdate as { date: string; times: string[] }[],
      // ),
      reviews: body.reviews?.length ? JSON.stringify(body.reviews) : null,
    };

    // console.log(
    //   "Transformed movie data for DB update:",
    //   JSON.stringify(movieData, null, 2),
    // );

    const updatedMovie = await db
      .update(movies)
      .set(movieData)
      .where(eq(movies.id, parsedId))
      .returning();

    if (!updatedMovie.length) {
      console.error("Movie not found for ID:", parsedId);
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    let insertConflicts: any[] = [];
    //console.log(insertConflicts);

    await Promise.all(
      body.showdate.map(async (showtime: Showtime) => {
        //console.log(showtime);
        let conflicts = await db
          .select()
          .from(showtimes)
          .where(
            and(
              not(eq(showtimes.movieId, updatedMovie[0]!.id)),
              eq(showtimes.date, showtime.date),
              eq(showtimes.time, showtime.time),
              eq(showtimes.showroom, showtime.showroom!),
              eq(showtimes.archived, false),
            ),
          );
    //console.log(conflicts);
        if (conflicts.length > 0) {
        //insertConflicts = await [...insertConflicts, ...conflicts];
        insertConflicts.push(showtime);
        //console.log(insertConflicts);
        }
      }),
    );
    //console.log(insertConflicts.length);

    if (insertConflicts.length > 0) {
      //console.log("hello");

      return NextResponse.json(
        {
          error: `SHOWTIME NOT UPDATED\n !!!!!!!!!\nFollowing Showtimes have conflicts with existing entries: \n${JSON.stringify(insertConflicts)}\n `,
          movieId: updatedMovie[0]?.id,
        },
        { status: 418 },
      );
    }
    //how updateing showtimes works
    //1. archive all existing showtimes for a movie.
    //2. try insert a showtime. if it doenst exist insert as normal
    //if already exists, unarchive it
    const currentShowtimes = await db
      .update(showtimes)
      .set({ archived: true })
      .where(eq(showtimes.movieId, parsedId));
    console.log(body.showdate);
    body.showdate.map(async (item: Showtime) => {
      console.log(item);
      await db
        .insert(showtimes)
        .values({ ...item, movieId: parsedId, pricesId: 6, archived: false })
        .onConflictDoUpdate({
          target: [showtimes.movieId, showtimes.time, showtimes.date],
          set: {
            showroom: item.showroom,
            archived: false,
          },
        });
    });

    //console.log("Updated movie:", JSON.stringify(updatedMovie[0], null, 2));
    return NextResponse.json(updatedMovie[0], { status: 200 });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      {
        error: `Failed to update movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      console.error("No ID provided in query");
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      console.error("Invalid ID format:", id);
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const deletedMovie = await db
      .delete(movies)
      .where(eq(movies.id, parsedId))
      .returning();

    if (!deletedMovie.length) {
      console.error("Movie not found for ID:", parsedId);
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    console.log("Deleted movie:", JSON.stringify(deletedMovie[0], null, 2));
    return NextResponse.json(
      { message: "Movie deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      {
        error: `Failed to delete movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
