import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Movie } from "./selectMovieButton";
import { Showtime } from "./selectShowTimes";
import { Seat } from "./selectSeats";
import SelectCreditCard from "./selectCreditCard";
import { useState } from "react";


type BookingSummaryProps = {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  onConfirm: () => void;
  selectedCard: string | null;
  setSelectedCard: (e:string) => void;
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
//TODO:
function getCreditCards() {
  return [
    {
      id: 1,
      cardNumber: 1111111111111111,
      cardName: "bob",
      cardType: "visa",
      exp: "01/28",
    },
    {
      id: 2,
      cardNumber: 111111111111111,
      cardName: "bob",
      cardType: "visa",
      exp: "01/28",
    },
    {
      id: 3,
      cardNumber: 12222222222222,
      cardName: "bob",
      cardType: "visa",
      exp: "01/28",
    },
  ];
}

export default function BookingSummary({
  movie,
  showtime,
  seats,
  onConfirm,
  selectedCard,
  setSelectedCard
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
        <SelectCreditCard
          cards={getCreditCards()}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        ></SelectCreditCard>
        <Button onClick={onConfirm} className="mt-4 w-full" disabled={selectedCard === null}>
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
}
