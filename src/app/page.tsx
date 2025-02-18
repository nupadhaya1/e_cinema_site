import Image from "next/image";
import { getMyMovies } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Movies() {
  const movies = await getMyMovies();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {movies.map((movie) => (
        <div key={movie.id} className="flex h-48 w-48 flex-col">
          <Image
            src={movie.url}
            style={{ objectFit: "contain" }}
            width={192}
            height={192}
            alt={movie.name}
          />
          <div>{movie.name}</div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main>
      <h1 className="p-4 text-center text-4xl font-bold">Movies</h1>
      <Movies />
    </main>
  );
}
