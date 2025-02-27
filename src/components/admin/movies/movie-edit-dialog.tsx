"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Upload } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"

// MPAA Rating options
const mpaaRatings = [
  { value: "G", label: "G - General Audiences" },
  { value: "PG", label: "PG - Parental Guidance Suggested" },
  { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
  { value: "R", label: "R - Restricted" },
  { value: "NC-17", label: "NC-17 - Adults Only" },
]

// Days of the week
const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

// Categories
const categories = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
]

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  cast: z.string().min(1, "Cast is required"),
  director: z.string().min(1, "Director is required"),
  producer: z.string().min(1, "Producer is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  reviews: z.string().optional(),
  mpaaRating: z.string().min(1, "MPAA rating is required"),
  trailerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  showDays: z.array(z.string()).min(1, "At least one show day is required"),
  showTimes: z.string().min(1, "Show times are required"),
  releaseYear: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 5),
  posterUrl: z.string().optional(),
  videoUrl: z.string().optional(),
})

type MovieFormValues = z.infer<typeof formSchema>

interface MovieEditDialogProps {
  movie: {
    id: string
    name: string
    url: string
    category?: string
    cast?: string
    director?: string
    producer?: string
    synopsis?: string
    reviews?: string
    mpaaRating?: string
    trailerUrl?: string
    showDays?: string[]
    showTimes?: string
    releaseYear?: number
    videoUrl?: string
  }
  trigger?: React.ReactNode
}

export function MovieEditDialog({ movie, trigger }: MovieEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState(movie.url)
  const router = useRouter()

  // Default values for the form
  const defaultValues: Partial<MovieFormValues> = {
    title: movie.name,
    category: movie.category || categories[0],
    cast: movie.cast || "",
    director: movie.director || "",
    producer: movie.producer || "",
    synopsis: movie.synopsis || "",
    reviews: movie.reviews || "",
    mpaaRating: movie.mpaaRating || "PG-13",
    trailerUrl: movie.trailerUrl || "",
    showDays: movie.showDays || ["friday", "saturday", "sunday"],
    showTimes: movie.showTimes || "12:00 PM - 9:00 PM",
    releaseYear: movie.releaseYear || 2023,
    posterUrl: movie.url,
    videoUrl: movie.videoUrl,
  }

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: MovieFormValues) => {
    try {
      // Here you would typically send the data to your API
      console.log("Form submitted:", data)

      // Handle file uploads if needed
      if (posterFile) {
        // Upload poster file logic
        console.log("Uploading poster:", posterFile)
      }

      if (videoFile) {
        // Upload video file logic
        console.log("Uploading video:", videoFile)
      }

      // Close the dialog
      setOpen(false)

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error updating movie:", error)
    }
  }

  const handleDelete = async () => {
    try {
      // Delete movie logic
      console.log("Deleting movie:", movie.id)

      // Close both dialogs
      setDeleteDialogOpen(false)
      setOpen(false)

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error deleting movie:", error)
    }
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPosterFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPosterPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger || <Button variant="outline">Edit Movie</Button>}</DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Movie Details</DialogTitle>
            <DialogDescription>Update the movie information below. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <div className="space-y-4">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
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

                  <FormField
                    control={form.control}
                    name="releaseYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter release year"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mpaaRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MPAA Rating</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mpaaRatings.map((rating) => (
                              <SelectItem key={rating.value} value={rating.value}>
                                {rating.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Media and Additional Info */}
                <div className="space-y-4">
                  <div>
                    <FormLabel>Movie Poster</FormLabel>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="relative h-32 w-24 overflow-hidden rounded-md border">
                        {posterPreview && (
                          <img
                            src={posterPreview || "/placeholder.svg"}
                            alt="Movie poster preview"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="poster-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 rounded-md border border-dashed p-2 hover:bg-muted">
                            <Upload className="h-4 w-4" />
                            <span>Upload new poster</span>
                          </div>
                        </Label>
                        <Input
                          id="poster-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePosterChange}
                        />
                        <FormDescription className="mt-1 text-xs">Recommended size: 300x450 pixels</FormDescription>
                      </div>
                    </div>
                  </div>

                  <div>
                    <FormLabel>Movie Video/Trailer File</FormLabel>
                    <div className="mt-2">
                      <Label htmlFor="video-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 rounded-md border border-dashed p-2 hover:bg-muted">
                          <Upload className="h-4 w-4" />
                          <span>{videoFile ? videoFile.name : "Upload video file"}</span>
                        </div>
                      </Label>
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                      <FormDescription className="mt-1 text-xs">Max file size: 100MB</FormDescription>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="trailerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trailer URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormDescription>YouTube or Vimeo URL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Cast and Synopsis */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cast</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter cast members (one per line)"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>List main actors, one per line</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter movie synopsis" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reviews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviews</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter critic reviews (optional)" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>Add critic reviews or audience feedback</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Showtimes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Show Schedule</h3>

                <FormField
                  control={form.control}
                  name="showDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Show Days</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day.id}`}
                              checked={field.value?.includes(day.id)}
                              onCheckedChange={(checked) => {
                                const updatedDays = checked
                                  ? [...field.value, day.id]
                                  : field.value.filter((d) => d !== day.id)
                                field.onChange(updatedDays)
                              }}
                            />
                            <Label htmlFor={`day-${day.id}`} className="text-sm font-normal">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showTimes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Show Times</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 12:00 PM - 9:00 PM" {...field} />
                      </FormControl>
                      <FormDescription>Enter show times (e.g., "12:00 PM, 3:30 PM, 7:00 PM")</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex items-center justify-between">
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Movie
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the movie "{movie.name}" and all
                        associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

