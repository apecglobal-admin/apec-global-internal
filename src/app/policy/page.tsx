"use client";

import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getListPolicy, getStatPolicy } from "@/src/features/policy/api/api";
import { usePolicyData } from "@/src/hooks/policyhook";
import { Spinner } from "@/components/ui/spinner";

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
        name: "Chính sách nhân sự",
        description:
            "Quản lý toàn bộ hành trình nhân sự từ tuyển dụng, đào tạo đến phúc lợi thống nhất trên toàn hệ thống.",
        policies: [
            {
                title: "Quy trình tuyển dụng nội bộ",
                description: "Cập nhật 15/01/2025",
                status: "active",
            },
            {
                title: "Chính sách đào tạo & phát triển",
                description: "Cập nhật 10/01/2025",
                status: "active",
            },
            {
                title: "Quy định phúc lợi ApecCare",
                description: "Cập nhật 05/01/2025",
                status: "new",
            },
        ],
    },

    {
        name: "Chính sách vận hành – công nghệ",
        description:
            "Chuẩn hóa vận hành, an ninh dữ liệu và hướng dẫn nền tảng công nghệ trọng yếu của tập đoàn",
        policies: null,
    },
];

export default function PoliciesPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const dispatch = useDispatch();

    const { statPolicy, listPolicy, isLoadingListPolicy } = usePolicyData();

    
    useEffect(() => {
        dispatch(getStatPolicy() as any);
    }, []);
    
    useEffect(() => {
        const fetchApi = async () => {
            const payload = {
                filter: searchQuery,
            };

            await dispatch(getListPolicy(payload) as any);            
        };
        fetchApi();
    }, [searchQuery]);

    const handleChange = (value: string) => {
        setSearchQuery(value)
    }

    if(statPolicy.length === 0 ){
        return(
            <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
                <Spinner text="đang tải trang..."/>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
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
                    {/* <div className="flex flex-wrap gap-2">
                        {quickLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2 rounded-full border border-orange-500  bg-orange-400 px-4 py-2 text-xs uppercase  text-white font-bold transition hover:border-gray-400 hover:bg-orange-500 hover:text-black/30"
                            >
                                {link.label}
                                <span aria-hidden>↗</span>
                            </a>
                        ))}
                    </div> */}
                </div>

                {/* ✅ Stats Grid cập nhật */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statPolicy.map((stat: any, index: number) => {
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
                                            className={`mt-1 text-lg uppercase   font-semibold ${colorClass}`}
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
                    <SearchBar 
                        placeholder="Tìm kiếm chính sách, biểu mẫu..."  
                        onChange={handleChange}
                    />

                    {/* <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase  text-white transition hover:bg-blue-500 sm:w-auto">
                        <Search size={16} />
                        Tra cứu nhanh
                    </button>

                    <div className="space-y-3 rounded-2xl border border-gray-500 bg-[#d6e8ee] p-4">
                        <div className="text-md font-semibold uppercase  text-blue-950">
                            Danh mục nổi bật
                        </div>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between rounded-xl border border-gray-400 bg-white px-3 py-2 text-sm text-black transition hover:border-gray-400 hover:bg-gray-300 hover:text-black/30"
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
                {isLoadingListPolicy && (
                    <section
                        style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
                        className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
                    >
                        <Spinner text="đang load dữ liệu"/>
                    </section>
                )}
                
                {/* Policy Groups Section */}
                {!isLoadingListPolicy && (
                    <div className="space-y-6">

                        {listPolicy?.map((group: any, groupIndex: number) => {
                            const hasPolicies =
                                Array.isArray(group.policies) &&
                                group.policies.length > 0;

                            return (
                                <article
                                    key={groupIndex}
                                    className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-box-shadow p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                                >
                                    {/* Group Header */}
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <h2 className="text-xl font-extrabold text-blue-main capitalize sm:text-2xl">
                                                {group.name}
                                            </h2>
                                            <span className="rounded-full bg-orange-400 border border-orange-500 px-3 py-1 text-xs font-semibold text-white">
                                                {hasPolicies
                                                    ? `${group.policies.length} tài liệu`
                                                    : "0 tài liệu"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-black/80">
                                            {group.description}
                                        </p>
                                    </div>

                                    {/* <div className="flex flex-wrap items-center gap-2 text-xs uppercase  text-blue-300">
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
                                    </div> */}

                                    {/* Policy List */}
                                    {hasPolicies ? (
                                        <ul className="space-y-2">
                                            {group.policies.map(
                                                (policy: any, index: number) => (
                                                    <a
                                                        href="#"
                                                        key={`${groupIndex}-${index}`}
                                                        className="flex flex-col gap-3 rounded-2xl bg-box-shadow bg-white px-4 py-3 transition hover:bg-gray-100 sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white">
                                                                {String(
                                                                    index + 1
                                                                ).padStart(2, "0")}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-black">
                                                                        {
                                                                            policy.title
                                                                        }
                                                                    </span>
                                                                    {policy.status ===
                                                                        "new" && (
                                                                        <span className="items-center rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                                            Mới
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-black">
                                                                    {
                                                                        policy.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs uppercase  transition text-orange-600">
                                                            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold hover:bg-orange-100">
                                                                Xem chi tiết{" "}
                                                                <span aria-hidden>
                                                                    ↗
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-gray-400 bg-gray-50 p-4 text-sm text-gray-600 italic">
                                            Chưa có tài liệu nào được cập nhật cho
                                            nhóm này.
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                        {listPolicy.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-blue-gradiant-main px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                                Không có chính sách nào cho bộ lọc hiện tại.
                            </div>
                        )}
                    </div>

                )}

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
