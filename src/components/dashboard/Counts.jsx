"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import { DateContext } from "@/context/DateContext";
import { PieChart, Pie, Tooltip, Cell, Label } from "recharts";

export default function Counts({ records }) {
  const { currentMonth } = useContext(DateContext);
  const [monthCounts, setMonthCounts] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  });

  const { counts, totalCounts } = useMemo(() => {
    const counts = {};
    const totalCounts = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0,
    };

    records?.forEach((record) => {
      const date = record.date;
      const monthKey = date.toISOString().slice(0, 7);
      const difficulty = record.difficulty.toLowerCase();

      if (!counts[monthKey]) {
        counts[monthKey] = {
          easy: 0,
          medium: 0,
          hard: 0,
          total: 0,
        };
      }

      counts[monthKey][difficulty] += 1;
      counts[monthKey].total += 1;

      totalCounts[difficulty] += 1;
      totalCounts.total += 1;
    });

    return { counts, totalCounts };
  }, [records]);

  useEffect(() => {
    const formattedMonth = currentMonth.toISOString().slice(0, 7);
    const monthData = counts[formattedMonth];

    if (monthData) {
      setMonthCounts(monthData);
    } else {
      setMonthCounts({ easy: 0, medium: 0, hard: 0, total: 0 });
    }
  }, [currentMonth, counts]);

  // Prepare data for totalCounts
  const totalData = [
    { name: "Easy", value: totalCounts.easy, color: "hsl(var(--chart-2))" },
    { name: "Medium", value: totalCounts.medium, color: "hsl(var(--chart-5))" },
    { name: "Hard", value: totalCounts.hard, color: "hsl(var(--chart-1))" },
  ];

  // Prepare data for monthCounts
  const monthData = [
    { name: "Easy", value: monthCounts.easy, color: "hsl(var(--chart-2))" },
    { name: "Medium", value: monthCounts.medium, color: "hsl(var(--chart-5))" },
    { name: "Hard", value: monthCounts.hard, color: "hsl(var(--chart-1))" },
  ];

  const placeholder = [
    { name: "None", value: 1, color: "hsl(var(--secondary))" },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm">
      <div className="flex flex-col items-center">
        <PieChart width={150} height={150}>
          <Pie
            data={totalData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="50%"
          >
            {totalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <Label
              value={totalCounts.total}
              position="center"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Pie>
          <Tooltip />
        </PieChart>
        <h2>Total</h2>
      </div>
      <div className="flex flex-col items-center">
        {monthCounts.total > 0 ? (
          <PieChart width={150} height={150}>
            <Pie
              data={monthData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="50%"
            >
              {monthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value={monthCounts.total}
                position="center"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <PieChart width={150} height={150}>
            <Pie
              data={placeholder}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="50%"
            >
              {placeholder.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value="0"
                position="center"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Pie>
          </PieChart>
        )}
        <h2>{currentMonth.toISOString().slice(0, 7)}</h2>
      </div>
    </div>
  );
}
