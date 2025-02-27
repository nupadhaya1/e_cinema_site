import { getMyMovies } from "~/server/queries";
import MoviesClient from './MoviesClient';


export default async function MoviesServer() {
 const movies = await getMyMovies();
 return <MoviesClient movies={movies} />;
}
