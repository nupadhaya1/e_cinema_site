import { set } from "date-fns";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Movie } from "./selectMovieButton";
import { useEffect, useState } from "react";
import { Showtime } from "~/server/db/schema";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { formatDateString } from "../utils";

type ShowtimeSelectionProps = {
  movie: Movie;
  onSelectShowtime: (showtime: Showtime) => void;
};

export function ShowtimeSelection({
  movie,
  onSelectShowtime,
}: ShowtimeSelectionProps) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/moviebooking/showtimes?movieId=${movie.id}&date=${formatDateString(selectedDate)}`,
      );
      const result = await response.json();
      setShowtimes(result);
    };

    fetchData();
  }, [selectedDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Showtime for {movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                // selected={selectedDate}
                // onSelect={setSelectedDate}
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={(date) => {
                  if (date == undefined) {
                    return;
                  }
                  setSelectedDate(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {showtimes.length > 0
          ? showtimes.map((showtime: Showtime) => (
              <Button
                key={showtime.id}
                onClick={() => onSelectShowtime(showtime)}
                variant="outline"
              >
                {showtime.time}
              </Button>
            ))
          : "No showtime available for this date."}
      </CardContent>
    </Card>
  );
}
