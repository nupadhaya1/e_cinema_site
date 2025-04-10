import "server-only";
import { db } from "./db";
import { movies, showtimes } from "./db/schema";
import { desc } from "drizzle-orm";

export async function getMyMovies() {
  const moviesList = await db.query.movies.findMany({
    orderBy: (model) => desc(model.id),
  });

  //console.log(moviesList);


  return moviesList;
}


export async function getMyShowtimes() {
  // Fetch all showtimes from the database
  const showtimesList = await db.query.showtimes.findMany();

  return showtimesList;
}