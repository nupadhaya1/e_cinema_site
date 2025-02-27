import Image from "next/image"
import { Edit, Star } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardHeader } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { MovieEditDialog } from "./movie-edit-dialog"

interface MovieCardProps {
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
}

export function MovieCard({ movie }: MovieCardProps) {
  // Map showDays to display format
  const showDays = movie.showDays || ["friday", "saturday", "sunday"]
  const daysOfWeek = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="overflow-hidden rounded-lg border">
          <Image
            src={movie.url || "/placeholder.svg?height=400&width=300"}
            style={{ objectFit: "contain" }}
            width={192}
            height={192}
            alt={movie.name}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{movie.name.toUpperCase()}</h2>
                <Separator orientation="vertical" className="h-4" />
                <Badge className="bg-orange-500">{movie.mpaaRating || "PG-13"}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Directed by {movie.director || "Christopher Nolan"} | Year: {movie.releaseYear || 1999}
              </p>
            </div>
            <MovieEditDialog
              movie={movie}
              trigger={
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{movie.reviews ? "8/10" : "6/10"}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-sm text-muted-foreground">
              <Badge variant="secondary">{movie.category || "Category Here"}</Badge>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">Producer: {movie.producer || "Producer Here"}</p>
            <p className="text-sm text-muted-foreground">Cast: {movie.cast || "Cast Here"}</p>
            <p className="text-sm text-muted-foreground">{movie.synopsis || "Synopsis here"}</p>
            {movie.trailerUrl && (
              <p className="text-sm text-blue-700">
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  Watch Trailer
                </a>
              </p>
            )}
            <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
              {daysOfWeek.map((day) => (
                <Badge key={day.id} className={showDays.includes(day.id) ? "bg-green-500" : "bg-red-500"}>
                  {day.label}
                </Badge>
              ))}
            </div>
            <div>
              <p className="mt-2 text-sm text-muted-foreground">{movie.showTimes || "12:00 PM - 9:00 PM"}</p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

