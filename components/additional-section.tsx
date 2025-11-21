"use client";

import {
    BookOpen,
    Zap,
    Lightbulb,
    Newspaper,
    Play,
    FileText,
    CheckCircle,
    ExternalLink,
} from "lucide-react";

const trainingResources = [
    {
        title: "Video hướng dẫn",
        detail: "30+ khóa kỹ năng và quy trình nội bộ",
    },
    { title: "Tài liệu chuyên đề", detail: "PDF, checklist và template" },
    { title: "Quiz đánh giá", detail: "Tự động chấm điểm và lưu kết quả" },
];

const quickTools = [
    { name: "MISA", description: "Kế toán & tài chính" },
    { name: "Odoo", description: "ERP & vận hành" },
    { name: "Sapo", description: "Quản lý bán hàng" },
    { name: "ApecTech", description: "Hệ sinh thái số" },
    { name: "GuardCam CMS", description: "Trung tâm giám sát" },
];

const innovationSteps = [
    "Gửi sáng kiến qua form trực tuyến",
    "Hội đồng sáng tạo thẩm định",
    "Triển khai thử nghiệm và nhân rộng",
];

const weeklyHighlights = [
    { title: "Tin nhanh", detail: "Cập nhật hoạt động nổi bật toàn tập đoàn" },
    { title: "Clip truyền thông", detail: "Video recap sự kiện và dự án" },
    { title: "Phỏng vấn", detail: "Chia sẻ từ nhân sự tiêu biểu" },
];

const ecosystemData = {
    trainingHub: {
        title: "Trung tâm đào tạo nội bộ",
        subtitle: "E-learning Hub",
        icon: BookOpen,
        resources: [
            {
                title: "Video hướng dẫn",
                detail: "30+ khóa kỹ năng và quy trình nội bộ",
                icon: Play,
            },
            {
                title: "Tài liệu chuyên đề",
                detail: "PDF, checklist và template",
                icon: FileText,
            },
            {
                title: "Quiz đánh giá",
                detail: "Tự động chấm điểm và lưu kết quả",
                icon: CheckCircle,
            },
        ],
        buttonText: "Truy cập E-learning",
        gradient: "from-blue-500 to-cyan-500",
    },
    workTools: {
        title: "Công cụ làm việc nhanh",
        subtitle: "One-click Access",
        icon: Zap,
        tools: [
            {
                name: "MISA",
                description: "Kế toán & tài chính",
                color: "bg-purple-500",
            },
            {
                name: "Odoo",
                description: "ERP & vận hành",
                color: "bg-pink-500",
            },
            {
                name: "Sapo",
                description: "Quản lý bán hàng",
                color: "bg-orange-500",
            },
            {
                name: "ApecTech",
                description: "Hệ sinh thái số",
                color: "bg-teal-500",
            },
            {
                name: "GuardCam CMS",
                description: "Trung tâm giám sát",
                color: "bg-indigo-500",
            },
        ],
        gradient: "from-purple-500 to-pink-500",
    },
    innovationHub: {
        title: "Góc sáng tạo & đề xuất",
        subtitle: "Innovation Hub",
        icon: Lightbulb,
        steps: [
            "Gửi sáng kiến qua form trực tuyến",
            "Hội đồng sáng tạo thẩm định",
            "Triển khai thử nghiệm và nhân rộng",
        ],
        buttonText: "Gửi sáng kiến",
        gradient: "from-amber-500 to-orange-500",
    },
    weeklyDigest: {
        title: "Bản tin Apec Weekly",
        subtitle: "360° Weekly Digest",
        icon: Newspaper,
        highlights: [
            {
                title: "Tin nhanh",
                detail: "Cập nhật hoạt động nổi bật toàn tập đoàn",
            },
            {
                title: "Clip truyền thông",
                detail: "Video recap sự kiện và dự án",
            },
            { title: "Phỏng vấn", detail: "Chia sẻ từ nhân sự tiêu biểu" },
        ],
        buttonText: "Xem số mới nhất",
        gradient: "from-emerald-500 to-teal-500",
    },
};

export default function AdditionalSection() {
    return (
        <section 
        style={{boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)"}}
        className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                    Các mục bổ sung
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold text-blue-main capitalize sm:text-3xl">
                    Hệ sinh thái hỗ trợ nội bộ
                    </h2>
                    <p className="mt-2 text-sm text-black">
                    Tăng tốc học tập, cộng tác và đổi mới với các trung tâm dữ
                    liệu nội bộ, công cụ làm việc nhanh và bản tin cập nhật hàng
                    tuần.
                    </p>
                </div>
            </div>
            <div className="mt-6 grid gap-5 sm:gap-6 xl:grid-cols-2">
                {/* Trung tâm đào tạo */}
                <div className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6">
                    <div className="flex items-center">
                        <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ecosystemData.trainingHub.gradient} shadow-lg`}
                        >
                            <BookOpen className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-3">
                            <div className="text-xs uppercase  font-semibold text-black">
                                {ecosystemData.trainingHub.title}
                            </div>
                            <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                {ecosystemData.trainingHub.subtitle}
                            </h3>
                        </div>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                        {ecosystemData.trainingHub.resources.map((item) => (
                            <li
                                key={item.title}
                                className="flex flex-col gap-2 rounded-xl bg-box-shadow-inset bg-white px-4 py-2 transition  hover:bg-gray-400/40 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <span className="text-black">{item.title}</span>
                                <span className="text-xs uppercase  text-black">
                                    {item.detail}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-4 w-full rounded-full bg-box-shadow bg-[#97cadb] py-3 text-sm font-bold uppercase  text-white transition hover:border-blue-800 hover:bg-[#7dc0d6] hover:text-black/30">
                        {ecosystemData.trainingHub.buttonText}
                    </button>
                </div>

                {/* Công cụ làm việc */}
                <div className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6">
                    <div className="flex items-center">
                        <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ecosystemData.workTools.gradient} shadow-lg`}
                        >
                            <Zap className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-3">
                            <div className="text-xs uppercase  font-semibold text-black">
                                {ecosystemData.workTools.title}
                            </div>
                            <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                {ecosystemData.workTools.subtitle}
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {ecosystemData.workTools.tools.map((tool) => (
                            <a
                                key={tool.name}
                                href="#"
                                className="rounded-xl bg-box-shadow-inset bg-white px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-500/40 hover:bg-gray-400/50 hover:text-black/30"
                            >
                                <div className="font-semibold text-black">
                                    {tool.name}
                                </div>
                                <div className="text-xs uppercase  text-black">
                                    {tool.description}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Góc sáng tạo */}
                <div className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6">
                    <div className="flex items-center">
                        <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ecosystemData.innovationHub.gradient} shadow-lg`}
                        >
                            <Lightbulb className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-3">
                            <div className="text-xs uppercase  font-semibold text-black">
                                {ecosystemData.innovationHub.title}
                            </div>
                            <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                {ecosystemData.innovationHub.subtitle}
                            </h3>
                        </div>
                    </div>
                    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-black sm:pl-6">
                        {ecosystemData.innovationHub.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <button className="mt-4 rounded-full bg-box-shadow bg-[#97cadb] px-5 py-2 text-sm font-semibold uppercase  text-white transition hover:bg-[#7dc0d6] hover:text-black/30">
                        {ecosystemData.innovationHub.buttonText}
                    </button>
                </div>

                {/* Bản tin tuần */}
                <div className="rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 sm:p-6">
                    <div className="flex items-center">
                        <div
                            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ecosystemData.weeklyDigest.gradient} shadow-lg`}
                        >
                            <Newspaper className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-3">
                            <div className="text-xs uppercase  font-semibold text-black">
                                {ecosystemData.weeklyDigest.title}
                            </div>
                            <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                                {ecosystemData.weeklyDigest.subtitle}
                            </h3>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        {ecosystemData.weeklyDigest.highlights.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl bg-box-shadow-inset bg-white px-4 py-3 transition hover:bg-gray-400/50 hover:text-black/30"
                            >
                                <div className="font-semibold text-black">
                                    {item.title}
                                </div>
                                <div className="text-xs text-black">{item.detail}</div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 rounded-full bg-box-shadow bg-[#97cadb] px-5 py-2 text-sm font-semibold uppercase  text-white transition hover:bg-[#7dc0d6] hover:text-black/30">
                        {ecosystemData.weeklyDigest.buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
