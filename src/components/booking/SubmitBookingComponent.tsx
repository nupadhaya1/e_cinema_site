import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Movie } from "./SelectMovieButton";
import { Showtime } from "./SelectShowTimes";
import { Seat } from "./SelectSeats";


type BookingSummaryProps = {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  onContinue: () => void;
};

type Price = {
  adult: number;
  child: number;
  senior: number;
};
//TODO: 
function getPrices(movie: Movie) {
  return { adult: 20.0, child: 15.0, senior: 10.0 };
}

export default function BookingSummary({
  movie,
  showtime,
  seats,
  onContinue,
}: BookingSummaryProps) {
  let prices = getPrices(movie);
  let subtotal = 0;
  for (let i = 0; i < seats.length; i++) {
    subtotal += prices[seats[i]!.ageCategory as keyof Price];
  }

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
          <div className="flex flex-col">
            {seats.map((seat) => (
              <div key={seat.id} className="flex flex-row justify-between">
                <div>
                  {seat.row}
                  {seat.number} ({seat.ageCategory})
                </div>
                {"$" + prices[seat.ageCategory as keyof Price].toFixed(2)}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            {"Total: $" + subtotal.toFixed(2)}
          </div>
        </div>
        <Button onClick={onContinue} className="mt-4 w-full">
                Continue
              </Button>
      </CardContent>
    </Card>
  );
}
