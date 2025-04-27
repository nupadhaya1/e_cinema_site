"use client";

import type React from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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

import { Separator } from "~/components/ui/separator";

import AdminShowtimesComponent from "~/components/admin/add_movie/showtimes";
import AdminAddCastComponent from "~/components/admin/add_movie/cast";
import AdminAddReviewComponent from "./reviews";
import { ShowDates } from "~/components/admin/add_movie/showtimes";
import { stateTuple } from "~/components/utils";
type moviedetailsProps = {
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
  castState: stateTuple<string[]>;
  reviewState: stateTuple<string[]>;
  showDatesState: stateTuple<ShowDates>;
  loading: boolean;
  reset: boolean;
  formValues?: z.infer<typeof formSchema>;
};

export const formSchema = z.object({
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

export default function AdminMovieDetailsForm({
  onSubmit,
  castState,
  reviewState,
  showDatesState,
  loading,
  reset,
  formValues,
}: moviedetailsProps) {
  let defaultValues = {
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
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues || defaultValues,
  });
  useEffect(() => {
    form.reset();
    form.watch();
  }, [reset]);
  useEffect(() => {
    if (formValues != undefined) {
      form.reset({ ...formValues });
      form.setValue("mpaa", "G");
      console.log(formValues);
      form.watch();
    }
  }, [formValues]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      {/* <SelectValue placeholder="Select category" /> */}
                      {field.value}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Currently Running">
                      Currently Running
                    </SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                    <SelectItem value="Science Fiction">
                      Science Fiction
                    </SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
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

        <AdminAddCastComponent castState={castState} loading={loading} />

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
                  //defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select MPAA rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="G">G (General Audiences)</SelectItem>
                    <SelectItem value="PG">
                      PG (Parental Guidance Suggested)
                    </SelectItem>
                    <SelectItem value="PG-13">
                      PG-13 (Parents Strongly Cautioned)
                    </SelectItem>
                    <SelectItem value="R">R (Restricted)</SelectItem>
                    <SelectItem value="NC-17">NC-17 (Adults Only)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <AdminAddReviewComponent reviewState={reviewState} loading={loading} />

        <AdminShowtimesComponent
          showDatesState={showDatesState}
          loading={loading}
        />

        <Separator />

        <Button type="submit" className="w-full" disabled={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
