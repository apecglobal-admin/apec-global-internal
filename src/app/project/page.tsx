"use client";

import { useEffect, useState } from "react";
import {
    BarChart3,
    Users,
    Calendar,
    FileText,
    Download,
    ExternalLink,
    Target,
    TrendingUp,
} from "lucide-react";
import { colorClasses, colorMap } from "@/src/utils/color";
import { useDispatch } from "react-redux";
import { useProjectData } from "@/src/hooks/projecthook";
import {
    getListProject,
    getStatProject,
    getStatusProject,
} from "@/src/features/project/api/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import SearchBar from "@/components/searchBar";

const clusters = [
    {
        title: "Apec BCI",
        subtitle: "Cộng đồng & đầu tư",
        objective:
            "Xây dựng cộng đồng nhà đầu tư 50.000 thành viên và quỹ đầu tư tác động",
        phase: "Giai đoạn 3/5",
        progress: 60,
        members: ["Ban Đầu tư", "Apec Capital", "Khối Pháp chế"],
        reportLink: "#",
        profileLink: "#",
        reportLabel: "PowerBI",
        assets: ["Hồ sơ dự án", "Pitch deck", "Video overview"],
        color: "blue",
        lastUpdate: "Cập nhật 2 ngày trước",
        daysSinceUpdate: 2,
    },
    {
        title: "Apec Space",
        subtitle: "Super App công nghệ",
        objective:
            "Phát triển siêu ứng dụng tích hợp dịch vụ tài chính, thương mại và chăm sóc sức khỏe",
        phase: "Giai đoạn 4/5",
        progress: 78,
        members: ["Khối Công nghệ", "Sản phẩm", "Marketing"],
        reportLink: "#",
        profileLink: "#",
        reportLabel: "PowerBI",
        assets: ["Roadmap phát triển", "Tài liệu API", "Demo sản phẩm"],
        color: "emerald",
        lastUpdate: "Cập nhật 1 ngày trước",
        daysSinceUpdate: 1,
    },
    {
        title: "GuardCam / Nam Thiên Long",
        subtitle: "An ninh công nghệ 5.0",
        objective:
            "Triển khai 10.000 điểm camera AI và trung tâm điều hành thông minh",
        phase: "Giai đoạn 2/5",
        progress: 42,
        members: ["GuardCam Team", "Khối An ninh", "Đối tác kỹ thuật"],
        reportLink: "#",
        profileLink: "#",
        reportLabel: "Google Sheet",
        assets: ["Catalogue thiết bị", "Video demo", "Checklist triển khai"],
        color: "amber",
        lastUpdate: "Cập nhật 6 ngày trước",
        daysSinceUpdate: 6,
        issues: ["Chậm báo cáo 1 tuần", "Cần đẩy nhanh triển khai"],
    },
    {
        title: "LifeCare",
        subtitle: "Chăm sóc sức khỏe",
        objective:
            "Vận hành hệ sinh thái y tế thông minh, kết nối 120 bệnh viện đối tác",
        phase: "Giai đoạn 3/5",
        progress: 55,
        members: ["LifeCare HQ", "Khối Vận hành", "Đối tác y tế"],
        reportLink: "#",
        profileLink: "#",
        reportLabel: "PowerBI",
        assets: ["Quy trình dịch vụ", "Brochure đối tác", "Video trải nghiệm"],
        color: "purple",
        lastUpdate: "Cập nhật hôm qua",
        daysSinceUpdate: 1,
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
        color: "cyan",
        lastUpdate: "Cập nhật 1 tuần trước",
        daysSinceUpdate: 7,
        issues: ["Đang chờ phê duyệt pháp lý"],
    },
];
// Hàm tự động xác định trạng thái dự án
// const getProjectStatus = (
//     progress: number,
//     phase: any,
//     daysSinceUpdate: any
// ) => {
//     const phaseNumber = parseInt(phase.match(/\d+/)[0]);
//     const totalPhases = parseInt(phase.match(/\/(\d+)/)[1]);
//     const expectedProgress = (phaseNumber / totalPhases) * 100;

//     // Tiêu chí "Cần quan tâm":
//     // 1. Tiến độ thực tế chậm hơn 15% so với giai đoạn dự kiến
//     // 2. Hoặc không cập nhật báo cáo quá 5 ngày
//     // 3. Hoặc tiến độ dưới 30% nhưng đã qua giai đoạn 2

//     if (daysSinceUpdate > 5) return "attention"; // Lâu không cập nhật
//     if (progress < expectedProgress - 15) return "attention"; // Chậm tiến độ
//     if (progress < 30 && phaseNumber >= 2) return "attention"; // Quá chậm so với giai đoạn
//     if (phaseNumber === 1 || progress < 35) return "planning"; // Đang lên kế hoạch
//     return "on-track"; // Đúng tiến độ
// };

export default function ProjectsPage() {
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("progress");

    const dispatch = useDispatch();
    const {
        listProject,
        statProject,
        statusProject,
        isLoadingListProject,
        isLoadingStatProject,
        isLoadingStatusProject,
    } = useProjectData();

    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | string>(
        "all"
    );
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        // dispatch(getListProject() as any);
        dispatch(getStatProject() as any);
        dispatch(getStatusProject() as any);
    }, []);

    // SHOW selected asset
    useEffect(() => {
        if (selectedAsset) {
            window.open(selectedAsset, "_blank");
        }
    }, [selectedAsset]);

    useEffect(() => {
        const project_status =  selectedStatus === "all" ? null : selectedStatus;
        const payload = {
            search: searchQuery,
            project_status
        }
        dispatch(getListProject(payload) as any);

    }, [selectedStatus, searchQuery]);

    const getStatusBadge = (status: string) => {
        const badges: any = {
            "on-track": {
                label: "Đúng tiến độ",
                class: "bg-emerald-500 text-white border-emerald-500/50",
            },
            attention: {
                label: "Cần quan tâm",
                class: "bg-amber-500 text-white border-amber-500/50",
            },
            planning: {
                label: "Lên kế hoạch",
                class: "bg-blue-500 text-white border-blue-500/50",
            },
        };
        return badges[status] || badges["on-track"];
    };

    if (!listProject) {
        return (
            <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
                <Spinner text="đang tải trang..." />
            </div>
        );
    }

    const handleChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        Danh mục dự án
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-blue-main capitallize sm:text-4xl lg:text-5xl">
                                Các dự án trọng điểm tập đoàn
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm text-black sm:text-base">
                                Theo dõi mục tiêu, tiến độ và tài nguyên mỗi dự
                                án. Dữ liệu đồng bộ tự động với báo cáo PowerBI
                                và Google Sheet hàng tuần.
                            </p>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-full border border-orange-500 bg-orange-400 px-5 py-3 text-sm font-semibold uppercase  text-white transition hover:border-orange-600 hover:bg-orange-500 hover:text-black/30">
                            <Download size={16} />
                            Tải báo cáo tổng hợp
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                    {statProject?.map((stat: any, index: number) => {
                        const colorClass =
                            colorClasses[index % colorClasses.length];
                        const borderColor = colorMap[colorClass] || "#FACC15";
                        return (
                            <div
                                key={stat.label}
                                className="group rounded-2xl bg-blue-gradiant-main border-l-6  p-5 shadow-inner shadow-black/10 transition"
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
                                            className={`mt-1 text-lg uppercase  font-semibold ${colorClass}`}
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

                {/* Filters */}
                <div className="mb-6 w-full">
                    <div className="mx-auto max-w-7xl rounded-2xl bg-box-shadow p-4 shadow-lg backdrop-blur-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
                            {/* Search Section - Chiếm phần lớn không gian */}
                            <div className="flex-1">
                                <div className="relative">
                                    <SearchBar
                                        placeholder="Tìm kiếm dự án..."
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {/* Status Filter Section - Compact hơn */}
                            <div className="flex items-center gap-3 lg:flex-shrink-0">
                                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 bg-box-shadow-inset transition-all hover:shadow-md">
                                    {/* Filter Icon */}
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-black">
                                        <svg
                                            className="h-4 w-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                    </div>

                                    {/* Filter Label & Select */}
                                    <div className="flex min-w-[140px] flex-col gap-0.5">
                                        <label className="text-xs font-semibold uppercase text-gray-500">
                                            Trạng thái
                                        </label>
                                        <Select
                                            value={String(selectedStatus)}
                                            onValueChange={(value) =>
                                                setSelectedStatus(
                                                    value === "all"
                                                        ? "all"
                                                        : Number(value)
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-white shadow-xl">
                                                <SelectItem
                                                    value="all"
                                                    className="cursor-pointer text-black"
                                                > 
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                        <span>
                                                            Tất cả trạng thái
                                                        </span>
                                                    </div>
                                                </SelectItem>

                                                {statusProject?.map(
                                                    (item: any) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={String(
                                                                item.id
                                                            )}
                                                            className="cursor-pointer text-black"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                                <span>
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Count Badge */}
                                    <div className="ml-2 flex h-7 min-w-[28px] flex-shrink-0 items-center justify-center rounded-full bg-black px-2 text-xs font-bold text-white bg-box-shadow">
                                        {listProject?.length || 0}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Projects List */}
                <div className="mt-6 space-y-4 max-h-screen lg:max-h-[600px] p-2 overflow-y-auto scroll-smooth">
                    {listProject?.length !== 0 &&
                        listProject?.map((item: any) => (
                            <div
                                key={item.id}
                                className="group rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 transition sm:p-6"
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                                    <div className="flex-1 space-y-5 space-x-5  font-bold">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-extrabold text-blue-main sm:text-2xl">
                                                    {item.name}
                                                </h3>
                                                {item.project_status.name && (
                                                    <span className="text-xs text-black bg-box-shadow-inset bg-tranparent px-2 py-1 rounded-2xl">
                                                        {
                                                            item.project_status
                                                                .name
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm uppercase description-2-lines  text-blue-950">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="rounded-full border border-gray-500 bg-white px-3 py-1.5 text-black">
                                                Thành viên: {item.team_size}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.documents?.map(
                                                (asset: any, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedAsset(
                                                                asset.file_url
                                                            )
                                                        }
                                                        className="rounded-full bg-blue-gradiant-main bg-box-shadow-inset px-3 py-1.5 text-xs text-black transition hover:border-blue-500 hover:bg-[#7dc0d6] hover:text-black/50"
                                                    >
                                                        {asset.name}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full space-y-4 lg:w-80 font-bold">
                                        <div>
                                            <div className="flex items-center justify-between text-xs uppercase  font-bold text-orange-600">
                                                <span>Tiến độ hoàn thành</span>
                                                <span className="text-lg font-bold text-orange-600">
                                                    {item.progress}%
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 shadow-lg shadow-cyan-500/50">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all"
                                                    style={{
                                                        width: `${item.progress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-slate-800 bg-white p-3">
                                            <div className="mb-2 text-xs font-semibold uppercase  text-black">
                                                Phòng ban phụ trách
                                            </div>
                                            <div className="space-y-1">
                                                {item.departments?.map(
                                                    (d: any) => (
                                                        <div
                                                            key={d.id}
                                                            className="text-xs text-black"
                                                        >
                                                            • {d.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <a
                                                href="#"
                                                className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-black/50"
                                            >
                                                <span className="flex items-center gap-2">
                                                    Báo cáo tiến độ tuần/tháng
                                                </span>
                                            </a>

                                            <a
                                                href="#"
                                                className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-black/50"
                                            >
                                                <span className="flex items-center gap-2">
                                                    Hồ sơ năng lực
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {listProject?.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-blue-gradiant-main px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                            Không có mục nào cho bộ lọc hiện tại.
                        </div>
                    )}
                </div>

                {/* Empty State */}

                {/* Timeline Overview */}
                {/* <div className="mt-8 rounded-2xl bg-blue-gradiant-main bg-box-shadow p-6">
                    <h3 className="mb-4 text-xl font-bold text-blue-main capitalize">
                        Tổng quan roadmap
                    </h3>
                    <div className="space-y-3"></div>
                </div> */}
            </div>
        </div>
    );
}
