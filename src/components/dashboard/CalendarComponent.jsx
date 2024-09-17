"use client";

import { Calendar } from "@/components/ui/calendar";
import { DateContext } from "@/context/DateContext";
import { useContext } from "react";

export default function CalendarComponent() {
  const { currentDate, setCurrentDate, currentMonth } = useContext(DateContext);

  return (
    <Calendar
      mode="single"
      selected={currentDate}
      onSelect={setCurrentDate}
      month={currentMonth}
    />
  );
}
