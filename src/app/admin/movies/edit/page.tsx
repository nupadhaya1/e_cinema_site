"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

import { Separator } from "~/components/ui/separator";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Showtime } from "~/server/db/schema";
import { ShowDates } from "~/components/admin/add_movie/showtimes";
import AdminMovieDetailsForm from "~/components/admin/add_movie/moviedetails";
import { formSchema } from "~/components/admin/add_movie/moviedetails";
import { initShowtimeList } from "~/components/admin/add_movie/showtimes";
import { useForm } from "react-hook-form";
export default function EditMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");

  const [cast, setCast] = useState<string[]>([]);
  const [showDates, setShowDates] = useState<ShowDates>([]);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<z.infer<typeof formSchema>>();


  useEffect(() => {
    if (!movieId) {
      console.error("No movie ID provided in query");
      alert("No movie ID provided");
      router.push("/admin/movies");
      return;
    }
    fetchMovie();
    fetchShowtimes();
  }, [movieId, router]);

  async function fetchMovie() {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching movie with ID:", movieId);
      const response = await fetch(`/api/movies?id=${movieId}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Fetch failed with status:",
          response.status,
          "Error:",
          errorText,
        );
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      const movie = await response.json();
      console.log("Fetched movie data:", JSON.stringify(movie, null, 2));
      console.log("Raw cast value:", movie.cast);

     
      setForm({
          name: movie.name,
          url: movie.url,
          category: movie.category,
          genre: movie.genre || "",
          director: movie.director,
          producer: movie.producer,
          synopsis: movie.synopsis,
          trailerUrl: movie.trailerUrl,
          imdb: movie.imdb,
          mpaa: movie.mpaa,
        });

      // Handle cast with explicit validation
      let castArray: string[];
      if (Array.isArray(movie.cast)) {
        castArray = movie.cast;
      } else if (typeof movie.cast === "string") {
        try {
          castArray = JSON.parse(movie.cast);
          if (!Array.isArray(castArray)) {
            console.warn("Parsed cast is not an array:", castArray);
            castArray = [];
          }
        } catch (e) {
          console.error("Failed to parse cast string:", movie.cast, e);
          castArray = [];
        }
      } else {
        console.warn(
          "Cast is neither an array nor a valid string:",
          movie.cast,
        );
        castArray = [];
      }
      console.log("Setting cast to:", castArray);
      setCast(castArray);
    } catch (error) {
      console.error("Error fetching movie:", error);
      setError(
        `Failed to load movie data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      router.push("/admin/movies");
    } finally {
      setLoading(false);
    }
  }

  async function fetchShowtimes() {
    const showTimeResponse = await fetch(
      "/api/moviebooking/showtimes?movieId=" + movieId,
    );
    const result: Showtime[] = await showTimeResponse.json();
    setShowDates(initShowtimeList(result));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!movieId) {
      alert("No movie ID provided");
      return;
    }

    if (cast.length === 0) {
      alert("Please add at least one cast member.");
      return;
    }
    if (showDates.length === 0) {
      alert("Please add at least one show date and time.");
      return;
    }

    const movieData = {
      ...values,
      id: parseInt(movieId),

      cast, // Sent as array, API will stringify

      reviews: [],
      showdate: showDates.map((item) => item.times)[0],
    };

    try {
      setLoading(true);
      const response = await fetch("/api/movies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update movie");
      }

      alert("Movie updated successfully!");
      router.push("/admin/movies");
    } catch (error) {
      console.error("Error updating movie:", error);
      alert(
        `Failed to update movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!movieId) {
      alert("No movie ID provided");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this movie? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/movies?id=${movieId}`, {
        method: "DELETE", // Fixed: Use colon (:) instead of equals (=)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete movie");
      }

      alert("Movie deleted successfully!");
      router.push("/admin/movies");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert(
        `Failed to delete movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading movie data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  <BreadcrumbLink href="/admin/movies/add">
                    Movies
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Movie</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Card className="rounded-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Movie</CardTitle>
            <CardDescription>Update details for this movie.</CardDescription>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Movie
            </Button>
          </CardHeader>
          <CardContent>
            <AdminMovieDetailsForm
              loading={loading}
              castState={[cast, setCast]}
              showDatesState={[showDates, setShowDates]}
              onSubmit={onSubmit}
              reset={reset}
              formValues={form}
            />
          </CardContent>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
