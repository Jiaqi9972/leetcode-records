"use client";

import { createContext, useState } from "react";

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
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
