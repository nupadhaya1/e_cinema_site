import "server-only";
import { db } from "./db";
import { movies } from "./db/schema";
import { desc } from "drizzle-orm";

export async function getMyMovies() {
  const moviesList = await db.query.movies.findMany({
    orderBy: (model) => desc(model.id),
  });

  console.log(moviesList);

  return moviesList;
}
