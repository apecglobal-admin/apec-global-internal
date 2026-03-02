import {
    Briefcase,
    Target,
    ClipboardList,
    Edit3,
    X,
    Save,
    Upload,
    Image,
    FileText,
    Plus,
    History,
    XCircle,
    Calendar,
    CheckCheck,
    Check,
} from "lucide-react";

import {
    uploadImageTask,
    uploadFileTask,
    updateProgressTask,
    getSubTask,
    deleteSubTask,
    updateStatusSubTask
} from "@/src/features/task/api";
import { useEffect, useState } from "react";
import { useTaskData } from "@/src/hooks/taskhook";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateSubTask from "./createSubTask";
import UpdateSubTask from "./updateSubTask";
import { Task } from "@/src/services/interface";
import { formatNumber } from "@/src/utils/formatNumber";


interface StatusTask {
    id: string;
    name: string;
}

interface TaskDetailProps {
    task: Task;
    onBack: () => void;
    getTaskStatusBadge: any;
    getPriorityBadge: (priorityId: number) => any;
    formatDate: (dateString: string) => string;
    calculateProgress: (task: Task) => number;
    statusTask?: StatusTask[];
    onUpdateSuccess?: (id: any) => void;
}

interface SubTask {
    
    id: string;
    name: string;
    description?: string;
    process: number;
    target_value: number;
    value: number;
    status: {
        id: number;
        name: string;
    };
}

function TaskDetail({
    task,
    onBack,
    getTaskStatusBadge,
    getPriorityBadge,
    formatDate,
    calculateProgress,
    statusTask,
    onUpdateSuccess
}: TaskDetailProps) {
    const dispatch = useDispatch();
    const { imageTask, fileTask, listSubTask } = useTaskData();
    
    const progress = calculateProgress(task);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(task.status.id);
    const [progressValue, setProgressValue] = useState(progress);
    const [uploadType, setUploadType] = useState<"image" | "document" | null>(
        null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showCreateSubTask, setShowCreateSubTask] = useState(false);
    const [showUpdateSubTask, setShowUpdateSubTask] = useState(false);
    const [subTaskOffset, setSubTaskOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreSubTasks, setHasMoreSubTasks] = useState(true);
    const [allSubTasks, setAllSubTasks] = useState<SubTask[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showTaskLogs, setShowTaskLogs] = useState(false);
    const [actualValue, setActualValue] = useState<number>(0);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<'accept' | 'reject' | null>(null);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        if (!task) return;

        setSubTaskOffset(0);
        setHasMoreSubTasks(true);
        setAllSubTasks([]);
        setIsInitialLoad(true);

        const token = localStorage.getItem("userToken");
        const payload = {
            token,
            task_assignment_id: task.id,
            limit: 5,
            offset: 0
        }
        dispatch(getSubTask(payload) as any);
    }, [task]);

    // Cập nhật allSubTasks khi listSubTask thay đổi
    useEffect(() => {
        if (!listSubTask) return;

        if (isInitialLoad) {
            // Lần đầu load hoặc sau khi refresh
            setAllSubTasks(listSubTask);
            setIsInitialLoad(false);
        } else {
            // Load more - nối thêm vào cuối
            setAllSubTasks(prev => {
                // Lọc ra các item mới chưa có trong danh sách
                const existingIds = new Set(prev.map(st => st.id));
                const newItems = listSubTask.filter((st: SubTask) => !existingIds.has(st.id));

                // Nối vào cuối
                return [...prev, ...newItems];
            });
        }
    }, [listSubTask]);

    useEffect(() => {
        // Tính giá trị thực tế từ process và target_value
        if (task.units?.name !== "%") {
            const calculatedValue = (progress / 100) * Number(task.target_value);
            setActualValue(calculatedValue);
        }
    }, [task, progress]);

    const enterSelectMode = (action: 'accept' | 'reject') => {
        setIsSelectMode(true);
        setCurrentAction(action);
        setSelectedIds([]);
    };

    const exitSelectMode = () => {
        setIsSelectMode(false);
        setCurrentAction(null);
        setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newIds = prev.includes(id) 
                ? prev.filter(i => i !== id) 
                : [...prev, id];
            return newIds;
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn file để tải lên");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const token = localStorage.getItem("userToken");
            const payload = {
                formData,
                token
            };

            let result;
            if (uploadType === "image") {
                result = await dispatch(uploadImageTask(payload) as any);
            } else if (uploadType === "document") {
                result = await dispatch(uploadFileTask(payload) as any);
            }

            

            if (result?.payload?.data?.status === 200 || result?.payload?.data?.status === 201 || result?.payload?.data?.success) {
                toast.success("Tải file thành công.")
                setIsUploaded(true);
            } else {
                toast.error("Tải file thất bại. File tải quá nặng")
            }
        } catch (error: any) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };
    

    const handleSave = async () => {
        // if (selectedStatus === 4 && !isUploaded) {
        //     toast.warning("Vui lòng tải lên minh chứng (ảnh hoặc tài liệu) khi hoàn thành nhiệm vụ")
        //     return;
        // }
        setIsSaving(true);
        try {
            const token = localStorage.getItem("userToken");

            let finalProcess = progressValue;
            if (task.units?.name !== "%" && task.units?.name !== null) {
                // Tính phần trăm từ giá trị thực tế
                finalProcess = actualValue;
            }

            const updatePayload = {
                id: parseInt(task.id),
                value: finalProcess,
                task_id: task.task.id,
                status: selectedStatus,
                prove: selectedStatus === 4
                    ? (uploadType === "image" ? imageTask : fileTask) || ""
                    : "",
                token,
                date_end: task.task.date_end,
                date_start: task.task.date_start,

            };

            const result = await dispatch(updateProgressTask(updatePayload) as any);
            
            if (result?.payload.data.success && !result?.error) {
                setIsEditing(false);
                resetForm();
                toast.success("Cập nhật tiến độ thành công!")
                if (onUpdateSuccess) {
                    onUpdateSuccess(task.id);
                }
            } else {
                toast.error(result?.payload.data?.message || "Cập nhật tiến độ thất bại")
                throw new Error(result?.payload || "Update failed");
            }
        } catch (error: any) {
            console.error("Save error:", error);
            // toast.error(error?.message || "Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedStatus(task.status.id);
        setProgressValue(progress);
        resetForm();
        setIsEditing(false);
    };

    const resetForm = () => {
        setUploadType(null);
        setSelectedFile(null);
        setFilePreview(null);
        setIsUploaded(false);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setProgressValue(value);
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = parseInt(e.target.value);
        setSelectedStatus(newStatus);
    
        if (newStatus !== 4) {
            resetForm();
        }
    
        if (newStatus === 4) {
            setProgressValue(100);
            if (task.units?.name !== "%") {
                setActualValue(Number(task.target_value)); // Set giá trị = mục tiêu
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setIsUploaded(false);

            if (uploadType === "image" && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleUploadTypeChange = (type: "image" | "document") => {
        if (uploadType === type) {
            setUploadType(null);
            setSelectedFile(null);
            setFilePreview(null);
            setIsUploaded(false);
        } else {
            setUploadType(type);
            setSelectedFile(null);
            setFilePreview(null);
            setIsUploaded(false);
        }
    };

    const getAcceptedFileTypes = () => {
        if (uploadType === "image") {
            return "image/*";
        } else if (uploadType === "document") {
            return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
        }
        return "";
    };
    
    const refreshSubTasks = async (refreshTask: boolean = false) => {
        setSubTaskOffset(0);
        setHasMoreSubTasks(true);
        setAllSubTasks([]);
        setIsInitialLoad(true);
        const token = localStorage.getItem("userToken");
        const payload = {
            token,
            task_assignment_id: task.id,
            limit: 5,
            offset: 0
        };
        await dispatch(getSubTask(payload) as any);
        if(refreshTask){
            onUpdateSuccess?.(task.id)
        }

    };

    const loadMoreSubTasks = async () => {
        if (isLoadingMore || !hasMoreSubTasks) return;

        setIsLoadingMore(true);
        try {
            const token = localStorage.getItem("userToken");
            const newOffset = subTaskOffset + 5;
            const payload = {
                token,
                task_assignment_id: task.id,
                limit: 5,
                offset: newOffset
            };

            const result = await dispatch(getSubTask(payload) as any);

            // Kiểm tra nếu không còn dữ liệu
            if (result?.payload?.data?.data?.length === 0 || result?.payload?.data?.data?.length < 5) {
                setHasMoreSubTasks(false);
            }

            // Cập nhật offset sau khi load thành công
            setSubTaskOffset(newOffset);
        } catch (error) {
            console.error("Error loading more subtasks:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleSubTaskScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        // Khi cuộn gần đến cuối (còn 50px)
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            loadMoreSubTasks();
        }
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

    const handleActualValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0) {
            const targetValue = Number(task.target_value);
            const newValue = Math.min(value, targetValue);
            setActualValue(newValue);
            
            // Tự động tính process
            const newProcess = Math.min(100, (newValue / targetValue) * 100);
            setProgressValue(Math.round(newProcess));
        }
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
                href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url.replace("/fl_attachment", ""))}`}
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

    const handleOptionTask = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một nhiệm vụ");
            return;
        }

        setIsProcessing(true);
        if(currentAction === 'accept' ){
            try {
                const token = localStorage.getItem("userToken");
                const res = await dispatch(updateStatusSubTask({
                    status: 4,
                    token, 
                    ids: selectedIds
                }) as any)
                
                if(res.payload.data.success){
                    toast.success(`Đã duyệt thành công nhiệm vụ`);
                    if (onUpdateSuccess) {
                        onUpdateSuccess(task.id);
                    }
                }else{
                    toast.error(`duyệt nhiệm vụ thất bại`);
                }
    
                exitSelectMode();
            } catch (error) {
                toast.error("Có lỗi xảy ra khi duyệt nhiều nhiệm vụ");
            } finally {
                setIsProcessing(false);
            }
        }else{

            try {
                const token = localStorage.getItem("userToken");
                const res = await dispatch(deleteSubTask({token, ids: selectedIds}) as any)
                
                if(res.payload.data.success){
                    toast.success(`Đã xóa thành công nhiệm vụ`);
                    if (onUpdateSuccess) {
                        onUpdateSuccess(task.id);
                    }
                }else{
                    toast.error(`xóa nhiệm vụ thất bại`);
                }
    
                exitSelectMode();
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa nhiều nhiệm vụ");
            } finally {
                setIsProcessing(false);
            }
        }
    }
 

    
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                    Chi tiết nhiệm vụ
                </h3>
                <button
                    onClick={onBack}
                    className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition"
                >
                    ← Quay lại
                </button>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 sm:p-5 lg:p-6">
                <div className="gap-4 mb-4">
                    <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div>
                                <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3">
                                    {task.task.name}
                                </h4>
                            </div>
                            <div className="flex sm:flex-col gap-2 items-start sm:items-end">
                                {getTaskStatusBadge(task.status.id)}
                                {getPriorityBadge(task.priority.id)}
                            </div>
                        </div>
                        <div className="space-y-2 mb-3">
                            {task.checked && (
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-blue-600 px-3 py-2 rounded-lg">
                                    <ClipboardList
                                        size={16}
                                        className="text-slate-500 flex-shrink-0"
                                        color="white"
                                    />
                                    <span className="font-semibold">Đã xác nhận hoàn thành:</span>
                                    <span>{formatDate(task.completed_date)}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                                <Briefcase size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="font-semibold">Dự án:</span>
                                <span className="truncate">{task.project.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                                <Target size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="font-semibold">KPI:</span>
                                <span className="truncate">{task.kpi_item.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                                <Target size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="font-semibold">Chỉ tiêu:</span>
                                {task.units?.name !== "%" && task.units?.name !== null ? (
                                    <span>{formatNumber(Number(task.target_value))} {task.units?.name}</span>
                                ) : (
                                    <span>100%</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                                <ClipboardList size={16} className="text-slate-500 flex-shrink-0" />
                                <span className="font-semibold">Loại:</span>
                                <span>{task.type.name}</span>
                            </div>
                        </div>

                        {!isSelectMode ? (
                            <div className="flex items-center justify-between mb-2 gap-2">
                                <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-2 shrink-0">
                                    <ClipboardList size={16} className="text-slate-400" />
                                    <span className="hidden sm:inline">Nhiệm vụ con ({allSubTasks?.length || 0})</span>
                                    <span className="sm:hidden">Nhiệm vụ con ({allSubTasks?.length || 0})</span>
                                </h5>
                                <div className="flex gap-1.5 sm:gap-2 items-center">
                                    <button
                                        onClick={() => enterSelectMode('reject')}
                                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                                        title="Xóa nhiều"
                                    >
                                        <XCircle className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline">Xóa nhiều</span>
                                    </button>

                                    <button
                                        onClick={() => enterSelectMode('accept')}
                                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
                                        title="Hoàn thành"
                                    >
                                        <CheckCheck className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline">Hoàn thành</span>
                                    </button>

                                    {allSubTasks && allSubTasks.length > 0 && (
                                        <button
                                            onClick={() => setShowUpdateSubTask(true)}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                                            title="Cập nhật"
                                        >
                                            <Edit3 size={14} className="shrink-0" />
                                            <span className="hidden sm:inline">Cập nhật</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setShowCreateSubTask(true)}
                                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                                        title="Tạo nhiệm vụ con"
                                    >
                                        <Plus size={14} className="shrink-0" />
                                        <span className="hidden sm:inline">Tạo</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mb-2 gap-2">
                                <h5 className="text-sm font-semibold text-slate-200 flex items-center gap-2 shrink-0">
                                    {currentAction === 'accept' ? (
                                        <Check size={16} className="text-emerald-500" />
                                    ) : (
                                        <XCircle size={16} className="text-red-500" />
                                    )}
                                    <span className={`text-xs sm:text-sm ${currentAction === 'accept' ? "text-emerald-500" : "text-rose-500"}`}>
                                        Đang chọn {currentAction === 'accept' ? "Duyệt" : "Xóa"}
                                    </span>
                                </h5>
                                <div className="flex gap-1.5 sm:gap-2 items-center">
                                    <button
                                        onClick={exitSelectMode}
                                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                                        title="Hủy bỏ"
                                    >
                                        <XCircle className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline">Hủy bỏ</span>
                                    </button>

                                    <button
                                        onClick={(e) => handleOptionTask(e)}
                                        disabled={selectedIds.length === 0 || isProcessing}
                                        className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        title={currentAction === 'accept' ? "Hoàn thành" : "Xóa"}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
                                                <span className="hidden sm:inline">Đang xử lý...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCheck className="h-4 w-4 shrink-0" />
                                                <span className="sm:hidden font-semibold">{selectedIds.length}</span>
                                                <span className="hidden sm:inline">
                                                    {currentAction === 'accept' ? "Hoàn thành" : "Xóa"} ({selectedIds.length})
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {showCreateSubTask && (
                            <CreateSubTask
                                task={task}
                                statusTask={statusTask}
                                onClose={() => setShowCreateSubTask(false)}
                                onSuccess={(refreshTask) => refreshSubTasks(refreshTask)}
                            />
                        )}

                        {showUpdateSubTask && allSubTasks && allSubTasks.length > 0 && (
                            <UpdateSubTask
                                unit={task.units}
                                subtasks={allSubTasks}
                                taskAssignmentId={task.id}
                                statusTask={statusTask}
                                onClose={() => setShowUpdateSubTask(false)}
                                onSuccess={(refreshTask) => refreshSubTasks(refreshTask)}
                            />
                        )}

                        {allSubTasks && allSubTasks.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <div
                                    className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                                    onScroll={handleSubTaskScroll}
                                >
                                    {allSubTasks.map((subtask: SubTask) => {
                                        const isSelected = selectedIds.includes(subtask.id);
                                        return (
                                            <div
                                                key={subtask.id}
                                                onClick={() => {
                                                    if (isSelectMode && subtask.status.id !== 4) {
                                                        toggleSelect(subtask.id);
                                                    }
                                                }}
                                                className="flex items-start justify-between gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-2.5 transition"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    {isSelectMode && subtask.status.id !== 4 && (
                                                        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelect(subtask.id)}
                                                                className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-700 cursor-pointer"
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="text-xs sm:text-sm text-white font-medium line-clamp-1">
                                                        {subtask.name}
                                                    </p>
                                                    {subtask.description && (
                                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                            {subtask.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <span className="text-slate-500">Mục tiêu:</span>
                                                            <span className="text-blue-400 font-semibold">
                                                                {formatNumber(Number(subtask.target_value))} {task.units?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <span className="text-slate-500">Tiến độ:</span>
                                                            <span className="text-blue-400 font-semibold">
                                                                {formatNumber(Number(subtask.value))} {task.units?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {getTaskStatusBadge(subtask.status.id, null, true)}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {isLoadingMore && (
                                        <div className="flex items-center justify-center py-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                                                <span>Đang tải thêm...</span>
                                            </div>
                                        </div>
                                    )}

                                    {!hasMoreSubTasks && allSubTasks.length >= 5 && (
                                        <div className="py-3 text-center">
                                            <p className="text-xs text-slate-500">
                                                Đã hiển thị tất cả nhiệm vụ con
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Ngày bắt đầu</div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                            {formatDate(task.task.date_start)}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Hạn chót</div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                            {formatDate(task.task.date_end)}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Tiến độ</div>
                        <div className="text-xs sm:text-sm font-semibold text-blue-400">
                            {progress}%
                        </div>
                    </div>
                </div>

                {/* Progress Update Section */}
                {!isEditing ? (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-300">
                                Tiến độ tổng quan
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-blue-400">
                                    {progress}%
                                </span>
                                {task.status.id !== 4 && task.status.id !== 5 && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                                        title="Cập nhật tiến độ"
                                    >
                                        <Edit3 size={14} className="shrink-0" />
                                        <span className="hidden sm:inline">Cập nhật</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 bg-slate-900 p-4 rounded-lg border border-blue-500/30">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-white">
                                Cập nhật tiến độ
                            </span>
                            <button
                                onClick={handleCancel}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Status Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                                >
                                    {statusTask &&
                                        statusTask.map((status) => (
                                            <option key={status.id} value={parseInt(status.id)}>
                                                {status.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Upload Section */}
                            {selectedStatus === 4 && (
                                <div className="bg-slate-950 p-4 rounded-lg border border-yellow-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Upload size={16} className="text-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-400">
                                            Minh chứng hoàn thành
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">
                                        Chọn loại minh chứng bạn muốn tải lên:
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={() => handleUploadTypeChange("image")}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${uploadType === "image"
                                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Image size={24} />
                                            <span className="text-sm font-semibold">Hình ảnh</span>
                                            <span className="text-xs text-slate-500">JPG, PNG, GIF</span>
                                        </button>
                                        <button
                                            onClick={() => handleUploadTypeChange("document")}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${uploadType === "document"
                                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <FileText size={24} />
                                            <span className="text-sm font-semibold">Tài liệu</span>
                                            <span className="text-xs text-slate-500">PDF, DOC, XLS</span>
                                        </button>
                                    </div>

                                    {uploadType && (
                                        <div>
                                            <label className="block w-full cursor-pointer">
                                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 transition">
                                                    <Upload size={16} className="text-blue-400" />
                                                    <span className="text-sm text-slate-300">
                                                        {selectedFile
                                                            ? selectedFile.name
                                                            : `Chọn ${uploadType === "image" ? "hình ảnh" : "tài liệu"}`}
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept={getAcceptedFileTypes()}
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />
                                            </label>

                                            {filePreview && uploadType === "image" && (
                                                <div className="mt-3">
                                                    <img
                                                        src={filePreview}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                                    />
                                                </div>
                                            )}

                                            {selectedFile && (
                                                <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {uploadType === "image" ? (
                                                                <Image size={16} className="text-blue-400" />
                                                            ) : (
                                                                <FileText size={16} className="text-blue-400" />
                                                            )}
                                                            <span className="text-xs text-slate-300 truncate">
                                                                {selectedFile.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedFile && !isUploaded && (
                                                <button
                                                    onClick={handleUpload}
                                                    disabled={isUploading}
                                                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                                                >
                                                    <Upload size={16} />
                                                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                                                </button>
                                            )}

                                            {isUploaded && (
                                                <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                                                    <p className="text-xs text-green-400 text-center">
                                                        ✓ Đã tải lên thành công!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Progress Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    {task.units?.name === "%" ? `Tiến độ (${task.units?.name})` : `Giá trị đạt được (${task.units?.name || "%"})`}
                                </label>
                                {task.units?.name === "%" || task.units?.name === null ? (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progressValue}
                                            onChange={handleProgressChange}
                                            disabled={selectedStatus === 4}
                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={progressValue}
                                            onChange={handleProgressChange}
                                            disabled={selectedStatus === 4}
                                            className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max={task.target_value}
                                                value={actualValue}
                                                onChange={handleActualValueChange}
                                                disabled={selectedStatus === 4}
                                                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder={`Nhập giá trị (tối đa ${formatNumber(Number(task.target_value))})`}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Mục tiêu: {formatNumber(Number(task.target_value))} {task.units?.name}
                                        </div>
                                    </div>
                                )}
                                {selectedStatus === 4 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        {task.units?.name === "%"
                                            ? "Tiến độ tự động đặt thành 100% khi hoàn thành"
                                            : "Giá trị sẽ được đặt bằng mục tiêu khi hoàn thành"}
                                    </p>
                                )}
                            </div>

                            {/* Progress Bar Preview */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-slate-400">Xem trước</span>
                                    <span className="text-xs font-bold text-blue-400">{progressValue}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all"
                                        style={{ width: `${progressValue}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                                >
                                    <Save size={16} />
                                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {task.prove && (
                    <div className="bg-slate-900 p-4 rounded-lg">
                        <h5 className="text-sm font-bold text-white mb-2">Minh chứng</h5>
                        {renderFilePreview(task.prove)}
                    </div>
                )}

                {/* Task Logs Section */}
                {task.task_logs && task.task_logs.length > 0 && (
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                <History size={16} className="text-slate-400" />
                                Lịch sử từ chối ({task.task_logs.length})
                            </h5>
                            <button
                                onClick={() => setShowTaskLogs(!showTaskLogs)}
                                className="text-xs text-blue-400 hover:text-blue-300 transition"
                            >
                                {showTaskLogs ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>

                        {showTaskLogs && (
                            <div className="space-y-3">
                                {task.task_logs.map((log: any, index: number) => (
                                    <div
                                        key={log.id}
                                        className="bg-slate-950 border border-red-900/30 rounded-lg p-3 hover:border-red-800/50 transition"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center">
                                                    <XCircle size={16} className="text-red-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-semibold text-red-400">
                                                        Lần {task.task_logs.length - index}
                                                    </span>
                                                    <span className="text-xs text-slate-500">•</span>
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Calendar size={12} />
                                                        {formatDate(log.reject_date)}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="bg-slate-900 px-3 py-2 rounded">
                                                        <p className="text-xs text-slate-500 mb-1">Lý do từ chối:</p>
                                                        <p className="text-sm text-white">{log.reason}</p>
                                                    </div>
                                                    {log.date_end && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-500">Hạn chót mới:</span>
                                                            <span className="text-blue-400 font-semibold">
                                                                {formatDate(log.date_end)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {log.prove && (
                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-2">Minh chứng đã gửi:</p>
                                                            {renderFilePreview(log.prove)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-slate-300 transition"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    );
}

export default TaskDetail;