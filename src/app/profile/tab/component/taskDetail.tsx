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
} from "lucide-react";

import {     
    uploadImageTask,
    uploadFileTask,
    updateProgressTask,
    getSubTask,
} from "@/src/features/task/api";
import { useEffect, useState } from "react";
import { useTaskData } from "@/src/hooks/taskhook";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateSubTask from "./createSubTask";
import UpdateSubTask from "./updateSubTask";

interface Task {
    id: string;
    employee_id: string;
    prove: string | null;
    checked: boolean;
    process: number;
    task: {
        id: number;
        name: string;
        process: number;
        date_start: string;
        date_end: string;
    };
    status: {
        id: number;
        name: string;
    };
    priority: {
        id: number;
        name: string;
    };
    project: {
        id: number;
        name: string;
    };
    kpi_item: {
        id: number;
        name: string;
    };
    type: {
        id: number;
        name: string;
    };
    target_type: {
        id: number;
        name: string;
    };
}

interface StatusTask {
    id: string;
    name: string;
}

interface TaskDetailProps {
    task: Task;
    onBack: () => void;
    getTaskStatusBadge: (statusId: number) => JSX.Element | null;
    getPriorityBadge: (priorityId: number) => JSX.Element | null;
    formatDate: (dateString: string) => string;
    calculateProgress: (task: Task) => number;
    statusTask?: StatusTask[];
}

interface SubTask {
  id: string;
  name: string;
  description?: string;
  process: number;
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
    
    useEffect(() => {
        if(!task) return;

        // Reset khi task thay đổi
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
            
            if (result?.payload.data.success && !result?.error) {
                setIsUploaded(true);
            } else {
                toast.error("tải file thất bại")
            }
        } catch (error: any) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };
    

    const handleSave = async () => {
        if (selectedStatus === 4 && !isUploaded) {
            toast.warning("Vui lòng tải lên minh chứng (ảnh hoặc tài liệu) khi hoàn thành nhiệm vụ")
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("userToken");
            const updatePayload = {
                id: parseInt(task.id),
                process: progressValue.toString(),
                task_id: task.task.id,
                status: selectedStatus,
                prove: selectedStatus === 4 
                    ? (uploadType === "image" ? imageTask : fileTask) || ""
                    : "",
            };
            const result = await dispatch(updateProgressTask(updatePayload) as any);

            if (result?.payload.data.success && !result?.error) {
                setIsEditing(false);
                resetForm();
                toast.success("Cập nhật tiến độ thành công!")
            } else {
                toast.error("Cập nhật tiến độ thất bại")
                throw new Error(result?.payload || "Update failed");
            }
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error?.message || "Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
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

    const refreshSubTasks = () => {
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
        dispatch(getSubTask(payload) as any);
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
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3">
              {task.task.name}
            </h4>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                <Briefcase
                  size={16}
                  className="text-slate-500 flex-shrink-0"
                />
                <span className="font-semibold">Dự án:</span>
                <span className="truncate">{task.project.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                <Target
                  size={16}
                  className="text-slate-500 flex-shrink-0"
                />
                <span className="font-semibold">KPI:</span>
                <span className="truncate">{task.kpi_item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                <ClipboardList
                  size={16}
                  className="text-slate-500 flex-shrink-0"
                />
                <span className="font-semibold">Loại:</span>
                <span>{task.type.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <ClipboardList size={16} className="text-slate-400" />
                    Nhiệm vụ con ({allSubTasks?.length || 0})
                </h5>
                <div className="flex gap-2">
                    {allSubTasks && allSubTasks.length > 0 && (
                        <button
                            onClick={() => setShowUpdateSubTask(true)}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded flex items-center gap-1"
                        >
                            <Edit3 size={14} />
                            Cập nhật
                        </button>
                    )}
                    <button
                        onClick={() => setShowCreateSubTask(true)}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1"
                    >
                        <Plus size={14} />
                        Tạo
                    </button>
                </div>
            </div>

            {showCreateSubTask && (
                <CreateSubTask
                    task={task}
                    statusTask={statusTask}
                    onClose={() => setShowCreateSubTask(false)}
                    onSuccess={refreshSubTasks}
                />
            )}

            {showUpdateSubTask && allSubTasks && allSubTasks.length > 0 && (
                <UpdateSubTask
                    subtasks={allSubTasks}
                    taskAssignmentId={task.id}
                    statusTask={statusTask}
                    onClose={() => setShowUpdateSubTask(false)}
                    onSuccess={refreshSubTasks}
                />
            )}

            {allSubTasks && allSubTasks.length > 0 && (
              <div className="mt-4 space-y-2">
                <div 
                  className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                  onScroll={handleSubTaskScroll}
                >
                  {allSubTasks.map((subtask: SubTask) => (
                    <div
                      key={subtask.id}
                      className="flex items-start justify-between gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-2.5 transition"
                    >
                      <div className="min-w-0 flex-1">
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
                            <span className="text-slate-500">Tiến độ:</span>
                            <span className="text-blue-400 font-semibold">
                              {subtask.process}%
                            </span>
                          </div>
                          <div className="flex-1 max-w-[100px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${subtask.process}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {getTaskStatusBadge(subtask.status.id)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                        <span>Đang tải thêm...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* End of list indicator */}
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
                    <div className="flex sm:flex-col gap-2 items-start sm:items-end">
                        {getTaskStatusBadge(task.status.id)}
                        {getPriorityBadge(task.priority.id)}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                            Ngày bắt đầu
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                            {formatDate(task.task.date_start)}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                            Hạn chót
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                            {formatDate(task.task.date_end)}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                            Tiến độ
                        </div>
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
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                                    >
                                        <Edit3 size={14} />
                                        Cập nhật
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
                                            <option
                                                key={status.id}
                                                value={parseInt(status.id)}
                                            >
                                                {status.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Upload Section - Only show when status is 4 (Hoàn thành) */}
                            {selectedStatus === 4 && (
                                <div className="bg-slate-950 p-4 rounded-lg border border-yellow-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Upload
                                            size={16}
                                            className="text-yellow-400"
                                        />
                                        <span className="text-sm font-semibold text-yellow-400">
                                            Minh chứng hoàn thành (bắt buộc)
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-400 mb-3">
                                        Chọn loại minh chứng bạn muốn tải lên:
                                    </p>

                                    {/* Upload Type Selection */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={() =>
                                                handleUploadTypeChange("image")
                                            }
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                                uploadType === "image"
                                                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Image size={24} />
                                            <span className="text-sm font-semibold">
                                                Hình ảnh
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                JPG, PNG, GIF
                                            </span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleUploadTypeChange(
                                                    "document"
                                                )
                                            }
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                                uploadType === "document"
                                                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <FileText size={24} />
                                            <span className="text-sm font-semibold">
                                                Tài liệu
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                PDF, DOC, XLS
                                            </span>
                                        </button>
                                    </div>

                                    {/* File Upload Input */}
                                    {uploadType && (
                                        <div>
                                            <label className="block w-full cursor-pointer">
                                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 transition">
                                                    <Upload
                                                        size={16}
                                                        className="text-blue-400"
                                                    />
                                                    <span className="text-sm text-slate-300">
                                                        {selectedFile
                                                            ? selectedFile.name
                                                            : `Chọn ${
                                                                  uploadType ===
                                                                  "image"
                                                                      ? "hình ảnh"
                                                                      : "tài liệu"
                                                              }`}
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept={getAcceptedFileTypes()}
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />
                                            </label>

                                            {/* Image Preview */}
                                            {filePreview &&
                                                uploadType === "image" && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={filePreview}
                                                            alt="Preview"
                                                            className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                                        />
                                                    </div>
                                                )}

                                            {/* File Info */}
                                            {selectedFile && (
                                                <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {uploadType ===
                                                            "image" ? (
                                                                <Image
                                                                    size={16}
                                                                    className="text-blue-400"
                                                                />
                                                            ) : (
                                                                <FileText
                                                                    size={16}
                                                                    className="text-blue-400"
                                                                />
                                                            )}
                                                            <span className="text-xs text-slate-300 truncate">
                                                                {
                                                                    selectedFile.name
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {(
                                                                selectedFile.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload Button */}
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

                                            {/* Upload Success Message */}
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
                                    Tiến độ (%)
                                </label>
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
                                {selectedStatus === 4 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Tiến độ tự động đặt thành 100% khi hoàn
                                        thành
                                    </p>
                                )}
                            </div>

                            {/* Progress Bar Preview */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-slate-400">
                                        Xem trước
                                    </span>
                                    <span className="text-xs font-bold text-blue-400">
                                        {progressValue}%
                                    </span>
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
                    <h5 className="text-sm font-bold text-white mb-2">
                    Minh chứng
                    </h5>
                    <img
                    src={task.prove}
                    alt="Minh chứng"
                    className="w-full sm:w-64 md:w-80 lg:w-96 h-auto rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => setPreviewImage(task.prove)}
                    />
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