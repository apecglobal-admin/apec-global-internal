"use client"

const clusters = [
  {
    title: "Apec BCI",
    subtitle: "Cộng đồng & đầu tư",
    objective: "Xây dựng cộng đồng nhà đầu tư 50.000 thành viên và quỹ đầu tư tác động",
    phase: "Giai đoạn 3/5",
    progress: 60,
    members: ["Ban Đầu tư", "Apec Capital", "Khối Pháp chế"],
    reportLink: "#",
    profileLink: "#",
    reportLabel: "PowerBI",
    assets: ["Hồ sơ dự án", "Pitch deck", "Video overview"],
  },
  {
    title: "Apec Space",
    subtitle: "Super App công nghệ",
    objective: "Phát triển siêu ứng dụng tích hợp dịch vụ tài chính, thương mại và chăm sóc sức khỏe",
    phase: "Giai đoạn 4/5",
    progress: 78,
    members: ["Khối Công nghệ", "Sản phẩm", "Marketing"],
    reportLink: "#",
    profileLink: "#",
    reportLabel: "PowerBI",
    assets: ["Roadmap phát triển", "Tài liệu API", "Demo sản phẩm"],
  },
  {
    title: "GuardCam / Nam Thiên Long",
    subtitle: "An ninh công nghệ 5.0",
    objective: "Triển khai 10.000 điểm camera AI và trung tâm điều hành thông minh",
    phase: "Giai đoạn 2/5",
    progress: 42,
    members: ["GuardCam Team", "Khối An ninh", "Đối tác kỹ thuật"],
    reportLink: "#",
    profileLink: "#",
    reportLabel: "Google Sheet",
    assets: ["Catalogue thiết bị", "Video demo", "Checklist triển khai"],
  },
  {
    title: "LifeCare",
    subtitle: "Chăm sóc sức khỏe",
    objective: "Vận hành hệ sinh thái y tế thông minh, kết nối 120 bệnh viện đối tác",
    phase: "Giai đoạn 3/5",
    progress: 55,
    members: ["LifeCare HQ", "Khối Vận hành", "Đối tác y tế"],
    reportLink: "#",
    profileLink: "#",
    reportLabel: "PowerBI",
    assets: ["Quy trình dịch vụ", "Brochure đối tác", "Video trải nghiệm"],
  },
  {
    title: "Ecoop",
    subtitle: "Thương mại & chuỗi cung ứng",
    objective: "Thiết lập 30 hub logistics và 1.000 cửa hàng nhượng quyền",
    phase: "Giai đoạn 1/5",
    progress: 25,
    members: ["Ecoop Team", "Chuỗi cung ứng", "Khối Pháp chế"],
    reportLink: "#",
    profileLink: "#",
    reportLabel: "Google Sheet",
    assets: ["SOP vận hành", "Tài liệu hợp tác", "Video giới thiệu"],
  },
]

export default function ProjectsSection() {
  return (
    <section className="rounded-2xl  bg-gray-200/40 p-6 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-400 sm:text-sm">Danh mục dự án</div>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Các dự án trọng điểm tập đoàn</h2>
          <p className="mt-2 text-sm text-white">
            Theo dõi mục tiêu, tiến độ và tài nguyên mỗi dự án. Dữ liệu đồng bộ tự động với báo cáo PowerBI và Google Sheet hàng tuần.
          </p>
        </div>
        <a
          href="#"
          className="flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-300 transition hover:border-blue-500 hover:text-white sm:px-5 sm:py-3 sm:text-sm md:w-auto"
        >
          Tải báo cáo tổng hợp
        </a>
      </div>

      <div className="mt-6 space-y-4">
        {clusters.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm uppercase tracking-widest text-blue-300">{item.subtitle}</p>
                <p className="mt-3 text-sm text-slate-300">{item.objective}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-widest text-slate-400">
                  <span className="rounded-full border border-slate-800 px-3 py-1">{item.phase}</span>
                  <span className="rounded-full border border-slate-800 px-3 py-1">Thành viên: {item.members.length}</span>
                </div>
              </div>
              <div className="w-full lg:w-64">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
                  <span>Tiến độ</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                    Thành viên phụ trách: {item.members.join(", ")}
                  </div>
                  <a
                    href={item.reportLink}
                    className="flex items-center justify-between rounded-xl border border-yellow-400/40 bg-slate-900/60 px-3 py-2 text-blue-300 hover:border-blue-500 hover:text-white"
                  >
                    Báo cáo tiến độ tuần/tháng
                    <span className="text-xs uppercase tracking-widest">{item.reportLabel}</span>
                  </a>
                  <a
                    href={item.profileLink}
                    className="flex items-center justify-between rounded-xl border border-yellow-400/40 bg-slate-900/60 px-3 py-2 text-blue-300 hover:border-blue-500 hover:text-white"
                  >
                    Hồ sơ năng lực
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-slate-300">
              {item.assets.map((asset) => (
                <a
                  key={asset}
                  href="#"
                  className="rounded-full border border-slate-800 px-3 py-1.5 hover:border-blue-500 hover:text-white"
                >
                  {asset}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
