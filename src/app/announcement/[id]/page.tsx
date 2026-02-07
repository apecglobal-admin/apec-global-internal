"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getListAnnouncement, readAnnoucement, getTypeAnnouncement } from "@/src/features/announcement/api/api";
import { toast } from "react-toastify";
import { useAnnouncementData } from "@/src/hooks/annoucementhook";
import { useProfileData } from "@/src/hooks/profileHook";
import { listDepartments } from "@/src/services/api";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type AnnouncementItem = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    departments: {
        id: number;
        name: string;
    };
    isRead: boolean;
    notification_type: {
        id: number;
        name: string;
    };
    documents: Array<{
        id: number;
        name: string;
        file_url: string;
    }>;
};

export default function AnnouncementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch();
    
    const { departments } = useProfileData();
    const { typeAnnouncements, listAnnouncement } = useAnnouncementData();
    const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [activeCategory, setActiveCategory] = useState<number | "all">("all");
    const [selectedDepartment, setSelectedDepartment] = useState<number | "all">("all");
    const [openCategorySelect, setOpenCategorySelect] = useState(false);
    const [openDepartmentSelect, setOpenDepartmentSelect] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setUserToken(token);
    }, []);

    useEffect(() => {
        const getDetail = async () => {
            const payload = {
                token: userToken,
                id: params.id,
                key: "detailAnnouncement"
            };
    
            const res = await dispatch(getListAnnouncement(payload) as any);

            if(res.payload.data){
                setAnnouncement(res.payload.data);
                setIsLoading(false);
            }
        };

        if (userToken) {
            getDetail();
        }
    }, [params.id, userToken]);

    // Load filter data
    useEffect(() => {
        dispatch(getTypeAnnouncement() as any);
        dispatch(listDepartments() as any);
    }, []);

    // Load filtered announcements list
    useEffect(() => {
        const type_id = activeCategory === "all" ? null : activeCategory;
        const department_id = selectedDepartment === "all" ? null : selectedDepartment;
        const payload = {
            token: userToken,
            search: "",
            type_id,
            department_id,
            key: "listAnnouncement"
        };

        if (userToken) {
            dispatch(getListAnnouncement(payload) as any);
        }
    }, [userToken, activeCategory, selectedDepartment]);

    const handleMarkAsRead = async () => {
        if (!announcement || !userToken) return;

        const payload = {
            id: announcement.id,
            token: userToken,
        };

        try {
            const res = await dispatch(readAnnoucement(payload) as any);
            
            if (res.payload.status === 200) {
                setAnnouncement({
                    ...announcement,
                    isRead: true
                });
                toast.success("Đã đánh dấu là đã đọc");
            } else {
                toast.warning(res.payload.data);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleAnnouncementClick = (id: number) => {
        router.push(`/announcement/${id}`);
    };

    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    //         </div>
    //     );
    // }

    if (!announcement) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Không tìm thấy thông báo</p>
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header với nút quay lại */}
                <div className="mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="font-medium">Quay lại danh sách</span>
                    </button>
                </div>

                {/* Layout 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Bộ lọc thông báo
                            </h3>

                            <div className="mb-6">
                                <div
                                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => setOpenCategorySelect(true)}
                                >
                                    <svg
                                        className="h-5 w-5 text-indigo-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>

                                    <div className="flex flex-1 flex-col gap-0.5">
                                        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Loại thông báo
                                        </label>
                                        <Select
                                            value={activeCategory === "all" ? "all" : String(activeCategory)}
                                            onValueChange={(value) => {
                                                setActiveCategory(value === "all" ? "all" : Number(value));
                                                setOpenCategorySelect(false);
                                            }}
                                            open={openCategorySelect}
                                            onOpenChange={setOpenCategorySelect}
                                        >
                                            <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                                <SelectValue placeholder="Chọn loại thông báo" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-white shadow-xl">
                                                <SelectItem value="all" className="cursor-pointer text-black">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                        <span className="capitalize">Tất cả thông báo</span>
                                                    </div>
                                                </SelectItem>

                                                {typeAnnouncements?.map((item: any) => (
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
                                </div>
                            </div>

                            <div className="mb-6">
                                <div
                                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => setOpenDepartmentSelect(true)}
                                >
                                    <svg
                                        className="h-5 w-5 text-indigo-500"
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
                                    <div className="flex flex-1 flex-col gap-0.5">
                                        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Phòng ban
                                        </label>
                                        <Select
                                            value={selectedDepartment === "all" ? "all" : String(selectedDepartment)}
                                            onValueChange={(value) => {
                                                setSelectedDepartment(value === "all" ? "all" : Number(value));
                                                setOpenDepartmentSelect(false);
                                            }}
                                            open={openDepartmentSelect}
                                            onOpenChange={setOpenDepartmentSelect}
                                        >
                                            <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                                <SelectValue placeholder="Chọn phòng ban" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-white shadow-xl">
                                                <SelectItem value="all" className="cursor-pointer text-black">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                        <span className="capitalize">Tất cả phòng ban</span>
                                                    </div>
                                                </SelectItem>

                                                {departments?.map((department: any) => (
                                                    <SelectItem
                                                        key={department.id}
                                                        value={String(department.id)}
                                                        className="cursor-pointer text-black"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                            <span>{department.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                                    Thông báo liên quan ({listAnnouncement?.length || 0})
                                </h4>
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {listAnnouncement?.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            Không có thông báo nào
                                        </div>
                                    ) : (
                                        listAnnouncement?.map((item: AnnouncementItem) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleAnnouncementClick(item.id)}
                                                className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                                                    item.id === announcement.id
                                                        ? "bg-blue-50 border-blue-500"
                                                        : "bg-gray-50 border-transparent hover:bg-gray-100"
                                                }`}
                                            >
                                                <div className="flex items-start gap-2 mb-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                                                            item.notification_type.id === 2
                                                                ? "bg-red-500"
                                                                : "bg-blue-500"
                                                        }`}
                                                    >
                                                        {item.notification_type.name}
                                                    </span>
                                                    {!item.isRead && (
                                                        <span className="h-2 w-2 rounded-full bg-red-500 mt-1"></span>
                                                    )}
                                                </div>
                                                <h5 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                    {item.title}
                                                </h5>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.created_at}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Bên phải */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-white px-6 sm:px-8 py-8 border-b border-gray-400">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span
                                        className={`rounded-full px-4 py-1.5 text-xs font-semibold text-white ${
                                            announcement.notification_type.id === 2
                                                ? "bg-red-500"
                                                : announcement.notification_type.id === 1
                                                ? "bg-blue-500"
                                                : "bg-purple-500"
                                        }`}
                                    >
                                        {announcement.notification_type.name}
                                    </span>
                                    <span className="text-blue-600 text-sm">
                                        {announcement.departments?.name || "Thông báo chung"}
                                    </span>
                                    <span className="text-blue-600 text-sm">
                                        {announcement.created_at}
                                    </span>
                                    {announcement.isRead && (
                                        <span className="ml-auto text-green-600 text-sm font-semibold">
                                            ✓ Đã đọc
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                                    {announcement.title}
                                </h1>
                            </div>

                            {/* Nội dung */}
                            <div className="px-6 sm:px-8 py-8">
                                <div className="prose max-w-none">
                                    <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                                        {announcement.content}
                                    </div>
                                </div>

                                {/* Tài liệu đính kèm */}
                                {announcement.documents && announcement.documents.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                />
                                            </svg>
                                            Tài liệu đính kèm ({announcement.documents.length})
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {announcement.documents.map((doc) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                                >
                                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                                                        <svg
                                                            className="w-7 h-7 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                                                            {doc.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {doc.name.split(".").pop()?.toUpperCase()} file
                                                        </p>
                                                    </div>
                                                    <svg
                                                        className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer với các nút action */}
                            <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
                                {!announcement.isRead && userToken && (
                                    <button
                                        onClick={handleMarkAsRead}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        ✓ Đánh dấu đã đọc
                                    </button>
                                )}
                                <button
                                    onClick={handleGoBack}
                                    className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-md hover:shadow-lg"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}