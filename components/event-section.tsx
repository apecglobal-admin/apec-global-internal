"use client"

import { useMemo, useState } from "react"
import { BellRing, Calendar, Clock, MapPin, Sparkles } from "lucide-react"

const calendarDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

const upcomingEvents = [
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

type EventType = "internal" | "external" | "all"

export default function EventSection() {
  const [activeType, setActiveType] = useState<EventType>("all")

  const filteredEvents = useMemo(() => {
    if (activeType === "all") return upcomingEvents
    return upcomingEvents.filter((event) => event.type === activeType)
  }, [activeType])

  const highlightedDates = useMemo(() => {
    return upcomingEvents.reduce<Record<string, { type: EventType; reminder: boolean }>>((acc, event) => {
      const day = event.date.split("-")[2]
      acc[day] = { type: event.type, reminder: event.reminder }
      return acc
    }, {})
  }, [])

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950/85 to-slate-900 p-6 sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-24 translate-y-16 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">
            <Sparkles size={16} className="text-blue-300" />
            Sự kiện
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Lịch sự kiện nội bộ & đối ngoại</h2>
            <p className="max-w-3xl text-sm text-slate-400">
              Theo dõi tiến độ tổ chức, đăng ký tham gia và thư viện media sau sự kiện. Bảng điều phối tập trung giúp đồng bộ thông tin giữa các phòng ban.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {eventStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">{stat.label}</div>
                <div className="text-[11px] text-slate-500">{stat.subLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-blue-500/10">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Lọc theo loại sự kiện</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button
            onClick={() => setActiveType("all")}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
              activeType === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveType("internal")}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
              activeType === "internal"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
            }`}
          >
            Nội bộ
          </button>
          <button
            onClick={() => setActiveType("external")}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition ${
              activeType === "external"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "border border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
            }`}
          >
            Đối ngoại
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-400 shadow-lg shadow-blue-500/10">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-300">Gợi ý điều phối</div>
        <p className="mt-2 leading-relaxed">
          Kết hợp bộ lọc với timeline để kiểm tra công tác chuẩn bị, gửi thư mời và cập nhật media ngay sau sự kiện.
        </p>
        <button className="mt-3 flex items-center justify-center gap-2 rounded-full border border-blue-500/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-blue-200 transition hover:border-blue-500 hover:text-white">
          <BellRing size={14} />
          Tạo nhắc nhở mới
        </button>
      </div>

      <div className="relative mt-8 space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-center justify-between text-sm font-semibold text-white">
            <span>Tháng 11/2025</span>
            <span className="text-blue-300">Calendar</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            {calendarDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 30 }, (_, index) => {
              const day = String(index + 1).padStart(2, "0")
              const highlightInfo = highlightedDates[day]
              const highlightClass = highlightInfo
                ? highlightInfo.type === "internal"
                  ? "border-blue-500 bg-blue-500/20 text-blue-100"
                  : "border-emerald-500 bg-emerald-500/20 text-emerald-100"
                : "text-slate-400"
              const reminderClass = highlightInfo?.reminder ? " ring-2 ring-orange-400/70" : ""
              return (
                <div key={day} className={`rounded-full border border-transparent px-2 py-1${reminderClass} ${highlightClass}`}>
                  {index + 1}
                </div>
              )
            })}
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Nội bộ
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Đối ngoại
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              Nhắc tự động
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">
                    <Calendar size={14} />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock size={14} />
                    {event.time}
                  </span>
                  <span className={event.type === "internal" ? "flex items-center gap-1 text-blue-300" : "flex items-center gap-1 text-emerald-300"}>
                    {event.type === "internal" ? "Nội bộ" : "Đối ngoại"}
                  </span>
                  {event.reminder && (
                    <span className="flex items-center gap-1 rounded-full border border-orange-400/50 px-3 py-1 text-orange-300">
                      <BellRing size={14} />
                      Tự động nhắc
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                  <p className="text-sm text-slate-300">{event.description}</p>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                    <MapPin size={14} className="text-blue-300" />
                    Địa điểm: {event.location}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-3 text-sm text-slate-300">
                <button className="flex-1 rounded-full bg-blue-600 px-5 py-2 font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500">
                  Đăng ký tham gia
                </button>
                <button className="flex-1 rounded-full border border-slate-800 px-5 py-2 font-semibold uppercase tracking-widest text-blue-300 transition hover:border-blue-500 hover:text-white">
                  Nhận nhắc nhở
                </button>
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">Thư viện sự kiện</div>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                {pastEvents.map((event) => (
                  <a
                    key={event.id}
                    href={event.mediaLink}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-transparent px-4 py-2 transition hover:border-blue-500/40 hover:bg-slate-900/80"
                  >
                    <span>{event.name}</span>
                    <span className="text-xs uppercase tracking-widest text-slate-500">{event.date}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300 sm:text-sm">Điểm nhấn timeline</div>
              <div className="mt-3 space-y-3">
                {timelineHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="text-xs uppercase tracking-widest text-slate-400">{item.timeframe}</div>
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-widest ${item.variant}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
