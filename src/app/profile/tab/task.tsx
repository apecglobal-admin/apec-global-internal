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
} from "lucide-react";
import { useState } from "react";

// Types
type JobStatus = "completed" | "in-progress" | "pending";
type TaskStatus = "completed" | "in-progress" | "pending";
type Priority = "high" | "medium" | "low";

interface Job {
  id: number;
  title: string;
  status: JobStatus;
}

interface BaseTask {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  progress: number;
  jobs: Job[];
  exp: number;
}

interface DailyTask extends BaseTask {
  isDaily: true;
}

interface PersonalTask extends BaseTask {
  isDaily?: false;
}

interface TeamTask extends BaseTask {
  assignedTo: string[];
  isDaily?: false;
}

type Task = DailyTask | PersonalTask | TeamTask;

// Mock Data
const mockTasks: {
  daily: DailyTask[];
  personal: PersonalTask[];
  team: TeamTask[];
} = {
  daily: [
    {
      id: 101,
      title: "Daily Standup Meeting",
      description: "Họp standup với team lúc 9:00 AM",
      priority: "medium",
      status: "completed",
      dueDate: "2024-12-03",
      progress: 100,
      jobs: [
        { id: 201, title: "Báo cáo công việc hôm qua", status: "completed" },
        { id: 202, title: "Chia sẻ kế hoạch hôm nay", status: "completed" },
        { id: 203, title: "Thảo luận blockers", status: "completed" },
      ],
      exp: 50,
      isDaily: true,
    },
    {
      id: 102,
      title: "Code Review Daily Tasks",
      description: "Review code của team members",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-12-03",
      progress: 60,
      jobs: [
        { id: 204, title: "Review morning PRs", status: "completed" },
        { id: 205, title: "Review afternoon PRs", status: "in-progress" },
        { id: 206, title: "Leave feedback", status: "pending" },
      ],
      exp: 100,
      isDaily: true,
    },
    {
      id: 103,
      title: "Cập nhật tiến độ dự án",
      description: "Cập nhật Jira và báo cáo với PM",
      priority: "medium",
      status: "pending",
      dueDate: "2024-12-03",
      progress: 0,
      jobs: [
        { id: 207, title: "Update Jira tickets", status: "pending" },
        { id: 208, title: "Gửi báo cáo cho PM", status: "pending" },
      ],
      exp: 75,
      isDaily: true,
    },
    {
      id: 104,
      title: "Kiểm tra Email & Slack",
      description: "Đọc và phản hồi các tin nhắn quan trọng",
      priority: "low",
      status: "completed",
      dueDate: "2024-12-03",
      progress: 100,
      jobs: [
        { id: 209, title: "Đọc email buổi sáng", status: "completed" },
        { id: 210, title: "Trả lời tin nhắn Slack", status: "completed" },
      ],
      exp: 30,
      isDaily: true,
    },
  ],
  personal: [
    {
      id: 1,
      title: "Hoàn thiện module Authentication",
      description: "Cập nhật flow đăng nhập và xác thực 2FA",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-12-15",
      progress: 65,
      jobs: [
        { id: 1, title: "Thiết kế UI flow đăng nhập", status: "completed" },
        { id: 2, title: "Implement API authentication", status: "completed" },
        { id: 3, title: "Tích hợp 2FA", status: "in-progress" },
        { id: 4, title: "Viết unit tests", status: "pending" },
      ],
      exp: 500,
    },
    {
      id: 2,
      title: "Code review cho team member",
      description: "Review pull request của 3 thành viên",
      priority: "medium",
      status: "completed",
      dueDate: "2024-12-01",
      progress: 100,
      jobs: [
        { id: 5, title: "Review PR #123", status: "completed" },
        { id: 6, title: "Review PR #124", status: "completed" },
        { id: 7, title: "Review PR #125", status: "completed" },
      ],
      exp: 300,
    },
    {
      id: 3,
      title: "Tối ưu hiệu suất Database",
      description: "Phân tích và tối ưu các query chậm",
      priority: "high",
      status: "pending",
      dueDate: "2024-12-20",
      progress: 0,
      jobs: [
        { id: 8, title: "Phân tích slow queries", status: "pending" },
        { id: 9, title: "Tạo indexes", status: "pending" },
        { id: 10, title: "Optimize queries", status: "pending" },
        { id: 11, title: "Load testing", status: "pending" },
      ],
      exp: 600,
    },
  ],
  team: [
    {
      id: 4,
      title: "Sprint Planning Q1 2025",
      description: "Lập kế hoạch sprint cho quý 1",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-12-10",
      progress: 80,
      jobs: [
        { id: 12, title: "Gather requirements", status: "completed" },
        { id: 13, title: "Estimate tasks", status: "completed" },
        { id: 14, title: "Assign resources", status: "in-progress" },
        { id: 15, title: "Create timeline", status: "pending" },
      ],
      exp: 400,
      assignedTo: ["Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường"],
    },
    {
      id: 5,
      title: "Đào tạo công nghệ mới",
      description: "Workshop về React 19 và Server Components",
      priority: "medium",
      status: "completed",
      dueDate: "2024-11-30",
      progress: 100,
      jobs: [
        { id: 16, title: "Chuẩn bị tài liệu", status: "completed" },
        { id: 17, title: "Demo ứng dụng mẫu", status: "completed" },
        { id: 18, title: "Q&A session", status: "completed" },
      ],
      exp: 350,
      assignedTo: ["Nguyễn Văn An", "Phạm Thị Dung"],
    },
    {
      id: 6,
      title: "Migration hệ thống Legacy",
      description: "Chuyển đổi từ monolith sang microservices",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-01-31",
      progress: 45,
      jobs: [
        { id: 19, title: "Phân tích kiến trúc hiện tại", status: "completed" },
        { id: 20, title: "Thiết kế microservices", status: "completed" },
        { id: 21, title: "Implement Auth service", status: "in-progress" },
        { id: 22, title: "Implement User service", status: "pending" },
        { id: 23, title: "Implement Payment service", status: "pending" },
        { id: 24, title: "Testing & deployment", status: "pending" },
      ],
      exp: 800,
      assignedTo: [
        "Nguyễn Văn An",
        "Trần Thị Bình",
        "Lê Văn Cường",
        "Hoàng Văn Em",
      ],
    },
  ],
};

function TasksTab() {
  const [taskFilter, setTaskFilter] = useState<
    "all" | "daily" | "personal" | "team"
  >("daily");
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const allTasks: Task[] = [
    ...mockTasks.daily,
    ...mockTasks.personal,
    ...mockTasks.team,
  ];
  const filteredTasks: Task[] =
    taskFilter === "all"
      ? allTasks
      : taskFilter === "daily"
      ? mockTasks.daily
      : taskFilter === "personal"
      ? mockTasks.personal
      : mockTasks.team;

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: "all" | "daily" | "personal" | "team") => {
    setTaskFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTaskStatusBadge = (status: TaskStatus) => {
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

  const getPriorityBadge = (priority: Priority) => {
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

  const getJobStatusIcon = (status: JobStatus) => {
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

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {selectedTask === null ? (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {/* <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    taskFilter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Tất cả ({allTasks.length})
                </button> */}
                <button
                  onClick={() => handleFilterChange("daily")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    taskFilter === "daily"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Hằng ngày ({mockTasks.daily.length})
                </button>
                <button
                  onClick={() => handleFilterChange("personal")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    taskFilter === "personal"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Cá nhân ({mockTasks.personal.length})
                </button>
                <button
                  onClick={() => handleFilterChange("team")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    taskFilter === "team"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Chung ({mockTasks.team.length})
                </button>
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

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                  : "space-y-3"
              }
            >
              {currentTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 hover:border-blue-500/50 transition cursor-pointer"
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                        {task.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 mb-2">
                        {task.description}
                      </p>
                      {"assignedTo" in task && task.assignedTo && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users size={14} />
                          <span>{task.assignedTo.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getTaskStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-300">
                        Tiến độ:{" "}
                        {
                          task.jobs.filter((j) => j.status === "completed")
                            .length
                        }
                        /{task.jobs.length} công việc
                      </span>
                      <span className="text-xs font-bold text-blue-400">
                        {task.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-500" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClipboardList size={14} className="text-slate-500" />
                        <span>{task.jobs.length} công việc</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} className="fill-yellow-400" />
                      <span className="font-semibold">+{task.exp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
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
                Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredTasks.length)} trong tổng số {filteredTasks.length} nhiệm vụ
              </div>
            )}
          </>
        ) : (
          <>
            {(() => {
              const task = allTasks.find((t) => t.id === selectedTask);
              if (!task) return null;

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
                          {task.title}
                        </h4>
                        <p className="text-sm text-slate-400 mb-3">
                          {task.description}
                        </p>
                        {"assignedTo" in task && task.assignedTo && (
                          <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900 px-3 py-2 rounded-lg">
                            <Users size={16} className="text-slate-500" />
                            <span className="font-semibold">Thành viên:</span>
                            <span>{task.assignedTo.join(", ")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getTaskStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Hạn chót
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Công việc
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {
                            task.jobs.filter((j) => j.status === "completed")
                              .length
                          }
                          /{task.jobs.length}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Tiến độ
                        </div>
                        <div className="text-sm font-semibold text-blue-400">
                          {task.progress}%
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">
                          Điểm XP
                        </div>
                        <div className="text-sm font-semibold text-yellow-400">
                          +{task.exp} XP
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-300">
                          Tiến độ tổng quan
                        </span>
                        <span className="text-sm font-bold text-blue-400">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                        <ClipboardList size={18} className="text-blue-400" />
                        Danh sách công việc ({task.jobs.length})
                      </h5>
                      <div className="space-y-2">
                        {task.jobs.map((job) => (
                          <div
                            key={job.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                              job.status === "completed"
                                ? "border-green-500/30 bg-green-500/10"
                                : job.status === "in-progress"
                                ? "border-blue-500/30 bg-blue-500/10"
                                : "border-slate-700 bg-slate-900"
                            }`}
                          >
                            {getJobStatusIcon(job.status)}
                            <span
                              className={`flex-1 text-sm ${
                                job.status === "completed"
                                  ? "text-slate-400 line-through"
                                  : "text-white font-medium"
                              }`}
                            >
                              {job.title}
                            </span>
                            {job.status === "completed" && (
                              <span className="text-xs font-semibold text-green-400">
                                Hoàn thành
                              </span>
                            )}
                            {job.status === "in-progress" && (
                              <span className="text-xs font-semibold text-blue-400">
                                Đang làm
                              </span>
                            )}
                          </div>
                        ))}
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