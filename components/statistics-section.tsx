"use client"

const coreMetrics = [
  { title: "Hiệu suất phòng ban", value: "92%", delta: "+4.2%", caption: "Trung bình tuần qua", tone: "positive" },
  { title: "Dự án đang triển khai", value: "37", delta: "+3", caption: "Bao gồm 5 dự án trọng điểm", tone: "positive" },
  { title: "Doanh thu tháng", value: "182 tỷ", delta: "+12%", caption: "So với tháng trước", tone: "positive" },
  { title: "Chi phí vận hành", value: "68 tỷ", delta: "-5%", caption: "Tối ưu hơn kế hoạch", tone: "positive" },
]

const engagementMetrics = [
  { label: "Lượt truy cập", value: "18.240", change: "+18%" },
  { label: "Phản hồi nhân sự", value: "1.320", change: "+26%" },
  { label: "Ticket IT", value: "240", change: "-9%" },
]

const technologyMetrics = [
  { label: "Triển khai công nghệ", value: "76%", descriptor: "12/16 module hoàn tất" },
  { label: "Tiến độ bảo trì", value: "88%", descriptor: "Hoàn thành 22/25 hạng mục" },
]

export default function StatisticsSection() {
  return (
    <section 
    style={{boxShadow: "inset 0 0 10px rgba(64, 64, 64, 0.5)"}}
    className="rounded-2xl  bg-white p-6 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">Thống kê & báo cáo</div>
          <h2 className="mt-2 text-2xl font-extrabold text-blue-main capitalize sm:text-3xl ">Dashboard realtime</h2>
          <p className="mt-2 text-sm text-black">
            Dữ liệu đồng bộ từ ERP, CRM và ApecTech Dashboard giúp theo dõi hiệu suất, tài chính, nhân sự và tiến độ công nghệ.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <button className="rounded-full border border-orange-500 bg-orange-400 px-4 py-2 text-xs font-semibold uppercase text-white transition hover:border-orange-700 hover:bg-orange-600">
            Xuất Excel
          </button>
          <button className="rounded-full border border-orange-500 bg-orange-400 px-4 py-2 text-xs font-semibold uppercase text-white transition hover:border-orange-700 hover:bg-orange-600">
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {coreMetrics.map((metric, id) => (
          <div key={metric.title} className={`rounded-2xl bg-blue-gradiant-main p-5 sm:p-6 bg-box-shadow`}>
            <div className="text-xs uppercase  text-black font-semibold">{metric.title}</div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-700">{metric.value}</span>
              <span
                className={`text-xs font-semibold uppercase  ${
                  metric.tone === "positive" ? "text-emerald-700" : metric.tone === "negative" ? "text-red-300" : "text-slate-300"
                }`}
              >
                {metric.delta}
              </span>
            </div>
            <p className="mt-2 text-xs text-black">{metric.caption}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-400"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-[#d6e8ee] p-5 sm:p-6 bg-box-shadow bg-blue-gradiant-main">
          <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
            <div className="text-xs uppercase  text-blue-700 font-extrabold">Tương tác nhân sự</div>
            <span className="text-xs uppercase  text-blue-700 font-extrabold">Realtime</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {engagementMetrics.map((item) => (
              <div key={item.label} className="rounded-xl bg-white p-4 bg-box-shadow-inset">
                <div className="text-xs uppercase  text-black font-bold">{item.label}</div>
                <div className="mt-2 text-xl font-semibold text-blue-800">{item.value}</div>
                <div className="text-xs text-emerald-700 font-bold">{item.change}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#d6e8ee] p-5 sm:p-6 bg-box-shadow bg-blue-gradiant-main">
          <div className="text-xs uppercase  text-blue-800 font-extrabold ">Công nghệ & bảo trì</div>
          <div className="mt-4 space-y-3">
            {technologyMetrics.map((item) => (
              <div key={item.label} className="rounded-xl bg-white p-4 bg-box-shadow-inset">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase  text-black font-bold">{item.label}</span>
                  <span className="text-sm font-extrabold text-blue-800 ">{item.value}</span>
                </div>
                <div className="mt-2 text-xs text-black">{item.descriptor}</div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: item.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
