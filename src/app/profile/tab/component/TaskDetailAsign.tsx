import React, { useState, useEffect } from 'react';
import {
    getTypeTask,
    getPriorityTask,
    getListProject,
    getChildKpi,
    getListEmployee,
    getStatusTask,
    updateTaskAssign,
    getDetailListTaskAssign,
} from "@/src/features/task/api";
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import TaskEditForm from './TaskEditForm';

interface TaskDetailProps {
    task: any;
    onBack: () => void;
    onUpdate?: () => void;
}

const TaskDetailAssign: React.FC<TaskDetailProps> = ({ task, onBack, onUpdate }) => {
    
    const dispatch = useDispatch();
    const {
        typeTask,
        priorityTask,
        childKpi,
        statusTask,
        listProject,
        listEmployee,
    } = useTaskData();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompletedEmployee, setHasCompletedEmployee] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (!statusTask) {
            dispatch(getStatusTask() as any);
        }
        dispatch(getTypeTask() as any);
        dispatch(getPriorityTask() as any);
        dispatch(getListProject({}) as any);
        dispatch(getChildKpi() as any);
        dispatch(
            getListEmployee({
                position_id: null,
                department_id: null,
                filter: null,
                token
            }) as any
        );
    }, [dispatch]);

    useEffect(() => {
        const hasCompleted = task?.task_assignment?.some((assignment: any) => assignment.process === 100);
        setHasCompletedEmployee(hasCompleted);
    }, [task]);

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

    const getPriorityColor = (priorityId: number) => {
        const colors: { [key: number]: string } = {
            1: 'text-red-400',
            2: 'text-orange-400',
            4: 'text-yellow-400',
            3: 'text-green-400',
        };
        return colors[priorityId] || 'text-gray-400';
    };

    const handleSave = async (changedData: any) => {
        setIsLoading(true);
        const token = localStorage.getItem("userToken");

        try {
            const payload: any = {
                id: task.id,
                token,
                ...changedData // Spread các field đã thay đổi
            };

            const response = await dispatch(updateTaskAssign(payload) as any);

            if (response.payload?.data?.success) {
                dispatch(getDetailListTaskAssign({
                    id: task.id,
                    token: token,
                    key: "detailTaskAssign"
                }) as any);
                toast.success('Cập nhật thành công!');
                setIsEditing(false);
                if (onUpdate) {
                    onUpdate();
                }
                
            } else {
                toast.error(response.payload?.data?.message || 'Cập nhật thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Chỉnh sửa công việc</h2>
                </div>

                <TaskEditForm
                    task={task}
                    typeTask={typeTask}
                    priorityTask={priorityTask}
                    listProject={listProject}
                    childKpi={childKpi}
                    listEmployee={listEmployee}
                    hasCompletedEmployee={hasCompletedEmployee}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <button
                    onClick={onBack}
                    className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden sm:inline">Quay lại danh sách</span>
                    <span className="sm:hidden">Quay lại</span>
                </button>

                <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base order-1 sm:order-2"
                >
                    <Edit2 size={16} className="sm:hidden" />
                    <Edit2 size={18} className="hidden sm:block" />
                    Chỉnh sửa
                </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 sm:p-6">
                {/* Tên công việc */}
                <div className="border-b border-slate-700 pb-3 sm:pb-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">{task.name}</h1>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className={`font-semibold flex items-center gap-1 ${getPriorityColor(task.priority.id)}`}>
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {task.priority.name}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Dự án</label>
                            <p className="text-white mt-1 text-sm sm:text-base truncate">{task.project.name}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Loại công việc</label>
                            <p className="text-white mt-1 text-sm sm:text-base truncate">{task.type_task.name}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">KPI</label>
                            <p className="text-white mt-1 text-sm sm:text-base truncate">{task.kpi_item.name}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Loại đối tượng</label>
                            <p className="text-white mt-1 text-sm sm:text-base truncate">{task.target_type.name}</p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Ngày bắt đầu</label>
                            <p className="text-white mt-1 text-sm sm:text-base">{formatDate(task.date_start)}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Ngày kết thúc</label>
                            <p className="text-white mt-1 text-sm sm:text-base">{formatDate(task.date_end)}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Từ chối tối thiểu</label>
                            <p className="text-white mt-1 text-sm sm:text-base">{task.min_count_reject}</p>
                        </div>

                        <div className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                            <label className="text-xs sm:text-sm font-semibold text-slate-400">Từ chối tối đa</label>
                            <p className="text-white mt-1 text-sm sm:text-base">{task.max_count_reject}</p>
                        </div>
                    </div>
                </div>

                {/* Tiến độ */}
                <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <label className="text-xs sm:text-sm font-semibold text-slate-400">Tiến độ</label>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-2.5 sm:h-3">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 sm:h-3 rounded-full transition-all duration-300"
                                style={{ width: `${task.process}%` }}
                            ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-blue-400 min-w-[40px] sm:min-w-[45px]">{task.process}%</span>
                    </div>
                </div>

                {/* Mô tả */}
                <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <label className="text-xs sm:text-sm font-semibold text-slate-400">Mô tả</label>
                    <p className="text-slate-300 mt-2 leading-relaxed text-sm sm:text-base">{task.description || 'Không có mô tả'}</p>
                </div>

                {/* Danh sách người thực hiện */}
                {task.task_assignment && task.task_assignment.length > 0 && (
                    <div>
                        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="truncate">Người thực hiện ({task.task_assignment.length})</span>
                        </h2>
                        <div className="space-y-2 sm:space-y-3">
                            {task.task_assignment.map((assignment: any) => (
                                <div key={assignment.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 sm:p-4 hover:border-blue-500/50 transition-colors">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            {assignment.employee.avatar ? (
                                                <img 
                                                    src={assignment.employee.avatar} 
                                                    alt={assignment.employee.name}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-slate-600 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg border-2 border-slate-600 flex-shrink-0">
                                                    {assignment.employee.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white text-sm sm:text-base truncate">{assignment.employee.name}</p>
                                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-lg ${getStatusColor(assignment.status.id)}`}>
                                                        {assignment.status.name}
                                                    </span>
                                                    {assignment.checked && (
                                                        <span className="text-xs px-2 py-0.5 sm:py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                                                            ✓ Đã kiểm tra
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs sm:text-sm text-slate-400">Tiến độ</p>
                                            <p className="font-bold text-blue-400 text-base sm:text-lg">{assignment.process}%</p>
                                            {assignment.completed_date && (
                                                <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                                                    Hoàn thành: {formatDate(assignment.completed_date)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {assignment.completed_date && (
                                        <p className="text-xs text-slate-500 mt-2 sm:hidden">
                                            Hoàn thành: {formatDate(assignment.completed_date)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailAssign;