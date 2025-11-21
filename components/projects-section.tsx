"use client";

import { getListProject, getStatProject } from "@/src/features/project/api/api";
import { useProjectData } from "@/src/hooks/projecthook";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Spinner } from "./ui/spinner";

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
    const { 
        listProject,
        statProject, 
        isLoadingListProject,
    } = useProjectData();

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

    if(isLoadingListProject){
        return(
            <section
                style={{ boxShadow: "inset 0 0 10px rgba(122, 122, 122, 0.5)" }}
                className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
            >
                <Spinner text="đang tải dữ liệu"/>
            </section>
        )
    }

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

            <div className="mt-6 space-y-4 max-h-screen  lg:max-h-[600px] p-2 overflow-y-auto scroll-smooth">
                {listProject && listProject.map((item: any) => (
                    <div
                        key={item.id}
                        className="group rounded-2xl bg-blue-gradiant-main bg-box-shadow p-5 transition sm:p-6"
                    >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            <div className="flex-1 space-y-5 space-x-5  font-bold">
                                <div>
                                    <div className="flex flex-wrap items-start gap-3">
                                        <h3 className="text-xl font-extrabold text-blue-main sm:text-2xl">
                                            {item.name}
                                        </h3>
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
                                                className="rounded-full bg-blue-gradiant-main bg-box-shadow-inset px-3 py-1.5 text-xs text-black transition hover:border-blue-500 hover:bg-[#7dc0d6] hover:text-black/30"
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
                                        className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-black/30"
                                    >
                                        <span className="flex items-center gap-2">
                                            Báo cáo tiến độ tuần/tháng
                                        </span>
                                    </a>

                                    <a
                                        href="#"
                                        className="flex items-center justify-between rounded-xl bg-box-shadow bg-blue-gradiant-main px-4 py-2.5 text-sm text-black transition hover:bg-orange-500 hover:text-black/30"
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
            </div>
        </section>
    );
}
