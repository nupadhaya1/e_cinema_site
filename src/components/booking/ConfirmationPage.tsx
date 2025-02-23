"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Movie } from "./SelectMovieButton";
import { Showtime } from "./SelectShowTimes";
import { Seat } from "./SelectSeats";
import { getPrices, Price } from "./BookingSummary";

type ConfirmationProps = {
  movie: Movie;
  showtime: Showtime|null;
  seats: Seat[];
  confirmationNumber: Number;
  discount: Number;
};

export default function ConfirmationPage({movie, showtime, seats, confirmationNumber, discount}:ConfirmationProps) {
    const router = useRouter();
    function onClick() {
      router.push("/");
    }
    let taxPercentage = 0.1;
    let prices = getPrices(movie);
    let subtotal = 0;
    for (let i = 0; i < seats.length; i++) {
      subtotal += prices[seats[i]!.ageCategory as keyof Price];
    }
    let total = subtotal * (1 + taxPercentage);
    total = total - Number(discount);
    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Thank You For Your Order!</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-2">
          <p className="text-lg text-center">
            <strong>{confirmationNumber+""}</strong> 
          </p>
          <p>
            <strong>Movie:</strong> {movie.title}
          </p>
          <p>
            <strong>Showtime:</strong> {showtime!.time}
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
            {"Subotal: $" + subtotal.toFixed(2)}
          </div>
          <div className="flex justify-end">
            {`Tax(${taxPercentage.toFixed(2)}%): $${(subtotal * taxPercentage).toFixed(2)}`}
          </div>

          <div className="flex justify-end">
            {`Discount: -$${discount.toFixed(2)}`}
          </div>
          <div className="flex justify-end">
            {`Total: $${total.toFixed(2)}`}
          </div>
        </div>

            <Button onClick={onClick} className="mt-4 w-full">
                    Return Home
                  </Button>
          </CardContent>
        </Card>
      );
}