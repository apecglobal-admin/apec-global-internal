"use client";

import { useState, useMemo, useEffect } from "react";
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
import CalendarDefault from "@/components/event/calendarDefault";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    eventRegister,
    eventReminder,
    getListEvent,
    getListTimeLine,
    getStatEvent,
    getTypeEvent,
} from "@/src/features/event/api/api";

import { formatDate, formatMonthYearVN } from "@/src/utils/formatDate";
import { useEventData } from "@/src/hooks/eventhook";


export default function EventsPage() {
    const dispatch = useDispatch();

    const { typeEvent, listEvent, listTimeLine, stateEvent } = useEventData();
    
    const [activeType, setActiveType] = useState<Number | "all">("all");
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date()); // November 2025
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [reminders, setReminders] = useState<Record<string, boolean>>({});

    const [visibleMonth, setVisibleMonth] = useState<string | null>(
        formatMonthYearVN(new Date())
    );

    // Lấy dữ liệu sự kiện từ API

    useEffect(() => {
        const fetchTypes = async () => {
            await dispatch(getStatEvent() as any);
            await dispatch(getTypeEvent() as any);
            await dispatch(getListTimeLine() as any);
        };
        fetchTypes();
    }, []);
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("userToken");
            const payload = {
                token,
                date: visibleMonth,
            };
            await dispatch(getListEvent(payload) as any);
            // if (token) {
            // }
        };

        fetchEvents();
    }, [visibleMonth]);

    useEffect(() => {
        const events = listEvent.calendar_events || [];

        const mapped = events.map((item: any) => ({
            ...item,
            date: item.date ? formatDate(item.date) : "",
            type:
                item.event_type?.name === "Nội bộ"
                    ? "internal"
                    : item.event_type?.name === "Đối ngoại"
                    ? "external"
                    : "all",
            location: item.address || "",
        }));

        const newRemind: Record<string, boolean> = {};
        mapped.forEach((e: any) => {
            newRemind[e.id] = e.isRemind;
        });

        setReminders(newRemind);
        setUpcomingEvents(mapped);
    }, [listEvent]);

    // Lọc sự kiện theo loại + ngày
    const filteredEvents = useMemo(() => {
        let events = upcomingEvents;

        if (activeType !== "all") {
            events = events.filter((event) => event.event_type.id === activeType);
        }

        if (selectedDate) {
            events = events.filter((event) => event.date === selectedDate);
        }

        return events;
    }, [activeType, upcomingEvents, selectedDate]);

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
        setActiveType("all");
    }

    const handleMonthChange = async (date: Date) => {
        const format = formatMonthYearVN(date);
        setVisibleMonth(format);
        setSelectedDate(null);
        setActiveType("all");

    };

    const toggleEventReminder = async (eventId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.warning("bạn cần đăng nhập để thực hiện");
            return;
        }

        try {
            const payload = { event_id: eventId, token };

            const res = await dispatch(eventReminder(payload) as any);
            if (res.payload.status === 200) {
                dispatch(getListEvent(payload) as any);
            } else {
                toast.warning(res.payload.data.message);
            }
        } catch (error) {}
    };

    const handleEventRegister = async (id: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        const payload = { event_id: id, token };
        const res = await dispatch(eventRegister(payload) as any);

        if (res.payload.status === 201) {
            dispatch(getListEvent(payload) as any);
        }
    };
    
    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        <Sparkles size={16} className="text-blue-950" />
                        Sự kiện
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-blue-main capitallize sm:text-4xl lg:text-5xl">
                            Lịch sự kiện nội bộ & đối ngoại
                        </h1>
                        <p className="max-w-3xl text-sm text-black sm:text-base">
                            Theo dõi tiến độ tổ chức, đăng ký tham gia và thư
                            viện media sau sự kiện. Bảng điều phối tập trung
                            giúp đồng bộ thông tin giữa các phòng ban.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stateEvent.map((stat: any, index: number) => {
                        const colorClass =
                            colorClasses[index % colorClasses.length];
                        const borderColor = colorMap[colorClass] || "#FACC15";

                        return (
                            <div
                                key={stat.label}
                                className="group rounded-2xl bg-blue-gradiant-main border-l-6 bg-white p-5 shadow-inner shadow-black/10  transition"
                                style={{
                                    borderLeftColor: borderColor,
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 20px ${borderColor}80`)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 10px rgba(0, 0, 0, 0.3)`)
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div
                                            className={`text-3xl font-bold ${colorClass}`}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            className={`mt-1 text-lg uppercase  font-semibold ${colorClass}`}
                                        >
                                            {stat.label}
                                        </div>
                                        <div className="text-sm text-black">
                                            {stat.subLabel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bộ lọc */}
                <div className="mt-8 rounded-3xl bg-blue-gradiant-main bg-box-shadow p-5 shadow-lg shadow-blue-500/10">
                    <div className="text-xs font-semibold uppercase  text-black">
                        Lọc theo loại sự kiện
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <button
                            onClick={() => {
                                setActiveType("all");
                                // setSelectedDate(null);
                            }}
                            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase  transition ${
                                activeType === "all"
                                    ? "bg-active-blue-metallic"
                                    : "border border-slate-400 bg-white text-slate-400 hover:border-teal-500 "
                            }`}
                        >
                            all
                        </button>
                        {typeEvent.map((btn: any) => (
                            <button
                                key={btn.id}
                                onClick={() => {
                                    setActiveType(Number(btn.id));
                                    // setSelectedDate(null);
                                }}
                                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase  transition ${
                                    activeType === Number(btn.id)
                                        ? "bg-active-blue-metallic"
                                        : "border border-slate-400 bg-white text-slate-400 hover:border-teal-500 "
                                }`}
                            >
                                {btn.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] mt-7">
                    {/* Calendar */}
                    <div className="space-y-4 py-3">
                        <CalendarDefault
                            events={upcomingEvents}
                            selectedDate={selectedDate}
                            onDateSelect={handleSelectDate}
                            onMonthChange={handleMonthChange}
                            allowNavigation={true}
                            initialDate={new Date()}
                            showLegend={true}
                            reminders={reminders}
                        />
                    </div>

                    {/* Danh sách sự kiện */}
                    <div className="space-y-5">
                        {selectedDate && (
                            <div className="rounded-2xl border border-blue-500/50 bg-blue-500/10 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-blue-500">
                                        Sự kiện ngày{" "}
                                        {new Date(selectedDate).getDate()}/
                                        {visibleMonth}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedDate(null)
                                            setActiveType("all")
                                        }}
                                        className="text-xs text-blue-500 hover:text-white"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="max-h-[600px] px-5 py-3 overflow-y-auto space-y-5 my-4">
                            {filteredEvents.length === 0 ? (
                                <div className="py-16 text-center">
                                    <Calendar
                                        size={48}
                                        className="mx-auto text-slate-600"
                                    />
                                    <p className="mt-4 text-black">
                                        Không có sự kiện trong ngày này
                                    </p>
                                </div>
                            ) : (
                                filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex flex-col gap-6 rounded-3xl  bg-box-shadow  sm:p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
                                    >
                                        {/* Nội dung event */}
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase ">
                                                <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-3 py-1 text-white">
                                                    <Calendar size={14} />{" "}
                                                    {event.date}
                                                </span>
                                                <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-3 py-1 text-white">
                                                    <Clock size={14} />{" "}
                                                    {event.time}
                                                </span>
                                                <span
                                                    className={
                                                        event.type ===
                                                        "internal"
                                                            ? "flex items-center rounded-full border border-blue-400 bg-blue-700 px-3 py-1 gap-1 text-white"
                                                            : "flex items-center rounded-full border border-emerald-400 bg-emerald-700 px-3 py-1 gap-1 text-white"
                                                    }
                                                >
                                                    {event.type === "internal"
                                                        ? "Nội bộ"
                                                        : "Đối ngoại"}
                                                </span>
                                                {reminders[event.id] && (
                                                    <span className="flex items-center gap-1 rounded-full border border-orange-400/50 bg-orange-400 px-3 py-1 text-white">
                                                        <BellRing size={14} />{" "}
                                                        Tự động nhắc
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-xl font-semibold text-black">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-black/70">
                                                    {event.description}
                                                </p>
                                                {event.location && (
                                                    <p className="flex items-center gap-2 text-xs uppercase  text-black/70">
                                                        <MapPin
                                                            size={14}
                                                            className="text-blue-700"
                                                        />{" "}
                                                        Địa điểm:{" "}
                                                        {event.location}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hành động */}
                                        <div className="flex w-full flex-wrap gap-3 text-sm text-slate-300">
                                            {!event.isSubmit && (
                                                <button
                                                    onClick={() =>
                                                        handleEventRegister(
                                                            event.id
                                                        )
                                                    }
                                                    className="bg-active-blue-metallic flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase  text-white transition hover:bg-blue-500"
                                                >
                                                    Đăng ký tham gia
                                                </button>
                                            )}

                                            {event.isSubmit && (
                                                <button className="flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase  text-white transition hover:bg-blue-500">
                                                    Bạn đã đăng ký
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    toggleEventReminder(
                                                        event.id
                                                    )
                                                }
                                                className={`flex-1 rounded-full px-5 py-2 font-semibold uppercase  transition ${
                                                    reminders[event.id]
                                                        ? "bg-orange-500/70  text-white hover:bg-orange-500/30"
                                                        : "bg-gray-400/30 border border-gray-500 text-gray-500 hover:border-blue-500 hover:text-white"
                                                }`}
                                            >
                                                {reminders[event.id]
                                                    ? "Hủy nhắc"
                                                    : "Nhắc nhở"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Timeline Highlights */}
                        <div className="rounded-3xl bg-box-shadow bg-blue-gradiant-main p-5 sm:p-6">
                            <div className="text-xs font-extrabold uppercase  text-blue-700 sm:text-sm">
                                Điểm nhấn timeline
                            </div>

                            <div className="mt-4 space-y-3">
                                {listTimeLine ? (
                                    Object.entries(listTimeLine).map(
                                        ([key, item]: any) => {                                            
                                            if (!item) return null;
                                            const statusMap: Record<
                                                string,
                                                {
                                                    label: string;
                                                    variant: string;
                                                }
                                            > = {
                                                ongoing: {
                                                    label: "Đang diễn ra",
                                                    variant: "text-emerald-600",
                                                },
                                                upcoming_soon: {
                                                    label: "Sắp diễn ra",
                                                    variant: "text-orange-500",
                                                },
                                                upcoming: {
                                                    label: "Sắp tới",
                                                    variant: "text-blue-700",
                                                },
                                            };

                                            const statusInfo = statusMap[
                                                key
                                            ] || {
                                                label: key,
                                                variant: "text-gray-500",
                                            };

                                            return (
                                                <div
                                                    key={item.id || key}
                                                    className="rounded-2xl bg-box-shadow-inset bg-white py-5 px-4"
                                                >
                                                    <div className="flex items-center justify-between gap-">
                                                        <div className="">
                                                            <div className="text-lg font-semibold text-black">
                                                                {item.title}
                                                            </div>
                                                            <div className="text-xs uppercase  text-black/80">
                                                                {item.date} -{" "}
                                                                {item.time}
                                                            </div>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold uppercase  ${statusInfo.variant}`}
                                                        >
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    {/* {item.description && (
                                                        <p className="mt-2 text-xs text-black/70">
                                                            {item.description}
                                                        </p>
                                                    )} */}
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <p className="text-sm text-black/60">
                                        Không có dữ liệu timeline
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Past Events */}
                        {/* <div className="rounded-3xl border border-slate-500 bg-[#e5f8ff] p-5 sm:p-6">
                            <div className="text-xs font-extrabold uppercase  text-blue-700 sm:text-sm">
                                Thư viện sự kiện
                            </div>
                            <div className="mt-4 space-y-2">
                                {pastEvents.map((event) => (
                                    <a
                                        key={event.id}
                                        href={event.mediaLink}
                                        className="flex items-center justify-between gap-2 rounded-2xl font-semibold border border-gray-400 bg-white px-4 py-3 text-sm text-slate-300 transition hover:border-black hover:bg-gray-300 hover:text-white"
                                    >
                                        <span className="text-black">
                                            {event.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase  text-black">
                                                {event.date}
                                            </span>
                                            <ExternalLink
                                                size={14}
                                                className="text-black"
                                            />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
