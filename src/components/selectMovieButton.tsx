"use client";

import { useState } from "react";
import { ShowtimeSelection } from "./selectShowTimes";
import { SeatSelection } from "./selectSeats";
import { BookingSummary } from "./bookingConfirmation";
import { Button } from "./ui/button";

export type Movie = {
  id: number;
  title: string;
  image: string;
};

type Showtime = {
  id: number;
  time: string;
};

type Seat = {
  id: number;
  row: string;
  number: number;
  ageCategory: string;
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

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setStep(3);
  };

  const handleConfirmSeats = (seats: Seat[]) => {
    setSelectedSeats(seats);
    setStep(4);
  };

  function handleBackButton() {
    // if (step == 2) {
    //   setSelectedShowtime(null);
    //   setSelectedSeats([]);
    // }
    // if (step == 3) {
    //   //setSelectedSeats([]);
    // }
    setStep(step - 1);
  }

  function handleConfirmBooking() {
    // Here you would typically send the booking data to your backend
    console.log("Booking confirmed:", {
      selectedMovie,
      selectedShowtime,
      selectedSeats,
    });
    alert("Booking confirmed!");
    // Reset the booking process
    // setStep(1)
    // setSelectedShowtime(null)
    // setSelectedSeats([])
  };

  return (
    <div className="container mx-auto p-4">
      {step === 1 && (
        <Button onClick={() => setStep(2)} className="w-full">
          Select Movie
        </Button>
      )}

      {step !== 1 && (
        <div className="flex flex-row gap-1">
          <Button onClick={handleBackButton} className="w-full ">
            Back
          </Button>
          <Button onClick={() => setStep(1)} className="w-full ">
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
      {step === 3 && <SeatSelection onConfirmSeats={handleConfirmSeats} />}
      {step === 4 && selectedMovie && selectedShowtime && (
        <BookingSummary
          movie={selectedMovie}
          showtime={selectedShowtime}
          seats={selectedSeats}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
