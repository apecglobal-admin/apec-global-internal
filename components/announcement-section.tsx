"use client";

import { getTypeAnnouncement } from "@/src/services/api";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type AnnouncementCategory = "general" | "urgent" | "personal";

type AnnouncementItem = {
    id: number;
    title: string;
    summary: string;
    date: string;
    category: AnnouncementCategory;
    department: string;
    read: boolean;
};

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
        summary:
            "Ngừng truy cập từ 20:00-22:00, liên hệ IT nếu có nghiệp vụ phát sinh",
        date: "2025-10-28",
        category: "urgent",
        department: "Công nghệ",
        read: false,
    },
    {
        id: 3,
        title: "Thông báo KPI cá nhân quý III",
        summary:
            "Vui lòng rà soát chỉ số và xác nhận trước 30/10 để tổng hợp thi đua",
        date: "2025-10-27",
        category: "personal",
        department: "Nhân sự",
        read: true,
    },
    {
        id: 4,
        title: "Triển khai chính sách phúc lợi mới",
        summary:
            "Áp dụng thẻ LifeCare cho toàn bộ nhân sự làm việc từ 6 tháng trở lên",
        date: "2025-10-26",
        category: "general",
        department: "Nhân sự",
        read: false,
    },
    {
        id: 5,
        title: "Lịch họp dự án Apec Space",
        summary:
            "Team sản phẩm cập nhật tiến độ sprint vào 09:00 thứ Hai hàng tuần",
        date: "2025-10-25",
        category: "personal",
        department: "Công nghệ",
        read: true,
    },
];

const departments = [
    "Tất cả",
    "Ban Lãnh đạo",
    "Hành chính",
    "Nhân sự",
    "Công nghệ",
    "Tài chính",
];

const mapApiIdToCategory = (id: string): AnnouncementCategory => {
    switch (id) {
        case "1":
            return "general";
        case "2":
            return "urgent";
        case "3":
            return "personal";
        default:
            return "general";
    }
};

export default function AnnouncementSection() {
    const dispatch = useDispatch();
    const { typeAnnouncements } = useSelector(
        (state: any) => state.announcement
    );

    const [activeCategory, setActiveCategory] =
        useState<AnnouncementCategory>("general");
    const [selectedDepartment, setSelectedDepartment] =
        useState<string>("Tất cả");
    const [isLoading, setIsLoading] = useState(false);

    // 🟩 State để quản lý danh sách thông báo (cho phép cập nhật read)
    const [announcements, setAnnouncements] =
        useState<AnnouncementItem[]>(initialAnnouncements);

    useEffect(() => {
        dispatch(getTypeAnnouncement() as any);
    }, [dispatch]);

    // 🟦 Lọc theo loại & phòng ban
    const filtered = useMemo(() => {
        return announcements.filter((item) => {
            const categoryMatch = item.category === activeCategory;
            const departmentMatch =
                selectedDepartment === "Tất cả" ||
                item.department === selectedDepartment;
            return categoryMatch && departmentMatch;
        });
    }, [announcements, activeCategory, selectedDepartment]);

    // ✅ Hàm bật/tắt đánh dấu đọc
    const toggleRead = (id: number) => {
        setAnnouncements((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, read: !item.read } : item
            )
        );
    };

    // 🧭 Tạo danh sách category từ API
    const categories =
        typeAnnouncements?.data?.map((item: any) => ({
            key: mapApiIdToCategory(item.id),
            label: item.name,
        })) || [];

    return (
        <section
            style={{ boxShadow: "inset 0 0 7px rgba(0, 0, 0, 0.5)" }}
            className="rounded-3xl bg-white p-6 sm:p-7 lg:p-8"
        >
            <div className="flex flex-col gap-4">
                <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.4em] text-blue-950 sm:text-lg">
                        Thông báo
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-blue-main sm:text-3xl capitalize">
                        Trung tâm thông báo nội bộ
                    </h2>
                    <p className="mt-2 max-w-2xl font-semibold text-sm text-black/80">
                        Cập nhật tức thời từ Ban Lãnh đạo, hành chính, nhân sự
                        và các dự án. Đánh dấu đã đọc để đồng bộ với hồ sơ KPI
                        của bạn.
                    </p>
                </div>

                {/* Lọc phòng ban */}
                <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl bg-box-shadow bg-blue-gradiant-main px-3 py-2 text-sm text-slate-300 sm:w-auto sm:flex-nowrap sm:rounded-full sm:px-4 ">
                    <span className="text-xs uppercase tracking-wide text-black sm:text-sm">
                        Lọc phòng ban:
                    </span>
                    <select
                        value={selectedDepartment}
                        onChange={(event) =>
                            setSelectedDepartment(event.target.value)
                        }
                        className="w-full bg-transparent text-black focus:outline-none sm:w-auto"
                    >
                        {departments.map((department) => (
                            <option
                                key={department}
                                value={department}
                                className="bg-gray-300 text-black"
                            >
                                {department}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Nút category */}
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                {categories.map((item: any) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveCategory(item.key)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:px-5 sm:text-sm ${
                            activeCategory === item.key
                                ? "bg-active-blue-metallic text-white"
                                : "border border-gray-600/50 bg-white text-gray-600/50 hover:border-teal-300/80 hover:text-black/60"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Danh sách thông báo */}
            <div className="mt-7 space-y-4 sm:mt-8">
                {isLoading && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-gray-300 px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                        Đang tải dữ liệu...
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-blue-gradiant-main px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                        Không có thông báo nào cho bộ lọc hiện tại.
                    </div>
                )}

                {!isLoading &&
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col gap-4 rounded-2xl bg-box-shadow bg-blue-gradiant-main p-4 sm:p-4 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-white">
                                    <span
                                        className={`rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs text-black  ${
                                            item.category === "urgent"
                                                ? "bg-red-500/80 bg-box-shadow-inset "
                                                : "bg-blue-main bg-box-shadow-inset "
                                        }`}
                                    >
                                        {item.category === "urgent"
                                            ? "Khẩn cấp"
                                            : item.category === "general"
                                            ? "Nội bộ"
                                            : "Cá nhân"}
                                    </span>
                                    <span className="text-blue-950 font-semibold">
                                        {item.department}
                                    </span>
                                    <span className="text-blue-950 font-semibold">
                                        {item.date}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-lg font-semibold text-black sm:text-xl">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-black/80">
                                    {item.summary}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 md:flex-col md:items-end">
                                <span
                                    className={`text-xs font-semibold uppercase tracking-widest ${
                                        item.read
                                            ? "text-green-700"
                                            : "text-red-500/80"
                                    }`}
                                >
                                    {item.read ? "Đã đọc" : "Chưa đọc"}
                                </span>
                                <button
                                    onClick={() => toggleRead(item.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border
                                      ${
                                          item.read
                                              ? "bg-gray-100 text-gray-500 border-gray-300 hover:bg-white hover:text-gray-700"
                                              : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:border-blue-800"
                                      }`}
                                >
                                    {item.read
                                        ? "Đánh dấu chưa đọc"
                                        : "Đánh dấu đã đọc"}
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}
