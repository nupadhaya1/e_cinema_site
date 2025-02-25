import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export type Seat = {
  id: number;
  row: string;
  number: number;
  selected: boolean;
  taken: boolean;
  ageCategory: string;
};

type SeatSelectionProps = {
  onConfirmSeats: (selectedSeats: Seat[]) => void;
  selected_seats: Seat[];
};

//TODO: get seats from db
const getSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E"];
  let min = 1; let max = 50;
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: rowIndex * 10 + i,
        row,
        number: i,
        selected: false,
        taken: (rowIndex * 10 + i) % 3 == 0 ? true : false,
        ageCategory: "adult",
      });
    }
  });
  return seats;
};

export function SeatSelection({
  onConfirmSeats,
  selected_seats,
}: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(getSeats());

  function toggleSeat(seatId: number) {
    setSeats(
      seats.map((seat) =>
        seat.id === seatId ? { ...seat, selected: !seat.selected } : seat,
      ),
    );
  }

  function updateAgeCategory(seatId: number, category: string) {
    setSeats(
      seats.map((seat) =>
        seat.id === seatId ? { ...seat, ageCategory: category } : seat,
      ),
    );
  }

  //to remember what seats were selected if back button press on booking conifrmation page
  useEffect(() => {
    setSeats(
      seats.map((seat) => {
        let s = selected_seats.find((s) => s.id === seat.id);
      return !seat.taken && s !== undefined ? {...s} : seat},
      ),
    );
  }, []);

  const selectedSeats = seats.filter((seat) => seat.selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-10 gap-2">
          {seats.map((seat) => (
            <Button
              key={seat.id}
              variant={seat.selected ? "default" : "outline"}
              className={`h-8 w-8 p-0 ${seat.taken ? "bg-red-500" : ""}`}
              onClick={() => toggleSeat(seat.id)}
              disabled={seat.taken}
            >
              {seat.row}
              {seat.number}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          {selectedSeats.map((seat) => (
            <div key={seat.id} className="flex items-center space-x-2">
              <span>
                {seat.row}
                {seat.number}
              </span>
              <Select
                onValueChange={(value) => updateAgeCategory(seat.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={seat.ageCategory.charAt(0).toUpperCase() + seat.ageCategory.slice(1)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button
          onClick={() => onConfirmSeats(selectedSeats)}
          className="mt-4"
          disabled={selectedSeats.length === 0}
        >
          Confirm Seats
        </Button>
      </CardContent>
    </Card>
  );
}
