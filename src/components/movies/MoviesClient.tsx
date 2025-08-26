"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Star, Calendar } from "lucide-react";
import { Button } from "../ui/button";

// MovieWindow Component
function MovieWindow({ movie, onClose }: { movie: any; onClose: () => void }) {
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

  const cast = movie.cast ? JSON.parse(movie.cast) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative max-h-[90vh] w-full max-w-5xl rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 text-3xl text-slate-400"
        >
          ×
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-8 pt-16">
          <h2 className="mb-4 text-3xl font-bold text-white">
            {movie.name}{" "}
            <span className="text-lg font-normal text-amber-400">
              ({movie.category})
            </span>
          </h2>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="h-80 flex-shrink-0 lg:w-64">
              <img
                src={movie.url || "/placeholder.svg"}
                alt={movie.name}
                className="h-full w-full rounded-lg object-cover shadow-lg"
              />
            </div>

            <div className="flex-1">
              <div className="relative h-full min-h-[300px] w-full">
                <div className="absolute inset-0">
                  <iframe
                    src={movie.trailerUrl}
                    title={`Trailer for ${movie.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full rounded-lg shadow-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 text-slate-300 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Director:</span>{" "}
              {movie.director}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Producer:</span>{" "}
              {movie.producer}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Genre:</span>{" "}
              {movie.genre}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Rating:</span>{" "}
              {movie.mpaa}
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-amber-400">IMDB:</span>{" "}
              {movie.imdb}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xl font-semibold text-amber-400">Cast</h3>
            <p className="text-slate-300">{cast.join(", ")}</p>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xl font-semibold text-amber-400">
              Synopsis
            </h3>
            <p className="leading-relaxed text-slate-300">{movie.synopsis}</p>
          </div>

          {movie.category === "Currently Running" && (
            <div className="mt-8 text-center">
              <Button
                asChild
                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-semibold text-white shadow-lg"
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
                  <Plus className="mr-2 h-5 w-5" />
                  Book Ticket
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN MoviesClient ---
function MoviesClient({ movies }: { movies: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Currently Running" | "Coming Soon"
  >("All");
  const [genreFilter, setGenreFilter] = useState<string>("All");

  const openWindow = (movie: any) => setSelectedMovie(movie);
  const closeWindow = () => setSelectedMovie(null);

  const filteredMovies = movies.filter((movie) => {
    const matchesQuery = movie.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      genreFilter === "All" ||
      movie.genre.toLowerCase() === genreFilter.toLowerCase();
    return matchesQuery && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/50">
        <div className="mx-auto max-w-7xl p-6">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 rounded-lg border border-slate-600 bg-slate-700 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value as
                        | "All"
                        | "Currently Running"
                        | "Coming Soon",
                    )
                  }
                  className="cursor-pointer appearance-none rounded-lg border border-slate-600 bg-slate-700 py-3 pl-10 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Currently Running">Currently Running</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>

              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="All">All Genres</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Animation">Animation</option>
                <option value="Documentary">Documentary</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Movie Section */}
      <div className="mx-auto max-w-7xl p-6">
        {filteredMovies.length === 0 ? (
          <div className="mt-20 text-center">
            <div className="mb-4 text-6xl">🎬</div>
            <div className="mb-2 text-2xl font-semibold text-slate-300">
              No movies found
            </div>
            <div className="text-slate-400">
              Try adjusting your search or filter criteria
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Display Currently Running */}
            {(categoryFilter === "All" ||
              categoryFilter === "Currently Running") && (
              <section>
                <div className="mb-8 flex items-center gap-3">
                  <div className="h-1 w-12 rounded bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <h2 className="text-3xl font-bold text-white">
                    Currently Running
                  </h2>
                  <div className="h-1 flex-1 rounded bg-gradient-to-r from-orange-500 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMovies
                    .filter((movie) => movie.category === "Currently Running")
                    .map((movie) => (
                      <div key={movie.id}>
                        <div className="cursor-pointer overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg hover:bg-slate-700">
                          <div className="relative">
                            <img
                              src={movie.url || "/placeholder.svg"}
                              alt={movie.name}
                              className="h-80 w-full object-cover"
                              onClick={() => openWindow(movie)}
                            />
                          </div>

                          <div className="space-y-4 p-6">
                            <div className="aspect-video overflow-hidden rounded-lg">
                              <iframe
                                src={movie.trailerUrl}
                                title={`Trailer for ${movie.name}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                              ></iframe>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-400">
                                Rated {movie.mpaa}
                              </span>
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {movie.imdb}
                                </span>
                              </div>
                            </div>

                            <h3 className="line-clamp-2 text-xl font-bold text-white">
                              {movie.name}
                            </h3>

                            <Button
                              asChild
                              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg"
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
                                <Plus className="mr-2 h-5 w-5" />
                                Book Ticket
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Display Coming Soon */}
            {(categoryFilter === "All" || categoryFilter === "Coming Soon") && (
              <section>
                <div className="mb-8 flex items-center gap-3">
                  <div className="h-1 w-12 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
                  <div className="h-1 flex-1 rounded bg-gradient-to-r from-purple-500 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMovies
                    .filter((movie) => movie.category === "Coming Soon")
                    .map((movie) => (
                      <div key={movie.id}>
                        <div className="cursor-pointer overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-lg hover:bg-slate-700">
                          <div className="relative">
                            <img
                              src={movie.url || "/placeholder.svg"}
                              alt={movie.name}
                              className="h-80 w-full object-cover"
                              onClick={() => openWindow(movie)}
                            />
                            <div className="absolute right-4 top-4">
                              <span className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                                <Calendar className="h-3 w-3" />
                                Coming Soon
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4 p-6">
                            <div className="aspect-video overflow-hidden rounded-lg">
                              <iframe
                                src={movie.trailerUrl}
                                title={`Trailer for ${movie.name}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                              ></iframe>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                                Rated {movie.mpaa}
                              </span>
                              <div className="flex items-center gap-1 text-blue-400">
                                <Star className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {movie.imdb}
                                </span>
                              </div>
                            </div>

                            <h3 className="line-clamp-2 text-xl font-bold text-white">
                              {movie.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Movie Window Popup */}
      <MovieWindow movie={selectedMovie} onClose={closeWindow} />
    </div>
  );
}

export default MoviesClient;
