"use client";

import { useState } from "react";
import { ShowtimeSelection } from "./selectShowTimes";
import { SeatSelection } from "./selectSeats";
import BookingSummary from "./bookingConfirmation";
import { Button } from "../ui/button";
import { Showtime } from "./selectShowTimes";
import { Seat } from "./selectSeats";

export type Movie = {
  id: number;
  title: string;
  image: string;
};

type SelectMovieProps = {
  selectedMovie: Movie;
};

export default function SelectMovieButton({ selectedMovie }: SelectMovieProps) {
  const [step, setStep] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null,
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  function handleSelectShowtime(showtime: Showtime) {
    setSelectedShowtime(showtime);
    setStep(3);
  }

  function handleConfirmSeats(seats: Seat[]) {
    setSelectedSeats(seats);
    setStep(4);
  }

  function handleBackButton() {
    if (step == 2) {
      setSelectedShowtime(null);
      //setSelectedSeats([]);
    }
    if (step == 3) {
      setSelectedSeats([]);
    }
    setSelectedCard(null);
    setStep(step - 1);
  }

  function handleCancel() {
    setSelectedCard(null);
    setStep(1);
    setSelectedSeats([]);
    setSelectedShowtime(null);
  }

  //TODO:
  function handleConfirmBooking() {
    // Here you would typically send the booking data to your backend
    console.log("Booking confirmed:", {
      selectedMovie,
      selectedShowtime,
      selectedSeats,
      selectedCard,
    });
    alert("Booking confirmed!");
    // Reset the booking process
    // setStep(1)
    // setSelectedShowtime(null)
    // setSelectedSeats([])
  }

  return (
    <div className="container mx-auto p-4">
      {step === 1 && (
        <Button onClick={() => setStep(2)} className="w-full">
          Select Movie
        </Button>
      )}

      {step !== 1 && (
        <div className="flex flex-row gap-1">
          <Button onClick={handleBackButton} className="w-full">
            Back
          </Button>
          <Button onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        </div>
      )}

      {step === 2 && selectedMovie && (
        <ShowtimeSelection
          movie={selectedMovie}
          onSelectShowtime={handleSelectShowtime}
        />
      )}
      {step === 3 && (
        <SeatSelection
          onConfirmSeats={handleConfirmSeats}
          selected_seats={selectedSeats}
        />
      )}
      {step === 4 && selectedMovie && selectedShowtime && (
        <BookingSummary
          movie={selectedMovie}
          showtime={selectedShowtime}
          seats={selectedSeats}
          onConfirm={handleConfirmBooking}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      )}
    </div>
  );
}
