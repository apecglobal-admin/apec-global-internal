import { useProfileData } from "@/src/hooks/profileHook";
import { listTypeTask, personTasks } from "@/src/services/api";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Star,
  LayoutList,
  LayoutGrid,
  Plus,
  Briefcase,
  Target,
  Pause,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AssignTask from "./component/AssignTask";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TaskDetail from "./component/taskDetail";
import { getPriorityTask, getStatusTask } from "@/src/features/task/api";
import { useTaskData } from "@/src/hooks/taskhook";
import CheckedTask from "./component/CheckedTask";

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

interface TasksResponse {
  data: Task[];
  filter: number;
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
}

interface TypeTask {
  id: string;
  name: string;
}

interface StatusTask {
  id: string;
  name: string;
}

interface PriorityTask {
  id: string;
  name: string;
}

function TasksTab() {
  const dispatch = useDispatch();
  const { tasks: tasksResponse, typeTask } = useProfileData();
  const { statusTask, priorityTask } = useTaskData();
  
  const [page, setPage] = useState(1);
  const [taskFilter, setTaskFilter] = useState<number | "all">(1);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [currentUserRole] = useState(2);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const tasks: Task[] = tasksResponse?.data || [];
  const totalPages = tasksResponse?.total_pages || 1;
  const totalItems = tasksResponse?.total_items || 0;
  const currentPage = tasksResponse?.page || 1;

  useEffect(() => {
    dispatch(listTypeTask() as any);

    if (!statusTask) {
      dispatch(getStatusTask() as any);
    }
    if (!priorityTask) {
      dispatch(getPriorityTask() as any);
    }
  }, [dispatch, statusTask, priorityTask]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const payload = {
        page,
        token,
        filter: taskFilter === "all" ? null : taskFilter,
      };
      dispatch(personTasks(payload as any) as any);
    }
  }, [dispatch, page, taskFilter]);

  const handleFilterChange = (filter: number | "all") => {
    setTaskFilter(filter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getTaskStatusBadge = (statusId: number) => {
    if (!statusTask) return null;

    const status = statusTask.find((s: StatusTask) => parseInt(s.id) === statusId);
    if (!status) return null;

    // Map based on status ID from API
    switch (statusId) {
      case 1: // "Chưa thực hiện" or pending
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <AlertCircle size={12} />
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
      case 2: // "Đang thực hiện"
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
      case 3: // "Tạm dừng"
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Pause size={12} />
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
      case 4: // "Hoàn thành"
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={12} />
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
      case 5: // "Hủy"
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle size={12} />
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <span className="hidden sm:inline">{status.name}</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priorityId: number) => {
    if (!priorityTask) return null;

    const priority = priorityTask.find(
      (p: PriorityTask) => parseInt(p.id) === priorityId
    );
    if (!priority) return null;

    // Map based on priority ID from API
    switch (priorityId) {
      case 1: // "Cực kỳ quan trọng"
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/30 text-red-300 border border-red-600/40">
            {priority.name}
          </span>
        );
      case 2: // "Cao"
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            {priority.name}
          </span>
        );
      case 3: // "Trung bình"
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <span className="hidden sm:inline">{priority.name}</span>
            <span className="sm:hidden">TB</span>
          </span>
        );
      case 4: // "Thấp"
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            {priority.name}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            {priority.name}
          </span>
        );
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const calculateProgress = (task: Task): number => {
    return Math.round(task.process || 0);
  };

  const handleAssignSuccess = (newTasks: any) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const payload = {
        page,
        token,
        filter: taskFilter === "all" ? null : taskFilter,
      };
      dispatch(personTasks(payload as any) as any);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        items.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (endPage < totalPages - 1) {
        items.push("ellipsis-end");
      }

      items.push(totalPages);
    }

    return items;
  };

  if (showAssignTask) {
    return (
      <AssignTask
        onBack={() => setShowAssignTask(false)}
        onAssignSuccess={handleAssignSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {selectedTask === null ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Quản lý nhiệm vụ cá nhân
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tổng số {totalItems} nhiệm vụ
                </p>
              </div>

              {currentUserRole === 2 && (
                <button
                  onClick={() => setShowAssignTask(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                >
                  <Plus size={18} />
                  Giao nhiệm vụ
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition whitespace-nowrap ${
                    taskFilter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Tất cả
                </button>
                {typeTask &&
                  Array.isArray(typeTask) &&
                  typeTask.map((type: TypeTask) => (
                    <button
                      key={type.id}
                      onClick={() => handleFilterChange(parseInt(type.id))}
                      className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition whitespace-nowrap ${
                        taskFilter === parseInt(type.id)
                          ? "bg-blue-500 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  title="Xem dạng lưới"
                >
                  <LayoutGrid size={18} />
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
                  <LayoutList size={18} />
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-base sm:text-lg">
                  Không có nhiệm vụ nào
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    : "space-y-3"
                }
              >
                {tasks.map((task) => {
                  const progress = calculateProgress(task);

                  return (
                    <div
                      key={task.id}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-4 hover:border-blue-500/50 transition cursor-pointer"
                      onClick={() => setSelectedTask(task.id)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-white mb-2 line-clamp-2">
                            {task.task.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                            <Briefcase size={12} className="flex-shrink-0" />
                            <span className="truncate">{task.project.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Target size={12} className="flex-shrink-0" />
                            <span className="truncate">{task.kpi_item.name}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          {getTaskStatusBadge(task.status.id)}
                          {getPriorityBadge(task.priority.id)}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Tiến độ
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
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar
                            size={12}
                            className="text-slate-500 flex-shrink-0"
                          />
                          <span className="truncate">
                            {formatDate(task.task.date_end)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                          <Star size={12} className="fill-yellow-400" />
                          <span className="font-semibold">+100 XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPaginationItems().map((item, index) => {
                      if (
                        item === "ellipsis-start" ||
                        item === "ellipsis-end"
                      ) {
                        return (
                          <PaginationItem key={`${item}-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={item}>
                          <PaginationLink
                            onClick={() => handlePageChange(item as number)}
                            isActive={currentPage === item}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center text-xs sm:text-sm text-slate-400">
                  Trang {currentPage} / {totalPages} - Tổng số {totalItems}{" "}
                  nhiệm vụ
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {(() => {
              const task = tasks.find((t: Task) => t.id === selectedTask);
              if (!task) return null;
              

              return (
                <TaskDetail
                  task={task}
                  onBack={() => setSelectedTask(null)}
                  getTaskStatusBadge={getTaskStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  formatDate={formatDate}
                  calculateProgress={calculateProgress}
                  statusTask={statusTask}
                />
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}

export default TasksTab;