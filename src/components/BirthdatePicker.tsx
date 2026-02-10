import { useEffect, useRef, useState } from "react";
import { MONTH_NAMES } from "../types";
import "./BirthdatePicker.css";

const YEAR_MIN = new Date().getFullYear() - 2;
const YEAR_MAX = new Date().getFullYear() + 5;
const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i);

interface BirthdatePickerProps {
  month: number;
  day: number;
  onChange: (month: number, day: number) => void;
  label?: string;
}

export default function BirthdatePicker({ month, day, onChange, label = "Birthday" }: BirthdatePickerProps) {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const y = currentYear;
    const maxDay = new Date(y, month, 0).getDate();
    return new Date(y, month - 1, Math.min(day, maxDay));
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep view month/day in sync when props change from outside; preserve view year
  useEffect(() => {
    setViewDate((d) => {
      const y = d.getFullYear();
      const maxDay = new Date(y, month, 0).getDate();
      return new Date(y, month - 1, Math.min(day, maxDay));
    });
  }, [month, day]);

  const displayText = `${MONTH_NAMES[month - 1].slice(0, 3)} ${day}`;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const setViewYear = (year: number) =>
    setViewDate((d) => new Date(year, d.getMonth(), Math.min(d.getDate(), new Date(year, d.getMonth() + 1, 0).getDate())));

  const pickDay = (d: number) => {
    onChange(viewMonth + 1, d);
    setOpen(false);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="birthdate-picker" ref={containerRef}>
      <label className="birthdate-picker-label">{label}</label>
      <button
        type="button"
        className="birthdate-picker-input"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span>{displayText}</span>
        <span className="birthdate-picker-icon" aria-hidden>📅</span>
      </button>
      {open && (
        <div className="birthdate-picker-dropdown" role="dialog" aria-label="Choose date">
          <div className="birthdate-picker-header">
            <button type="button" className="birthdate-picker-nav" onClick={prevMonth} aria-label="Previous month">
              ‹
            </button>
            <span className="birthdate-picker-month-year">
              {MONTH_NAMES[viewMonth]}{" "}
              <select
                className="birthdate-picker-year-select"
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                aria-label="Year"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </span>
            <button type="button" className="birthdate-picker-nav" onClick={nextMonth} aria-label="Next month">
              ›
            </button>
          </div>
          <div className="birthdate-picker-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
              <span key={w} className="birthdate-picker-weekday">{w}</span>
            ))}
          </div>
          <div className="birthdate-picker-days">
            {blanks.map((i) => (
              <span key={`b-${i}`} className="birthdate-picker-day birthdate-picker-day--blank" />
            ))}
            {days.map((d) => {
              const isSelected = month === viewMonth + 1 && day === d;
              return (
                <button
                  key={d}
                  type="button"
                  className={`birthdate-picker-day ${isSelected ? "birthdate-picker-day--selected" : ""}`}
                  onClick={() => pickDay(d)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
