import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

interface CalendarEvent {
  id: number;
  date: string;
  type?: "internal" | "external";
  reminder?: boolean;
  [key: string]: any;
}

interface CalendarProps {
  events?: any;
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
  allowNavigation?: boolean;
  initialDate?: Date;
  showLegend?: boolean;
  className?: string;
  reminders?: Record<number, boolean>;
}

const CalendarDefault = ({
  events = [],
  selectedDate = null,
  onDateSelect,
  allowNavigation = true,
  initialDate = new Date(),
  showLegend = true,
  className = "",
  reminders = {},
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    if (!allowNavigation) return;
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    if (!allowNavigation) return;
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event: any) => event.date === dateStr);
  };

  const hasReminder = (eventId: number) => {
    return reminders[eventId] || false;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className={`rounded-3xl border border-slate-800 bg-gray-300 p-5 sm:p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        {allowNavigation ? (
          <>
            <button
              onClick={goToPreviousMonth}
              className="rounded-lg p-2 text-black transition hover:bg-slate-800 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <div className="text-lg font-semibold text-black">
                {MONTHS[currentMonth]}
              </div>
              <div className="text-sm font-bold text-blue-600">{currentYear}</div>
            </div>
            <button
              onClick={goToNextMonth}
              className="rounded-lg p-2 text-black transition hover:bg-slate-800 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : (
          <div className="w-full text-center">
            <div className="text-lg font-semibold text-black">
              {MONTHS[currentMonth]}
            </div>
            <div className="text-sm font-bold text-blue-600">{currentYear}</div>
          </div>
        )}
      </div>

      {/* Weekday Headers */}
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-widest text-black">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mt-2 grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(day);
          const hasInternal = dayEvents.some((e: any) => e.type === "internal");
          const hasExternal = dayEvents.some((e: any) => e.type === "external");
          const hasReminderActive = dayEvents.some((e: any) => hasReminder(e.id));
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;

          let bgClass = "bg-gray-300 text-slate-400";
          if (hasInternal && hasExternal) {
            bgClass = "bg-gradient-to-br from-blue-500/30 to-emerald-500/30 text-white border-blue-400";
          } else if (hasInternal) {
            bgClass = "bg-blue-500 text-blue-100 border-blue-500";
          } else if (hasExternal) {
            bgClass = "bg-emerald-500 text-emerald-100 border-emerald-500";
          }

          return (
            <button
              key={day}
              onClick={() => onDateSelect?.(dateStr)}
              className={`relative aspect-square rounded-lg border transition hover:scale-105 ${bgClass} ${
                isSelected ? "ring-2 ring-blue-400 ring-offset-2" : "border-transparent"
              } ${dayEvents.length > 0 ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="text-sm font-medium text-black">{day}</span>
              {hasReminderActive && (
                <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-orange-400"></span>
              )}
              {/* {dayEvents.length > 1 && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">
                  {dayEvents.length}
                </span>
              )} */}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 space-y-2 text-xs text-black">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            <span>Sự kiện nội bộ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span>Sự kiện đối ngoại</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-orange-400"></span>
            <span>Có nhắc nhở tự động</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDefault;