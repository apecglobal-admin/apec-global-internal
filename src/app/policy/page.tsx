"use client";

import { useState } from "react";
import {
    FileText,
    PenTool,
    Search,
    Download,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { colorClasses, colorMap } from "@/src/utils/color";
import SearchBar from "@/components/searchBar";

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
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-950 sm:text-sm">
                        Chính sách nội bộ
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-blue-main capitallize sm:text-4xl lg:text-5xl">
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
                                className="flex items-center gap-2 rounded-full border border-orange-500  bg-orange-400 px-4 py-2 text-xs uppercase tracking-widest text-white font-bold transition hover:border-gray-400 hover:bg-orange-500 hover:text-white"
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
                                className={`group rounded-2xl border-l-6 bg-white p-5 shadow-inner shadow-black/10 transition bg-blue-gradiant-main`}
                                style={{
                                    borderLeftColor: borderColor,
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 20px ${borderColor}80`)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = `0 0 10px rgba(0, 0, 0, 0.3)`)
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div
                                            className={`text-3xl font-bold ${colorClass}`}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            className={`mt-1 text-lg uppercase tracking-widest  font-semibold ${colorClass}`}
                                        >
                                            {stat.label}
                                        </div>
                                        <div className="text-[11px] text-black">
                                            {stat.subLabel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search Section */}
                <div className="mb-8 space-y-4 ">
                    <SearchBar placeHoder="Tìm kiếm chính sách, biểu mẫu..." />

                    {/* <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-blue-500 sm:w-auto">
                        <Search size={16} />
                        Tra cứu nhanh
                    </button>

                    <div className="space-y-3 rounded-2xl border border-gray-500 bg-[#d6e8ee] p-4">
                        <div className="text-md font-semibold uppercase tracking-widest text-blue-950">
                            Danh mục nổi bật
                        </div>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between rounded-xl border border-gray-400 bg-white px-3 py-2 text-sm text-black transition hover:border-gray-400 hover:bg-gray-300 hover:text-white"
                                >
                                    {link.label}
                                    <span aria-hidden>
                                        <ArrowRight />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div> */}
                </div>

                {/* Policy Groups */}
                <div className="space-y-5">
                    {policyGroups.map((group) => (
                        <article
                            key={group.title}
                            className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-box-shadow   p-6 transition-all duration-300  hover:shadow-lg hover:shadow-blue-500/10"
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-xl font-extrabold text-blue-main capitalize sm:text-2xl">
                                        {group.title}
                                    </h2>
                                    <span className="rounded-full bg-orange-400 border border-orange-500 px-3 py-1 text-xs font-semibold text-white">
                                        {group.items.length} tài liệu
                                    </span>
                                </div>
                                <p className="text-sm text-black/80">
                                    {group.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-blue-300">
                                <button className="flex items-center gap-2 rounded-full bg-blue-gradiant-main bg-box-shadow px-3 py-1.5 text-xs font-semibold text-black transition hover:border-orange-600 hover:bg-orange-500 hover:text-black/40">
                                    <FileText size={14} />
                                    Tải PDF
                                </button>
                                <button className="flex items-center gap-2 rounded-full bg-blue-gradiant-main bg-box-shadow px-3 py-1.5 text-xs font-semibold text-black transition hover:border-orange-600 hover:bg-orange-500 hover:text-black/40">
                                    <PenTool size={14} />
                                    Ký xác nhận
                                </button>
                                <button className="flex items-center gap-2 rounded-full bg-blue-gradiant-main bg-box-shadow px-3 py-1.5 text-xs font-semibold text-black transition hover:border-orange-600 hover:bg-orange-500 hover:text-black/40">
                                    <Download size={14} />
                                    Tải tất cả
                                </button>
                            </div>

                            <ul className="space-y-2">
                                {group.items.map((item, index) => (
                                    <a
                                        href="#"
                                        key={item.name}
                                        className="flex flex-col gap-3 rounded-2xl border border-gray-400 bg-white px-4 py-3 transition hover:bg-gray-400/30 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white transition">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-black">
                                                        {item.name}
                                                    </span>
                                                    {item.status === "new" && (
                                                        <span className="items-center rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                            Mới
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-black">
                                                    {item.updated}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest  transition">
                                            <div className="flex items-center gap-1.5 rounded-lg text-orange-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition hover:bg-orange-700">
                                                Xem chi tiết
                                                <span aria-hidden>↗</span>
                                            </div>
                                        </div>
                                    </a>
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
