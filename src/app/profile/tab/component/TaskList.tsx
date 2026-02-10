import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTaskAssign, exportTemplate, getDetailListTaskAssign, getListProject, getPriorityTask, getStatusTask } from '@/src/features/task/api';
import { useTaskData } from '@/src/hooks/taskhook';
import { Download, Plus, Search, Upload, X, XCircle } from 'lucide-react';
import PopupComponent, { usePopup } from "@/components/PopupComponent";
import { toast } from 'react-toastify';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import TaskDetailAssign from './TaskDetailAsign'; 
import AssignTask from './AssignTask';
import { useProfileData } from '@/src/hooks/profileHook';
import { listTypeTask } from '@/src/services/api';
import FilterableSelector from '@/components/FilterableSelector';
import DashboardTaskManager from './dashboard/DashboardTaskManager';

interface TypeProps{
    id: string;
    name: string;
}

const TaskListAssign: React.FC = () => {
    const dispatch = useDispatch();
    const { typeTask } = useProfileData();
    const { listDetailTaskAssign, detailTaskAssign, loadingListDetailTaskAssign, errorListDetailTaskAssign, listProject, statusTask, priorityTask } = useTaskData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();
    const [showAssignTask, setShowAssignTask] = useState(false);

    const [taskFilter, setTaskFilter] = useState<string>("all");
    const [projectFilter, setProjectFilter] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>("2");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showFilter, setShowFilter] = useState(true);

    
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

    useEffect(() => {

        const timeout = setTimeout(() => {
            const token = localStorage.getItem("userToken");
            if (token) {
                const payload = {
                    page: currentPage,
                    token,
                    task_status: statusFilter === "all" ? null : parseInt(statusFilter),  
                    type_task: taskFilter === "all" ? null : parseInt(taskFilter), 
                    project_id: projectFilter?.id  ? projectFilter?.id : null, 
                    search: searchFilter === "" ? null : searchFilter,
                    task_priority: priorityFilter === "all" ? null : parseInt(priorityFilter), 
                    key: "listDetailTaskAssign"
                };

                dispatch(getDetailListTaskAssign(payload) as any);
                    
            }
        }, 300)
        return () => clearTimeout(timeout);
    }, [statusFilter, taskFilter, projectFilter, searchFilter, priorityFilter, currentPage]);

    

    useEffect(() => {
        if (listProject) {
            setFilteredProjects(listProject);
        }
    }, [listProject]);
    
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
    
    const handleTaskClick = (taskId: string) => {

        const token = localStorage.getItem("userToken");

        setSelectedTaskId(taskId);
        dispatch(getDetailListTaskAssign({
            id: taskId,
            token: token,
            key: "detailTaskAssign"
        }) as any);
    };

    const handleBackToList = () => {
        setSelectedTaskId(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (statusId: number) => {
        const colors: { [key: number]: string } = {
            1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            2: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            4: 'bg-green-500/20 text-green-400 border border-green-500/30',
            3: 'bg-red-500/20 text-red-400 border border-red-500/30',
        };
        return colors[statusId] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
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

    

    const handleDeleteTask = async (e: React.MouseEvent, task: any) => {
        e.stopPropagation();
        
        const token = localStorage.getItem("userToken");
        const payload = {
            id: task.id,
            token
        }
        openPopup({
            type: "warning",
            title: "Nhiệm vụ này sẽ được xóa",
            confirmText: "Xác nhận",
            showActionButtons: true,
            onConfirm: async () => {
                const res = await dispatch(deleteTaskAssign(payload) as any);
                
                if(res.payload.data?.success){
                    dispatch(getDetailListTaskAssign({
                        page: currentPage,
                        token: token,
                        key: "listDetailTaskAssign"
                    }) as any);
                    toast.success(res.payload.data.message)

                    closePopup();
                }else{
                    toast.error(res.payload.message || res.payload.data.message || "Xóa thất bại")
                    closePopup();
                }
                
            },
            onCancel: closePopup,
        });
    };

    const renderPaginationItems = () => {
        if (!listDetailTaskAssign?.pagination) return null;

        const totalPages = listDetailTaskAssign.pagination.totalPages;
        const items = [];
        const showEllipsisThreshold = 7;

        if (totalPages <= showEllipsisThreshold) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i);
                            }}
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
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                        }}
                        isActive={currentPage === 1}
                        className="cursor-pointer"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(<PaginationEllipsis key="ellipsis-start" />);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i);
                            }}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<PaginationEllipsis key="ellipsis-end" />);
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
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

    // Hiển thị chi tiết task
    if (selectedTaskId && detailTaskAssign) {
        return <TaskDetailAssign task={detailTaskAssign} onBack={handleBackToList} />;
    }

    if (showAssignTask) {
        return (
          <AssignTask
            onBack={() => setShowAssignTask(false)}
            // onAssignSuccess={handleAssignSuccess}
          />
        );
    }

    const handleFilterChange = (filter: string) => {
        setTaskFilter(filter);
        setCurrentPage(1)
    };
    const handleProjectFilterChange = (filter: any) => {
        setProjectFilter(filter);
        setCurrentPage(1)

    };
    const handleStatusFilterChange = (filter: string) => {
        setStatusFilter(filter);
        setCurrentPage(1)

    };
    const handlePriorityFilterChange = (filter: string) => {
        setPriorityFilter(filter);
        setCurrentPage(1)

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

    const handleExport = async () => {
        const token = localStorage.getItem("userToken");
        
        try {
            const result = await dispatch(exportTemplate({ token }) as any).unwrap();
            
            const blob = new Blob([result.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `task_template_${new Date().getTime()}.xlsx`; // Tên file
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            
        } catch (error) {
            toast.error("Tải file thất bại")
        }
    };

    const handleImport = () => {

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
                                setCurrentPage(1)
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

    // Hiển thị danh sách task
    return (
        <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
            <DashboardTaskManager />
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5'>
                <h1 className="md:text-2xl text-xl  font-bold text-white mb-6">Công việc đã giao</h1>
                <div className='flex items-center gap-1'>
                    <button
                        onClick={() => handleExport()}
                        className="flex items-center justify-center gap-2 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    {/* <button
                        onClick={() => handleImport()}
                        className="flex items-center justify-center gap-2 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                    >
                        <Upload size={18} />
                        Import
                    </button> */}

                    <button
                        onClick={() => setShowAssignTask(true)}
                        className="flex items-center justify-center gap-2 px-2.5 py-1.5 
                                    bg-blue-600 hover:bg-blue-700 text-white text-xs 
                                    font-semibold rounded-lg transition 
                                    shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">
                            Giao nhiệm vụ
                        </span>
                    </button>
                </div>
            </div>
            <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />

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

            {loadingListDetailTaskAssign ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500"></div>
                </div>
            ) : errorListDetailTaskAssign ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    Có lỗi xảy ra khi tải danh sách công việc
                </div>
            ) : (
                <>
                    {listDetailTaskAssign && listDetailTaskAssign.data && listDetailTaskAssign.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listDetailTaskAssign.data.map((task: any) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                        className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer p-4 group"
                                    >
                                        <div className='mb-3'>
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
                                        </div>
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white flex-1 group-hover:text-blue-400 transition-colors">{task.name}</h3>
                                            {task.status.id !== 4 && (
                                                <button
                                                    onClick={(e) => handleDeleteTask(e,task)}
                                                    className={`p-2 rounded-lg transition-all 
                                                    bg-red-600 hover:bg-red-700 text-white cursor-pointer
                                                    disabled:opacity-50`}
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            )}
                                        </div>


                                        <div className="flex items-center justify-between mb-4 ">
                                            <span className={`text-xs px-2.5 py-1 rounded-lg ${getStatusColor(task.status.id)}`}>
                                                {task.status.name}
                                            </span>
                                            <span className={`text-xs ${getPriorityColor(task.priority.id)} px-2 py-1 rounded-lg`}>{task.priority.name}</span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Dự án:</span> {task.project.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Loại:</span> {task.type_task.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Hạn:</span> {formatDate(task.date_end)}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                                                <span>Tiến độ</span>
                                                <span className="font-bold text-blue-400">{task.process}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${task.process}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {listDetailTaskAssign.pagination && listDetailTaskAssign.pagination.totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 1) {
                                                            handlePageChange(currentPage - 1);
                                                        }
                                                    }}
                                                    className={`cursor-pointer ${
                                                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                                    }`}
                                                />
                                            </PaginationItem>
                                            
                                            {renderPaginationItems()}
                                            
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < listDetailTaskAssign.pagination.totalPages) {
                                                            handlePageChange(currentPage + 1);
                                                        }
                                                    }}
                                                    className={`cursor-pointer ${
                                                        currentPage === listDetailTaskAssign.pagination.totalPages
                                                            ? 'pointer-events-none opacity-50'
                                                            : ''
                                                    }`}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-lg">
                            <svg className="mx-auto h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-4 text-lg text-slate-400">Chưa giao công việc</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TaskListAssign;