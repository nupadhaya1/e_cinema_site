import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db/index";
import { movies } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      console.error("Invalid ID format:", id);
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }
    const movie = await db
      .select()
      .from(movies)
      .where(eq(movies.id, parsedId))
      .limit(1);
    if (!movie.length) {
      console.error("Movie not found for ID:", parsedId);
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    console.log("Fetched movie:", JSON.stringify(movie[0], null, 2));
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
    console.log("Received movie data:", JSON.stringify(body, null, 2));

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
      "showtime",
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

    let castValue: string;
    if (Array.isArray(body.cast) && body.cast.length > 0) {
      castValue = JSON.stringify(body.cast);
    } else {
      console.warn("Cast is invalid or empty, using default:", body.cast);
      castValue = "[]";
    }
    console.log("Processed cast value:", castValue);

    const movieData = {
      name: body.name as string,
      url: body.url as string,
      category: body.category as string,
      genre: body.genre as string,
      cast: castValue,
      director: body.director as string,
      producer: body.producer as string,
      synopsis: body.synopsis as string,
      trailerUrl: body.trailerUrl as string,
      imdb: Number(body.imdb) as number,
      mpaa: body.mpaa as string,
      showdate: JSON.stringify(
        body.showdate as { date: string; times: string[] }[],
      ),
      showtime: JSON.stringify(body.showtime as string[][]),
      reviews: body.reviews?.length ? JSON.stringify(body.reviews) : null,
    };

    console.log(
      "Transformed movie data for DB:",
      JSON.stringify(movieData, null, 2),
    );

    const newMovie = await db.insert(movies).values(movieData).returning();
    console.log("Inserted movie:", JSON.stringify(newMovie[0], null, 2));
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
    console.log("Received update data:", JSON.stringify(body, null, 2));

    const id = body.id;
    if (!id) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
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
      "showtime",
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

    let castValue: string;
    if (Array.isArray(body.cast) && body.cast.length > 0) {
      castValue = JSON.stringify(body.cast);
    } else {
      console.warn("Cast is invalid or empty, using default:", body.cast);
      castValue = "[]";
    }
    console.log("Processed cast value:", castValue);

    const movieData = {
      name: body.name as string,
      url: body.url as string,
      category: body.category as string,
      genre: body.genre as string,
      cast: castValue,
      director: body.director as string,
      producer: body.producer as string,
      synopsis: body.synopsis as string,
      trailerUrl: body.trailerUrl as string,
      imdb: Number(body.imdb) as number,
      mpaa: body.mpaa as string,
      showdate: JSON.stringify(
        body.showdate as { date: string; times: string[] }[],
      ),
      showtime: JSON.stringify(body.showtime as string[][]),
      reviews: body.reviews?.length ? JSON.stringify(body.reviews) : null,
    };

    console.log(
      "Transformed movie data for DB update:",
      JSON.stringify(movieData, null, 2),
    );

    const updatedMovie = await db
      .update(movies)
      .set(movieData)
      .where(eq(movies.id, parseInt(id)))
      .returning();

    if (!updatedMovie.length) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    console.log("Updated movie:", JSON.stringify(updatedMovie[0], null, 2));
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
