import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type Movie = {
  id: number
  title: string
}

type Showtime = {
  id: number
  time: string
}

type Seat = {
  id: number
  row: string
  number: number
  ageCategory: string
}

type BookingSummaryProps = {
  movie: Movie
  showtime: Showtime
  seats: Seat[]
  onConfirm: () => void
}

export function BookingSummary({ movie, showtime, seats, onConfirm }: BookingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Movie:</strong> {movie.title}
          </p>
          <p>
            <strong>Showtime:</strong> {showtime.time}
          </p>
          <p>
            <strong>Seats:</strong>
          </p>
          <ul className="list-disc list-inside">
            {seats.map((seat) => (
              <li key={seat.id}>
                {seat.row}
                {seat.number} ({seat.ageCategory})
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={onConfirm} className="mt-4 w-full">
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  )
}

