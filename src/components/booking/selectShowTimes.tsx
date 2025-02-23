import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Movie } from "./SelectMovieButton"
import { useEffect, useState } from "react"

export type Showtime = {
  id: number
  time: string
}


type ShowtimeSelectionProps = {
  movie: Movie
  onSelectShowtime: (showtime: Showtime) => void
}

//TODO: Get showtimes from db
function getShowTimes(movie: Movie) {
    return [
        { id: 1, time: "10:00 AM" },
        { id: 2, time: "1:00 PM" },
        { id: 3, time: "4:00 PM" },
        { id: 4, time: "7:00 PM" },
        { id: 5, time: "10:00 PM" },
      ];
}

export function ShowtimeSelection({ movie, onSelectShowtime }: ShowtimeSelectionProps) {
    const [showtimes, setShowtimes] = useState<Showtime[] >(getShowTimes(movie));


  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Showtime for {movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {showtimes.map((showtime) => (
          <Button key={showtime.id} onClick={() => onSelectShowtime(showtime)} variant="outline">
            {showtime.time}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

