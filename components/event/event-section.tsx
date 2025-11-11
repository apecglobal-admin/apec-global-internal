"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';

import { getTypeEvent, getListEvent, eventRegister, eventReminder } from "@/src/services/api";
import { formatDate } from "@/src/utils/formatDate";
import CalendarDefault from "./calendarDefault";
import { colorClasses, colorMap } from "@/src/utils/color";


type EventType = "internal" | "external" | "all";

const eventStats = [
  { value: "24", label: "Sự kiện 2025", subLabel: "Đã xác nhận lịch" },
  { value: "8", label: "Đang mở đăng ký", subLabel: "Nội bộ & đối ngoại" },
  { value: "640", label: "Người tham gia", subLabel: "Dự kiến cập nhật" },
  { value: "92%", label: "Tỷ lệ phản hồi", subLabel: "Sau sự kiện" },
];

const navEvent = [
  { label: "Tất cả", value: "all" },
  { label: "Nội bộ", value: "internal" },
  { label: "Đối ngoại", value: "external" },
];
const initialRemind: Record<string, boolean> = {};

export default function EventSection() {
  const dispatch = useDispatch();
  const { listEvent, typeEvent,  reminder} = useSelector((state: any) => state.event);

  const [activeType, setActiveType] = useState<EventType>("all");
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  // const [eventCalendar, setEventCalendar] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const [eventsToShow, setEventsToShow] = useState(5); // số event ban đầu hiển thị
const [visibleEvents, setVisibleEvents] = useState<any[]>([]);
  
  // Lấy dữ liệu sự kiện từ API
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        await dispatch(getListEvent(token) as any);
        await dispatch(getTypeEvent() as any);        
      }
    };
  
    fetchEvents();
  }, []);

  useEffect(() => {
    if(listEvent.data.calendar_events && listEvent.data.calendar_events.length !== 0){
      const mapped = listEvent.data.calendar_events.map((item: any) => ({
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

      mapped.forEach((e: any) => {
        initialRemind[e.id] = e.isRemind;
      });
      
      setReminders(initialRemind);
      setUpcomingEvents(mapped);      
    }
  }, [listEvent]);

  
  // Khi API trả dữ liệu -> format lại cho component

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Lọc sự kiện theo loại + ngày
  const filteredEvents = useMemo(() => {
    let events = upcomingEvents;

    if (activeType !== "all") {
      events = events.filter((event) => event.type === activeType);
    }

    if (selectedDate) {
      events = events.filter((event) => event.date === selectedDate);
    }

    return events;
  }, [activeType, upcomingEvents, selectedDate]);
  
  const toggleEventReminder = async (eventId: number) => {
    const token = localStorage.getItem("userToken");
    if(!token) return;
    
    try {
      const payload = {event_id: eventId, token}
  
      const res = await dispatch(eventReminder(payload) as any);
      console.log(res);
      
      
      if(reminder.payload.status === 200){
        dispatch(getListEvent(token) as any)
      }
      
    } catch (error) {
      
    }

    
  };

  const handleEventRegister = (id: number) => {
    const token = localStorage.getItem("userToken");
    if(!token) return;

    const payload = {event_id: id, token}
    console.log("formData", payload);
    
    dispatch(eventRegister(payload) as any);

  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gray-200 p-6 sm:p-7 lg:p-8">
      
      <div className="relative space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-blue-950 sm:text-sm">
            <Sparkles size={16} className="text-blue-950" /> Sự kiện
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-blue-950 sm:text-3xl">
              Lịch sự kiện nội bộ & đối ngoại
            </h2>
            <p className="max-w-3xl text-sm text-black/80">
              Theo dõi tiến độ tổ chức, đăng ký tham gia và thư viện media sau
              sự kiện. Bảng điều phối tập trung giúp đồng bộ thông tin giữa các
              phòng ban.
            </p>
          </div>

          {/* Thống kê */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {eventStats.map((stat, index) => {
              const colorClass = colorClasses[index % colorClasses.length];
              const borderColor = colorMap[colorClass] || "#FACC15";

              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-gray-400 border-l-6 bg-white p-5 shadow-inner shadow-black/10 transition"
                  style={{ borderLeftColor: borderColor }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`text-3xl font-bold ${colorClass}`}>
                        {stat.value}
                      </div>
                      <div
                        className={`mt-1 text-lg uppercase tracking-widest font-semibold ${colorClass}`}
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
        <div
          style={{ border: "1px solid rgb(152, 152, 152)" }}
          className="mt-8 rounded-3xl border border-slate-800 bg-gray-300 p-5 shadow-lg shadow-blue-500/10"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-black">
            Lọc theo loại sự kiện
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {navEvent.map((btn) => (
              <button
                key={btn.value}
                onClick={() => {
                  setActiveType(btn.value as EventType);
                  setSelectedDate(null);
                }}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
                  activeType === btn.value
                    ? "bg-active-blue-metallic"
                    : "border border-slate-400 text-slate-400 hover:border-teal-500 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Calendar */}
          <div className="space-y-4">
            <CalendarDefault
              events={upcomingEvents}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              allowNavigation={false}
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
          Sự kiện ngày {new Date(selectedDate).getDate()}/{currentMonth + 1}/{currentYear}
        </div>
        <button
          onClick={() => setSelectedDate(null)}
          className="text-xs text-blue-500 hover:text-white"
        >
          Xem tất cả
        </button>
      </div>
    </div>
  )}

  <div className="max-h-[600px] overflow-y-auto space-y-5">
    {filteredEvents.length === 0 ? (
      <div className="py-16 text-center">
        <Calendar size={48} className="mx-auto text-slate-600" />
        <p className="mt-4 text-black">Không có sự kiện trong ngày này</p>
      </div>
    ) : (
      filteredEvents.map((event) => (
        <div
          key={event.id}
          style={{ border: "2px solid rgb(127, 127, 127)" }}
          className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-gray-300 p-5 sm:p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
        >
          {/* Nội dung event */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-3 py-1 text-white">
                <Calendar size={14} /> {event.date}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-700/80 px-3 py-1 text-white">
                <Clock size={14} /> {event.time}
              </span>
              <span
                className={
                  event.type === "internal"
                    ? "flex items-center rounded-full border border-blue-400 bg-blue-700 px-3 py-1 gap-1 text-white"
                    : "flex items-center rounded-full border border-emerald-400 bg-emerald-700 px-3 py-1 gap-1 text-white"
                }
              >
                {event.type === "internal" ? "Nội bộ" : "Đối ngoại"}
              </span>
              {reminders[event.id] && (
                <span className="flex items-center gap-1 rounded-full border border-orange-400/50 bg-orange-400 px-3 py-1 text-white">
                  <BellRing size={14} /> Tự động nhắc
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-black">{event.title}</h3>
              <p className="text-sm text-black/70">{event.description}</p>
              {event.location && (
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/70">
                  <MapPin size={14} className="text-blue-700" /> Địa điểm: {event.location}
                </p>
              )}
            </div>
          </div>

          {/* Hành động */}
          <div className="flex w-full flex-wrap gap-3 text-sm text-slate-300">
            {!event.isSubmit && (
              <button
                onClick={() => handleEventRegister(event.id)}
                className="bg-active-blue-metallic flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500"
              >
                Đăng ký tham gia
              </button>
            )}

            {event.isSubmit && (
              <button className="flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500">
                Bạn đã đăng ký
              </button>
            )}

            <button
              onClick={() => toggleEventReminder(event.id)}
              className={`flex-1 rounded-full px-5 py-2 font-semibold uppercase tracking-widest transition ${
                reminders[event.id]
                  ? "bg-orange-500/70  text-white hover:bg-orange-500/30"
                  : "bg-gray-400/30 border border-gray-500 text-gray-500 hover:border-blue-500 hover:text-white"
              }`}
            >
              {reminders[event.id] ? "Hủy nhắc" : "Nhắc nhở"}
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
