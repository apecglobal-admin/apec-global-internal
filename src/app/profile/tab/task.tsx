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
  Search,
  X,
  ChevronDown,
  ChevronUp,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TaskDetail from "./component/taskDetail";
import { 
  getPriorityTask, 
  getStatusTask,
  getChildKpi,
  getListProject,
 } from "@/src/features/task/api";
import { useTaskData } from "@/src/hooks/taskhook";
import CheckedTask from "./component/CheckedTask";
import { Task } from "@/src/services/interface";
import { formatNumber } from "@/src/utils/formatNumber";
import { getDashboardTasks } from "@/src/features/dashboard/api/api";
import { useDashboardData } from "@/src/hooks/dashboardhook";

interface TasksResponse {
  data: Task[];
  filter: number;
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
}

interface TypeProps{
  id: string;
  name: string;
}


function TasksTab() {
  const dispatch = useDispatch();
  const { tasks: tasksResponse, typeTask, detailTask } = useProfileData();
  const {listDashboardTasks } = useDashboardData();
  

  const {
    priorityTask,
    childKpi,
    statusTask,
    listProject
  } = useTaskData();

  const [page, setPage] = useState(1);
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [kpiFilter, setKpiFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("2");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showFilter, setShowFilter] = useState(true);

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [isVisible, setIsVisible] = useState(true);

  const tasks: Task[] = tasksResponse?.data || [];
  const totalPages = tasksResponse?.total_pages || 1;
  const totalItems = tasksResponse?.total_items || 0;
  const currentPage = tasksResponse?.page || 1;
  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if(!listDashboardTasks){
      dispatch(getDashboardTasks({token }) as any)
    }
    if(!typeTask){
      dispatch(listTypeTask() as any);
    }
    if(!listProject){
      dispatch(getListProject({}) as any);
    }
    if(!childKpi){
      dispatch(getChildKpi() as any);
    }
    if (!statusTask) {
      dispatch(getStatusTask() as any);
    }
    if (!priorityTask) {
      dispatch(getPriorityTask() as any);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("userToken");
      if (token) {
        const payload = {
          page: page,
          token,
          filter: taskFilter === "all" ? null : parseInt(taskFilter),
          projectFilter: projectFilter === "all" ? null : parseInt(projectFilter),
          kpiFilter: kpiFilter === "all" ? null : parseInt(kpiFilter),
          statusFilter: statusFilter === "all" ? null : parseInt(statusFilter),
          priorityFilter: priorityFilter === "all" ? null : parseInt(priorityFilter),
          search: searchFilter === "" ? null : searchFilter,
          key: "tasks"
        };

        dispatch(personTasks(payload as any) as any);
        
        
      }
    }, 300)
    return () => clearTimeout(timer);
  }, [dispatch, page, taskFilter, projectFilter, kpiFilter, statusFilter, priorityFilter, searchFilter]);

  const refreshFilter = () => {
    setTaskFilter("all");
    setProjectFilter("all");
    setKpiFilter("all");
    setStatusFilter("2");
    setPriorityFilter("all");
    setSearchFilter("");
  }

  const handleFilterChange = (filter: string) => {
    setTaskFilter(filter);
    setPage(1);
  };

  const handleProjectFilterChange = (filter: string) => {
    setProjectFilter(filter);
    setPage(1);

  };

  const handleKpiFilterChange = (filter: string) => {
    setKpiFilter(filter);
    setPage(1);

  };

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(1);

  };

  const handlePriorityFilterChange = (filter: string) => {
    setPriorityFilter(filter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTaskClick = async (taskId: string) => {
    const token = localStorage.getItem("userToken");
    const payload1 = {
      token,
      id: taskId,
      key: "detailTasks"
    }

    await dispatch(personTasks(payload1 as any) as any);
    setSelectedTask(taskId);

    const payload2 = {
      page: page,
      token,
      statusFilter: 2,
      key: "tasks"
    };

    dispatch(personTasks(payload2 as any) as any);
  };


  const refreshTasks = (id: any) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const payload1 = {
        id,
        token,
        key: "detailTasks"
      };
      dispatch(personTasks(payload1 as any) as any);

      refreshFilter()
    }
  };

  const getTaskStatusBadge = (statusId: number, checked: boolean) => {
    if (!statusTask) return null;
    

    const status = statusTask.find((s: TypeProps) => parseInt(s.id) === statusId);
    if (!status) return null;

    switch (statusId) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <AlertCircle size={12} />
            <span className="text-xs">{status.name}</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            <span className="text-xs">{status.name}</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <Pause size={12} />
            <span className="text-xs">{status.name}</span>
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={12} />
            <span className="text-xs">{checked ? "Đã Duyệt" : "Chờ Duyệt"}</span>
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle size={12} />
            <span className="text-xs">{status.name}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <span className="text-xs">{status.name}</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priorityId: number) => {
    if (!priorityTask) return null;

    const priority = priorityTask.find(
      (p: TypeProps) => parseInt(p.id) === priorityId
    );
    if (!priority) return null;

    switch (priorityId) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/30 text-red-300 border border-red-600/40">
            {priority.name}
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            {priority.name}
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <span className="hidden sm:inline">{priority.name}</span>
            <span className="sm:hidden">TB</span>
          </span>
        );
      case 4:
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

  const renderDashboard = () => {
    return(
      <div>
        {listDashboardTasks && (
          <div className="space-y-1">
            {/* Toggle Button */}
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 transition-all duration-200"
            >
              <span className="text-white font-semibold text-sm">Dashboard Tổng Quan</span>
              {isVisible ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>

            {/* Dashboard Content */}
            {isVisible && (
              <div className="space-y-1">
                {/* Row 1: Tổng số công việc & Quá hạn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-white/20 rounded-md">
                        <ClipboardList className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-blue-100 text-xs font-medium">
                        {listDashboardTasks.total_task_assignments?.label}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {listDashboardTasks.total_task_assignments?.value || 0}
                        </p>
                        <p className="text-blue-200 text-xs">nhiệm vụ</p>
                      </div>
                    </div>
                  </div>

                  {/* Công việc quá hạn */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-white/20 rounded-md animate-pulse">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-red-100 text-xs font-medium">
                        {listDashboardTasks.overdue_tasks?.label}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {listDashboardTasks.overdue_tasks?.value || 0}
                        </p>
                        <p className="text-red-200 text-xs">cần xử lý</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Theo trạng thái & Theo ưu tiên */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  {/* Công việc theo trạng thái */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-purple-600/20 rounded">
                          <CheckCircle2 className="h-4 w-4 text-purple-400" />
                        </div>
                        <h3 className="text-xs font-bold text-white">
                          {listDashboardTasks.tasks_by_status?.label}
                        </h3>
                      </div>
                      <div className="px-2 py-0.5 bg-purple-600/20 rounded-full">
                        <span className="text-purple-300 text-xs font-semibold">
                          {listDashboardTasks.tasks_by_status?.items?.reduce((sum: any, item: any) => sum + item.total, 0) || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {listDashboardTasks.tasks_by_status?.items && 
                      listDashboardTasks.tasks_by_status.items.length > 0 ? (
                        listDashboardTasks.tasks_by_status.items.map((item: any, index: any) => {
                          const colorMap: any = {
                            "2": { bg: "bg-blue-500", text: "text-blue-400" },
                            "3": { bg: "bg-orange-500", text: "text-orange-400" },
                            "4": { bg: "bg-green-500", text: "text-green-400" },
                            "5": { bg: "bg-red-500", text: "text-red-400" },
                          };
                          const colors = colorMap[item.task_status] || { bg: "bg-slate-500", text: "text-slate-400" };

                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                  {item.total}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4">
                          <CheckCircle2 className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                          <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Công việc theo mức độ ưu tiên */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-orange-600/20 rounded">
                          <Star className="h-4 w-4 text-orange-400" />
                        </div>
                        <h3 className="text-xs font-bold text-white">
                          {listDashboardTasks.tasks_by_priority?.label}
                        </h3>
                      </div>
                      <div className="px-2 py-0.5 bg-orange-600/20 rounded-full">
                        <span className="text-orange-300 text-xs font-semibold">
                          {listDashboardTasks.tasks_by_priority?.items?.reduce((sum: any, item: any) => sum + item.total, 0) || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {listDashboardTasks.tasks_by_priority?.items && 
                      listDashboardTasks.tasks_by_priority.items.length > 0 ? (
                        listDashboardTasks.tasks_by_priority.items.map((item: any, index: any) => {
                          const colorMap: any = {
                            "1": { bg: "bg-red-600", text: "text-red-400" },
                            "2": { bg: "bg-orange-500", text: "text-orange-400" },
                            "3": { bg: "bg-yellow-500", text: "text-yellow-400" },
                            "4": { bg: "bg-green-500", text: "text-green-400" },
                          };
                          const colors = colorMap[item.task_priority] || { bg: "bg-slate-500", text: "text-slate-400" };

                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                  {item.total}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4">
                          <Star className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                          <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderFilter = () => {
    return(
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
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

          {/* Project Filter */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-300">
              Dự án
            </label>
            <Select value={projectFilter} onValueChange={handleProjectFilterChange}>
              <SelectTrigger className="w-full max-w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10SSSSSSSSSSSS">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 max-w-[330px]">
                <SelectItem value="all" className="text-white text-xs sm:text-sm">
                  Tất cả
                </SelectItem>
                {listProject &&
                  Array.isArray(listProject) &&
                  listProject.map((project: TypeProps) => (
                    <SelectItem 
                      key={project.id} 
                      value={project.id.toString()}
                      className="text-white text-xs sm:text-sm"
                    >
                      {project.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* KPI Filter */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-300">
              KPI
            </label>
            <Select value={kpiFilter} onValueChange={handleKpiFilterChange}>
              <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Chọn KPI" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white text-xs sm:text-sm">
                  Tất cả
                </SelectItem>
                {childKpi &&
                  Array.isArray(childKpi) &&
                  childKpi.map((kpi: TypeProps) => (
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
              Mức độ
            </label>
            <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
              <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Chọn Status" />
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


          {/* View Mode Toggle */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-300">
              Chế độ xem
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-2 rounded-lg transition text-xs sm:text-sm font-medium ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
                }`}
                title="Xem dạng lưới"
              >
                <LayoutGrid size={16} className="mx-auto sm:hidden" />
                <span className="hidden sm:inline">Lưới</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 p-2 rounded-lg transition text-xs sm:text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700"
                }`}
                title="Xem dạng danh sách"
              >
                <LayoutList size={16} className="mx-auto sm:hidden" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                    setSearchFilter(e.target.value)
                    setPage(1)
                }}
                placeholder={"Tìm kiếm tên, mô tả..."}
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
    )
  }


      
  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {renderDashboard()}
        {selectedTask === null ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Quản lý nhiệm vụ cá nhân
                </h2>
                <p className="text-xs sm:text-sm tex t-slate-400 mt-1">
                  Tổng số {totalItems} nhiệm vụ
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
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

            {tasks.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-slate-800/50 border border-slate-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-600 mb-3 sm:mb-4" />
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
                      className="rounded-lg border border-slate-800 bg-slate-950 p-3 sm:p-4 hover:border-blue-500/50 transition cursor-pointer"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2 line-clamp-2">
                            {task.task.name}
                          </h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 mb-1">
                            <Briefcase size={12} className="flex-shrink-0" />
                            <span className="truncate">{task.project.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
                            <Target size={12} className="flex-shrink-0" />
                            <span className="truncate">{task.kpi_item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
                            <span>Chỉ tiêu: </span>
                            {task.units?.name !== "%" && task.units?.name !== null ? (
                              <span className="">{formatNumber(Number(task.target_value))} {task.units?.name}</span>
                            ) : (
                              <span className="">100%</span>

                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 sm:gap-1.5 flex-shrink-0">
                          {task.is_overdue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-semibold">
                              Trễ hạn
                            </span>
                          )}
                          {task.is_due && !task.is_overdue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-600 text-white font-semibold animate-pulse">
                              Gần deadline
                            </span>
                          )}
                          {getTaskStatusBadge(task.status.id, task.checked)}
                          {getPriorityBadge(task.priority.id)}
                        </div>
                      </div>

                      {task.units.name !== "%" && task.units.name !== null && (
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-300">
                              Mức đạt được
                            </span>
                            <span className="text-xs font-bold text-blue-400">
                              {formatNumber(Number(task.value))} {task.units.name}
                            </span>
                          </div>
                        </div>
                      )}


                      <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-300">
                            Tiến độ
                          </span>
                          <span className="text-xs font-bold text-blue-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
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

                      <div className="flex items-center justify-between text-xs mt-1.5 sm:mt-2">
                        <div className="flex items-center gap-1 text-slate-400">
                          <span className="truncate">
                            {/* Reject - chỉ hiện khi chưa checked */}
                            {task.reject_status && !task.checked && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/30 text-red-300 border border-red-600/40">
                                Bị từ chối
                              </span>
                            )}

                            {/* Checked */}
                            {task.checked && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-600 text-white">
                                Xác nhận hoàn thành
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Ngày reject - chỉ hiện khi chưa checked */}
                        {task.last_reject_date && !task.checked && (
                          <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/30 text-red-300 border border-red-600/40">
                              {formatDate(task.last_reject_date)}
                            </span>
                          </div>
                        )}

                        {/* Ngày hoàn thành */}
                        {task.checked && (
                          <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-600 text-white">
                              {formatDate(task.completed_date)}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 sm:gap-4 mt-6">
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
                  Trang {currentPage} / {totalPages} - Tổng số {tasks.length}{" "}
                  nhiệm vụ
                </div>
              </div>
            )}
          </>
        ) : (
          <TaskDetail
            task={detailTask}
            onBack={() => setSelectedTask(null)}
            getTaskStatusBadge={getTaskStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            calculateProgress={calculateProgress}
            statusTask={statusTask}
            onUpdateSuccess={(id) => refreshTasks(id)}
          />
        )}
      </div>
    </div>
  );
}

export default TasksTab;