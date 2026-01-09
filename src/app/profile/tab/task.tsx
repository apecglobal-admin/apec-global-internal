import { useProfileData } from "@/src/hooks/profileHook";
import { listTypeTask, personTasks } from "@/src/services/api";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ClipboardList,
  Star,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignTask from "./AssignTask"; // Import component giao nhiệm vụ

// Types
type TaskStatus = "completed" | "in-progress" | "pending";
type Priority = "high" | "medium" | "low";

interface SubtaskEmployee {
  id: number;
  employee_id: number;
  process: number;
  created_at: string;
  updated_at: string;
  subtask_status: {
    id: number;
    name: string;
    status: boolean;
  };
}

interface Subtask {
  id: number;
  name: string;
  description: string | null;
  subtask_employee: SubtaskEmployee[];
}

interface Task {
  id: string;
  task_id: number;
  employee_id: number;
  process: string;
  task_status: number;
  created_at: string;
  updated_at: string;
  employee: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  task: {
    id: number;
    name: string;
    description: string;
    type_task: number;
    date_start: string;
    date_end: string;
    task_status: {
      id: number;
      name: string;
      status: boolean;
    };
    task_priority: {
      id: number;
      name: string;
    };
    subtasks: Subtask[];
  };
}

interface TypeTask {
  id: string;
  name: string;
}

function TasksTab() {
  const dispatch = useDispatch();
  const { tasks, typeTask } = useProfileData();
  const [page] = useState(1);
  const [limit] = useState(100);

  // State để kiểm soát hiển thị component nào
  const [showAssignTask, setShowAssignTask] = useState(false);

  // Giả sử user hiện tại có role = 2 (Trưởng phòng)
  // Trong thực tế, lấy từ Redux store hoặc context
  const [currentUserRole] = useState(2);

  useEffect(() => {
    dispatch(listTypeTask() as any);
    const token = localStorage.getItem("userToken");
    if (token) {
      const payload = {
        page,
        limit,
        token,
      };
      dispatch(personTasks(payload as any) as any);
    }
  }, [dispatch, page, limit]);

  useEffect(() => {
    if (typeTask && typeTask.length > 0) {
      setTaskFilter(parseInt(typeTask[0].id));
    }
  }, [typeTask]);

  const [taskFilter, setTaskFilter] = useState<number | "all">(
    typeTask[0]?.id || "all"
  );
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Get filtered tasks based on type_task
  const filteredTasks: Task[] =
    taskFilter === "all"
      ? tasks || []
      : (tasks || []).filter(
          (task: Task) => task.task.type_task === taskFilter
        );

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: number | "all") => {
    setTaskFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Map task_status.id to status
  const getTaskStatus = (statusId: number): TaskStatus => {
    switch (statusId) {
      case 1:
        return "pending";
      case 2:
        return "in-progress";
      case 3:
        return "completed";
      default:
        return "pending";
    }
  };

  // Map task_priority.name to priority
  const getPriorityLevel = (priorityName: string): Priority => {
    const name = priorityName.toLowerCase();
    if (name.includes("cao") || name.includes("high")) return "high";
    if (name.includes("thấp") || name.includes("low")) return "low";
    return "medium";
  };

  const getTaskStatusBadge = (statusId: number) => {
    const status = getTaskStatus(statusId);
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={12} />
            Hoàn thành
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            Đang làm
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <AlertCircle size={12} />
            Chờ xử lý
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priorityName: string) => {
    const priority = getPriorityLevel(priorityName);
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            Cao
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Trung bình
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  const getSubtaskStatusIcon = (statusId: number) => {
    const status = getTaskStatus(statusId);
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "in-progress":
        return <Clock size={16} className="text-blue-500" />;
      case "pending":
        return <AlertCircle size={16} className="text-slate-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Calculate completed subtasks
  const getCompletedSubtasks = (subtasks: Subtask[]) => {
    return subtasks.filter((subtask) =>
      subtask.subtask_employee.some(
        (se) => getTaskStatus(se.subtask_status.id) === "completed"
      )
    ).length;
  };

  // Calculate task progress
  const calculateProgress = (task: Task): number => {
    const processValue = parseFloat(task.process);
    if (!isNaN(processValue)) {
      return Math.round(processValue);
    }

    const subtasks = task.task.subtasks;
    if (subtasks.length === 0) return 0;

    const completed = getCompletedSubtasks(subtasks);
    return Math.round((completed / subtasks.length) * 100);
  };

  // Get task count by type
  const getTaskCountByType = (typeId: number) => {
    return (tasks || []).filter((task: Task) => task.task.type_task === typeId)
      .length;
  };

  // Callback khi giao nhiệm vụ thành công
  const handleAssignSuccess = (newTasks: any[]) => {
    // TODO: Dispatch action để thêm tasks mới vào Redux store
    // dispatch(addTasks(newTasks));
    
    alert(`Đã giao thành công ${newTasks.length} nhiệm vụ!`);
    setShowAssignTask(false);
  };

  // Nếu đang ở chế độ giao nhiệm vụ, hiển thị component AssignTask
  if (showAssignTask) {
    return (
      <AssignTask
        onBack={() => setShowAssignTask(false)}
        onAssignSuccess={handleAssignSuccess}
      />
    );
  }

  // Ngược lại, hiển thị danh sách tasks như cũ
  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {selectedTask === null ? (
          <>
            {/* Header với nút giao nhiệm vụ */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Quản lý Nhiệm vụ
                </h2>
              </div>

              {/* Hiển thị nút "Giao nhiệm vụ" chỉ khi role = 2 */}
              {currentUserRole === 2 && (
                <button
                  onClick={() => setShowAssignTask(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg shadow-blue-500/30"
                >
                  <Plus size={18} />
                  Giao nhiệm vụ
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {typeTask &&
                  Array.isArray(typeTask) &&
                  typeTask.map((type: TypeTask) => (
                    <button
                      key={type.id}
                      onClick={() => handleFilterChange(parseInt(type.id))}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                        taskFilter === parseInt(type.id)
                          ? "bg-blue-500 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {type.name} ({getTaskCountByType(parseInt(type.id))})
                    </button>
                  ))}
              </div>

              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  title="Xem dạng lưới"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  title="Xem dạng danh sách"
                >
                  <LayoutList size={20} />
                </button>
              </div>
            </div>

            {currentTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">Không có nhiệm vụ nào</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                    : "space-y-3"
                }
              >
                {currentTasks.map((task) => {
                  const progress = calculateProgress(task);
                  const completedSubtasks = getCompletedSubtasks(
                    task.task.subtasks
                  );
                  const totalSubtasks = task.task.subtasks.length;

                  return (
                    <div
                      key={task.id}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 hover:border-blue-500/50 transition cursor-pointer"
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                            {task.task.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400 mb-2">
                            {task.task.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Users size={14} />
                            <span>{task.employee.name}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getTaskStatusBadge(task.task.task_status.id)}
                          {getPriorityBadge(task.task.task_priority.name)}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Tiến độ: {completedSubtasks}/{totalSubtasks} công
                            việc
                          </span>
                          <span className="text-xs font-bold text-blue-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-slate-500" />
                            <span>{formatDate(task.task.date_end)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClipboardList
                              size={14}
                              className="text-slate-500"
                            />
                            <span>{totalSubtasks} công việc</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={14} className="fill-yellow-400" />
                          <span className="font-semibold">
                            +{totalSubtasks * 50} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition ${
                    currentPage === totalPages
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {filteredTasks.length > 0 && (
              <div className="text-center text-sm text-slate-400">
                Hiển thị {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredTasks.length)} trong tổng số{" "}
                {filteredTasks.length} nhiệm vụ
              </div>
            )}
          </>
        ) : (
          <>
            {(() => {
              const task = (tasks || []).find(
                (t: Task) => t.id === selectedTask
              );
              if (!task) return null;

              const progress = calculateProgress(task);
              const completedSubtasks = getCompletedSubtasks(
                task.task.subtasks
              );
              const totalSubtasks = task.task.subtasks.length;

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Chi tiết nhiệm vụ
                    </h3>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      ← Quay lại
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {task.task.name}
                        </h4>
                        <p className="text-sm text-slate-400 mb-3">
                          {task.task.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                          <Users size={16} className="text-slate-500" />
                          <span className="font-semibold">
                            Người thực hiện:
                          </span>
                          <span>{task.employee.name}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getTaskStatusBadge(task.task.task_status.id)}
                        {getPriorityBadge(task.task.task_priority.name)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Ngày bắt đầu
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatDate(task.task.date_start)}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Hạn chót
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatDate(task.task.date_end)}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Công việc
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {completedSubtasks}/{totalSubtasks}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Tiến độ
                        </div>
                        <div className="text-sm font-semibold text-blue-400">
                          {progress}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-300">
                          Tiến độ tổng quan
                        </span>
                        <span className="text-sm font-bold text-blue-400">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                        <ClipboardList size={18} className="text-blue-400" />
                        Danh sách công việc ({totalSubtasks})
                      </h5>
                      <div className="space-y-2">
                        {task.task.subtasks.map((subtask: any) => {
                          const subtaskEmployee = subtask.subtask_employee[0];
                          const statusId =
                            subtaskEmployee?.subtask_status?.id || 1;
                          const status = getTaskStatus(statusId);

                          return (
                            <div
                              key={subtask.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                                status === "completed"
                                  ? "border-green-500/30 bg-green-500/10"
                                  : status === "in-progress"
                                  ? "border-blue-500/30 bg-blue-500/10"
                                  : "border-slate-700 bg-slate-900"
                              }`}
                            >
                              {getSubtaskStatusIcon(statusId)}
                              <span
                                className={`flex-1 text-sm ${
                                  status === "completed"
                                    ? "text-slate-400 line-through"
                                    : "text-white font-medium"
                                }`}
                              >
                                {subtask.name}
                              </span>
                              {status === "completed" && (
                                <span className="text-xs font-semibold text-green-400">
                                  Hoàn thành
                                </span>
                              )}
                              {status === "in-progress" && (
                                <span className="text-xs font-semibold text-blue-400">
                                  Đang làm
                                </span>
                              )}
                              {status === "pending" && (
                                <span className="text-xs font-semibold text-slate-400">
                                  Chờ xử lý
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}

export default TasksTab;