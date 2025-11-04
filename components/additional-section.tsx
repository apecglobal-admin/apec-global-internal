"use client"

const trainingResources = [
  { title: "Video hướng dẫn", detail: "30+ khóa kỹ năng và quy trình nội bộ" },
  { title: "Tài liệu chuyên đề", detail: "PDF, checklist và template" },
  { title: "Quiz đánh giá", detail: "Tự động chấm điểm và lưu kết quả" },
]

const quickTools = [
  { name: "MISA", description: "Kế toán & tài chính" },
  { name: "Odoo", description: "ERP & vận hành" },
  { name: "Sapo", description: "Quản lý bán hàng" },
  { name: "ApecTech", description: "Hệ sinh thái số" },
  { name: "GuardCam CMS", description: "Trung tâm giám sát" },
]

const innovationSteps = [
  "Gửi sáng kiến qua form trực tuyến",
  "Hội đồng sáng tạo thẩm định",
  "Triển khai thử nghiệm và nhân rộng",
]

const weeklyHighlights = [
  { title: "Tin nhanh", detail: "Cập nhật hoạt động nổi bật toàn tập đoàn" },
  { title: "Clip truyền thông", detail: "Video recap sự kiện và dự án" },
  { title: "Phỏng vấn", detail: "Chia sẻ từ nhân sự tiêu biểu" },
]

export default function AdditionalSection() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-7 lg:p-8">
      <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">Các mục bổ sung</div>
      <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Hệ sinh thái hỗ trợ nội bộ</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-400">
        Tăng tốc học tập, cộng tác và đổi mới với các trung tâm dữ liệu nội bộ, công cụ làm việc nhanh và bản tin cập nhật hàng tuần.
      </p>

      <div className="mt-6 grid gap-5 sm:gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-slate-400">Trung tâm đào tạo nội bộ</div>
          <h3 className="mt-2 text-xl font-semibold text-white">E-learning Hub</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {trainingResources.map((item) => (
              <li key={item.title} className="flex flex-col gap-2 rounded-xl border border-transparent px-4 py-2 transition hover:border-blue-500/40 hover:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
                <span>{item.title}</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">{item.detail}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-full border border-slate-800 bg-slate-900/70 py-3 text-sm font-semibold uppercase tracking-widest text-slate-200 transition hover:border-blue-500 hover:text-white">
            Truy cập E-learning
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-slate-400">Công cụ làm việc nhanh</div>
          <h3 className="mt-2 text-xl font-semibold text-white">One-click Access</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickTools.map((tool) => (
              <a
                key={tool.name}
                href="#"
                className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-500 hover:text-white"
              >
                <div className="font-semibold text-white">{tool.name}</div>
                <div className="text-xs uppercase tracking-widest text-slate-500">{tool.description}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-slate-400">Góc sáng tạo & đề xuất</div>
          <h3 className="mt-2 text-xl font-semibold text-white">Innovation Hub</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300 sm:pl-6">
            {innovationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <button className="mt-4 rounded-full border border-slate-800 bg-slate-900/70 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-blue-300 transition hover:border-blue-500 hover:text-white">
            Gửi sáng kiến
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="text-xs uppercase tracking-widest text-slate-400">Bản tin Apec Weekly</div>
          <h3 className="mt-2 text-xl font-semibold text-white">360° Weekly Digest</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {weeklyHighlights.map((item) => (
              <div key={item.title} className="rounded-xl border border-transparent px-4 py-3 transition hover:border-blue-500/40 hover:bg-slate-900/80">
                <div className="font-semibold text-white">{item.title}</div>
                <div className="text-xs text-slate-400">{item.detail}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 rounded-full border border-slate-800 bg-slate-900/70 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-slate-200 transition hover:border-blue-500 hover:text-white">
            Xem số mới nhất
          </button>
        </div>
      </div>
    </section>
  )
}
