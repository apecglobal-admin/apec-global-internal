"use client";

import {
    getListProject,
    getStatProject,
    getStatusProject,
} from "@/src/features/project/api/api";
import { useProjectData } from "@/src/hooks/projecthook";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Spinner } from "./ui/spinner";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/components/searchBar";
import { colorClasses, colorMap } from "@/src/utils/color";

interface ProjectRenderType {
    id: number;
    name: string;
    description: string;
    status: string;
    progress: number;
    team_size: number;
    project_status: string;
    departments: any[];
    documents: any[];
    members: any[];
    reportLink: string;
    profileLink: string;
}

export default function ProjectsSection() {
    const dispatch = useDispatch();
    const { listProject, statProject, statusProject, isLoadingListProject } =
        useProjectData();

    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | string>(
        "all"
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    useEffect(() => {
        dispatch(getStatProject() as any);
        dispatch(getStatusProject() as any);
    }, []);

    useEffect(() => {
        const project_status = selectedStatus === "all" ? null : selectedStatus;
        const payload = {
            search: searchQuery,
            project_status,
        };
        dispatch(getListProject(payload) as any);
    }, [selectedStatus, searchQuery]);

    // SHOW selected asset
    useEffect(() => {
        if (selectedAsset) {
            console.log("FILE URL:", selectedAsset);
            window.open(selectedAsset, "_blank");
        }
    }, [selectedAsset]);

    const handleChange = (value: string) => {
        setSearchQuery(value);
    };

    // if(isLoadingListProject){
    //     return(
    //         <section
    //             style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
    //             className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
    //         >
    //             <Spinner text="đang tải dữ liệu"/>
    //         </section>
    //     )
    // }

    return (
        <section
            style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                        Danh mục dự án
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold text-blue-main capitalize sm:text-3xl">
                        Các dự án trọng điểm tập đoàn
                    </h2>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="my-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
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

                                            {statusProject?.map((item: any) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={String(item.id)}
                                                    className="cursor-pointer text-black"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
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
                                                    {item.project_status.name}
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
                                            {item.departments?.map((d: any) => (
                                                <div
                                                    key={d.id}
                                                    className="text-xs text-black"
                                                >
                                                    • {d.name}
                                                </div>
                                            ))}
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
        </section>
    );
}
