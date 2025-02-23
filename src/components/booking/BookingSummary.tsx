"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Movie } from "./SelectMovieButton";
import { Showtime } from "./SelectShowTimes";
import { Seat } from "./SelectSeats";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { useState } from "react";


type BookingSummaryProps = {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  discount: Number;
  setDiscount: (e: Number) => void;
  onContinue: () => void;
};

export type Price = {
  adult: number;
  child: number;
  senior: number;
};


const formSchema = z
  .object({
   promotionCode: z.string().optional(),
  })

//TODO:
export function getPrices(movie: Movie) {
  return { adult: 20.0, child: 15.0, senior: 10.0, taxPercentage: 0.1 };
}

export default function BookingSummary({
  movie,
  showtime,
  seats,
  discount,
  setDiscount,
  onContinue,
}: BookingSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  let taxPercentage = 0.1;
  let prices = getPrices(movie);
  let subtotal = 0;
  for (let i = 0; i < seats.length; i++) {
    subtotal += prices[seats[i]!.ageCategory as keyof Price];
  }
  let total = subtotal * (1 + taxPercentage);
  total = total - Number(discount);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promotionCode: "",
    },
  });
//TODO: check promotion code validity
  async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsLoading(true);
      console.log(values);
      try {
        if(values.promotionCode == "uga") {
        setDiscount(10.00);

        }
        // await updateProfile(values);
        // toast({
        //   title: "Profile updated",
        //   description: "Your profile has been successfully updated.",
        // });
        // form.reset();
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "There was a problem updating your profile.",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false);
      }
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="promotionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Code?</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Checking..." : "Apply Promotion Code"}
            </Button>
          </form>
        </Form>

        <Button onClick={onContinue} className="mt-4 w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
