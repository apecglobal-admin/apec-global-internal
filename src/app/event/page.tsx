"use client";

import { useState, useMemo } from "react";
import {
    BellRing,
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import { colorClasses, colorMap } from "@/src/utils/color";

const eventStats = [
    { value: "24", label: "Sự kiện 2025", subLabel: "Đã xác nhận lịch" },
    { value: "8", label: "Đang mở đăng ký", subLabel: "Nội bộ & đối ngoại" },
    { value: "640", label: "Người tham gia", subLabel: "Dự kiến cập nhật" },
    { value: "92%", label: "Tỷ lệ phản hồi", subLabel: "Sau sự kiện" },
];

const allEvents = [
    {
        id: 1,
        name: "Đào tạo lãnh đạo trẻ",
        date: "2025-11-05",
        time: "08:30",
        type: "internal",
        location: "Phòng Innovation Lab",
        description: "Chương trình coaching dành cho 40 quản lý tiềm năng",
        reminder: true,
    },
    {
        id: 2,
        name: "ApecGlobal Innovation Summit",
        date: "2025-11-15",
        time: "13:00",
        type: "external",
        location: "Apec Tower",
        description:
            "Sự kiện ra mắt giải pháp công nghệ và ký kết đối tác chiến lược",
        reminder: true,
    },
    {
        id: 3,
        name: "Team Building Khối Công nghệ",
        date: "2025-11-22",
        time: "07:30",
        type: "internal",
        location: "Khu du lịch Đại Lải",
        description: "Hoạt động gắn kết và cập nhật chiến lược sản phẩm 2026",
        reminder: false,
    },
    {
        id: 4,
        name: "Hội nghị Ban lãnh đạo Q4",
        date: "2025-12-10",
        time: "09:00",
        type: "internal",
        location: "Phòng họp Tầng 15",
        description: "Tổng kết năm 2025 và định hướng chiến lược 2026",
        reminder: true,
    },
    {
        id: 5,
        name: "Apec Year End Party",
        date: "2025-12-28",
        time: "18:00",
        type: "internal",
        location: "Grand Ballroom, JW Marriott",
        description: "Tiệc tất niên và trao giải thưởng xuất sắc năm 2025",
        reminder: true,
    },
    {
        id: 6,
        name: "Workshop AI & Automation",
        date: "2025-10-18",
        time: "14:00",
        type: "internal",
        location: "Online - Zoom",
        description: "Chia sẻ kinh nghiệm triển khai AI trong doanh nghiệp",
        reminder: false,
    },
];

const pastEvents = [
    {
        id: 101,
        name: "Triển lãm GuardCam AI 5.0",
        date: "2025-10-12",
        type: "external",
        mediaLink: "#",
    },
    {
        id: 102,
        name: "Apec Space Product Day",
        date: "2025-09-28",
        type: "internal",
        mediaLink: "#",
    },
];

const timelineHighlights = [
    {
        title: "Innovation Summit",
        timeframe: "15-16/11",
        status: "Đang chuẩn bị",
        variant: "text-emerald-300",
    },
    {
        title: "Chuỗi đào tạo lãnh đạo",
        timeframe: "Tuần 1-3/11",
        status: "Đang triển khai",
        variant: "text-blue-300",
    },
    {
        title: "Team Building Tech",
        timeframe: "22/11",
        status: "Sắp diễn ra",
        variant: "text-orange-300",
    },
];

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

type EventType = "internal" | "external" | "all";

export default function EventsPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
    const [activeType, setActiveType] = useState<EventType>("all");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [reminders, setReminders] = useState<Record<number, boolean>>(() => {
        // Khởi tạo trạng thái reminder từ dữ liệu ban đầu
        const initial: Record<number, boolean> = {};
        allEvents.forEach((event) => {
            initial[event.id] = event.reminder;
        });
        return initial;
    });

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Toggle reminder cho một sự kiện
    const toggleReminder = (eventId: number) => {
        setReminders((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    // Kiểm tra xem sự kiện có reminder không
    const hasReminder = (eventId: number) => {
        return reminders[eventId] || false;
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedDate(null);
    };

    const getCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Empty cells before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const eventsMap = useMemo(() => {
        const map: Record<string, typeof allEvents> = {};
        allEvents.forEach((event) => {
            const dateKey = event.date;
            if (!map[dateKey]) {
                map[dateKey] = [];
            }
            map[dateKey].push(event);
        });
        return map;
    }, []);

    const getEventsForDate = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;
        return eventsMap[dateStr] || [];
    };

    const filteredEvents = useMemo(() => {
        const monthEvents = allEvents.filter((event) => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        });

        if (selectedDate) {
            return monthEvents.filter((e) => e.date === selectedDate);
        }

        if (activeType === "all") return monthEvents;
        return monthEvents.filter((event) => event.type === activeType);
    }, [currentMonth, currentYear, activeType, selectedDate]);

    const calendarDays = getCalendarDays();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">
                        <Sparkles size={16} className="text-blue-300" />
                        Sự kiện
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Lịch sự kiện nội bộ & đối ngoại
                        </h1>
                        <p className="max-w-3xl text-sm text-slate-400 sm:text-base">
                            Theo dõi tiến độ tổ chức, đăng ký tham gia và thư
                            viện media sau sự kiện. Bảng điều phối tập trung
                            giúp đồng bộ thông tin giữa các phòng ban.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {eventStats.map((stat, index) => {
                        const colorClass =
                            colorClasses[index % colorClasses.length];
                        const borderColor = colorMap[colorClass] || "#FACC15";

                        return (
                            <div
                                key={stat.label}
                                className="group rounded-2xl border border-slate-700/80 border-l-4 bg-slate-900/60 p-5 shadow-inner shadow-black/10 transition"
                                style={{
                                    borderLeftColor: borderColor,
                                    boxShadow: `inset 0 0 10px rgba(0,0,0,0.1)`,
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 20px ${borderColor}40`)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = `inset 0 0 10px rgba(0,0,0,0.1)`)
                                }
                            >
                                <div
                                    className={`text-3xl font-bold ${colorClass}`}
                                >
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-lg uppercase tracking-widest text-white font-semibold">
                                    {stat.label}
                                </div>
                                <div className="text-[11px] text-slate-300">
                                    {stat.subLabel}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-blue-500/10">
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Lọc theo loại sự kiện
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <button
                            onClick={() => {
                                setActiveType("all");
                                setSelectedDate(null);
                            }}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                                activeType === "all"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => {
                                setActiveType("internal");
                                setSelectedDate(null);
                            }}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                                activeType === "internal"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                            }`}
                        >
                            Nội bộ
                        </button>
                        <button
                            onClick={() => {
                                setActiveType("external");
                                setSelectedDate(null);
                            }}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                                activeType === "external"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                            }`}
                        >
                            Đối ngoại
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                    {/* Calendar Section */}
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={goToPreviousMonth}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-white">
                                        {MONTHS[currentMonth]}
                                    </div>
                                    <div className="text-sm text-blue-300">
                                        {currentYear}
                                    </div>
                                </div>
                                <button
                                    onClick={goToNextMonth}
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Weekday Headers */}
                            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
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

                                    const events = getEventsForDate(day);
                                    const hasInternal = events.some(
                                        (e) => e.type === "internal"
                                    );
                                    const hasExternal = events.some(
                                        (e) => e.type === "external"
                                    );
                                    const hasReminderActive = events.some((e) =>
                                        hasReminder(e.id)
                                    );
                                    const dateStr = `${currentYear}-${String(
                                        currentMonth + 1
                                    ).padStart(2, "0")}-${String(day).padStart(
                                        2,
                                        "0"
                                    )}`;
                                    const isSelected = selectedDate === dateStr;

                                    let bgClass =
                                        "bg-slate-900/50 text-slate-400";
                                    if (hasInternal && hasExternal) {
                                        bgClass =
                                            "bg-gradient-to-br from-blue-500/30 to-emerald-500/30 text-white border-blue-400";
                                    } else if (hasInternal) {
                                        bgClass =
                                            "bg-blue-500/20 text-blue-100 border-blue-500";
                                    } else if (hasExternal) {
                                        bgClass =
                                            "bg-emerald-500/20 text-emerald-100 border-emerald-500";
                                    }

                                    return (
                                        <button
                                            key={day}
                                            onClick={() =>
                                                setSelectedDate(dateStr)
                                            }
                                            className={`relative aspect-square rounded-lg border transition hover:scale-105 ${bgClass} ${
                                                isSelected
                                                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900"
                                                    : "border-transparent"
                                            } ${
                                                events.length > 0
                                                    ? "cursor-pointer"
                                                    : "cursor-default"
                                            }`}
                                        >
                                            <span className="text-sm font-medium">
                                                {day}
                                            </span>
                                            {hasReminderActive && (
                                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
                                            )}
                                            {events.length > 1 && (
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">
                                                    {events.length}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 space-y-2 text-xs text-white">
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
                        </div>

                        {/* Quick Action */}
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-400 shadow-lg shadow-blue-500/10">
                            <div className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                                Gợi ý điều phối
                            </div>
                            <p className="mt-2 leading-relaxed">
                                Kết hợp bộ lọc với calendar để kiểm tra công tác
                                chuẩn bị, gửi thư mời và cập nhật media ngay sau
                                sự kiện.
                            </p>
                            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-blue-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-200 transition hover:border-blue-500 hover:text-white">
                                <BellRing size={14} />
                                Tạo nhắc nhở mới
                            </button>
                        </div>
                    </div>

                    {/* Events List Section */}
                    <div className="space-y-4">
                        {selectedDate && (
                            <div className="rounded-2xl border border-blue-500/50 bg-blue-500/10 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-blue-200">
                                        Sự kiện ngày{" "}
                                        {new Date(selectedDate).getDate()}/
                                        {currentMonth + 1}/{currentYear}
                                    </div>
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="text-xs text-blue-300 hover:text-white"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
                            </div>
                        )}

                        {filteredEvents.length === 0 ? (
                            <div className="py-16 text-center">
                                <Calendar
                                    size={48}
                                    className="mx-auto text-slate-600"
                                />
                                <p className="mt-4 text-slate-400">
                                    Không có sự kiện trong ngày này
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 sm:p-6"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
                                                <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">
                                                    <Calendar size={14} />
                                                    {new Date(
                                                        event.date
                                                    ).getDate()}
                                                    /
                                                    {new Date(
                                                        event.date
                                                    ).getMonth() + 1}
                                                </span>
                                                <span className="flex items-center gap-1 text-slate-300">
                                                    <Clock size={14} />
                                                    {event.time}
                                                </span>
                                                <span
                                                    className={`rounded-full px-3 py-1 ${
                                                        event.type ===
                                                        "internal"
                                                            ? "bg-blue-500/20 text-blue-300"
                                                            : "bg-emerald-500/20 text-emerald-300"
                                                    }`}
                                                >
                                                    {event.type === "internal"
                                                        ? "Nội bộ"
                                                        : "Đối ngoại"}
                                                </span>
                                                {hasReminder(event.id) && (
                                                    <span className="flex items-center gap-1 rounded-full border border-orange-400/50 bg-orange-500/10 px-3 py-1 text-orange-300">
                                                        <BellRing
                                                            size={14}
                                                            className="animate-pulse"
                                                        />
                                                        Đã bật
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-xl font-semibold text-white">
                                                    {event.name}
                                                </h3>
                                                <p className="text-sm text-slate-300">
                                                    {event.description}
                                                </p>
                                                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                                                    <MapPin
                                                        size={14}
                                                        className="text-blue-300"
                                                    />
                                                    {event.location}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <button className="flex-1 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500">
                                                    Đăng ký tham gia
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        toggleReminder(event.id)
                                                    }
                                                    className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition ${
                                                        hasReminder(event.id)
                                                            ? "border-orange-500 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30"
                                                            : "border-slate-700 bg-slate-800/50 text-blue-300 hover:border-blue-500 hover:bg-slate-800 hover:text-white"
                                                    }`}
                                                >
                                                    <BellRing
                                                        size={16}
                                                        className={
                                                            hasReminder(
                                                                event.id
                                                            )
                                                                ? "animate-pulse"
                                                                : ""
                                                        }
                                                    />
                                                    {hasReminder(event.id)
                                                        ? "Tắt nhắc nhở"
                                                        : "Bật nhắc nhở"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Timeline Highlights */}
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300 sm:text-sm">
                                Điểm nhấn timeline
                            </div>
                            <div className="mt-4 space-y-3">
                                {timelineHighlights.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-white">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs uppercase tracking-widest text-slate-400">
                                                    {item.timeframe}
                                                </div>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold uppercase tracking-widest ${item.variant}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Past Events */}
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">
                                Thư viện sự kiện
                            </div>
                            <div className="mt-4 space-y-2">
                                {pastEvents.map((event) => (
                                    <a
                                        key={event.id}
                                        href={event.mediaLink}
                                        className="flex items-center justify-between gap-2 rounded-2xl border border-transparent bg-slate-950/60 px-4 py-3 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-950/80 hover:text-white"
                                    >
                                        <span>{event.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-widest text-slate-500">
                                                {event.date}
                                            </span>
                                            <ExternalLink size={14} />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
