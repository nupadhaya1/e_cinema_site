import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type Seat = {
  id: number
  row: string
  number: number
  selected: boolean
  taken: boolean
  ageCategory: string
}

//TODO: get seats from db
const getSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = ["A", "B", "C", "D", "E"]
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: rowIndex * 10 + i,
        row,
        number: i,
        selected: false,
        taken: i % 3 == 0 ? true : false,
        ageCategory: "adult",
      })
    }
  })
  return seats
}

type SeatSelectionProps = {
  onConfirmSeats: (selectedSeats: Seat[]) => void
}

export function SeatSelection({ onConfirmSeats }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(getSeats())

  const toggleSeat = (seatId: number) => {
    setSeats(seats.map((seat) => (seat.id === seatId ? { ...seat, selected: !seat.selected } : seat)))
  }

  const updateAgeCategory = (seatId: number, category: string) => {
    setSeats(seats.map((seat) => (seat.id === seatId ? { ...seat, ageCategory: category } : seat)))
  }

  const selectedSeats = seats.filter((seat) => seat.selected)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {seats.map((seat) => (
            <Button
              key={seat.id}
              variant={seat.selected ? "default" : "outline"}
              className={`w-8 h-8 p-0 ${seat.taken ? "bg-red-500" : ""}`}
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
              <Select onValueChange={(value) => updateAgeCategory(seat.id, value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Age Category" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button onClick={() => onConfirmSeats(selectedSeats)} className="mt-4" disabled={selectedSeats.length === 0}>
          Confirm Seats
        </Button>
      </CardContent>
    </Card>
  )
}

