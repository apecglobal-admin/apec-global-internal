'use client'

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
    getSubTaskDetail
} from "@/src/features/task/api";
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { Edit2, CheckCircle2, Clock, XCircle, AlertCircle, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import TaskEditForm from './TaskEditForm';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';

interface TaskDetailProps {
    task: any;
    onBack: () => void;
    onUpdate?: () => void;
    isEdit?: boolean
}

interface SubTask {
    id: string;
    name: string;
    description: string;
    process: string;
    target_value: string;
    value: string;
    status: {
        id: number;
        name: string;
    };
}

const TaskDetailAssign: React.FC<TaskDetailProps> = ({ task, onBack, onUpdate, isEdit = true }) => {

    const dispatch = useDispatch();
    const {
        typeTask,
        priorityTask,
        childKpi,
        statusTask,
        listProject,
        listEmployee,
        subTaskDetail,
        loadingSubTaskDetail,
    } = useTaskData();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompletedEmployee, setHasCompletedEmployee] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!statusTask) dispatch(getStatusTask() as any);
        dispatch(getListEmployee({ position_id: null, department_id: null, filter: null, token }) as any);
        
        if (isEdit) {
            if (!typeTask) dispatch(getTypeTask() as any);
            if (!priorityTask) dispatch(getPriorityTask() as any);
            if (!listProject) dispatch(getListProject({}) as any);
            if (!childKpi) dispatch(getChildKpi() as any);
        }
    }, [dispatch, isEdit]);

    useEffect(() => {
        if (!isEdit) return;
        const hasCompleted = task?.task_assignment?.some((a: any) => a.process === 100);
        setHasCompletedEmployee(hasCompleted);
    }, [task, isEdit]);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN');

    const formatNumber = (value: number) => {
        if (!value) return "";
        return new Intl.NumberFormat("en-US").format(value);
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

    const getSubTaskStatusIcon = (statusId: number) => {
        switch (statusId) {
            case 4: return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
            case 2: return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
            case 3: return <XCircle className="w-3.5 h-3.5 text-red-400" />;
            default: return <AlertCircle className="w-3.5 h-3.5 text-blue-400" />;
        }
    };

    const getSubTaskStatusStyle = (statusId: number) => {
        const styles: { [key: number]: string } = {
            1: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            2: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            4: 'bg-green-500/10 text-green-400 border border-green-500/20',
            3: 'bg-red-500/10 text-red-400 border border-red-500/20',
        };
        return styles[statusId] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    };

    const getProgressColor = (process: number) => {
        if (process >= 100) return 'from-green-500 to-emerald-400';
        if (process >= 60) return 'from-blue-500 to-cyan-400';
        if (process >= 30) return 'from-yellow-500 to-amber-400';
        return 'from-red-500 to-rose-400';
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
            const payload: any = { id: task.id, token, ...changedData };
            const response = await dispatch(updateTaskAssign(payload) as any);
            if (response.payload?.data?.success) {
                dispatch(getDetailListTaskAssign({ id: task.id, token, key: "detailTaskAssign" }) as any);
                toast.success('Cập nhật thành công!');
                setIsEditing(false);
                if (onUpdate) onUpdate();
            } else {
                toast.error(response.payload?.data?.message || 'Cập nhật thất bại!');
            }
        } catch {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetail = async (assignmentId: number) => {
        const assignment = task.task_assignment.find((a: any) => a.id === assignmentId);
        setSelectedAssignment(assignment);
        setIsDialogOpen(true);
        const token = localStorage.getItem("userToken");
        const res = await dispatch(getSubTaskDetail({ task_assignment_id: assignmentId, token }) as any);
        console.log(res);
        
    };

    // Lấy từ Redux store — chỉ dùng data khi là array có phần tử
    const subTasks: SubTask[] = Array.isArray(subTaskDetail) && subTaskDetail.length > 0 ? subTaskDetail : [];
    const isSubTaskLoading = !!loadingSubTaskDetail;
    const completedSubTasks = subTasks.filter(st => st.status.id === 4).length;

    if (isEditing && isEdit) {
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
                    onCancel={() => setIsEditing(false)}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <button
                    onClick={onBack}
                    className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex justify-center items-center gap-2 transition-colors text-sm order-2 sm:order-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-xs">Quay lại</span>
                </button>
                {isEdit && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-xs order-1 sm:order-2"
                    >
                        <Edit2 size={16} />
                        Chỉnh sửa
                    </button>

                )}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 sm:p-6">
                {/* Tên công việc */}
                <div className="border-b border-slate-700 pb-3 sm:pb-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">{task.name}</h1>
                    <span className={`font-semibold flex items-center gap-1 text-xs sm:text-sm ${getPriorityColor(task.priority.id)}`}>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {task.priority.name}
                    </span>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-3 sm:space-y-4">
                        {[
                            { label: 'Dự án', value: task.project.name },
                            { label: 'Loại công việc', value: task.type_task.name },
                            { label: 'KPI', value: task.kpi_item.name },
                            { label: 'Mục tiêu', value: `${formatNumber(task.target_value)} ${task.unit.name}` },
                            { label: 'Loại đối tượng', value: task.target_type.name },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                                <label className="text-xs sm:text-sm font-semibold text-slate-400">{label}</label>
                                <p className="text-white mt-1 text-sm sm:text-base truncate">{value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {[
                            { label: 'Ngày bắt đầu', value: formatDate(task.date_start) },
                            { label: 'Ngày kết thúc', value: formatDate(task.date_end) },
                            { label: 'Từ chối tối thiểu', value: task.min_count_reject },
                            { label: 'Từ chối tối đa', value: task.max_count_reject },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-900/50 p-2.5 sm:p-3 rounded-lg">
                                <label className="text-xs sm:text-sm font-semibold text-slate-400">{label}</label>
                                <p className="text-white mt-1 text-sm sm:text-base">{value}</p>
                            </div>
                        ))}
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
                            />
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
                                <div
                                    onClick={() => handleDetail(assignment.id)}
                                    key={assignment.id}
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 sm:p-4 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
                                >
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
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-white text-sm sm:text-base truncate">{assignment.employee.name}</p>
                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                                </div>
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
                                            {(task.is_overdue || task.is_due) ? (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs sm:text-sm font-medium text-white">Tiến độ</span>
                                                    <div className="flex items-center gap-2">
                                                        {task.is_overdue && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-red-500 text-white font-medium shadow-sm">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                                Trễ hạn
                                                            </span>
                                                        )}
                                                        {task.is_due && !task.is_overdue && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-sm animate-pulse">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                </svg>
                                                                Gần deadline
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs sm:text-sm font-medium text-white">Tiến độ</span>
                                            )}
                                            <p className="font-bold text-blue-400 text-base sm:text-lg">{assignment.process}%</p>
                                            {assignment.completed_date && (
                                                <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                                                    deadline: {formatDate(assignment.completed_date)}
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

            {/* Sub-task Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="bg-slate-900 border border-slate-700 text-white max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col p-0"
                    showCloseButton={false}
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-700/80 flex items-start justify-between gap-3 flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            {selectedAssignment?.employee?.avatar ? (
                                <img
                                    src={selectedAssignment.employee.avatar}
                                    alt={selectedAssignment.employee.name}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-600 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-600 flex-shrink-0">
                                    {selectedAssignment?.employee?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <DialogTitle className="text-base font-bold text-white truncate">
                                    {selectedAssignment?.employee?.name}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-md ${getStatusColor(selectedAssignment?.status?.id)}`}>
                                        {selectedAssignment?.status?.name}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Tiến độ: <span className="text-blue-400 font-bold">{selectedAssignment?.process}%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Summary stats — chỉ hiện khi KHÔNG loading và CÓ data */}
                    {!isSubTaskLoading && subTasks.length > 0 && (
                        <div className="px-5 pt-4 grid grid-cols-3 gap-3 flex-shrink-0">
                            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-white">{subTasks.length}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Tổng nhiệm vụ</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-green-400">{completedSubTasks}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Hoàn thành</p>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-blue-400">{subTasks.length - completedSubTasks}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Đang thực hiện</p>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">

                        {/* Loading spinner */}
                        {isSubTaskLoading && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-slate-400 text-sm">Đang tải dữ liệu...</p>
                            </div>
                        )}

                        {/* Empty — chỉ hiện khi KHÔNG loading và KHÔNG có data */}
                        {!isSubTaskLoading && subTasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 text-sm font-medium">Chưa có nhiệm vụ nào</p>
                            </div>
                        )}

                        {/* Data list — chỉ hiện khi KHÔNG loading và CÓ data */}
                        {!isSubTaskLoading && subTasks.length > 0 && subTasks.map((subTask, index) => {
                            const process = parseInt(subTask.process);
                            const progressColor = getProgressColor(process);
                            return (
                                <div
                                    key={subTask.id}
                                    className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white text-sm leading-snug">{subTask.name}</p>
                                                {subTask.description && (
                                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{subTask.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0 ${getSubTaskStatusStyle(subTask.status.id)}`}>
                                            {getSubTaskStatusIcon(subTask.status.id)}
                                            {subTask.status.name}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-slate-700/40 rounded-lg p-2 flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Mục tiêu</p>
                                                <p className="text-xs font-semibold text-slate-200 truncate">{formatNumber(parseFloat(subTask.target_value))}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-700/40 rounded-lg p-2 flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Đạt được</p>
                                                <p className="text-xs font-semibold text-slate-200 truncate">{formatNumber(parseFloat(subTask.value))}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Tiến độ</span>
                                            <span className={`text-xs font-bold ${process >= 100 ? 'text-green-400' : process >= 60 ? 'text-blue-400' : process >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {process}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${progressColor} rounded-full transition-all duration-500`}
                                                style={{ width: `${Math.min(process, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-slate-700/80 flex justify-end flex-shrink-0">
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors font-medium"
                        >
                            Đóng
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskDetailAssign;