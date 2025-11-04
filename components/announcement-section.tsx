"use client"

import { useEffect, useMemo, useState } from "react"

type AnnouncementCategory = "general" | "urgent" | "personal"

type AnnouncementItem = {
  id: number
  title: string
  summary: string
  date: string
  category: AnnouncementCategory
  department: string
  read: boolean
}

const initialAnnouncements: AnnouncementItem[] = [
  {
    id: 1,
    title: "Ban Lãnh đạo: Phê duyệt chiến lược 2025",
    summary: "Toàn bộ đơn vị cập nhật kế hoạch quý IV trên ERP trước 31/10",
    date: "2025-10-28",
    category: "general",
    department: "Hành chính",
    read: false,
  },
  {
    id: 2,
    title: "Khẩn cấp: Bảo trì hệ thống ERP",
    summary: "Ngừng truy cập từ 20:00-22:00, liên hệ IT nếu có nghiệp vụ phát sinh",
    date: "2025-10-28",
    category: "urgent",
    department: "Công nghệ",
    read: false,
  },
  {
    id: 3,
    title: "Thông báo KPI cá nhân quý III",
    summary: "Vui lòng rà soát chỉ số và xác nhận trước 30/10 để tổng hợp thi đua",
    date: "2025-10-27",
    category: "personal",
    department: "Nhân sự",
    read: true,
  },
  {
    id: 4,
    title: "Triển khai chính sách phúc lợi mới",
    summary: "Áp dụng thẻ LifeCare cho toàn bộ nhân sự làm việc từ 6 tháng trở lên",
    date: "2025-10-26",
    category: "general",
    department: "Nhân sự",
    read: false,
  },
  {
    id: 5,
    title: "Lịch họp dự án Apec Space",
    summary: "Team sản phẩm cập nhật tiến độ sprint vào 09:00 thứ Hai hàng tuần",
    date: "2025-10-25",
    category: "personal",
    department: "Công nghệ",
    read: true,
  },
]

const categories: { key: AnnouncementCategory; label: string }[] = [
  { key: "general", label: "Thông báo nội bộ" },
  { key: "urgent", label: "Thông báo khẩn" },
  { key: "personal", label: "Cá nhân hóa" },
]

const departments = ["Tất cả", "Ban Lãnh đạo", "Hành chính", "Nhân sự", "Công nghệ", "Tài chính"]

export default function AnnouncementSection() {
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory>("general")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Tất cả")
  const [data, setData] = useState<AnnouncementItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const fetchAnnouncements = async () => {
      setIsLoading(true)

      try {
        const response = await fetch("/api/announcements", { cache: "no-store" })

        if (!response.ok) {
          throw new Error("Failed to load announcements")
        }

        const payload = (await response.json()) as { data?: AnnouncementItem[] }
        const items = Array.isArray(payload.data) ? payload.data : []

        if (!isActive) {
          return
        }

        setData(items)
      } catch (error) {
        if (!isActive) {
          return
        }

        setData(initialAnnouncements)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    fetchAnnouncements()

    return () => {
      isActive = false
    }
  }, [])

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch = item.category === activeCategory
      const departmentMatch = selectedDepartment === "Tất cả" || item.department === selectedDepartment
      return categoryMatch && departmentMatch
    })
  }, [data, activeCategory, selectedDepartment])

  const toggleRead = (id: number) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
  }


  return (
    <section style={{border: "1.5px solid #434F58"}} className="rounded-3xl bg-slate-950/60 p-6 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">Thông báo</div>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Trung tâm thông báo nội bộ</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Cập nhật tức thời từ Ban Lãnh đạo, hành chính, nhân sự và các dự án. Đánh dấu đã đọc để đồng bộ với hồ sơ KPI của bạn.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 sm:w-auto sm:flex-nowrap sm:rounded-full sm:px-4">
          <span className="text-xs uppercase tracking-wide text-slate-400 sm:text-sm">Lọc phòng ban:</span>
          <select
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            className="w-full bg-transparent text-white focus:outline-none sm:w-auto"
          >
            {departments.map((department) => (
              <option key={department} value={department} className="bg-slate-900 text-slate-300">
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
        {categories.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveCategory(item.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:px-5 sm:text-sm ${
              activeCategory === item.key ? "bg-active-blue-metallic" : "border border-slate-800 text-slate-300 hover:border-teal-300/80 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-7 space-y-4 sm:mt-8">
        {isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
            Đang tải dữ liệu...
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
            Không có thông báo nào cho bộ lọc hiện tại.
          </div>
        )}

        {!isLoading &&
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-slate-500">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs ${
                      item.category === "urgent"
                        ? "bg-red-500/20 text-red-300"
                        : item.category === "general"
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-emerald-500/20 text-emerald-200"
                    }`}
                  >
                    {item.category === "urgent" ? "Khẩn cấp" : item.category === "general" ? "Nội bộ" : "Cá nhân"}
                  </span>
                  <span>{item.department}</span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 md:flex-col md:items-end">
                <span className={`text-xs font-semibold uppercase tracking-widest ${item.read ? "text-color-green" : "text-orange-300"}`}>
                  {item.read ? "Đã đọc" : "Chưa đọc"}
                </span>
                <button
                  onClick={() => toggleRead(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    item.read ? "border border-slate-700 text-slate-300 hover:border-teal-300/80 hover:text-white" : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {item.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
