"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BellRing, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
    getTypeEvent,
    getListEvent,
    eventRegister,
    eventReminder,
    getStatEvent,
} from "@/src/features/event/api/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDate, formatMonthYearVN } from "@/src/utils/formatDate";
import CalendarDefault from "./calendarDefault";
import { colorClasses, colorMap } from "@/src/utils/color";
import { useEventData } from "@/src/hooks/eventhook";
import { Spinner } from "../ui/spinner";
import SearchBar from "../searchBar";

const initialRemind: Record<string, boolean> = {};

export default function EventSection() {
    const dispatch = useDispatch();

    const {
        typeEvent,
        listEvent,
        stateEvent,
        isLoadingTypeEvent,
        isLoadingListEvent,
        isLoadingListTimeLine,
        isLoadingStateEvent,
    } = useEventData();

    const [activeType, setActiveType] = useState<Number | "all">("all");
    const [activeActionType, setActiveActionType] = useState<
        "all" | "reminder" | "submit" | "noReminder" | "noSubmit"
    >("all");
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [openEventTypeSelect, setOpenEventTypeSelect] = useState(false);
    const [openActionTypeSelect, setOpenActionTypeSelect] = useState(false);


    // Lấy dữ liệu sự kiện từ API
    useEffect(() => {
        const fetchEvents = async () => {

            await dispatch(getStatEvent() as any);
            await dispatch(getTypeEvent() as any);
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const event_type_id = activeType === "all" ? null : activeType;
    
        const payload: any = {
            token,
            search: searchQuery,
            event_type_id,
        };

        if (activeActionType !== "all") {
            if (activeActionType === "reminder") {
                payload.remind = true;
            } else if (activeActionType === "submit") {
                payload.submit = true;
            }
        }
    
        const fetchEvents = async () => {
            dispatch(getListEvent(payload) as any);
        };
    
        fetchEvents();
        
    }, [searchQuery, activeActionType, activeType]);

    // useEffect(() => {

    //     const mapped = listEvent.calendar_events.map((item: any) => ({
    //         ...item,
    //         date: item.date ? formatDate(item.date) : "",
    //         type:
    //             item.event_type?.name === "Nội bộ"
    //                 ? "internal"
    //                 : item.event_type?.name === "Đối ngoại"
    //                 ? "external"
    //                 : "all",
    //         location: item.address || "",
    //     }));

    //     mapped.forEach((e: any) => {
    //         initialRemind[e.id] = e.isRemind;
    //     });

    //     setReminders(initialRemind);
    //     setUpcomingEvents(mapped);
        
    // }, [listEvent]);


    // Lọc sự kiện theo loại + ngày
    const filteredEvents = useMemo(() => {
        let events = listEvent.calendar_events || [];
    
        if (selectedDate) {
            events = events.filter((event: any) => {
                const start = event.date;
                const end = event.end_date || event.date;
    
                return selectedDate >= start && selectedDate <= end;
            });
        }
    
        return events;
        }, [listEvent.calendar_events, selectedDate]);

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
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
            if (res.payload.status === 200 || res.payload.status === 201) {
                dispatch(getListEvent(payload) as any);
            } else {
                toast.warning(res.payload.data.message);
            }
        } catch (error) {}
    };

    const handleEventRegister = async (id: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.warning("bạn cần đăng nhập để thực hiện");
            return;
        }

        const payload = { event_id: id, token };
        const res = await dispatch(eventRegister(payload) as any);

        if (res.payload.status === 201 || res.payload.status === 200) {
            dispatch(getListEvent(payload) as any);
            toast.success(res.payload.data.message);
        } else {
            toast.error(res.payload.message);
        }
    };

    const handleChange = (value: string) => {
        setSearchQuery(value);
    };

    // if (isLoadingStateEvent) {
    //     return (
    //         <section
    //             style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
    //             className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
    //         >
    //             <Spinner text="đang tải dữ liệu" />
    //         </section>
    //     );
    // }
    
    return (
        <section
            style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
        >
            <div className="relative space-y-8">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        <Sparkles size={16} className="text-blue-950" /> Sự kiện
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-extrabold text-blue-main capitalize sm:text-3xl">
                            Lịch sự kiện nội bộ & đối ngoại
                        </h2>
                        <p className="max-w-3xl text-sm text-black/80">
                            Theo dõi tiến độ tổ chức, đăng ký tham gia và thư
                            viện media sau sự kiện. Bảng điều phối tập trung
                            giúp đồng bộ thông tin giữa các phòng ban.
                        </p>
                    </div>

                    {/* Thống kê */}
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        {stateEvent.map((stat: any, index: number) => {
                            const colorClass =
                                colorClasses[index % colorClasses.length];
                            const borderColor =
                                colorMap[colorClass] || "#FACC15";

                            return (
                                <div
                                    key={stat.label}
                                    className={`group rounded-2xl border-l-6 bg-white p-5 shadow-inner shadow-black/10 transition bg-blue-gradiant-main`}
                                    style={{
                                        borderLeftColor: borderColor,
                                        boxShadow:
                                            "0 0 10px rgba(0, 0, 0, 0.3)",
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
                                                className={`mt-1 text-lg uppercase   font-semibold ${colorClass}`}
                                            >
                                                {stat.label}
                                            </div>
                                            <div className="text-[11px] text-black">
                                                {stat.subLabel}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="mt-8 rounded-3xl bg-blue-gradiant-main bg-box-shadow p-5 shadow-lg shadow-blue-500/10">
                    <div className="text-xs font-semibold uppercase text-black mb-3">
                        Lọc theo loại sự kiện
                    </div>

                    {/* Search Bar - Hàng đầu tiên */}
                    <div className="mb-3">
                        <SearchBar
                            placeholder="Tìm kiếm theo sự kiện..."
                            onChange={handleChange}
                        />
                    </div>

                    {/* Các Select - Hàng thứ hai */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Select Loại sự kiện */}
                        <div
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 bg-box-shadow-inset transition-all hover:shadow-md cursor-pointer w-full sm:w-72"
                            onClick={() => setOpenEventTypeSelect(true)}
                        >
                            <svg
                                className="h-5 w-5 text-indigo-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>

                            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Loại sự kiện
                                </label>
                                <Select
                                    value={
                                        activeType === "all"
                                            ? "all"
                                            : String(activeType)
                                    }
                                    onValueChange={(value) => {
                                        setActiveType(
                                            value === "all"
                                                ? "all"
                                                : Number(value)
                                        );
                                        setOpenEventTypeSelect(false);
                                    }}
                                    open={openEventTypeSelect}
                                    onOpenChange={setOpenEventTypeSelect}
                                >
                                    <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                        <SelectValue placeholder="Chọn loại sự kiện" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white shadow-xl">
                                        <SelectItem
                                            value="all"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                <span className="capitalize">
                                                    Tất cả sự kiện
                                                </span>
                                            </div>
                                        </SelectItem>

                                        {typeEvent.map((item: any) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                                className="cursor-pointer text-black"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                    <span>{item.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Select Action Type */}
                        <div
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 bg-box-shadow-inset transition-all hover:shadow-md cursor-pointer w-full sm:w-72"
                            onClick={() => setOpenActionTypeSelect(true)}
                        >
                            <svg
                                className="h-5 w-5 text-emerald-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Trạng thái
                                </label>
                                <Select
                                    value={activeActionType}
                                    onValueChange={(
                                        value:
                                            | "all"
                                            | "reminder"
                                            | "submit"
                                            | "noReminder"
                                            | "noSubmit"
                                    ) => {
                                        setActiveActionType(value);
                                        setOpenActionTypeSelect(false);
                                    }}
                                    open={openActionTypeSelect}
                                    onOpenChange={setOpenActionTypeSelect}
                                >
                                    <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-emerald-600">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white shadow-xl">
                                        <SelectItem
                                            value="all"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                                                <span>Tất cả</span>
                                            </div>
                                        </SelectItem>

                                        <SelectItem
                                            value="reminder"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                                <span>Có nhắc nhở</span>
                                            </div>
                                        </SelectItem>

                                        <SelectItem
                                            value="submit"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                <span>Có đăng ký</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
                {(activeType !== "all" || activeActionType !== "all")  && (
                    <div 
                    onClick={() => {
                        setSelectedDate(null);
                        setActiveType("all");
                        setActiveActionType("all")
                    }}
                    className="mt-8 rounded-2xl border border-blue-500/50 bg-blue-500/10 p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="text-xs sm:text-sm font-semibold text-blue-500">
                                Đặt lại bộ lọc
                            </div>
                            <div
                                className="text-xs text-blue-500 hover:text-black/30 whitespace-nowrap"
                            >
                                Xem tất cả
                            </div>
                        </div>
                    </div>

                )}
                <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                    {/* Calendar */}
                    <div className="space-y-4 py-3">
                        <CalendarDefault
                            events={listEvent.calendar_events || []}
                            eventTypes={typeEvent}
                            selectedDate={selectedDate}
                            onDateSelect={handleSelectDate}
                            allowNavigation={false}
                            initialDate={new Date()}
                            showLegend={true}
                            // reminders={reminders}
                        />
                    </div>

                    {/* Danh sách sự kiện */}
                    <div className="space-y-5">
                        {selectedDate && (
                            <div className="mt-4 rounded-2xl border border-blue-500/50 bg-blue-500/10 p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div className="text-xs sm:text-sm font-semibold text-blue-500">
                                        Sự kiện ngày {selectedDate}
                                        {/* {now.current.month + 1}/{now.current.year} */}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedDate(null);
                                            setActiveType("all");
                                        }}
                                        className="text-xs text-blue-500 hover:text-black/30 whitespace-nowrap"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="max-h-[600px] px-2 sm:px-5 py-3 overflow-y-auto space-y-4 sm:space-y-5">
                            {filteredEvents.length === 0 ? (
                                <div className="py-12 sm:py-16 text-center">
                                    <Calendar
                                        size={48}
                                        className="mx-auto text-slate-600"
                                    />
                                    <p className="mt-4 text-sm sm:text-base text-black">
                                        Không có sự kiện trong ngày này
                                    </p>
                                </div>
                            ) : (
                                filteredEvents.map((event: any) => (
                                    <div
                                        key={event.id}
                                        className="flex flex-col gap-4 sm:gap-6 rounded-3xl bg-box-shadow p-4 sm:p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
                                    >
                                        {/* Nội dung event */}
                                        <div className="space-y-3 sm:space-y-4">
                                            {/* Tags - Responsive */}
                                            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] uppercase">
                                                <span className="flex items-center gap-1 sm:gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-2 sm:px-3 py-1 text-white">
                                                    <Calendar
                                                        size={12}
                                                        className="sm:w-[14px] sm:h-[14px]"
                                                    />
                                                    <span className="hidden sm:inline">
                                                        {event.date}  {event.end_date && event.end_date !== event.date && ` - ${event.end_date}`}
                                                    </span>
                                                    <span className="sm:hidden">
                                                        {new Date(
                                                            event.date
                                                        ).getDate()}
                                                        /
                                                        {new Date(
                                                            event.date
                                                        ).getMonth() + 1}
                                                    </span>
                                                </span>
                                                <span className="flex items-center gap-1 sm:gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-2 sm:px-3 py-1 text-white">
                                                    <Clock
                                                        size={12}
                                                        className="sm:w-[14px] sm:h-[14px]"
                                                    />
                                                    {event.time}  {event.end_time && ` - ${event.end_time}`}
                                                </span>
                                                <span
                                                    className={
                                                        event.event_type
                                                            ?.name === "Nội bộ"
                                                            ? "flex items-center rounded-full border border-blue-400 bg-blue-700 px-2 sm:px-3 py-1 gap-1 text-white"
                                                            : "flex items-center rounded-full border border-emerald-400 bg-emerald-700 px-2 sm:px-3 py-1 gap-1 text-white"
                                                    }
                                                >
                                                    {event.event_type?.name ||
                                                        "Khác"}
                                                </span>
                                                {event.isRemind && (
                                                    <span className="flex items-center gap-1 rounded-full border border-orange-400/50 bg-orange-400 px-2 sm:px-3 py-1 text-white">
                                                        <BellRing
                                                            size={12}
                                                            className="sm:w-[14px] sm:h-[14px]"
                                                        />
                                                        <span className="hidden sm:inline">
                                                            Tự động nhắc
                                                        </span>
                                                        <span className="sm:hidden">
                                                            Nhắc
                                                        </span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <h3 className="text-lg sm:text-xl font-semibold text-black line-clamp-2">
                                                    {event.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-black/70 line-clamp-3">
                                                    {event.description}
                                                </p>
                                                {event.address && (
                                                    <p className="flex items-start sm:items-center gap-2 text-xs uppercase text-black/70">
                                                        <MapPin
                                                            size={14}
                                                            className="text-blue-700 flex-shrink-0 mt-0.5 sm:mt-0"
                                                        />
                                                        <span className="line-clamp-2">
                                                            Địa điểm:{" "}
                                                            {event.address}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hành động - Responsive */}
                                        <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
                                            {!event.isSubmit && (
                                                <button
                                                    onClick={() =>
                                                        handleEventRegister(
                                                            event.id
                                                        )
                                                    }
                                                    className="bg-active-blue-metallic w-full sm:flex-1 rounded-full bg-blue-600 px-4 sm:px-5 py-2.5 sm:py-2 font-semibold uppercase text-white transition hover:bg-blue-500"
                                                >
                                                    Đăng ký tham gia
                                                </button>
                                            )}

                                            {event.isSubmit && (
                                                <button className="w-full sm:flex-1 rounded-full bg-blue-600 px-4 sm:px-5 py-2.5 sm:py-2 font-semibold uppercase text-white transition hover:bg-blue-500">
                                                    Bạn đã đăng ký
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    toggleEventReminder(
                                                        event.id
                                                    )
                                                }
                                                className={`w-full sm:flex-1 rounded-full px-4 sm:px-5 py-2.5 sm:py-2 font-semibold uppercase transition ${
                                                    event.isRemind
                                                        ? "bg-orange-500/70 text-white hover:bg-orange-500/30"
                                                        : "bg-gray-400/30 border border-gray-500 text-gray-500 hover:border-blue-500 hover:text-black/30"
                                                }`}
                                            >
                                                {event.isRemind
                                                    ? "Hủy nhắc"
                                                    : "Nhắc nhở"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
