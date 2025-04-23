"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Showtime,
  Movie,
  seats,
  prices,
  confirmed_bookings,
} from "~/server/db/schema";
import { useEffect, useState } from "react";

type props = {};

export type OrderHistoryType = {
  booking: typeof confirmed_bookings.$inferSelect;
  movie: Movie;
  showtime: Showtime;
  seats: (typeof seats.$inferSelect)[];
  price: typeof prices.$inferSelect;
};
export type OrderHistoryTypeArray = OrderHistoryType[];

export default function OrderHistory({}: props) {
  const [history, setHistory] = useState<OrderHistoryTypeArray>([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/orderhistory");
      const json = await response.json();
      setHistory(json);
    }
    try {
      fetchData();
    } catch {
      alert("Fetching order history failed.");
    }
  }, []);
  return (
    <Card className="h-max">
      <CardHeader>
        <CardTitle className="text-center text-xl">Order History</CardTitle>
      </CardHeader>
      {history.length == 0 ? (
        <CardContent>No Orders in History</CardContent>
      ) : (<CardContent>
          {history.map((item: OrderHistoryType, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{`${item.movie.name}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  {`Confirmation Number: `}
                  <strong>{item.booking.id}</strong>
                  <br></br>
                  {`Date: ${item.showtime.date} ${item.showtime.time}`}
                  <br></br>
                  {`Number of Seats: ${item.seats.length}`}
                  <br></br>
                  {`Total Price: ${item.booking.total?.toFixed(2)}`}
                </CardContent>
              </Card>
            );
          })}
          </CardContent>
      )}
    </Card>
  );
}
