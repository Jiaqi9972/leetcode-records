"use client";

import { createContext, useState } from "react";
import { toZonedTime } from "date-fns-tz";

const timeZone = "America/Los_Angeles";

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);

  const [currentMonth, setCurrentMonth] = useState(zonedDate);
  const [currentDate, setCurrentDate] = useState(zonedDate);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <DateContext.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        currentDate,
        setCurrentDate,
        activeIndex,
        setActiveIndex,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
