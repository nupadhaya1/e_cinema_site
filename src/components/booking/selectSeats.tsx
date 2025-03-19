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
  showTimeId: number;
};

//intializes seats
function getSeats() {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E"];
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: rowIndex * 10 + i,
        row,
        number: i,
        selected: false,
        taken: false,
        ageCategory: "adult",
      });
    }
  });
  return seats;
}

export function SeatSelection({
  onConfirmSeats,
  selected_seats,
  showTimeId,
}: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(getSeats());
  const [refresh, setFresh] = useState(false);
  const [takenSeats, setTakenSeats] = useState<String[] | null>(null);

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
        return !seat.taken && s !== undefined ? { ...s } : seat;
      }),
    );
  }, []);

  useEffect(() => { //gets db data
    const fetchData = async () => {
      let data = await fetch(
        "/api/moviebooking/seats?showTimeId=" + showTimeId,
      );
      setTakenSeats(await data.json());
    
    };
    fetchData();
    setFresh(false);
  }, [refresh]);

  useEffect(() => { //sets seats taken based on db data
    if(takenSeats == null) {
      return;
    }
    setSeats(
      seats.map((seat) => {
        for(let i = 0; i < takenSeats.length; i++) {
          if (takenSeats[i] == (seat.row + seat.number)) {
            return {...seat, taken: true}
          }
        }
        
        return seat;
      }),
    );
  }, [takenSeats]);

  const selectedSeats = seats.filter((seat) => seat.selected); //counts how many seats selected

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
                  <SelectValue
                    placeholder={
                      seat.ageCategory.charAt(0).toUpperCase() +
                      seat.ageCategory.slice(1)
                    }
                  />
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
