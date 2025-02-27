"use client";

import type React from "react";
import Link from "next/link";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";

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

const formSchema = z.object({
  title: z.string().min(1, "Movie title is required"),
  category: z.string().min(1, "Category is required"),
  director: z.string().min(1, "Director is required"),
  producer: z.string().min(1, "Producer is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  mpaaRating: z.string().min(1, "MPAA rating is required"),
  imdbRating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10"),
  moviePoster: z.any().refine((file) => file instanceof File, {
    message: "Movie poster is required",
  }),
  trailerUrl: z.string().url("Invalid URL").optional(),
});

export default function AddMovieForm() {
  const [cast, setCast] = useState<string[]>([]);
  const [castInput, setCastInput] = useState("");
  const [reviews, setReviews] = useState<{ author: string; content: string }[]>(
    [],
  );

  const [ratings, setRatings] = useState<number[]>([]);
  const [ratingInput, setRatingInput] = useState("");

  const [showDates, setShowDates] = useState<{ date: Date; times: string[] }[]>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeInput, setTimeInput] = useState("");
  const [moviePosterPreview, setMoviePosterPreview] = useState<string | null>(
    null,
  );
  const [trailerVideoURLPreview, setTrailerVideoURLPreview] = useState<
    string | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      director: "",
      producer: "",
      synopsis: "",
      imdbRating: 0,
      mpaaRating: "",
      trailerUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, you would send this data to your backend
    const movieData = {
      ...values,
      cast,
      reviews,
      showDates,
    };

    console.log("Movie data submitted:", movieData);
    alert("Movie added successfully!");
    // Reset form after submission
    form.reset();
    setCast([]);
    setReviews([]);
    setShowDates([]);
    setMoviePosterPreview(null);
    setTrailerVideoURLPreview(null);
  }

  const addCastMember = () => {
    if (castInput.trim() !== "" && !cast.includes(castInput.trim())) {
      setCast([...cast, castInput.trim()]);
      setCastInput("");
    }
  };

  const removeCastMember = (index: number) => {
    setCast(cast.filter((_, i) => i !== index));
  };

  const addRating = () => {
    const ratingValue = parseFloat(ratingInput);
    if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 10) {
      setRatings([...ratings, ratingValue]);
      setRatingInput("");
    }
  };

  const removeRating = (index: number) => {
    setRatings(ratings.filter((_, i) => i !== index));
  };

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const addShowTime = () => {
    if (selectedDate && timeInput.trim() !== "") {
      const existingDateIndex = showDates.findIndex(
        (item) => item.date.toDateString() === selectedDate.toDateString(),
      );

      if (existingDateIndex >= 0) {
        const updatedShowDates = [...showDates];
        // if (
        //   !updatedShowDates[existingDateIndex].times.includes(timeInput.trim())
        // ) {
        //   updatedShowDates[existingDateIndex].times.push(timeInput.trim());
        // }
        setShowDates(updatedShowDates);
      } else {
        setShowDates([
          ...showDates,
          { date: selectedDate, times: [timeInput.trim()] },
        ]);
      }
      setTimeInput("");
    }
  };

  const removeShowDate = (dateIndex: number) => {
    setShowDates(showDates.filter((_, i) => i !== dateIndex));
  };

  const removeShowTime = (dateIndex: number, timeIndex: number) => {
    const updatedShowDates = [...showDates];
    // updatedShowDates[dateIndex].times = updatedShowDates[
    //   dateIndex
    // ].times.filter((_, i) => i !== timeIndex);

    // if (updatedShowDates[dateIndex].times.length === 0) {
    //   removeShowDate(dateIndex);
    // } else {
    //   setShowDates(updatedShowDates);
    // }
  };

  const handleMoviePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // form.setValue("moviePoster", file);
      const reader = new FileReader();
      reader.onload = () => {
        setMoviePosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrailerVideoURLChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // form.setValue("trailerVideoURL", file);
      const reader = new FileReader();
      reader.onload = () => {
        setTrailerVideoURLPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            <CardDescription>
              Enter the details for a new movie to add to the system.
            </CardDescription>
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Movie Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter movie title" {...field} />
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
                    <Button type="button" onClick={addCastMember} size="sm">
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
                  <div>
                    <FormField
                      control={form.control}
                      name="imdbRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMDb Rating</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="Enter rating (0-10)"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || "")
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="mpaaRating"
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
                        <Input
                          placeholder="e.g., 7:30 PM"
                          value={timeInput}
                          onChange={(e) => setTimeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addShowTime();
                            }
                          }}
                        />
                        <Button type="button" onClick={addShowTime} size="sm">
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

                <div>
                  <FormLabel>Movie Poster</FormLabel>
                  <div className="mt-2">
                    <div className="flex h-[200px] items-center justify-center rounded-md border-2 border-dashed p-4">
                      {moviePosterPreview ? (
                        <div className="relative h-full w-full">
                          <img
                            src={moviePosterPreview || "/placeholder.svg"}
                            alt="Movie poster preview"
                            className="h-full w-full object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute right-0 top-0"
                            onClick={() => {
                              setMoviePosterPreview(null);
                              // form.setValue("moviePoster", undefined);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="mt-2">
                            <label
                              htmlFor="movie-poster"
                              className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
                            >
                              Upload poster
                            </label>
                            <input
                              id="movie-poster"
                              name="movie-poster"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleMoviePosterChange}
                            />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="trailerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trailer URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="Enter trailer URL (e.g., https://youtube.com/...)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Movie
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
