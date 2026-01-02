// Calendar.js
import React from "react";
import "./calendar.css";
import { CreateMonthGrid } from "./month-grid";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ date }) => {
const inputDate = new Date(date)
  const monthYearFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  });
  const title = monthYearFormatter.format(inputDate);

  const grid = CreateMonthGrid(inputDate);
  const activeDay = inputDate.getDate();

  return (
    <div className="calendar" aria-label="Calendar">
      <div className="calendar-header" data-testid="calendar-header">
        {title}
      </div>

      <div className="calendar-weekdays">
        {weekdayLabels.map((label) => (
          <div key={label} className="calendar-weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid" data-testid="calendar-grid">
        {grid.map((week, weekIndex) =>
          week.map((day, index) => {
            const key = `${weekIndex}-${index}`;
            const isActive = day === activeDay;

            return (
              <div
                key={key}
                className={
                  "calendar-cell" + (isActive ? " calendar-cell-active" : "")
                }
                aria-current={isActive ? "date" : undefined}
              >
                {day ?? ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar