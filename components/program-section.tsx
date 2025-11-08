"use client"

import { useMemo, useState } from "react"

const departmentsRanking = [
  { name: "Khối Công nghệ", score: 1280, badge: "🔥", trend: "+12" },
  { name: "Khối Nhân sự", score: 1150, badge: "⭐", trend: "+4" },
  { name: "Khối Tài chính", score: 980, badge: "💎", trend: "+8" },
]

const individualsRanking = [
  { name: "Nguyễn Minh Khang", dept: "GuardCam", score: 540, trend: "+3" },
  { name: "Lê Hoàng Yến", dept: "LifeCare", score: 525, trend: "+5" },
  { name: "Trần Bảo Long", dept: "Apec Space", score: 498, trend: "+1" },
]

const projectsRanking = [
  { name: "Apec Space Super App", score: 320, trend: "+10" },
  { name: "GuardCam AI Hub", score: 295, trend: "+6" },
  { name: "LifeCare Smart Clinic", score: 280, trend: "+9" },
]

const modules = [
  { title: "KPI thi đua", description: "Đánh giá theo tháng với 6 trụ cột hiệu suất", status: "Đồng bộ ERP" },
  { title: "Điểm thưởng & huy hiệu", description: "Tự động cộng điểm khi hoàn thành OKR", status: "Realtime" },
  { title: "Danh hiệu", description: "Vinh danh tập thể và cá nhân xuất sắc", status: "Công bố mỗi quý" },
  { title: "Countdown", description: "Đếm ngược kết quả tháng 10 còn 03 ngày", status: "Đang chạy" },
]

type RankingTab = "departments" | "individuals" | "projects"

export default function ProgramSection() {
  const [activeTab, setActiveTab] = useState<RankingTab>("departments")

  const rankingData = useMemo(() => {
    if (activeTab === "departments") return departmentsRanking
    if (activeTab === "individuals") return individualsRanking
    return projectsRanking
  }, [activeTab])

  return (
    <section 
    style={{
      boxShadow: "0 0 10px 3px rgb(212, 212, 214)",
  }}
    className="rounded-3xl border border-slate-800  bg-gray-200 p-6 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-950 sm:text-sm">Thi đua & khen thưởng</div>
          <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">Bảng xếp hạng realtime</h2>
          <p className="mt-2 text-sm text-black/80">
            Cập nhật tự động từ ERP, phản ánh KPI, điểm thưởng, huy hiệu và danh hiệu của từng phòng ban, cá nhân và dự án.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("departments")}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              activeTab === "departments" ? "bg-amber-500 text-white" : "border border-black/50 bg-gray-300 text-black/50 hover:bg-amber-500"
            }`}
          >
            Phòng ban
          </button>
          <button
            onClick={() => setActiveTab("individuals")}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              activeTab === "individuals" ? "bg-amber-500 text-white" : "border border-black/50 bg-gray-300 text-black/50 hover:bg-amber-500"
            }`}
          >
            Cá nhân
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              activeTab === "projects" ? "bg-amber-500 text-white" : "border border-black/50 bg-gray-300 text-black/50 hover:bg-amber-500"
            }`}
          >
            Dự án
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-gray-700 bg-gray-300 p-5 sm:p-6">
          <div className="text-md uppercase tracking-widest font-extrabold text-orange-600">Bảng xếp hạng</div>
          <ul className="mt-4 space-y-3">
            {rankingData.map((item, index) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-black/50 bg-white px-4 py-4 sm:px-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600 text-lg font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-black">
                      {item.name}
                      {"badge" in item && <span className="text-lg leading-none">{item.badge as any}</span>}
                    </div>
                    {"dept" in item && <div className="text-xs uppercase tracking-widest text-amber-200">{item.dept as any}</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">{item.score}</div>
                  <div className="text-xs font-bold text-emerald-700">{item.trend}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-700 bg-gray-300 p-5 sm:p-6">
            <div className="text-md uppercase tracking-widest font-extrabold text-orange-600">Module</div>
            <div className="mt-4 grid gap-3">
              {modules.map((module) => (
                <div key={module.title} className="flex items-center justify-between rounded-xl border border-slate-800 bg-white px-4 py-3 text-sm text-slate-200">
                  <div>
                    <div className="font-semibold text-black">{module.title}</div>
                    <div className="text-xs text-black">{module.description}</div>
                  </div>
                  <span className="rounded-full border font-semibold border-orange-600 px-3 py-1 text-xs uppercase tracking-widest text-orange-600">
                    {module.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-700 bg-amber-300/40 p-5 sm:p-6 text-center">
            <div className="text-xs uppercase tracking-widest font-extrabold text-orange-600">Vinh danh tập thể xuất sắc</div>
            <div className="mt-3 text-2xl font-extrabold text-white text-shadow-lg">GuardCam AI Hub</div>
            <p className="mt-2 text-sm text-black">
              Dẫn đầu quý III với 132% KPI, 08 sáng kiến đổi mới và chỉ số hài lòng nhân sự đạt 4.8/5.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
