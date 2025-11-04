"use client"

import { FileText, PenTool, Search } from "lucide-react"

const policyStats = [
  { value: "128", label: "Chính sách", subLabel: "Đã cập nhật 2025" },
  { value: "36", label: "Biểu mẫu", subLabel: "Chuẩn hóa PDF" },
  { value: "18", label: "Quy trình", subLabel: "Ký nhận điện tử" },
  { value: "12", label: "Phòng ban", subLabel: "Phụ trách rà soát" },
]

const policyGroups = [
  {
    title: "Chính sách nhân sự",
    description: "Quản lý toàn bộ hành trình nhân sự từ tuyển dụng, đào tạo đến phúc lợi thống nhất trên toàn hệ thống.",
    items: ["Quy trình tuyển dụng nội bộ", "Chính sách đào tạo & phát triển", "Quy định phúc lợi ApecCare"],
  },
  {
    title: "Chính sách tài chính – khen thưởng",
    description: "Quy chuẩn ngân sách, thanh toán và các chương trình thưởng minh bạch cho từng cấp bậc.",
    items: ["Quy chế lương thưởng 2025", "Quy định tạm ứng & hoàn ứng", "Chính sách thưởng nóng dự án"],
  },
  {
    title: "Chính sách vận hành – công nghệ",
    description: "Chuẩn hóa vận hành, an ninh dữ liệu và hướng dẫn nền tảng công nghệ trọng yếu của tập đoàn.",
    items: ["Quy trình quản trị dữ liệu", "Hướng dẫn an ninh GuardCam", "Quy chuẩn vận hành MISA/Odoo"],
  },
  {
    title: "Chính sách truyền thông & thương hiệu",
    description: "Định hướng truyền thông, nhận diện thương hiệu và quy định phát ngôn thống nhất.",
    items: ["Bộ nhận diện thương hiệu", "Quy định phát ngôn truyền thông", "Hướng dẫn sử dụng kênh nội bộ"],
  },
]

const quickLinks = [
  { label: "Chính sách mới cập nhật", href: "#" },
  { label: "Biểu mẫu phổ biến", href: "#" },
  { label: "Hướng dẫn ký nhận điện tử", href: "#" },
]

export default function PolicySection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 sm:p-8">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400 sm:text-sm">Chính sách nội bộ</div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Kho chính sách tập trung</h2>
              <p className="text-sm text-slate-400">
                Tra cứu nhanh, tải tài liệu chuẩn hóa và ký nhận điện tử trên từng chính sách để đảm bảo tuân thủ đồng nhất toàn hệ thống.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-blue-300">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-slate-200 transition hover:border-blue-500/40 hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                  <span aria-hidden>↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {policyStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-inner shadow-black/10 sm:p-5"
              >
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">{stat.label}</div>
                <div className="text-[11px] text-slate-500">{stat.subLabel}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-blue-500/10">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
            <Search size={18} className="text-blue-300" />
            <input
              type="search"
              placeholder="Tìm kiếm chính sách, biểu mẫu..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500">
            <Search size={16} />
            Tra cứu nhanh
          </button>
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-300">Danh mục nổi bật</div>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-transparent bg-slate-950/60 px-3 py-2 text-slate-200 transition hover:border-blue-500/40 hover:bg-slate-950/80 hover:text-white"
                >
                  {link.label}
                  <span aria-hidden>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {policyGroups.map((group) => (
            <article
              key={group.title}
              className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/50 p-6 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white sm:text-xl">{group.title}</h3>
                <p className="text-sm text-slate-400">{group.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-blue-300">
                <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white">
                  <FileText size={14} />
                  Tải PDF
                </button>
                <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white">
                  <PenTool size={14} />
                  Ký xác nhận
                </button>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {group.items.map((item, index) => (
                  <li
                    key={item}
                    className="flex flex-col gap-3 rounded-2xl border border-transparent bg-slate-900/40 px-3 py-3 transition hover:border-blue-500/40 hover:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-slate-200">{item}</span>
                    </div>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-300 transition hover:text-blue-200"
                    >
                      Xem chi tiết
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
