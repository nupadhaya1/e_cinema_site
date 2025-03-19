import { set } from "date-fns"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Movie } from "./selectMovieButton"
import { useEffect, useState } from "react"

export type Showtime = {
  id: number
  time: string
}


type ShowtimeSelectionProps = {
  movie: Movie
  onSelectShowtime: (showtime: Showtime) => void
}


export function ShowtimeSelection({ movie, onSelectShowtime }: ShowtimeSelectionProps) {
    const [showtimes, setShowtimes] = useState<Showtime[] >([]);
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch("/api/moviebooking/showtimes?movieId=" + movie.id);
        const result = await response.json();
        setShowtimes(result);
      };
  
      fetchData();
    }, []);



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

