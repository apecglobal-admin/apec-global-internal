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
import { getListProject, getStatProject } from "@/src/features/project/api/api";

const projectStats = [
    {
        value: "5",
        label: "Dự án chính",
        subLabel: "Trọng điểm tập đoàn",
        icon: Target,
    },
    {
        value: "52%",
        label: "Tiến độ TB",
        subLabel: "Cập nhật hàng tuần",
        icon: TrendingUp,
    },
    {
        value: "15",
        label: "Phòng ban",
        subLabel: "Tham gia triển khai",
        icon: Users,
    },
];

// Hàm tự động xác định trạng thái dự án
const getProjectStatus = (
    progress: number,
    phase: any,
    daysSinceUpdate: any
) => {
    const phaseNumber = parseInt(phase.match(/\d+/)[0]);
    const totalPhases = parseInt(phase.match(/\/(\d+)/)[1]);
    const expectedProgress = (phaseNumber / totalPhases) * 100;

    // Tiêu chí "Cần quan tâm":
    // 1. Tiến độ thực tế chậm hơn 15% so với giai đoạn dự kiến
    // 2. Hoặc không cập nhật báo cáo quá 5 ngày
    // 3. Hoặc tiến độ dưới 30% nhưng đã qua giai đoạn 2

    if (daysSinceUpdate > 5) return "attention"; // Lâu không cập nhật
    if (progress < expectedProgress - 15) return "attention"; // Chậm tiến độ
    if (progress < 30 && phaseNumber >= 2) return "attention"; // Quá chậm so với giai đoạn
    if (phaseNumber === 1 || progress < 35) return "planning"; // Đang lên kế hoạch
    return "on-track"; // Đúng tiến độ
};

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
].map((project) => ({
    ...project,
    status: getProjectStatus(
        project.progress,
        project.phase,
        project.daysSinceUpdate
    ),
}));


export default function ProjectsPage() {
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("progress");

    const dispatch = useDispatch();
    const { listProject, statProject } = useProjectData();

    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    useEffect(() => {
        dispatch(getStatProject() as any);
        dispatch(getListProject() as any);
    }, []);

    // SHOW selected asset
    useEffect(() => {
        if (selectedAsset) {
            console.log("FILE URL:", selectedAsset);
            window.open(selectedAsset, "_blank");
        }
    }, [selectedAsset]);



    const filteredProjects = clusters.filter(
        (project) => filterStatus === "all" || project.status === filterStatus
    );

    

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
                        <button className="flex items-center justify-center gap-2 rounded-full border border-orange-500 bg-orange-400 px-5 py-3 text-sm font-semibold uppercase  text-white transition hover:border-orange-600 hover:bg-orange-500 hover:text-white">
                            <Download size={16} />
                            Tải báo cáo tổng hợp
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                    {statProject.map((stat: any, index: number) => {
                        const colorClass =
                            colorClasses[index % colorClasses.length];
                        const borderColor = colorMap[colorClass] || "#FACC15";
                        const Icon = stat.icon;

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
                                        <div className={`mt-1 text-lg uppercase  font-semibold ${colorClass}`}>
                                            {stat.label}
                                        </div>
                                        <div className="text-[11px] text-black">
                                            {stat.subLabel}
                                        </div>
                                    </div>
                                    <Icon
                                        size={24}
                                        className={`${colorClass}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-3 bg-blue-gradiant-main p-3 rounded-full  inset-shadow-sm inset-shadow-black/50">
                    <div className="text-xs font-bold uppercase  text-black ml-4">
                        Lọc theo trạng thái:
                    </div>
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase transition ${
                            filterStatus === "all"
                                ? "bg-blue-500 text-white border border-blue-500"
                                : "bg-white text-gray-500 bg-box-shadow hover:text-slate-200"
                        }`}
                    >
                        Tất cả ({clusters.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("on-track")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase transition ${
                            filterStatus === "on-track"
                                ? "bg-emerald-500 text-white border border-emerald-500/50"
                                : "bg-white text-gray-500 bg-box-shadow hover:text-slate-200"
                        }`}
                    >
                        Đúng tiến độ (
                        {clusters.filter((p) => p.status === "on-track").length}
                        )
                    </button>
                    <button
                        onClick={() => setFilterStatus("attention")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase transition ${
                            filterStatus === "attention"
                                ? "bg-amber-500 text-white border border-amber-500/50"
                                : "bg-white text-gray-500 bg-box-shadow hover:text-slate-200"
                        }`}
                    >
                        Cần quan tâm (
                        {
                            clusters.filter((p) => p.status === "attention")
                                .length
                        }
                        )
                    </button>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    {filteredProjects.map((project) => {
                        const statusBadge = getStatusBadge(project.status);
                        return (
                            <article
                                key={project.title}
                                className="group rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 transition  sm:p-6"
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                                    {/* Left Column */}
                                    <div className="flex-1 space-y-4 font-bold">
                                        <div>
                                            <div className="flex flex-wrap items-start gap-3">
                                                <h3 className="text-xl font-extrabold text-blue-950 sm:text-2xl ">
                                                    {project.title}
                                                </h3>
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusBadge.class}`}
                                                >
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm uppercase  text-blue-950">
                                                {project.subtitle}
                                            </p>
                                        </div>

                                        <p className="text-sm text-black">
                                            {project.objective}
                                        </p>

                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="rounded-full border border-gray-500 bg-white px-3 py-1.5 text-black">
                                                {project.phase}
                                            </span>
                                            <span className="rounded-full border border-gray-500 bg-white  px-3 py-1.5 text-black">
                                                <Users
                                                    size={12}
                                                    className="mr-1 inline"
                                                />
                                                Thành viên:{" "}
                                                {project.members.length}
                                            </span>
                                            <span className="rounded-full border border-gray-500 bg-white px-3 py-1.5 text-black">
                                                <Calendar
                                                    size={12}
                                                    className="mr-1 inline"
                                                />
                                                {project.lastUpdate}
                                            </span>
                                        </div>

                                        {/* Assets */}
                                        <div className="flex flex-wrap gap-2 ">
                                            {project.assets.map((asset) => (
                                                <a
                                                    key={asset}
                                                    href="#"
                                                    className="rounded-full bg-blue-gradiant-main bg-box-shadow-inset px-3 py-1.5 text-xs text-black transition hover:border-blue-500 hover:bg-[#7dc0d6] hover:text-white"
                                                >
                                                    {asset}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="w-full space-y-4 lg:w-80 font-bold">
                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between text-xs uppercase  font-bold text-orange-600">
                                                <span>Tiến độ hoàn thành</span>
                                                <span className="text-lg font-bold text-orange-600">
                                                    {project.progress}%
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 shadow-lg shadow-cyan-500/50">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all "
                                                    style={{
                                                        width: `${project.progress}%`,
                                                        
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Team Members */}
                                        <div className="rounded-xl border border-slate-800 bg-white p-3">
                                            <div className="mb-2 text-xs font-semibold uppercase  text-black">
                                                Thành viên phụ trách
                                            </div>
                                            <div className="space-y-1">
                                                {project.members.map(
                                                    (member) => (
                                                        <div
                                                            key={member}
                                                            className="text-xs text-black"
                                                        >
                                                            • {member}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="space-y-2">
                                            <a
                                                href={project.reportLink}
                                                className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-white"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <BarChart3 size={16} />
                                                    Báo cáo tiến độ
                                                </span>
                                                <span className="text-xs uppercase ">
                                                    {project.reportLabel}
                                                </span>
                                            </a>
                                            <a
                                                href={project.profileLink}
                                                className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-white"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <FileText size={16} />
                                                    Hồ sơ năng lực
                                                </span>
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>

                                        {/* Issues Alert - Chỉ hiển thị nếu có vấn đề */}
                                        {project.issues &&
                                            project.issues.length > 0 && (
                                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/40 p-3">
                                                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase  text-orange-600">
                                                        <span>⚠️</span>
                                                        <span>
                                                            Vấn đề cần xử lý
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {project.issues.map(
                                                            (issue, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="text-xs text-orange-600"
                                                                >
                                                                    • {issue}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="text-5xl">📂</div>
                        <p className="mt-4 text-slate-400">
                            Không tìm thấy dự án phù hợp
                        </p>
                    </div>
                )}

                {/* Timeline Overview */}
                <div className="mt-8 rounded-2xl bg-blue-gradiant-main bg-box-shadow p-6">
                    <h3 className="mb-4 text-xl font-bold text-blue-main capitalize">
                        Tổng quan roadmap
                    </h3>
                    <div className="space-y-3">
                        {clusters.map((project, index) => (
                            <div
                                key={project.title}
                                className="flex items-center gap-4"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-semibold text-white">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-blue-950">
                                                {project.title}
                                            </div>
                                            <div className="text-xs text-black/70">
                                                {project.phase}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-orange-400">
                                                {project.progress}%
                                            </div>
                                            <div className="text-xs text-black">
                                                {project.lastUpdate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
