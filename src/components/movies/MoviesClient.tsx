"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

// MovieWindow Component
function MovieWindow({ movie, onClose }: { movie: any; onClose: () => void }) {
  // ✅ Lock scroll only when modal is active
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  if (!movie) return null;

  // Parse the cast data if it's in string format (e.g., '[\"Leonardo DiCaprio\",\"Kate Winslet\"]')
  const cast = movie.cast ? JSON.parse(movie.cast) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white max-w-4xl w-full max-h-[90vh] rounded-lg shadow-lg">
        {/* Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-2xl text-gray-600 hover:text-black"
        >
          ×
        </button>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[90vh] pt-14">
          {/* Title and Category */}
          <h2 className="text-2xl font-bold mb-2">
            {movie.name}{" "}
            <span className="text-sm text-gray-500 font-normal">
              ({movie.category})
            </span>
          </h2>

          {/* Poster and Trailer aligned top and bottom */}
          <div className="flex flex-col md:flex-row md:items-stretch gap-4 mt-4">
            {/* Poster */}
            <div className="h-72 flex-shrink-0">
              <img
                src={movie.url}
                alt={movie.name}
                className="h-full w-auto rounded-md object-cover"
              />
            </div>

            {/* Trailer */}
            <div className="flex-1">
              <div className="h-full w-full relative">
                <div className="absolute inset-0">
                  <iframe
                    src={movie.trailerUrl}
                    title={`Trailer for ${movie.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>
                </div>
                {/* Spacer to maintain 16:9 aspect ratio */}
                <div className="invisible aspect-video w-full"></div>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="mt-6 space-y-1 text-sm">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Producer:</strong> {movie.producer}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>MPAA Rating:</strong> {movie.mpaa}</p>
            <p><strong>IMDB Rating:</strong> {movie.imdb}</p>
            {/* Cast */}
            <p><strong>Cast:</strong> {cast.join(", ")}</p>
          </div>

          {/* Synopsis */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-sm">{movie.synopsis}</p>
          </div>

          {/* Book Button */}
          <div className="mt-6 text-center">
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
        </div>
      </div>
    </div>
  );
}


function MoviesClient({ movies }: { movies: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<"All" | "Currently Running" | "Coming Soon">("All");

  // Filter movies based on the search query
  const filteredMovies = movies.filter((movie) => {
    const matchesQuery = movie.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || movie.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  // Filter movies by category
  const currentlyRunningMovies = filteredMovies.filter(
    (movie) => movie.category === "Currently Running",
  );
  const comingSoonMovies = filteredMovies.filter(
    (movie) => movie.category === "Coming Soon",
  );

  const openWindow = (movie: any) => {
    setSelectedMovie(movie);
  };

  const closeWindow = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-center bg-gray-900 p-4 gap-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 rounded-md border p-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as "All" | "Currently Running" | "Coming Soon")
          }
          className="rounded-md border p-2"
        >
          <option value="All">All</option>
          <option value="Currently Running">Currently Running</option>
          <option value="Coming Soon">Coming Soon</option>
        </select>
      </div>
  
      <div className="flex flex-col gap-8 p-4">
        {filteredMovies.length === 0 ? (
          <div className="text-center text-red-500 text-lg font-semibold mt-10">
            No movies found for your search and filter criteria.
          </div>
        ) : (
          <>
            {/* Currently Running Movies (only show if filter is All or Currently Running) */}
            {(categoryFilter === "All" || categoryFilter === "Currently Running") && (
              <div>
                <h2 className="mb-4 text-center text-2xl font-semibold">
                  Currently Running
                </h2>
                <div className="flex gap-4 overflow-x-auto px-4">
                  {currentlyRunningMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex h-auto w-48 flex-shrink-0 flex-col cursor-pointer"
                      
                    >
                      <img
                        src={movie.url}
                        alt={movie.name}
                        className="h-64 w-full rounded-md object-cover"
                        onClick={() => openWindow(movie)}
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
                      <div className="text-center">Rated {movie.mpaa}</div>
                      <div className="flex h-12 items-center justify-center text-center font-bold">
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
            )}
  
            {/* Coming Soon Movies (only show if filter is All or Coming Soon) */}
            {(categoryFilter === "All" || categoryFilter === "Coming Soon") && (
              <div>
                <h2 className="mb-4 text-center text-2xl font-semibold">
                  Coming Soon
                </h2>
                <div className="flex gap-4 overflow-x-auto px-4">
                  {comingSoonMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex h-auto w-48 flex-shrink-0 flex-col cursor-pointer"
                      
                    >
                      <img
                        src={movie.url}
                        alt={movie.name}
                        className="h-64 w-full rounded-md object-cover"
                        onClick={() => openWindow(movie)}
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
                      <div className="text-center">Rated {movie.mpaa}</div>
                      <div className="flex h-12 items-center justify-center text-center font-bold">
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
            )}
          </>
        )}
      </div>
  
      {/* Movie Window */}
      <MovieWindow movie={selectedMovie} onClose={closeWindow} />
    </div>
  );
  
}

export default MoviesClient;