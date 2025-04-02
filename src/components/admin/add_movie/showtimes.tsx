"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "~/components/ui/button";

import { FormControl, FormLabel } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Badge } from "~/components/ui/badge";
import { Dispatch, SetStateAction } from "react";
import { Showtime } from "~/server/db/schema";
import {formatDateString} from "~/components/utils"

export type ShowDates = { date: string; times: Showtime[] }[];

type stateTuple<T> = [T, Dispatch<SetStateAction<T>>];

type AdminShowtimesComponentProps = {
  showDatesState: stateTuple<ShowDates>;
  loading: boolean;
};

export const VALIDHOURS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
export const VALIDMINUTES = ["00", "15", "30", "45"];
export const VALIDSHOWROOMS = [1, 2, 3];

export function initShowtimeList(showtimes: Showtime[]) {
  const _showdates: ShowDates = [];
  showtimes.forEach((newShowdate) => {
    const existingDateIndex = _showdates.findIndex(
      //group dates
      (item) => item.date === newShowdate.date,
    );
    if (existingDateIndex >= 0) {
      const ifTimeExists = _showdates[existingDateIndex]?.times.findIndex(
        (item) => item.time === newShowdate.time,
      );
      if (ifTimeExists != undefined && ifTimeExists < 0) {
        _showdates[existingDateIndex]!.times.push(newShowdate);
      }
    } else {
      _showdates.push({ date: newShowdate.date, times: [newShowdate] });
    }
  });
  return _showdates;
}

export function convertShowDateToShowtimeList(showdate: ShowDates) {
  let a: Showtime[] = [];
  showdate.forEach((e) => {
    a.push(...e.times);
  });
  return a;
}

export default function AdminShowtimesComponent({
  showDatesState,
  loading,
}: AdminShowtimesComponentProps) {
  const [showDates, setShowDates] = showDatesState;

  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [minute, setMinute] = useState<string | undefined>(undefined);
  const [ampm, setampm] = useState<string | undefined>(undefined);
  const [showroom, setShowRoom] = useState<number | undefined>(undefined);

  useEffect(() => {
    setSelectedDate(undefined);
    setHour(undefined);
    setMinute(undefined);
    setampm(undefined);
  }, [loading]);

  function addShowTime() {
    if (
      selectedDate == undefined ||
      hour == undefined ||
      minute == undefined ||
      ampm == undefined ||
      showroom == undefined
    ) {
      alert("invalid time format");
      return;
    }
    let newShowdate: Showtime = {
      //make new showtime object
      date: selectedDate,
        // .toISOString()
        // .substring(0, selectedDate.toISOString().indexOf("T")),
      time: `${hour}:${minute} ${ampm}`,
      showroom: showroom,
    };
    const existingDateIndex = showDates.findIndex(
      //group dates
      (item) => item.date === newShowdate.date,
    );
    if (existingDateIndex >= 0) {
      const ifTimeExists = showDates[existingDateIndex]?.times.findIndex(
        (item) => item.time === newShowdate.time,
      );
      if (ifTimeExists != undefined && ifTimeExists < 0) {
        //cannot add same date time more than once
        const updatedShowDates = [...showDates];
        updatedShowDates[existingDateIndex]!.times.push(newShowdate);
        setShowDates(updatedShowDates);
      }
    } else {
      setShowDates([
        ...showDates,
        {
          date: selectedDate,
            // .toISOString()
            // .substring(0, selectedDate.toISOString().indexOf("T")),
          times: [newShowdate],
        },
      ]);
    }
  }

  function removeShowDate(dateIndex: number) {
    setShowDates(showDates.filter((_, i) => i !== dateIndex));
  }

  const removeShowTime = (dateIndex: number, timeIndex: number) => {
    const updatedShowDates = [...showDates];
    updatedShowDates[dateIndex]!.times = updatedShowDates[
      dateIndex
    ]!.times.filter((_, i) => i !== timeIndex);
    if (updatedShowDates[dateIndex]!.times.length === 0) {
      removeShowDate(dateIndex);
    } else {
      setShowDates(updatedShowDates);
    }
  };
  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Show Dates & Times</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FormLabel>Date</FormLabel>
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
                  setSelectedDate(formatDateString(date));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <FormLabel>Time</FormLabel>

          <div className="flex items-center gap-2">
            {!loading && (
              <Select onValueChange={(val) => setHour(val)} value={hour}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="hours" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {VALIDHOURS.map((hour, index) => (
                    <SelectItem key={"hours" + index} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}{" "}
            :
            {!loading && (
              <Select onValueChange={(val) => setMinute(val)} value={minute}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="minutes" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {VALIDMINUTES.map((min, index) => (
                    <SelectItem key={"minutes" + index} value={min}>
                      {min}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!loading && (
              <Select onValueChange={(val) => setampm(val)} value={ampm}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            )}
            {!loading && (
              <Select
                onValueChange={(val) => setShowRoom(Number(val))}
                value={showroom + ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="showroom" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VALIDSHOWROOMS.map((room, index) => (
                    <SelectItem key={"showroom" + index} value={room + ""}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              type="button"
              onClick={addShowTime}
              size="sm"
              disabled={loading}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>
      {showDates.length > 0 && (
        <div className="mt-4 rounded-md border p-4">
          <h4 className="mb-2 font-medium">Scheduled Shows</h4>
          <div className="space-y-3">
            {showDates.map((showDate, dateIndex) => (
              <div key={dateIndex} className="border-b pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">
                    {format(showDate.date, "PPP")}
                  </h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeShowDate(dateIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove date</span>
                  </Button>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {showDate.times.map((showtime: Showtime, timeIndex) => (
                    <Badge
                      key={timeIndex}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {showtime.time}
                      <button
                        type="button"
                        onClick={() => removeShowTime(dateIndex, timeIndex)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Remove {showtime.time}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
