"use client";

import { use, useState } from "react";
import { ShowtimeSelection } from "./selectShowTimes";
import { SeatSelection } from "./selectSeats";
import BookingSummary, { Price } from "./BookingSummary";
import { Button } from "../ui/button";
import { Seat } from "./selectSeats";
import SelectCreditCard from "./selectCreditCard";
import ConfirmationPage from "./ConfirmationPage";
import { useRouter } from "next/navigation";
import { Showtime, Movie } from "~/server/db/schema";


type SelectMovieProps = {
  selectedMovie: Movie;
};

export default function SelectMovieButton({ selectedMovie }: SelectMovieProps) {
  const [step, setStep] = useState(2);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null,
  ); //{id:, time:}
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null); //uuid
  const [discount, setDiscount] = useState<Number>(0.0);
  // const [promotionCode, setPromotionCode] = useState<String>("");
  const [confirmationNumber, setConfirmationNumber] = useState<Number>(-1);
  const [prices, setPrices] = useState<Price | null>();
  const [total, setTotal] = useState<Number>(0.0);

  const router = useRouter();

  async function handleConfirmBooking() {
    console.log(selectedMovie);
    try {
      const response = await fetch("/api/moviebooking/confirmbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: selectedMovie,
          showtime: selectedShowtime,
          seats: selectedSeats,
          card: selectedCard,
          total: total
        }),
      });
      let jason = await response.json();
      setConfirmationNumber(jason[0].bookingId);
      setStep(6);
    } catch (e) {
      console.log(e);
    }
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
    // setSelectedCard(null);
    // setStep(2);
    // setSelectedSeats([]);
    // setSelectedShowtime(null);
    router.push("/");

  }

  return (
    <div className="container mx-auto p-4">
      {step !== 1 && step !== 6 && (
        <div className="mb-2 flex flex-row gap-1">
          <Button onClick={handleBackButton} className="w-full">
            Back
          </Button>
          {step > 2 && step != 6 && (
        <Button onClick={handleCancel} className="w-full bg-red-600 hover:bg-red-800">
          Cancel
        </Button>
      )}
        </div>
      )}

      {step === 2 && selectedMovie && (
        <ShowtimeSelection
          movie={selectedMovie}
          onSelectShowtime={handleSelectShowtime}
        />
      )}
      {step === 3 && selectedShowtime != null && (
        <SeatSelection
          onConfirmSeats={handleConfirmSeats}
          selected_seats={selectedSeats}
          showTimeId={selectedShowtime.id!}
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
          setPrices={setPrices}
          prices={prices}
          total={total}
          setTotal={setTotal}
        />
      )}
      {step === 5 && (
        <SelectCreditCard
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          handleConfirmBooking={handleConfirmBooking}
        ></SelectCreditCard>
      )}
      {/* {step === 5 && (
        <Button
          onClick={handleConfirmBooking}
          className="mt-4 w-full"
          disabled={selectedCard === null}
        >
          Confirm Booking
        </Button>
      )} */}


      {step === 6 && (
        <ConfirmationPage
          movie={selectedMovie}
          discount={discount}
          seats={selectedSeats}
          showtime={selectedShowtime}
          confirmationNumber={confirmationNumber}
          prices={prices!}
        ></ConfirmationPage>
      )}
    </div>
  );
}
