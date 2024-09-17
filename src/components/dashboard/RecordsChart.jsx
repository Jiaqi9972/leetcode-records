"use client";

import { useContext, useMemo } from "react";
import {
  eachDayOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  parse,
} from "date-fns";
import { DateContext } from "@/context/DateContext";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecordsChart({ records }) {
  const { currentMonth, setCurrentDate } = useContext(DateContext);

  // Generate all dates for the current month
  const monthDates = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysArray = eachDayOfInterval({ start, end });
    return daysArray.map((day) => format(day, "yyyy-MM-dd"));
  }, [currentMonth]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Filter records for the current month
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === currentMonth.getFullYear() &&
        recordDate.getMonth() === currentMonth.getMonth()
      );
    });

    // Map dates to counts
    const dateCountMap = filteredRecords.reduce((acc, record) => {
      const dateKey = format(new Date(record.date), "yyyy-MM-dd");
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    // Prepare chart data
    const data = monthDates.map((date) => ({
      date,
      count: dateCountMap[date] || 0,
    }));

    return data;
  }, [records, currentMonth, monthDates]);

  // Handle bar click
  const handleBarClick = (data) => {
    if (data && data.activeLabel) {
      const selectedDate = data.activeLabel;
      setCurrentDate(parse(selectedDate, "yyyy-MM-dd", new Date()));
    }
  };

  const chartConfig = {
    count: {
      label: "Solved Problems",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="w-full flex flex-1 items-center justify-center">
      <CardHeader className="w-1/4 text-center">
        <CardTitle>
          <div className="flex justify-center">Solved Problems</div>
        </CardTitle>
        <CardDescription>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-3/4 ">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            onClick={handleBarClick}
            className="w-full"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                format(parse(value, "yyyy-MM-dd", new Date()), "d")
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={4}
              onClick={(e) => handleBarClick(e)}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
