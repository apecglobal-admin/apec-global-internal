"use client";

import {
    getListAnnouncement,
    getTypeAnnouncement,
    readAnnoucement,
} from "@/src/features/announcement/api/api";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProfileData } from "@/src/hooks/profileHook";
import { listDepartments } from "@/src/services/api";
import { toast } from "react-toastify";
import { useAnnouncementData } from "@/src/hooks/annoucementhook";
import { Spinner } from "./ui/spinner";
import SearchBar from "./searchBar";

type AnnouncementItem = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    departments: any;
    isRead: boolean;
    notification_type: any;
    documents: any;
};

export default function AnnouncementSection() {
    const dispatch = useDispatch();

    const { departments, isLoadingDepartments, userInfo } = useProfileData();
    const { typeAnnouncements, listAnnouncement, isLoadingListAnnoucement } =
        useAnnouncementData();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [activeCategory, setActiveCategory] = useState<number | "all">(2);
    const [selectedDepartment, setSelectedDepartment] = useState<
        number | "all"
    >("all");
    

    const [userToken, setUserToken] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] =
        useState<AnnouncementItem | null>(null);

    const [openCategorySelect, setOpenCategorySelect] = useState(false);
    const [openDepartmentSelect, setOpenDepartmentSelect] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        
        setUserToken(token);
    }, [userInfo]);
    
    useEffect(() => {
        // if(!searchQuery) return;

        const type_id = activeCategory === "all" ? null : activeCategory;
        const department_id = selectedDepartment === "all" ? null : selectedDepartment;
        const payload = {
            token: userToken,
            search: searchQuery,
            type_id,
            department_id
        };

        dispatch(getListAnnouncement(payload) as any);
    }, [userToken, searchQuery, activeCategory, selectedDepartment]);

    useEffect(() => {
        dispatch(getTypeAnnouncement() as any);
        dispatch(listDepartments() as any);
    }, []);

    // useEffect(() => {
    //     if (listAnnouncement.length === 0) return;
    //     setAnnouncements(listAnnouncement);
    // }, [listAnnouncement]);

    // 🟦 Lọc theo loại & phòng ban
    // const filtered = useMemo(() => {
    //     return announcements.filter((item) => {
    //         // Lọc theo category
    //         const categoryMatch =
    //             activeCategory === "all" ||
    //             item.notification_type?.id === activeCategory;

    //         // Lọc theo phòng ban
    //         const departmentMatch =
    //             selectedDepartment === "all" ||
    //             item.departments?.id === selectedDepartment;

    //         return categoryMatch && departmentMatch;
    //     });
    // }, [announcements, activeCategory, selectedDepartment]);

    // ✅ Hàm bật/tắt đánh dấu đọc
    const toggleRead = async (id: number) => {
        if (!userInfo) {
            toast.warning("Bạn phải đăng nhập mới có thể xem thông báo");
            return;
        }

        const payload = {
            id,
            token: userToken,
        };

        const res = await dispatch(readAnnoucement(payload) as any);

        if (res.payload.status === 200) {
            const type_id = activeCategory === "all" ? null : activeCategory;
            const department_id = selectedDepartment === "all" ? null : selectedDepartment;
            const payload = {
                token: userToken,
                search: searchQuery,
                type_id,
                department_id
            };
            dispatch(getListAnnouncement(payload) as any);
        } else {
            toast.warning(res.payload.data);
        }
    };

    const handleShowDetail = (id: number) => {        
        const found = listAnnouncement.find((a: any) => Number(a.id) === id);

        if (found) {
            
            setSelectedAnnouncement(found);
            setOpenDialog(true);
        }
    };

    // if (isLoadingListAnnoucement) {
    //     return (
    //         <section
    //             style={{ boxShadow: "inset 0 0 7px rgba(0, 0, 0, 0.5)" }}
    //             className="rounded-3xl bg-white p-6 sm:p-7 lg:p-8"
    //         >
    //             <Spinner />
    //         </section>
    //     );
    // }

    const handleChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <section
            style={{ boxShadow: "inset 0 0 7px rgba(0, 0, 0, 0.5)" }}
            className="rounded-3xl bg-white p-6 sm:p-7 lg:p-8"
        >
            <div className="flex flex-col gap-4 ">
                <div>
                    <div className="text-xs font-extrabold uppercase text-blue-950 sm:text-lg">
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
                <div className="flex w-full flex-col gap-3 rounded-2xl bg-box-shadow p-4">
                    <div className="w-full">
                        <SearchBar
                            placeholder="Tìm kiếm thông báo..."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Category Filter Section */}
                        <div
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 bg-box-shadow-inset transition-all hover:shadow-md sm:flex-1 cursor-pointer"
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
                                    value={
                                        activeCategory === "all"
                                            ? "all"
                                            : String(activeCategory)
                                    }
                                    onValueChange={(value) => {
                                        setActiveCategory(
                                            value === "all"
                                                ? "all"
                                                : Number(value)
                                        );
                                        setOpenCategorySelect(false);
                                    }}
                                    open={openCategorySelect}
                                    onOpenChange={setOpenCategorySelect}
                                >
                                    {/* ⬇️ UI giống Department */}
                                    <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                        <SelectValue placeholder="Chọn loại thông báo" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white shadow-xl">
                                        <SelectItem
                                            value="all"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                <span className="capitalize">
                                                    Tất cả thông báo
                                                </span>
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

                        {/* Department Filter Section */}
                        <div
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 bg-box-shadow-inset transition-all hover:shadow-md sm:flex-1 cursor-pointer"
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
                                    value={
                                        selectedDepartment === "all"
                                            ? "all"
                                            : String(selectedDepartment)
                                    }
                                    onValueChange={(value) => {
                                        setSelectedDepartment(
                                            value === "all"
                                                ? "all"
                                                : Number(value)
                                        );
                                        setOpenDepartmentSelect(false);
                                    }}
                                    open={openDepartmentSelect}
                                    onOpenChange={setOpenDepartmentSelect}
                                >
                                    <SelectTrigger className="h-auto border-none p-0 text-sm font-medium text-gray-800 hover:text-indigo-600">
                                        <SelectValue placeholder="Chọn phòng ban" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white shadow-xl">
                                        <SelectItem
                                            value="all"
                                            className="cursor-pointer text-black"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                <span className="capitalize">
                                                    Tất cả phòng ban
                                                </span>
                                            </div>
                                        </SelectItem>

                                        {departments.map((department: any) => (
                                            <SelectItem
                                                key={department.id}
                                                value={String(department.id)}
                                                className="cursor-pointer text-black"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                    <span>
                                                        {department.name}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút category */}
            {/* <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <button
                    onClick={() => setActiveCategory(0)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase  transition sm:px-5 sm:text-sm ${
                        activeCategory === 0
                            ? "bg-active-blue-metallic text-white"
                            : "border border-gray-300 bg-white text-gray-600/50 hover:border-teal-300/80 hover:text-black/30"
                    }`}
                >
                    all thông báo
                </button>
                {typeAnnouncements &&
                    typeAnnouncements.map((item: any) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveCategory(Number(item.id))}
                            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase  transition sm:px-5 sm:text-sm ${
                                activeCategory === Number(item.id)
                                    ? "bg-active-blue-metallic text-white"
                                    : "border border-gray-300 bg-white text-gray-600/50 hover:border-teal-300/80 hover:text-black/30"
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
            </div> */}

            {/* Danh sách thông báo */}
            <div
                className="mt-7 sm:mt-8 space-y-4 overflow-y-auto pr-4 py-3"
                style={{ maxHeight: "420px" }}
            >
                {/* {isLoading && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-gray-300 px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                        Đang tải dữ liệu...
                    </div>
                )} */}

                {listAnnouncement?.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-blue-gradiant-main px-5 py-10 text-center text-slate-400 sm:px-6 sm:py-12">
                        Không có thông báo nào cho bộ lọc hiện tại.
                    </div>
                )}

                {listAnnouncement?.map((item: AnnouncementItem) => (
                    <div
                        onClick={() => handleShowDetail(item.id)}
                        key={item.id}
                        className="flex flex-col gap-4 rounded-2xl bg-box-shadow-inset bg-blue-gradiant-main p-4 sm:p-4 md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3 text-xs uppercase  text-white">
                                <span
                                    className={`rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs text-black  ${
                                        item.notification_type.id === 2
                                            ? "bg-red-500/80 bg-box-shadow-inset "
                                            : "bg-blue-main bg-box-shadow-inset "
                                    }`}
                                >
                                    {item.notification_type.id === 2
                                        ? "Khẩn cấp"
                                        : item.notification_type.id === 1
                                        ? "Nội bộ"
                                        : "Cá nhân"}
                                </span>
                                <span className="text-blue-950 font-semibold">
                                    {item.departments?.name ||
                                        "thông báo chung"}
                                </span>
                                <span className="text-blue-950 font-semibold">
                                    {item.created_at}
                                </span>
                            </div>
                            <h3 className="mt-3 text-lg font-semibold text-black sm:text-xl">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-black/80">
                                {item.content}
                            </p>
                        </div>
                        {userToken && (
                            <div className="flex items-center gap-3 sm:gap-4 md:flex-col md:items-end">
                                <span
                                    className={`text-xs font-semibold uppercase  ${
                                        item.isRead
                                            ? "text-green-700"
                                            : "text-red-500/80"
                                    }`}
                                >
                                    {item.isRead ? "Đã đọc" : "Chưa đọc"}
                                </span>
                                {!item.isRead && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn sự kiện nổi bọt lên parent
                                            toggleRead(item.id);
                                        }}
                                        className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border
                   bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:border-blue-800"
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="bg-white ">
                        {selectedAnnouncement && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-black">
                                        {selectedAnnouncement.title}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                                        <span>
                                            {selectedAnnouncement.created_at}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {
                                                selectedAnnouncement.departments
                                                    ?.name
                                            }
                                        </span>
                                        <span>•</span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                                            {
                                                selectedAnnouncement
                                                    .notification_type.name
                                            }
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-6 space-y-4">
                                    {/* Nội dung thông báo */}
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        <p>{selectedAnnouncement.content}</p>
                                    </div>

                                    {/* Hiển thị documents nếu có */}
                                    {selectedAnnouncement.documents?.length >
                                        0 && (
                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                                Tài liệu đính kèm (
                                                {
                                                    selectedAnnouncement
                                                        .documents.length
                                                }
                                                )
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedAnnouncement.documents.map(
                                                    (doc: any) => (
                                                        <a
                                                            key={doc.id}
                                                            href={doc.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                                                        >
                                                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <svg
                                                                    className="w-6 h-6 text-green-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                                    {doc.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {doc.name
                                                                        .split(
                                                                            "."
                                                                        )
                                                                        .pop()
                                                                        ?.toUpperCase()}{" "}
                                                                    file
                                                                </p>
                                                            </div>
                                                            <svg
                                                                className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        {!selectedAnnouncement.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn sự kiện nổi bọt lên parent
                                                    toggleRead(
                                                        selectedAnnouncement.id
                                                    );
                                                }}
                                                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border
                   bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:border-blue-800"
                                            >
                                                Đánh dấu đã đọc
                                            </button>
                                        )}
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors">
                                            Đóng
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
