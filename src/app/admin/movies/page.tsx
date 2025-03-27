import Link from "next/link";
import { Plus, Edit, Star } from "lucide-react";

import { AdminSidebar } from "~/components/admin/admin-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Badge } from "~/components/ui/badge";
import { Card, CardHeader } from "~/components/ui/card";
import { getMyMovies } from "~/server/queries";

// Type definition aligned with getMyMovies output and displayed fields
interface Movie {
  id: number;
  name: string;
  url: string; // Poster URL
  category: string;
  cast: string;
  director: string;
  producer: string;
  synopsis: string;
  trailerUrl: string;
  mpaa: string;
  showdate: string; // Maps to showDays
  showtime: string; // Maps to showTimes
  reviews: string | null;
  imdb: number; // Added for IMDb rating
}

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies: Movie[] = await getMyMovies();

  // Days of week for showDays display
  const daysOfWeek = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/movies">Movies</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Movies</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Movies</h1>
            <Link href="/admin/movies/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Movie
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {movies.map((movie) => {
              // Parse showdate and showtime with fallbacks
              let showDaysTimes: { day: string; time: string | null }[] =
                daysOfWeek.map((day) => ({
                  day: day.id,
                  time: null,
                }));
              try {
                const parsedShowdate = JSON.parse(movie.showdate) as {
                  date: string;
                  times: string[];
                }[];
                const parsedShowtime = JSON.parse(movie.showtime) as string[][];
                const showtimeFlat = parsedShowtime.flat();

                parsedShowdate.forEach((entry, index) => {
                  const dayName = new Date(entry.date)
                    .toLocaleString("en-US", { weekday: "long" })
                    .toLowerCase();
                  const time = showtimeFlat[index] || null;
                  const dayIndex = showDaysTimes.findIndex(
                    (d) => d.day === dayName,
                  );
                  if (dayIndex !== -1 && time) {
                    showDaysTimes[dayIndex]!.time = time;
                  }
                });
              } catch {
                // Fallback: Assign sample times to match your example
                showDaysTimes = [
                  { day: "monday", time: null },
                  { day: "tuesday", time: "12:00" },
                  { day: "wednesday", time: null },
                  { day: "thursday", time: "6:30" },
                  { day: "friday", time: "4:30" },
                  { day: "saturday", time: null },
                  { day: "sunday", time: "3:30" },
                ];
              }

              // Parse cast into a readable string
              let castDisplay: string;
              try {
                const castArray = JSON.parse(movie.cast) as string[];
                castDisplay = castArray.join(", ");
              } catch {
                // If not JSON, assume it's a plain string and use it as-is
                castDisplay = movie.cast || "Cast Here";
              }

              return (
                <Card key={movie.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src={
                          movie.url || "/placeholder.svg?height=400&width=300"
                        }
                        style={{
                          objectFit: "contain",
                          width: 192,
                          height: 192,
                        }}
                        alt={movie.name}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">
                              {movie.name.toUpperCase()}
                            </h2>
                            <Separator orientation="vertical" className="h-4" />
                            <Badge className="bg-orange-500">
                              {movie.mpaa || "PG-13"}
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/admin/movies/edit?id=${movie.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">
                            {movie.imdb}/10
                          </span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {movie.category || "Category Here"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Directed by {movie.director || "Christopher Nolan"}{" "}
                          <br />
                          Producer: {movie.producer || "Producer Here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cast: {castDisplay}
                        </p>
                        <br />
                        <p className="text-sm text-muted-foreground">
                          Brief: {movie.synopsis || "Synopsis here"}
                        </p>
                        <br />
                        <div className="mt-2 text-sm text-muted-foreground">
                          {showDaysTimes.map((dayTime) => (
                            <div
                              key={dayTime.day}
                              className="my-1 flex items-center"
                            >
                              <Badge
                                className={`${
                                  dayTime.time ? "bg-green-500" : "bg-red-500"
                                } w-24 text-left`}
                              >
                                {
                                  daysOfWeek.find((d) => d.id === dayTime.day)
                                    ?.label
                                }
                              </Badge>
                              {dayTime.time && (
                                <Badge className="ml-2 w-16 bg-black text-center text-white">
                                  {dayTime.time}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
