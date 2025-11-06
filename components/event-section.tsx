"use client"

import { useMemo, useState, useEffect } from "react"
import { BellRing, Calendar, Clock, MapPin, Sparkles } from "lucide-react"

type EventType = "internal" | "external" | "all"

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

const initialUpcomingEvents = [
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
    description: "Sự kiện ra mắt giải pháp công nghệ và ký kết đối tác chiến lược",
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
]

const pastEvents = [
  { id: 101, name: "Triển lãm GuardCam AI 5.0", date: "2025-10-12", type: "external", mediaLink: "#" },
  { id: 102, name: "Apec Space Product Day", date: "2025-09-28", type: "internal", mediaLink: "#" },
]

const eventStats = [
  { value: "24", label: "Sự kiện 2025", subLabel: "Đã xác nhận lịch" },
  { value: "8", label: "Đang mở đăng ký", subLabel: "Nội bộ & đối ngoại" },
  { value: "640", label: "Người tham gia", subLabel: "Dự kiến cập nhật" },
  { value: "92%", label: "Tỷ lệ phản hồi", subLabel: "Sau sự kiện" },
]

const timelineHighlights = [
  { title: "Innovation Summit", timeframe: "15-16/11", status: "Đang chuẩn bị", variant: "text-emerald-300" },
  { title: "Chuỗi đào tạo lãnh đạo", timeframe: "Tuần 1-3/11", status: "Đang triển khai", variant: "text-blue-300" },
  { title: "Team Building Tech", timeframe: "22/11", status: "Sắp diễn ra", variant: "text-orange-300" },
]

export default function EventSection() {
  const [activeType, setActiveType] = useState<EventType>("all")
  const [upcomingEvents, setUpcomingEvents] = useState(initialUpcomingEvents)
  const [highlightedDates, setHighlightedDates] = useState<Record<string, { type: EventType; reminder: boolean }>>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Lấy tháng và năm hiện tại
  const now = new Date()
  const currentMonth = now.getMonth() // 0-indexed
  const currentYear = now.getFullYear()
  
  // Tính toán calendar với các ô trống
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const days = []

    // Thêm các ô trống trước ngày đầu tiên của tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const calendarDays = getCalendarDays()

  // Cập nhật highlight khi sự kiện thay đổi
  useEffect(() => {
    const newHighlights = upcomingEvents.reduce<Record<string, { type: EventType; reminder: boolean }>>(
      (acc, event) => {
        const [year, month, day] = event.date.split("-").map(Number)
        if (year === currentYear && month === currentMonth + 1) {
          acc[String(day).padStart(2, "0")] = { type: event.type, reminder: event.reminder }
        }
        return acc
      },
      {}
    )
    setHighlightedDates(newHighlights)
  }, [upcomingEvents, currentMonth, currentYear])

  const filteredEvents = useMemo(() => {
    let events = upcomingEvents

    if (activeType !== "all") {
      events = events.filter((event) => event.type === activeType)
    }

    if (selectedDate) {
      events = events.filter((event) => event.date === selectedDate)
    }

    return events
  }, [activeType, upcomingEvents, selectedDate])

  const toggleReminder = (eventId: number) => {
    setUpcomingEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, reminder: !ev.reminder } : ev))
    )
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 sm:p-7 lg:p-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-24 translate-y-16 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">
            <Sparkles size={16} className="text-blue-300" /> Sự kiện
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Lịch sự kiện nội bộ & đối ngoại
            </h2>
            <p className="max-w-3xl text-sm text-slate-400">
              Theo dõi tiến độ tổ chức, đăng ký tham gia và thư viện media sau sự kiện. Bảng điều phối tập trung giúp
              đồng bộ thông tin giữa các phòng ban.
            </p>
          </div>

          {/* Thống kê */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {eventStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5"
              >
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">{stat.label}</div>
                <div className="text-[11px] text-slate-500">{stat.subLabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-blue-500/10">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Lọc theo loại sự kiện</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { label: "Tất cả", value: "all" },
              { label: "Nội bộ", value: "internal" },
              { label: "Đối ngoại", value: "external" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setActiveType(btn.value as EventType)}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
                  activeType === btn.value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="relative mt-8 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span>Tháng {currentMonth + 1}/{currentYear}</span>
              <span className="text-blue-300">Calendar</span>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 justify-items-center">
              {WEEKDAYS.map((day) => (
                <div key={day} className="w-8 h-6 flex items-center justify-center">{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] justify-items-center">
              {calendarDays.map((dayOrNull, index) => {
                // Ô trống
                if (dayOrNull === null) {
                  return <div key={`empty-${index}`} className="w-8 h-8" />
                }

                const day = String(dayOrNull).padStart(2, "0")
                const highlightInfo = highlightedDates[day]
                const highlightClass = highlightInfo
                  ? highlightInfo.type === "internal"
                    ? "border-blue-500 bg-blue-500/20 text-blue-100 border"
                    : "border-emerald-500 bg-emerald-500/20 text-emerald-100 border"
                  : "text-slate-400 border-transparent"

                const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${day}`

                return (
                  <div
                    key={`day-${dayOrNull}`}
                    onClick={() => setSelectedDate(fullDate)}
                    className={`relative cursor-pointer rounded-lg w-12 h-12 t-2 flex items-center justify-center border transition hover:scale-110 ${highlightClass} ${
                      selectedDate === fullDate ? "ring-1 ring-blue-500" : ""
                    }`}
                  >
                    {dayOrNull}

                    {highlightInfo?.reminder && (
                      <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 space-y-2 text-sm text-white">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span> Nội bộ
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Đối ngoại
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span> Nhắc tự động
              </div>
            </div>
          </div>

          {selectedDate && (
          <div className="rounded-2xl border border-blue-500/50 bg-blue-500/10 p-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-blue-200">
                    Sự kiện ngày {new Date(selectedDate).getDate()}/
                    {currentMonth + 1}/{currentYear}
                </div>
                <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs text-yellow-300 hover:text-white"
                >
                    Xem tất cả
                </button>
            </div>
          </div>
          )}

          {/* Danh sách sự kiện */}
          <div className="space-y-5">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock size={14} /> {event.time}
                    </span>
                    <span
                      className={
                        event.type === "internal"
                          ? "flex items-center gap-1 text-blue-300"
                          : "flex items-center gap-1 text-emerald-300"
                      }
                    >
                      {event.type === "internal" ? "Nội bộ" : "Đối ngoại"}
                    </span>
                    {event.reminder && (
                      <span className="flex items-center gap-1 rounded-full border border-orange-400/50 px-3 py-1 text-orange-300">
                        <BellRing size={14} /> Tự động nhắc
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                    <p className="text-sm text-slate-300">{event.description}</p>
                    <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                      <MapPin size={14} className="text-blue-300" /> Địa điểm: {event.location}
                    </p>
                  </div>
                </div>

                {/* Hành động */}
                <div className="flex w-full flex-wrap gap-3 text-sm text-slate-300">
                  <button className="flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500">
                    Đăng ký tham gia
                  </button>
                  <button
                    onClick={() => toggleReminder(event.id)}
                    className={`flex-1 rounded-full px-5 py-2 font-semibold uppercase tracking-widest transition ${
                      event.reminder
                        ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30"
                        : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                    }`}
                  >
                    {event.reminder ? "Hủy nhắc" : "Nhắc nhở"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}