"use client";

import { useState } from "react";
import { FileText, PenTool, Search, Download, AlertCircle, ArrowRight } from "lucide-react";
import { colorClasses, colorMap } from "@/src/utils/color";

const policyStats = [
    { value: "128", label: "Chính sách", subLabel: "Đã cập nhật 2025" },
    { value: "36", label: "Biểu mẫu", subLabel: "Chuẩn hóa PDF" },
    { value: "18", label: "Quy trình", subLabel: "Ký nhận điện tử" },
    { value: "12", label: "Phòng ban", subLabel: "Phụ trách rà soát" },
];

const quickLinks = [
    { label: "Chính sách mới cập nhật", href: "#" },
    { label: "Biểu mẫu phổ biến", href: "#" },
    { label: "Hướng dẫn ký nhận điện tử", href: "#" },
];

const policyGroups = [
    {
        title: "Chính sách nhân sự",
        description:
            "Quản lý toàn bộ hành trình nhân sự từ tuyển dụng, đào tạo đến phúc lợi thống nhất trên toàn hệ thống.",
        items: [
            {
                name: "Quy trình tuyển dụng nội bộ",
                updated: "Cập nhật 15/01/2025",
                status: "active",
            },
            {
                name: "Chính sách đào tạo & phát triển",
                updated: "Cập nhật 10/01/2025",
                status: "active",
            },
            {
                name: "Quy định phúc lợi ApecCare",
                updated: "Cập nhật 05/01/2025",
                status: "new",
            },
        ],
    },
    {
        title: "Chính sách tài chính – khen thưởng",
        description:
            "Quy chuẩn ngân sách, thanh toán và các chương trình thưởng minh bạch cho từng cấp bậc.",
        items: [
            {
                name: "Quy chế lương thưởng 2025",
                updated: "Cập nhật 01/01/2025",
                status: "new",
            },
            {
                name: "Quy định tạm ứng & hoàn ứng",
                updated: "Cập nhật 20/12/2024",
                status: "active",
            },
            {
                name: "Chính sách thưởng nóng dự án",
                updated: "Cập nhật 15/12/2024",
                status: "active",
            },
        ],
    },
    {
        title: "Chính sách vận hành – công nghệ",
        description:
            "Chuẩn hóa vận hành, an ninh dữ liệu và hướng dẫn nền tảng công nghệ trọng yếu của tập đoàn.",
        items: [
            {
                name: "Quy trình quản trị dữ liệu",
                updated: "Cập nhật 18/01/2025",
                status: "active",
            },
            {
                name: "Hướng dẫn an ninh GuardCam",
                updated: "Cập nhật 12/01/2025",
                status: "active",
            },
            {
                name: "Quy chuẩn vận hành MISA/Odoo",
                updated: "Cập nhật 08/01/2025",
                status: "active",
            },
        ],
    },
    {
        title: "Chính sách truyền thông & thương hiệu",
        description:
            "Định hướng truyền thông, nhận diện thương hiệu và quy định phát ngôn thống nhất.",
        items: [
            {
                name: "Bộ nhận diện thương hiệu",
                updated: "Cập nhật 22/01/2025",
                status: "new",
            },
            {
                name: "Quy định phát ngôn truyền thông",
                updated: "Cập nhật 10/01/2025",
                status: "active",
            },
            {
                name: "Hướng dẫn sử dụng kênh nội bộ",
                updated: "Cập nhật 05/01/2025",
                status: "active",
            },
        ],
    },
];

export default function PoliciesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);


    return (
        <div className="min-h-screen bg-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-400 sm:text-sm">
                        Chính sách nội bộ
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-teal-400 sm:text-4xl lg:text-5xl">
                            Chính sách tập trung
                        </h1>
                        <p className="max-w-3xl text-sm text-black sm:text-base">
                            Tra cứu nhanh, tải tài liệu chuẩn hóa và ký nhận
                            điện tử trên từng chính sách để đảm bảo tuân thủ
                            đồng nhất toàn hệ thống.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quickLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2 rounded-full  bg-gray-500/80 px-4 py-2 text-xs uppercase tracking-widest text-white transition hover:border-blue-500/40 hover:bg-slate-900 hover:text-white"
                                style={{border: "1px solid rgb(92,197,199)"}}
                            >
                                {link.label}
                                <span aria-hidden>↗</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ✅ Stats Grid cập nhật */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {policyStats.map((stat, index) => {
                        const colorClass =
                            colorClasses[index % colorClasses.length];
                        const borderColor = colorMap[colorClass] || "#FACC15";

                        return (
                            <div
                                key={stat.label}
                                className="group rounded-2xl border border-slate-700/80 border-l-6 bg-slate-900/60 p-5 shadow-inner shadow-black/10 transition"
                                style={{
                                    borderLeftColor: borderColor,
                                    boxShadow:
                                        "0 0 10px 2px rgba(0, 0, 0, 0.6)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 20px ${borderColor}80`)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = `inset 0 0 10px rgba(0,0,0,0.1)`)
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div
                                            className={`text-3xl font-bold ${colorClass}`}
                                        >
                                            {stat.value}
                                        </div>
                                        <div className="mt-1 text-lg uppercase tracking-widest text-white font-semibold">
                                            {stat.label}
                                        </div>
                                        <div className="text-[11px] text-slate-300">
                                            {stat.subLabel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search Section */}
                <div className="mb-8 space-y-4 rounded-3xl border border-gray-500/60 bg-gray-400 p-5 shadow-lg shadow-blue-500/10 transition-all duration-300 hover:!border-blue-500/50">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-white px-4 py-3">
                        <Search size={18} className="text-black" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm chính sách, biểu mẫu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
                        />
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500 sm:w-auto">
                        <Search size={16} />
                        Tra cứu nhanh
                    </button>

                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                        <div className="text-md font-semibold uppercase tracking-widest text-yellow-300">
                            Danh mục nổi bật
                        </div>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between rounded-xl border border-transparent bg-gray-600 px-3 py-2 text-sm text-slate-200 transition hover:border-blue-500/40 hover:bg-slate-950/80 hover:text-white"
                                >
                                    {link.label}
                                    <span aria-hidden>
                                        <ArrowRight />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Policy Groups */}
                <div className="space-y-5">
                    {policyGroups.map((group) => (
                        <article
                            key={group.title}
                            className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-gray-500/60 bg-gray-400 p-6 transition-all duration-300 hover:!border-blue-500/50"
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-teal-300 sm:text-2xl">
                                        {group.title}
                                    </h2>
                                    <span className="rounded-full bg-red-800/80 border border-teal-800 px-3 py-1 text-xs font-semibold text-white">
                                        {group.items.length} tài liệu
                                    </span>
                                </div>
                                <p className="text-sm text-white">
                                    {group.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-gray-500 hover:text-white">
                                    <FileText size={14} />
                                    Tải PDF
                                </button>
                                <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-gray-500 hover:text-white">
                                    <PenTool size={14} />
                                    Ký xác nhận
                                </button>
                                <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-gray-500 hover:text-white">
                                    <Download size={14} />
                                    Tải tất cả
                                </button>
                            </div>

                            <ul className="space-y-2">
                                {group.items.map((item, index) => (
                                    <li
                                        key={item.name}
                                        className="flex flex-col gap-3 rounded-2xl border border-transparent bg-slate-900/40 px-4 py-3 transition hover:border-blue-500/40 hover:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/80 text-xs font-semibold text-white group-hover:text-blue-300 transition">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-200">
                                                        {item.name}
                                                    </span>
                                                    {item.status === "new" && (
                                                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                                                            Mới
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {item.updated}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="#"
                                                className="flex items-center gap-1.5 rounded-lg bg-teal-500/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-teal-500/30"
                                            >
                                                Xem chi tiết
                                                <span aria-hidden>↗</span>
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                {/* Notice Banner */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-400 bg-red-500/30 p-5">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 flex-shrink-0 text-red-500"
                    />
                    <div className="flex-1 space-y-1">
                        <div className="text-sm font-semibold text-red-500">
                            Lưu ý quan trọng
                        </div>
                        <p className="text-xs text-red-600">
                            Mọi nhân viên có trách nhiệm đọc, hiểu và tuân thủ
                            các chính sách. Vui lòng ký xác nhận sau khi đọc các
                            tài liệu bắt buộc. Liên hệ phòng HR nếu có thắc mắc:
                            hr@apecgroup.vn
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
