import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
];

// ✅ Bảng màu tự động cho các loại sự kiện
const EVENT_COLORS = [
    {
        bg: "bg-blue-500",
        text: "text-blue-100",
        border: "border-blue-500",
        color: "#3B82F6",
    },
    {
        bg: "bg-emerald-500",
        text: "text-emerald-100",
        border: "border-emerald-500",
        color: "#10B981",
    },
    {
        bg: "bg-purple-500",
        text: "text-purple-100",
        border: "border-purple-500",
        color: "#A855F7",
    },
    {
        bg: "bg-pink-500",
        text: "text-pink-100",
        border: "border-pink-500",
        color: "#EC4899",
    },
    {
        bg: "bg-orange-500",
        text: "text-orange-100",
        border: "border-orange-500",
        color: "#F97316",
    },
    {
        bg: "bg-teal-500",
        text: "text-teal-100",
        border: "border-teal-500",
        color: "#14B8A6",
    },
    {
        bg: "bg-indigo-500",
        text: "text-indigo-100",
        border: "border-indigo-500",
        color: "#6366F1",
    },
    {
        bg: "bg-rose-500",
        text: "text-rose-100",
        border: "border-rose-500",
        color: "#F43F5E",
    },
];

interface EventType {
    id: number;
    name: string;
}

interface CalendarEvent {
    id: number;
    date: string;
    end_date?: string; // ✅ Thêm end_date
    event_type?: EventType;
    isRemind?: boolean;
    [key: string]: any;
}

interface CalendarProps {
    events?: CalendarEvent[];
    selectedDate?: string | null;
    onDateSelect?: (date: string) => void;
    onMonthChange?: (date: Date) => void;
    allowNavigation?: boolean;
    initialDate?: Date;
    showLegend?: boolean;
    className?: string;
    eventTypes?: EventType[];
}

const CalendarDefault = ({
    events = [],
    selectedDate = null,
    onDateSelect,
    onMonthChange,
    allowNavigation = true,
    initialDate = new Date(),
    showLegend = true,
    className = "",
    eventTypes = [],
}: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(initialDate);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // ✅ Tạo color mapping cho từng event type
    const getEventTypeColor = (typeId: number) => {
        const index = eventTypes.findIndex((t) => Number(t.id) === typeId);
        const colorIndex = index === -1 ? 0 : index;
        return EVENT_COLORS[colorIndex % EVENT_COLORS.length];
    };

    // ✅ Tạo gradient nhiều màu (chia đều các block)
    const createMultiColorGradient = (colors: string[]) => {
        if (colors.length === 0) return "#3B82F6";
        if (colors.length === 1) return colors[0];
        
        const step = 100 / colors.length;
        const gradientStops = colors.map((color, index) => {
            const start = index * step;
            const end = (index + 1) * step;
            return `${color} ${start}%, ${color} ${end}%`;
        }).join(', ');
        
        return `linear-gradient(-45deg, ${gradientStops})`;
    };

    // ✅ Kiểm tra xem một ngày có nằm trong khoảng thời gian của event không
    const isDateInEventRange = (dateStr: string, event: CalendarEvent) => {
        const checkDate = new Date(dateStr);
        const startDate = new Date(event.date);
        const endDate = event.end_date ? new Date(event.end_date) : startDate;
        
        // Reset time to compare dates only
        checkDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return checkDate >= startDate && checkDate <= endDate;
    };

    useEffect(() => {
        onMonthChange?.(currentDate);
    }, [currentDate]);

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

    // ✅ Cập nhật function để lấy events cho ngày cụ thể (bao gồm multi-day events)
    const getEventsForDate = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;
        
        return events.filter((event: CalendarEvent) => {
            return isDateInEventRange(dateStr, event);
        });
    };

    const calendarDays = getCalendarDays();

    return (
        <div
            className={`rounded-3xl bg-white p-5 sm:p-6 bg-box-shadow-inset ${className}`}
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                {allowNavigation ? (
                    <>
                        <button
                            onClick={goToPreviousMonth}
                            className="rounded-lg p-2 text-black transition hover:bg-gray-300"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-black">
                                {MONTHS[currentMonth]}
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                                {currentYear}
                            </div>
                        </div>
                        <button
                            onClick={goToNextMonth}
                            className="rounded-lg p-2 text-black transition hover:bg-gray-300"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                ) : (
                    <div className="w-full text-center">
                        <div className="text-lg font-semibold text-black">
                            {MONTHS[currentMonth]}
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                            {currentYear}
                        </div>
                    </div>
                )}
            </div>

            {/* Weekday Headers */}
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-black">
                {WEEKDAYS.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="mt-2 grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    if (!day) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="aspect-square"
                            />
                        );
                    }

                    const dayEvents = getEventsForDate(day);

                    const dateStr = `${currentYear}-${String(
                        currentMonth + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;

                    // Kiểm tra ngày đã qua
                    const today = new Date();
                    const currentDateObj = new Date(
                        currentYear,
                        currentMonth,
                        day
                    );
                    const isPast = currentDateObj < new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    );

                    const hasReminderActive =
                        !isPast &&
                        dayEvents.some((e: any) => e.isRemind === true);

                    // ✅ Logic màu sắc
                    let bgClass = "bg-gray-200 text-gray-600"; // mặc định: không có sự kiện
                    let bgStyle: React.CSSProperties = {};

                    if (dayEvents.length > 0) {
                        if (isPast) {
                            // Có sự kiện và đã qua → màu xanh nhạt
                            bgStyle = { backgroundColor: "#97cadb" };
                            bgClass = "text-white border-transparent";
                        } else {
                            // Có sự kiện và chưa qua
                            const eventTypeIds = [
                                ...new Set(
                                    dayEvents
                                        .map((e: any) => e.event_type?.id)
                                        .filter((id) => id !== undefined && id !== null)
                                ),
                            ];

                            if (eventTypeIds.length === 0) {
                                // Có sự kiện nhưng không có event_type
                                bgStyle = { backgroundColor: EVENT_COLORS[0].color };
                                bgClass = "text-white border-transparent";
                            } else if (eventTypeIds.length === 1) {
                                // Chỉ có 1 loại sự kiện
                                const color = getEventTypeColor(
                                    eventTypeIds[0] as number
                                );
                                bgStyle = { backgroundColor: color.color };
                                bgClass = "text-white border-transparent";
                            } else {
                                // Có 2+ loại sự kiện → trộn màu (gradient blocks)
                                const colors = eventTypeIds.map((id) =>
                                    getEventTypeColor(id as number).color
                                );
                                bgStyle = { background: createMultiColorGradient(colors) };
                                bgClass = "text-white border-transparent";
                            }
                        }
                    }

                    return (
                        <button
                            key={day}
                            onClick={() => dayEvents.length > 0 && onDateSelect?.(dateStr)}
                            style={bgStyle}
                            className={`relative aspect-square rounded-lg border transition ${bgClass} ${
                                isSelected
                                    ? "ring-2 ring-blue-400 ring-offset-2"
                                    : "border-transparent"
                            } ${
                                dayEvents.length > 0
                                    ? "cursor-pointer hover:scale-105"
                                    : "cursor-default"
                            }`}
                        >
                            <span className="text-sm font-medium">
                                {day}
                            </span>
                            {hasReminderActive && (
                                <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-orange-400"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend - ✅ Hiển thị tất cả event types */}
            {showLegend && (
                <div className="mt-4 space-y-2 text-xs text-black">
                    {/* Hiển thị tất cả loại sự kiện */}
                    {eventTypes.map((type, index) => {
                        const color = EVENT_COLORS[index % EVENT_COLORS.length];
                        return (
                            <div
                                key={type.id}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: color.color }}
                                ></span>
                                <span>{type.name}</span>
                            </div>
                        );
                    })}

                    {/* Separator nếu có event types */}
                    {eventTypes.length > 0 && (
                        <div className="border-t border-gray-200 my-2"></div>
                    )}

                    {/* Các trạng thái cố định */}
                    <div className="flex items-center gap-2">
                        <span 
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "#F97316" }}
                        ></span>
                        <span>Có nhắc nhở tự động</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span 
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "#97cadb" }}
                        ></span>
                        <span>Sự kiện đã qua</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarDefault;