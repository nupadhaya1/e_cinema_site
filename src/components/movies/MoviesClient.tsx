"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

function MoviesClient({ movies }: { movies: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter movies based on the search query
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter movies by category
  const currentlyRunningMovies = filteredMovies.filter(
    (movie) => movie.category === "Currently Running",
  );
  const comingSoonMovies = filteredMovies.filter(
    (movie) => movie.category === "Coming Soon",
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-center bg-gray-900 p-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 rounded-md border p-2"
        />
      </div>

      <div className="flex flex-col gap-8 p-4">
        {/* Currently Running Movies */}
        <div>
          <h2 className="mb-4 text-center text-2xl font-semibold">
            Currently Running
          </h2>
          <div className="flex gap-4 overflow-x-auto px-4">
            {currentlyRunningMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex h-auto w-48 flex-shrink-0 flex-col"
              >
                <img
                  src={movie.url}
                  alt={movie.name}
                  className="h-64 w-full rounded-md object-cover"
                />

                <iframe
                  width="192"
                  height="108"
                  src={movie.trailerUrl}
                  title={`Trailer for ${movie.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="mt-4 w-48 rounded-md"
                ></iframe>
                <div className="text-center">{movie.rating}</div>
                <div className="flex h-12 items-center justify-center text-center">
                  {movie.name}
                </div>
                <Button
                  asChild
                  className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Link
                    href={{
                      pathname: "/movie_booking",
                      query: {
                        name: movie.name,
                        url: movie.url,
                        id: movie.id,
                      },
                    }}
                  >
                    <Plus className="h-4" />
                    Book Ticket
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Movies */}
        <div>
          <h2 className="mb-4 text-center text-2xl font-semibold">
            Coming Soon
          </h2>
          <div className="flex gap-4 overflow-x-auto px-4">
            {comingSoonMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex h-auto w-48 flex-shrink-0 flex-col"
              >
                <img
                  src={movie.url}
                  alt={movie.name}
                  className="h-64 w-full rounded-md object-cover"
                />

                <iframe
                  width="192"
                  height="108"
                  src={movie.trailerUrl}
                  title={`Trailer for ${movie.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="mt-4 w-48 rounded-md"
                ></iframe>
                <div className="text-center">{movie.rating}</div>
                <div className="flex h-12 items-center justify-center text-center">
                  {movie.name}
                </div>
                <Button
                  asChild
                  className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Link
                    href={{
                      pathname: "/movie_booking",
                      query: { name: movie.name, url: movie.url },
                    }}
                  >
                    <Plus className="h-4" />
                    Book Ticket
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviesClient;
