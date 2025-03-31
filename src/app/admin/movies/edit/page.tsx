"use client";
import { VALIDHOURS, VALIDMINUTES } from "../add/page";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format, setDate } from "date-fns";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Badge } from "~/components/ui/badge";
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
import { date } from "drizzle-orm/mysql-core";

const formSchema = z.object({
  name: z.string().min(1, "Movie name is required"),
  url: z.string().url("Invalid URL").min(1, "Poster URL is required"),
  category: z.string().min(1, "Category is required"),
  genre: z.string().min(1, "Genre is required"),
  director: z.string().min(1, "Director is required"),
  producer: z.string().min(1, "Producer is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  trailerUrl: z.string().url("Invalid URL").min(1, "Trailer URL is required"),
  imdb: z
    .number()
    .min(0, "IMDb must be at least 0")
    .max(10, "IMDb must be at most 10"),
  mpaa: z.string().min(1, "MPAA rating is required"),
});

export default function EditMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");

  const [cast, setCast] = useState<string[]>([]);
  const [castInput, setCastInput] = useState("");
  const [showDates, setShowDates] = useState<{ date: Date; times: string[] }[]>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeInput, setTimeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [minute, setMinute] = useState<string | undefined>(undefined);
  const [ampm, setampm] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      category: "",
      genre: "",
      director: "",
      producer: "",
      synopsis: "",
      trailerUrl: "",
      imdb: 0,
      mpaa: "",
    },
  });

  useEffect(() => {
    if (!movieId) {
      console.error("No movie ID provided in query");
      alert("No movie ID provided");
      router.push("/admin/movies");
      return;
    }

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

        form.reset({
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

        const showTimeResponse = await fetch(
          "/api/moviebooking/showtimes?movieId=" + movieId,
        );
        const result: Showtime[] = await showTimeResponse.json();
        //console.log(result);
        //shit was not working so you have the following magik
        let a = result.map((showtime) => {
          return { date: showtime.date, time: showtime.time };
        });
        let b: any[] = [];
        let c = true;
        for (let i = 0; i < a.length; i++) {
          for (let j = 0; j < b.length; j++) {
            if (b[j].date == a[i]?.date) {
              b[j].times.push(a[i]?.time); //= [...b[j].times, ...[]];
              c = false;
              break;
            }
          }
          if (c) {
            b = [...b, ...[{ date: a[i]?.date, times: [a[i]?.time] }]];
          }
          c = true;
        }
        //console.log(b);

        b = b.map((e) => {
          return { date: new Date(e.date), times: e.times };
        });
        //console.log(b);
        setShowDates(b);
        //end magik
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
    fetchMovie();
  }, [movieId, form, router]);

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
      id: parseInt(movieId),
      name: values.name,
      url: values.url,
      category: values.category,
      genre: values.genre,
      cast, // Sent as array, API will stringify
      director: values.director,
      producer: values.producer,
      synopsis: values.synopsis,
      trailerUrl: values.trailerUrl,
      imdb: values.imdb,
      mpaa: values.mpaa,
      showdate: showDates.map((show) => ({
        date: show.date.toISOString(),
        times: show.times,
      })),
      reviews: [],
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

  const addCastMember = () => {
    if (castInput.trim() && !cast.includes(castInput.trim())) {
      setCast([...cast, castInput.trim()]);
      setCastInput("");
    }
  };

  const removeCastMember = (index: number) => {
    setCast(cast.filter((_, i) => i !== index));
  };

  const addShowTime = () => {
    if (hour == undefined || minute == undefined || ampm == undefined) {
      alert("invalid time format");
      return;
    }
    let timeInput = `${hour}:${minute} ${ampm}`;
    if (selectedDate && timeInput.trim()) {
      const existingDateIndex = showDates.findIndex(
        (item) => item.date.toDateString() === selectedDate.toDateString(),
      );
      if (existingDateIndex >= 0) {
        const updatedShowDates = [...showDates];
        if (
          !updatedShowDates[existingDateIndex]!.times.includes(timeInput.trim())
        ) {
          updatedShowDates[existingDateIndex]!.times.push(timeInput.trim());
          setShowDates(updatedShowDates);
        }
      } else {
        setShowDates([
          ...showDates,
          { date: selectedDate, times: [timeInput.trim()] },
        ]);
      }
      //setTimeInput("");
    }
  };

  const removeShowDate = (dateIndex: number) => {
    setShowDates(showDates.filter((_, i) => i !== dateIndex));
  };

  const removeShowTime = (dateIndex: number, timeIndex: number) => {
    const updatedShowDates = [...showDates];
    updatedShowDates[dateIndex]!.times = updatedShowDates[
      dateIndex
    ]!.times.filter((_, i) => i !== timeIndex);
    if (updatedShowDates[dateIndex]!.times.length === 0) {
      removeShowDate(dateIndex);
    } else {
      setShowDates(updatedShowDates);
    }
  };

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Movie Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter movie name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poster URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter poster URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Currently Running">
                              Currently Running
                            </SelectItem>
                            <SelectItem value="Coming Soon">
                              Coming Soon
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="comedy">Comedy</SelectItem>
                            <SelectItem value="drama">Drama</SelectItem>
                            <SelectItem value="horror">Horror</SelectItem>
                            <SelectItem value="sci-fi">
                              Science Fiction
                            </SelectItem>
                            <SelectItem value="thriller">Thriller</SelectItem>
                            <SelectItem value="romance">Romance</SelectItem>
                            <SelectItem value="animation">Animation</SelectItem>
                            <SelectItem value="documentary">
                              Documentary
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter director name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="producer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter producer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Cast</FormLabel>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      placeholder="Enter cast member name"
                      value={castInput}
                      onChange={(e) => setCastInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCastMember();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCastMember}
                      size="sm"
                      disabled={loading}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cast.map((member, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => removeCastMember(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove {member}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter movie synopsis"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="trailerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trailer URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter trailer URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imdb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IMDb Rating</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="1"
                            placeholder="Enter IMDb rating (0-10)"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mpaa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MPAA Rating</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select MPAA rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="G">
                              G (General Audiences)
                            </SelectItem>
                            <SelectItem value="PG">
                              PG (Parental Guidance Suggested)
                            </SelectItem>
                            <SelectItem value="PG-13">
                              PG-13 (Parents Strongly Cautioned)
                            </SelectItem>
                            <SelectItem value="R">R (Restricted)</SelectItem>
                            <SelectItem value="NC-17">
                              NC-17 (Adults Only)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    Show Dates & Times
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <FormLabel>Time</FormLabel>

                      <div className="flex items-center gap-2">
                        {/* <Input
                            placeholder="e.g., 7:30 PM"
                            value={timeInput}
                            onChange={(e) => setTimeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addShowTime();
                              }
                            }}
                          /> */}
                        {!loading && (
                          <Select
                            onValueChange={(val) => setHour(val)}
                            value={hour}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="hours" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {VALIDHOURS.map((hour, index) => (
                                <SelectItem key={"hours" + index} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}{" "}
                        :
                        {!loading && (
                          <Select
                            onValueChange={(val) => setMinute(val)}
                            value={minute}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="minutes" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {VALIDMINUTES.map((min, index) => (
                                <SelectItem key={"minutes" + index} value={min}>
                                  {min}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {!loading && (
                          <Select
                            onValueChange={(val) => setampm(val)}
                            value={ampm}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          type="button"
                          onClick={addShowTime}
                          size="sm"
                          disabled={loading}
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  {showDates.length > 0 && (
                    <div className="mt-4 rounded-md border p-4">
                      <h4 className="mb-2 font-medium">Scheduled Shows</h4>
                      <div className="space-y-3">
                        {showDates.map((showDate, dateIndex) => (
                          <div
                            key={dateIndex}
                            className="border-b pb-2 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">
                                {format(showDate.date, "PPP")}
                              </h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeShowDate(dateIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove date</span>
                              </Button>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {showDate.times.map((time, timeIndex) => (
                                <Badge
                                  key={timeIndex}
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {time}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeShowTime(dateIndex, timeIndex)
                                    }
                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span className="sr-only">
                                      Remove {time}
                                    </span>
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating" : "Update Movie"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
