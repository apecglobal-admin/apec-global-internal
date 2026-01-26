import React, { useEffect, useState } from "react";
import { getListTaskAssign, checkedTask, rejectTask, getDetailListTaskAssign } from "@/src/features/task/api";
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
    X
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
    status: {
        id: number;
        name: string;
    };
    employee: {
        id: number;
        name: string;
    };
}

interface PaginationData {
    total: number;
    limit: number;
    totalPages: number;
}

function CheckedTask() {
    const dispatch = useDispatch();
    const { listTaskAssign, listDetailTaskAssign, loadingListDetailTaskAssign, detailTaskAssign } = useTaskData();

    
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingTaskId, setCheckingTaskId] = useState<string | null>(null);
    const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        limit: 6,
        totalPages: 1
    });

    // Modal states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [newDateEnd, setNewDateEnd] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        loadTasks(currentPage);
    }, [currentPage]);

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
        console.log(page);
        
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                token,
                limit: 6,
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

    
    return (
        <>
        {tasks.length !== 0 && (
            <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FileCheck className="text-blue-400" size={32} />
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                Duyệt nhiệm vụ
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm sm:text-base">
                            Danh sách nhiệm vụ đã giao cho nhân viên - Tổng: {pagination.total} nhiệm vụ
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && tasks.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="text-slate-400">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
                            <AlertCircle className="text-slate-500 mb-4" size={64} />
                            <p className="text-slate-400 text-lg">Không có nhiệm vụ nào</p>
                        </div>
                    ) : (
                        <>
                            {/* Tasks Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all"
                                    >
                                        {/* Task Header */}
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                                                    {task.task.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                                    <User size={16} className="text-slate-500 flex-shrink-0" />
                                                    <span className="truncate">{task.employee.name}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 flex-shrink-0">
                                                
                                                <button
                                                    onClick={() => handleCheckTask(task)}
                                                    disabled={task.checked || checkingTaskId === task.id}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        task.checked
                                                            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    title={task.checked ? "Đã duyệt" : "Duyệt nhiệm vụ"}
                                                >
                                                    {checkingTaskId === task.id ? (
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : task.checked ? (
                                                        <CheckCheck size={20} />
                                                    ) : (
                                                        <CheckCircle2 size={20} />
                                                    )}
                                                </button>

                                                
                                                <button
                                                    onClick={() => handleOpenRejectModal(task)}
                                                    disabled={task.checked}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        task.checked
                                                            ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                                                            : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                                    } disabled:opacity-50`}
                                                    title={task.checked ? "Không thể từ chối" : "Từ chối nhiệm vụ"}
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Task Info */}
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                                                <span className="text-slate-400">Ngày làm:</span>
                                                <span className="text-white font-medium">
                                                    {formatDate(task.task.date_start)} - 
                                                </span>
                                                <span className="text-white font-medium">
                                                    {formatDate(task.task.date_end)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                                                <span className="text-slate-400">Hoàn thành:</span>
                                                <span className="text-white font-medium">
                                                    {formatDate(task.completed_date)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-slate-500 flex-shrink-0" />
                                                {getDeadlineBadge(task.deadline)}
                                            </div>
                                        </div>

                                        {/* Status and Progress */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(task.status)}
                                                {task.checked && (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                                                        <CheckCheck size={14} />
                                                        Đã duyệt
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                                        style={{ width: `${task.process}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-semibold text-blue-400 min-w-[3rem]">
                                                    {task.process}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Proof Image */}
                                        {task.prove && (
                                            <div className="mt-3 pt-3 border-t border-slate-700">
                                                <p className="text-xs text-slate-500 mb-2">Minh chứng:</p>
                                                {renderFilePreview(task.prove)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <Pagination className="mt-8">
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-slate-700">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <XCircle className="text-red-400" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Từ chối nhiệm vụ
                                    </h3>
                                </div>
                                <button
                                    onClick={handleCloseRejectModal}
                                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                                    disabled={rejectingTaskId !== null}
                                >
                                    <X className="text-slate-400" size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 space-y-4">
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Nhiệm vụ</p>
                                            <p className="text-sm font-semibold text-white">
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
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Thời gian kết thúc mới <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={newDateEnd}
                                        onChange={(e) => setNewDateEnd(e.target.value)}
                                        min={selectedTask ? new Date(new Date(selectedTask.task.date_end).getTime() + 86400000).toISOString().split('T')[0] : ''}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        disabled={rejectingTaskId !== null}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Thời gian mới phải lớn hơn {selectedTask && formatDate(selectedTask.task.date_end)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Lý do từ chối <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Nhập lý do từ chối nhiệm vụ..."
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        rows={4}
                                        disabled={rejectingTaskId !== null}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Vui lòng cung cấp lý do cụ thể để nhân viên có thể hiểu và cải thiện
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 p-5 border-t border-slate-700">
                                <button
                                    onClick={handleCloseRejectModal}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                                    disabled={rejectingTaskId !== null}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleRejectTask}
                                    disabled={rejectingTaskId !== null || !rejectReason.trim() || !newDateEnd}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {rejectingTaskId ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={18} />
                                            Xác nhận từ chối
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {previewImage && (
            <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
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

