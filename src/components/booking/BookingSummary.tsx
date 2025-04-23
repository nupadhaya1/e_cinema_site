"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Showtime, Movie } from "~/server/db/schema";
import { Seat } from "./selectSeats";
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
import { useEffect, useState } from "react";
import { set } from "date-fns";

type BookingSummaryProps = {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  discount: Number;
  setDiscount: (e: Number) => void;
  onContinue: () => void;
  setPrices: (p: Price) => void;
  prices: Price | null | undefined;
  total: Number;
  setTotal: (e: Number) => void;
};

export type Price = {
  adult: number;
  child: number;
  senior: number;
};

const formSchema = z.object({
  promotionCode: z.string().optional(),
});

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
  setPrices,
  prices,
  total,
  setTotal
}: BookingSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  let taxPercentage = 0.1;
  useEffect(() => {
    let fetchData = async () => {
      let data = await fetch(
        "/api/moviebooking/prices?movieId=" +
          movie.id +
          "&showtimeId=" +
          showtime.id,
      );
      setPrices(await data.json());
    };
    fetchData();
  }, []);

  const [subtotal, setSubTotal] = useState(0.0);

  //let prices = getPrices(movie);
  // if(prices == null || prices == undefined) {
  //   setPrices(getPrices(movie));
  // }
  useEffect(() => {
    if (prices == null) {
      return;
    }
    let _subtotal = 0;
    for (let i = 0; i < seats.length; i++) {
      _subtotal += prices![seats[i]!.ageCategory as keyof Price];
    }
    setSubTotal(_subtotal);
    let total = subtotal * (1 + taxPercentage);
    setTotal(total - Number(discount));
  }, [prices]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promotionCode: "",
    },
  });
  //TODO: check promotion code validity
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    //console.log(values);
    try {
      let data = await fetch(
        "/api/moviebooking/promotion?promotion=" + values.promotionCode,
      );
      if (!data.ok) {
        form.setError("promotionCode", {
          message: "Invalid promotion code.",
        });
      } else {
        setDiscount(Number(await data.json()));
      }
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
    prices != null && (
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Movie:</strong> {movie.name}
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
                  {"$" + prices![seat.ageCategory as keyof Price].toFixed(2)}
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
              <div className="flex flex-row justify-between">
                <Button type="submit" disabled={isLoading || discount != 0}>
                  {isLoading ? "Checking..." : "Apply Promotion Code"}
                </Button>

                <Button onClick={onContinue} className="">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  );
}
