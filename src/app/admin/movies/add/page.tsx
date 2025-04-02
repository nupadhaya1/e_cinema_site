"use client";

import type React from "react";
import { useState } from "react";
import { z } from "zod";

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
import { ShowDates } from "~/components/admin/add_movie/showtimes";
import { convertShowDateToShowtimeList } from "~/components/admin/add_movie/showtimes";
import AdminMovieDetailsForm, {
  formSchema,
} from "~/components/admin/add_movie/moviedetails";

export default function AddMovieForm() {
  const [cast, setCast] = useState<string[]>([]);
  const [showDates, setShowDates] = useState<ShowDates>([]);
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (cast.length === 0) {
      alert("Please add at least one cast member.");
      setLoading(false);
      return;
    }
    if (showDates.length === 0) {
      alert("Please add at least one show date and time.");
      setLoading(false);
      return;
    }

    const movieData = {
      ...values,
      cast: cast, // Array of strings
      showdate: convertShowDateToShowtimeList(showDates),
      reviews: [], // Optional field
    };

    console.log("Submitting movie data:", JSON.stringify(movieData, null, 2));

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      const responseBody = await response.json();
      console.log(
        "Server response:",
        response.status,
        JSON.stringify(responseBody, null, 2),
      );

      if (!response.ok) {
        throw new Error(responseBody.error || "Unknown error");
      }

      alert("Movie added successfully!");
      setCast([]);
      setShowDates([]);
      setReset(!reset);
    } catch (error) {
      console.error("Error submitting movie:", error);
      alert(
        `Failed to add movie: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
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
                  <BreadcrumbPage>Add Movie</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Card className="rounded-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Movie</CardTitle>
            <CardDescription>Enter details for a new movie.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminMovieDetailsForm
              loading={loading}
              castState={[cast, setCast]}
              showDatesState={[showDates, setShowDates]}
              onSubmit={onSubmit}
              reset={reset}
            />
          </CardContent>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
