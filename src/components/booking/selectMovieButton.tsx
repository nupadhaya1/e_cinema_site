"use client";

import { useState } from "react";
import { ShowtimeSelection } from "./selectShowTimes";
import { SeatSelection } from "./selectSeats";
import BookingSummary from "./BookingSummary";
import { Button } from "../ui/button";
import { Showtime } from "./selectShowTimes";
import { Seat } from "./selectSeats";
import SelectCreditCard from "./selectCreditCard";
import ConfirmationPage from "./ConfirmationPage";
import { useRouter } from "next/navigation";

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
  const [discount, setDiscount] = useState<Number>(0.0);
  const [confirmationNumber, setConfirmationNumber] = useState<Number>(-1);

  const router = useRouter();

  //TODO:
  function handleConfirmBooking() {
    // Here you would typically send the booking data to your backend
    console.log("Booking confirmed:", {
      selectedMovie,
      selectedShowtime,
      selectedSeats,
      selectedCard,
    });
    setConfirmationNumber(Math.floor(Math.random() * 100000000));
    setStep(6);
    //alert("Booking confirmed!");
  }

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
      // setSelectedShowtime(null);
      //setSelectedSeats([]);
      router.push("/");
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

  return (
    <div className="container mx-auto p-4">
      {step === 1 && (
        <Button onClick={() => setStep(2)} className="w-full">
          Select Movie
        </Button>
      )}

      {step !== 1 && step !== 6 && (
        <div className="mb-2 flex flex-row gap-1">
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
          discount={discount}
          setDiscount={setDiscount}
          onContinue={() => setStep(5)}
        />
      )}
      {step === 5 && (
        <SelectCreditCard
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        ></SelectCreditCard>
      )}
      {step === 5 && (
        <Button
          onClick={handleConfirmBooking}
          className="mt-4 w-full"
          disabled={selectedCard === null}
        >
          Confirm Booking
        </Button>
      )}
      {step === 6 && (
        <ConfirmationPage
          movie={selectedMovie}
          discount={discount}
          seats={selectedSeats}
          showtime={selectedShowtime}
          confirmationNumber={confirmationNumber}
        ></ConfirmationPage>
      )}
    </div>
  );
}
