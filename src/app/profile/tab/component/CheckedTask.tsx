import React, { useEffect, useState } from "react";
import { getListTaskAssign, checkedTask, rejectTask, getDetailListTaskAssign, getListProject, getStatusTask, getPriorityTask } from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { useTaskData } from "@/src/hooks/taskhook";
import { 
    CheckCircle2, 
    Circle, 
    User, 
    Clock, 
    Calendar,
    FileCheck,
    AlertCircle,
    CheckCheck,
    XCircle,
    X,
    Search,
    Info,
    Check
} from "lucide-react";
import { toast } from "react-toastify";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProfileData } from "@/src/hooks/profileHook";
import { listTypeTask } from '@/src/services/api';
import FilterableSelector from "@/components/FilterableSelector";
import DashboardTaskManager from "./dashboard/DashboardTaskManager";

interface Props{
    id: number;
    name: string;
}
interface Task {
    id: string;
    prove: string;
    checked: boolean;
    process: string;
    completed_date: string;
    deadline: string;
    task: {
        id: number;
        name: string;
        date_start: string;
        date_end: string;
    };
    status: Props;
    employee: Props;
    project_priorities: Props;
    project: Props;

}

interface PaginationData {
    total: number;
    totalPages: number;
}
interface TypeProps{
    id: string;
    name: string;
}

function CheckedTask() {
    const dispatch = useDispatch();
    const { listTaskAssign, listDetailTaskAssign, loadingListDetailTaskAssign, detailTaskAssign, listProject, statusTask, priorityTask } = useTaskData();
    const { typeTask } = useProfileData();
    
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingTaskId, setCheckingTaskId] = useState<string | null>(null);
    const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 1
    });

    // Modal states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [newDateEnd, setNewDateEnd] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [taskFilter, setTaskFilter] = useState<string>("all");
    const [projectFilter, setProjectFilter] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [showFilter, setShowFilter] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadTasks(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if(!typeTask){
            dispatch(listTypeTask() as any);
        }
        if(!listProject){
            dispatch(getListProject({}) as any);
        }
        if (!statusTask) {
            dispatch(getStatusTask() as any);
        }
        if (!priorityTask) {
            dispatch(getPriorityTask() as any);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const token = localStorage.getItem("userToken");
            if (token) {
                const payload = {
                    token,
                    task_status: statusFilter === "all" ? null : parseInt(statusFilter),  
                    type_task: taskFilter === "all" ? null : parseInt(taskFilter), 
                    project_id: projectFilter?.id  ? projectFilter?.id : null, 
                    search: searchFilter === "" ? null : searchFilter,
                    task_priority: priorityFilter === "all" ? null : parseInt(priorityFilter), 
                };

                dispatch(getListTaskAssign(payload) as any);
                    
            }
        }, 300)
        return () => clearTimeout(timeout);
    }, [statusFilter, taskFilter, projectFilter, searchFilter, priorityFilter]);

    useEffect(() => {
        if (listTaskAssign?.data) {
            setTasks(listTaskAssign.data);
            if (listTaskAssign.pagination) {
                setPagination(listTaskAssign.pagination);
            }
        }
    }, [listTaskAssign]);

    const loadTasks = async (page: number) => {
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                token,
                page
            };
            await dispatch(getListTaskAssign(payload) as any);
        } catch (error) {
            console.error("Error loading tasks:", error);
            toast.error("Không thể tải danh sách nhiệm vụ");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckTask = async (task: Task) => {
        if (task.checked) {
            toast.info("Nhiệm vụ này đã được duyệt");
            return;
        }

        setCheckingTaskId(task.id);
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                id: parseInt(task.id),
                task_id: task.task.id,
                token
            };
            
            const result = await dispatch(checkedTask(payload) as any);
            
            if (result?.payload?.data?.success && !result?.error) {
                toast.success(`Đã duyệt nhiệm vụ "${task.task.name}"`);
                loadTasks(currentPage);
            } else {
                toast.error("Duyệt nhiệm vụ thất bại");
            }
        } catch (error) {
            console.error("Error checking task:", error);
            toast.error("Có lỗi xảy ra khi duyệt nhiệm vụ");
        } finally {
            setCheckingTaskId(null);
        }
    };

    const handleOpenRejectModal = (task: Task) => {
        if (task.checked) {
            toast.info("Không thể từ chối nhiệm vụ đã được duyệt");
            return;
        }
        setSelectedTask(task);
        setRejectReason("");
        setNewDateEnd("");
        setShowRejectModal(true);
    };

    const handleCloseRejectModal = () => {
        setShowRejectModal(false);
        setSelectedTask(null);
        setRejectReason("");
        setNewDateEnd("");
    };

    const handleRejectTask = async () => {
        if (!selectedTask) return;
        
        if (!rejectReason.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối");
            return;
        }

        if (!newDateEnd) {
            toast.warning("Vui lòng chọn thời gian kết thúc mới");
            return;
        }

        // Validate new date must be greater than old date
        const oldDate = new Date(selectedTask.task.date_end);
        const selectedNewDate = new Date(newDateEnd);
        
        if (selectedNewDate <= oldDate) {
            toast.warning("Thời gian kết thúc mới phải lớn hơn thời gian cũ");
            return;
        }

        setRejectingTaskId(selectedTask.id);
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                id: parseInt(selectedTask.id),
                task_id: selectedTask.task.id,
                date_end: newDateEnd,
                reason: rejectReason.trim(),
                token
            };
            
            const result = await dispatch(rejectTask(payload) as any);
            
            if (result?.payload?.data?.success && !result?.error) {
                toast.success(`Đã từ chối nhiệm vụ "${selectedTask.task.name}"`);
                handleCloseRejectModal();
                loadTasks(currentPage);
            } else {
                toast.error("Từ chối nhiệm vụ thất bại");
            }
        } catch (error) {
            console.error("Error rejecting task:", error);
            toast.error("Có lỗi xảy ra khi từ chối nhiệm vụ");
        } finally {
            setRejectingTaskId(null);
        }
    };

    const enterSelectMode = () => {
        setIsSelectMode(true);
        setSelectedIds([]);
    };

    const exitSelectMode = () => {
        setIsSelectMode(false);
        setSelectedIds([]);
    };

    const toggleSelect = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(taskId => taskId !== id));
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một nhiệm vụ");
            return;
        }

        setIsProcessing(true);
        let successCount = 0;
        let failCount = 0;

        try {
            const token = localStorage.getItem("userToken");

            for (const taskId of selectedIds) {
                const task = tasks.find(t => t.id === taskId);
                if (!task || task.checked) continue;

                const payload = {
                    id: parseInt(taskId),
                    task_id: task.task.id,
                    token
                };

                const result = await dispatch(checkedTask(payload) as any);

                if (result?.payload?.data?.success && !result?.error) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`Đã duyệt thành công ${successCount} nhiệm vụ`);
            }
            if (failCount > 0) {
                toast.error(`Có ${failCount} nhiệm vụ duyệt thất bại`);
            }

            exitSelectMode();
            loadTasks(currentPage);
        } catch (error) {
            console.error("Error bulk approving tasks:", error);
            toast.error("Có lỗi xảy ra khi duyệt nhiều nhiệm vụ");
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: { id: number; name: string }) => {
        const statusColors: Record<number, string> = {
            1: "bg-gray-500/20 text-gray-400 border-gray-500/30",
            2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            3: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            4: "bg-green-500/20 text-green-400 border-green-500/30",
            5: "bg-red-500/20 text-red-400 border-red-500/30"
        };

        return (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${statusColors[status.id] || statusColors[1]}`}>
                {status.name}
            </span>
        );
    };

    const getPriorityColor =  (statusId: number) => {
        const colors: { [key: number]: string } = {
            4: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            3: 'bg-green-500/20 text-green-400 border border-green-500/30',
            2: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            1: 'bg-red-500/20 text-red-400 border border-red-500/30',
        };
        return colors[statusId] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    const getDeadlineBadge = (deadline: string) => {
        const colors: Record<string, string> = {
            "Trước thời hạn": "bg-green-500/20 text-green-400",
            "Đúng thời hạn": "bg-blue-500/20 text-blue-400",
            "Trễ hạn": "bg-red-500/20 text-red-400"
        };

        return (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colors[deadline] || "bg-gray-500/20 text-gray-400"}`}>
                {deadline}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getFileInfo = (url: string) => {
        const extension = url.split('.').pop()?.toLowerCase() || '';
        const fileName = url.split('/').pop() || 'file';
        
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const isImage = imageExtensions.includes(extension);
        
        const fileIcons: Record<string, string> = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'xls': '📊',
            'xlsx': '📊',
            'ppt': '📊',
            'pptx': '📊',
            'txt': '📃',
            'zip': '🗜️',
            'rar': '🗜️',
        };
        
        return {
            isImage,
            extension: extension.toUpperCase(),
            fileName,
            icon: fileIcons[extension] || '📎'
        };
    };
    
    const renderPaginationItems = () => {
        const items = [];
        const { totalPages } = pagination;
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                        className="cursor-pointer"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer"
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const renderFilePreview = (url?: string) => {
        if (!url) return null;
    
        const file = getFileInfo(url);
    
        if (file.isImage) {
            return (
                <img
                    src={url}
                    alt={file.fileName}
                    className="w-full h-32 object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition"
                    onClick={() => setPreviewImage(url)}
                />
            );
        }
    
        return (
            <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm text-slate-200"
        >
            <span className="text-lg">{file.icon}</span>
            <span className="truncate">{file.fileName}</span>
            <span className="ml-auto text-xs text-slate-400">
                {file.extension}
            </span>
        </a>
        );
    };

    const handleFilterChange = (filter: string) => {
        setTaskFilter(filter);
    };
    const handleProjectFilterChange = (filter: any) => {
        setProjectFilter(filter);
    };
    const handleStatusFilterChange = (filter: string) => {
        setStatusFilter(filter);
    };
    const handlePriorityFilterChange = (filter: string) => {
        setPriorityFilter(filter);
    };
    
    const handleFilterProject = (filter: string) => {
        if (!listProject) return;
    
        if (!filter || filter.trim() === "") {
            // Nếu không có filter, hiển thị tất cả
            setFilteredProjects(listProject);
        } else {
            // Lọc danh sách project theo tên
            const filtered = listProject.filter((project: any) => 
                project.name.toLowerCase().includes(filter.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }

    const renderFilter = () => {
        return(
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Task Type Filter */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                        Loại nhiệm vụ
                        </label>
                        <Select value={taskFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                            <SelectValue placeholder="Chọn loại nhiệm vụ" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="all" className="text-white text-xs sm:text-sm">
                            Tất cả
                            </SelectItem>
                            {typeTask &&
                            Array.isArray(typeTask) &&
                            typeTask.map((type: TypeProps) => (
                                <SelectItem 
                                key={type.id} 
                                value={type.id}
                                className="text-white text-xs sm:text-sm"
                                >
                                {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>


                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                        Trạng thái
                        </label>
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                            <SelectValue placeholder="Chọn Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="all" className="text-white text-xs sm:text-sm">
                            Tất cả
                            </SelectItem>
                            {statusTask &&
                            Array.isArray(statusTask) &&
                            statusTask.map((kpi: TypeProps) => (
                                <SelectItem 
                                key={kpi.id} 
                                value={kpi.id.toString()}
                                className="text-white text-xs sm:text-sm"
                                >
                                {kpi.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                        Loại mức độ
                        </label>
                        <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
                        <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                            <SelectValue placeholder="Chọn mức độ" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="all" className="text-white text-xs sm:text-sm">
                            Tất cả
                            </SelectItem>
                            {priorityTask &&
                            Array.isArray(priorityTask) &&
                            priorityTask.map((kpi: TypeProps) => (
                                <SelectItem 
                                key={kpi.id} 
                                value={kpi.id.toString()}
                                className="text-white text-xs sm:text-sm"
                                >
                                {kpi.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    {/* Project Filter */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                        Dự án
                        </label>
                        <FilterableSelector
                            data={filteredProjects}
                            onFilter={handleFilterProject}
                            onSelect={(value) => handleProjectFilterChange(value)}
                            value={projectFilter}
                            placeholder="Chọn dự án"
                            displayField="name"
                            emptyMessage="Không có dự án"
                        />
                    </div>

                </div>
                <div className="space-y-1.5 sm:space-y-2">
                    <div className="grid grid-cols-1 mt-4">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            value={searchFilter}
                            onChange={(e) => {
                                setSearchFilter(e.target.value)
                            }}
                            placeholder={"Tìm kiếm tên..."}
                            className="
                            w-full rounded-md
                            bg-slate-900 border border-slate-700
                            pl-9 pr-8 py-2 text-sm text-white
                            placeholder:text-slate-500
                            focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-150
                            "
                        />
                        {searchFilter  && (
                            <button
                            type="button"
                            onClick={() => setSearchFilter("")}
                            aria-label="Xóa tìm kiếm"
                            className="
                                absolute right-2.5 top-1/2 -translate-y-1/2
                                text-slate-500 hover:text-white
                                transition-colors duration-150
                            "
                            >
                            <X className="h-4 w-4" />
                            </button>
                        )}
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <>
        <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
            <DashboardTaskManager />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        {!isSelectMode ? (
                            <>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileCheck className="text-blue-400 flex-shrink-0" size={20} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                                            Duyệt nhiệm vụ
                                        </h1>
                                        <p className="text-slate-400 text-xs sm:text-sm">
                                            Tổng: {pagination.total} nhiệm vụ
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={enterSelectMode}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">Duyệt nhiều</span>
                                        <span className="sm:hidden">Duyệt nhiều</span>
                                    </button>
                                </div> */}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                                        Đang chọn để Duyệt
                                    </span>
                                    <span className="text-xs sm:text-sm text-slate-300 font-medium">
                                        Đã chọn: <span className="text-white text-base sm:text-lg">{selectedIds.length}</span>
                                    </span>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={exitSelectMode}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={handleBulkApprove}
                                        disabled={selectedIds.length === 0 || isProcessing}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Xác nhận Duyệt ({selectedIds.length})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end mb-4">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition border border-slate-700"
                    >
                        {showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                        <svg 
                            className={`w-4 h-4 transition-transform ${showFilter ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {showFilter && renderFilter()}

                {/* Loading State */}
                {isLoading && tasks.length === 0 ? (
                    <div className="flex items-center justify-center py-16 sm:py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 text-sm sm:text-base">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-slate-800/50 rounded-lg border border-slate-700">
                        <AlertCircle className="text-slate-500 mb-3 sm:mb-4" size={48} />
                        <p className="text-slate-400 text-base sm:text-lg">Không có nhiệm vụ nào</p>
                    </div>
                ) : (
                    <>
                        {/* Tasks Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`bg-slate-800/50 border rounded-lg p-3 sm:p-4 hover:border-slate-600 transition-all ${
                                        selectedIds.includes(task.id) && isSelectMode
                                            ? 'ring-2 ring-emerald-500/20 border-emerald-500'
                                            : 'border-slate-700'
                                    } ${isSelectMode && !task.checked ? 'cursor-pointer' : ''}`}
                                    onClick={() => {
                                        if (isSelectMode && !task.checked) {
                                            toggleSelect(task.id, !selectedIds.includes(task.id));
                                        }
                                    }}
                                >
                                    {/* Task Header */}
                                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        {/* Checkbox - chỉ hiện khi đang ở chế độ chọn và task chưa được duyệt */}
                                        {isSelectMode && !task.checked && (
                                            <div className="mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleSelect(task.id, e.target.checked);
                                                    }}
                                                    className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-700 cursor-pointer"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-1.5 sm:mb-2 line-clamp-2">
                                                {task.task.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300">
                                                <User size={14} className="text-slate-500 flex-shrink-0" />
                                                <span className="truncate">{task.employee.name}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Buttons - ẩn khi đang ở chế độ chọn */}
                                        {!isSelectMode && (
                                            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleCheckTask(task)}
                                                    disabled={task.checked || checkingTaskId === task.id}
                                                    className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                                                        task.checked
                                                            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    title={task.checked ? "Đã duyệt" : "Duyệt nhiệm vụ"}
                                                >
                                                    {checkingTaskId === task.id ? (
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : task.checked ? (
                                                        <CheckCheck size={16} />
                                                    ) : (
                                                        <CheckCircle2 size={16} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleOpenRejectModal(task)}
                                                    disabled={task.checked}
                                                    className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                                                        task.checked
                                                            ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                                                            : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                                    } disabled:opacity-50`}
                                                    title={task.checked ? "Không thể từ chối" : "Từ chối nhiệm vụ"}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Task Info */}
                                    <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Info size={14} className="text-slate-500 flex-shrink-0" />
                                            <span className="text-sm">
                                                {task.project.name}

                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap">
                                            <Calendar size={14} className="text-slate-500 flex-shrink-0" />
                                            <span className="text-slate-400">Ngày làm:</span>
                                            <span className="text-white font-medium">
                                                {formatDate(task.task.date_start)} - {formatDate(task.task.date_end)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                            <Calendar size={14} className="text-slate-500 flex-shrink-0" />
                                            <span className="text-slate-400">Hoàn thành:</span>
                                            <span className="text-white font-medium">
                                                {formatDate(task.completed_date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Info size={14} className="text-slate-500 flex-shrink-0" />

                                            <span className={`text-xs ${getPriorityColor(task.project_priorities.id)} px-2 py-1 rounded-lg`}>{task.project_priorities.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Clock size={14} className="text-slate-500 flex-shrink-0" />
                                            {getDeadlineBadge(task.deadline)}
                                        </div>

                                    </div>

                                    {/* Status and Progress */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 sm:pt-3 border-t border-slate-700">
                                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                            {getStatusBadge(task.status)}
                                            {task.checked && (
                                                <span className="px-2 py-0.5 sm:py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                                                    <CheckCheck size={12} className="" />
                                                    Đã duyệt
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                                    style={{ width: `${task.process}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold text-blue-400 min-w-[2.5rem] sm:min-w-[3rem]">
                                                {task.process}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Proof Image */}
                                    {task.prove && (
                                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700">
                                            <p className="text-xs text-slate-500 mb-1.5 sm:mb-2">Minh chứng:</p>
                                            {renderFilePreview(task.prove)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Pagination className="mt-6 sm:mt-8">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={`cursor-pointer ${
                                                currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                            }`}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                            className={`cursor-pointer ${
                                                currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""
                                            }`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-slate-700 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg">
                                    <XCircle className="text-red-400" size={20} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    Từ chối nhiệm vụ
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseRejectModal}
                                className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                                disabled={rejectingTaskId !== null}
                            >
                                <X className="text-slate-400" size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                            <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-700">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Nhiệm vụ</p>
                                        <p className="text-sm font-semibold text-white line-clamp-2">
                                            {selectedTask?.task.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Nhân viên</p>
                                        <p className="text-sm text-slate-300">
                                            {selectedTask?.employee.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Thời gian kết thúc hiện tại</p>
                                        <p className="text-sm text-slate-300 font-medium">
                                            {selectedTask && formatDate(selectedTask.task.date_end)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                                    Thời gian kết thúc mới <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newDateEnd}
                                    onChange={(e) => setNewDateEnd(e.target.value)}
                                    min={selectedTask ? new Date(new Date(selectedTask.task.date_end).getTime() + 86400000).toISOString().split('T')[0] : ''}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    disabled={rejectingTaskId !== null}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Thời gian mới phải lớn hơn {selectedTask && formatDate(selectedTask.task.date_end)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                                    Lý do từ chối <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối nhiệm vụ..."
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    rows={4}
                                    disabled={rejectingTaskId !== null}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Vui lòng cung cấp lý do cụ thể để nhân viên có thể hiểu và cải thiện
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-2 sm:gap-3 p-4 sm:p-5 border-t border-slate-700 sticky bottom-0 bg-slate-800">
                            <button
                                onClick={handleCloseRejectModal}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                                disabled={rejectingTaskId !== null}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRejectTask}
                                disabled={rejectingTaskId !== null || !rejectReason.trim() || !newDateEnd}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                            >
                                {rejectingTaskId ? (
                                    <>
                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">Đang xử lý...</span>
                                        <span className="sm:hidden">Xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} className="sm:hidden" />
                                        <XCircle size={18} className="hidden sm:block" />
                                        <span className="hidden sm:inline">Xác nhận từ chối</span>
                                        <span className="sm:hidden">Từ chối</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {previewImage && (
            <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setPreviewImage(null)}
            >
                <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full max-h-full rounded-lg shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        )}

        </>
    );
}

export default CheckedTask;