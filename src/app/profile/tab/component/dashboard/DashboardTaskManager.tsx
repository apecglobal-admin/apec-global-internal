import { getDashboardManagerTasks } from '@/src/features/dashboard/api/api';
import { useDashboardData } from '@/src/hooks/dashboardhook';
import { 
  ChevronUp, 
  ChevronDown, 
  ClipboardList, 
  AlertCircle, 
  CheckCircle2, 
  Star, 
  Layers, 
  Target,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

const MONTH_NAMES = [
    'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];

function DashboardTaskManager() {
    const dispatch = useDispatch();
    const { listDashboardManagerTasks } = useDashboardData();
    const [isVisible, setIsVisible] = useState(true);
    const [isKpiDropdownOpen, setIsKpiDropdownOpen] = useState(false);

    // ── Filter state ─────────────────────────────────────────────────────────
    // null = không lọc theo tháng (gửi request không có param month)
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number | null>(today.getMonth() + 1); // 1–12 | null
    const [selectedYear, setSelectedYear]   = useState<number>(today.getFullYear());

    const isCurrentMonth =
        selectedMonth !== null &&
        selectedMonth === today.getMonth() + 1 &&
        selectedYear  === today.getFullYear();

    // Build param "YYYY-MM" theo yêu cầu API — trả về undefined nếu không chọn tháng
    const buildMonthParam = (month: number | null, year: number) =>
      month !== null ? `${String(month).padStart(2, '0')}/${year}` : undefined;


    const handlePrevMonth = () => {
        if (selectedMonth === null) return;
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(y => y - 1);
        } else {
            setSelectedMonth(m => m! - 1);
        }
    };

    const handleNextMonth = () => {
        if (isCurrentMonth) return;
        if (selectedMonth === null) return;
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(y => y + 1);
        } else {
            setSelectedMonth(m => m! + 1);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        dispatch(
            getDashboardManagerTasks({
                token,
                month: buildMonthParam(selectedMonth, selectedYear),
            }) as any
        );
    }, [selectedMonth, selectedYear]);

    return (
        <div>
            <div className="space-y-1 mb-4">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 transition-all duration-200"
                >
                    <span className="text-white font-semibold text-sm">Dashboard Tổng Quan</span>
                    {isVisible
                        ? <ChevronUp className="h-5 w-5 text-slate-400" />
                        : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {isVisible && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 gap-2">
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="p-1 bg-sky-600/20 rounded">
                                    <CalendarDays className="h-4 w-4 text-sky-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-300">Lọc theo tháng</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setSelectedMonth(null)}
                                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                                        selectedMonth === null
                                            ? 'text-white bg-green-500'
                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                                    }`}
                                >
                                    Tất cả
                                </button>

                                <button
                                    onClick={handlePrevMonth}
                                    disabled={selectedMonth === null}
                                    className={`p-1 rounded transition-colors ${
                                        selectedMonth === null
                                            ? 'opacity-30 cursor-not-allowed'
                                            : 'hover:bg-slate-700'
                                    }`}
                                >
                                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                                </button>

                                <button
                                    onClick={() => {
                                        if (selectedMonth === null) {
                                            setSelectedMonth(today.getMonth() + 1);
                                            setSelectedYear(today.getFullYear());
                                        }
                                    }}
                                    className={`min-w-[126px] text-center px-1 py-0.5 rounded transition-colors ${
                                        selectedMonth === null
                                            ? 'bg-slate-700/30 cursor-pointer hover:bg-slate-700/60'
                                            : 'bg-slate-700/60'
                                    }`}
                                >
                                    <span className={`text-xs font-bold ${selectedMonth === null ? 'text-slate-500' : 'text-white'}`}>
                                        {selectedMonth !== null
                                            ? `${MONTH_NAMES[selectedMonth - 1]} / ${selectedYear}`
                                            : '— / —'}
                                    </span>
                                </button>

                                <button
                                    onClick={handleNextMonth}
                                    disabled={isCurrentMonth || selectedMonth === null}
                                    className={`p-1 rounded transition-colors ${
                                        isCurrentMonth || selectedMonth === null
                                            ? 'opacity-30 cursor-not-allowed'
                                            : 'hover:bg-slate-700'
                                    }`}
                                >
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {listDashboardManagerTasks ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-md">
                                                    <ClipboardList className="h-5 w-5 text-white" />
                                                </div>
                                                <p className="text-blue-100 text-xs font-medium">
                                                    {listDashboardManagerTasks.total_task_assignments?.label}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="sm:text-xl text-sm font-bold text-white">
                                                    {listDashboardManagerTasks.total_task_assignments?.value || 0}
                                                </p>
                                                <p className="text-blue-200 text-xs">nhiệm vụ</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-md animate-pulse">
                                                    <AlertCircle className="h-5 w-5 text-white" />
                                                </div>
                                                <p className="text-red-100 text-xs font-medium">
                                                    {listDashboardManagerTasks.overdue_tasks?.label}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="sm:text-xl text-sm font-bold text-white">
                                                    {listDashboardManagerTasks.overdue_tasks?.value || 0}
                                                </p>
                                                <p className="text-red-200 text-xs">cần xử lý</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Row 2: Trạng thái & Ưu tiên ──────────────── */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-purple-600/20 rounded">
                                                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                                                </div>
                                                <h3 className="text-xs font-bold text-white">
                                                    {listDashboardManagerTasks.tasks_by_status?.label}
                                                </h3>
                                            </div>
                                            <div className="px-2 py-0.5 bg-purple-600/20 rounded-full">
                                                <span className="text-purple-300 text-xs font-semibold">
                                                    {listDashboardManagerTasks.tasks_by_status?.items?.reduce(
                                                        (sum: any, item: any) => sum + item.total, 0
                                                    ) || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {listDashboardManagerTasks.tasks_by_status?.items?.length > 0 ? (
                                                listDashboardManagerTasks.tasks_by_status.items.map((item: any, index: any) => {
                                                    const colorMap: any = {
                                                        "2": { text: "text-blue-400" },
                                                        "3": { text: "text-orange-400" },
                                                        "4": { text: "text-green-400" },
                                                        "5": { text: "text-red-400" },
                                                    };
                                                    const colors = colorMap[item.task_status] || { text: "text-slate-400" };
                                                    return (
                                                        <div key={index} className="flex items-center justify-between">
                                                            <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                                            <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                                                {item.total}
                                                            </span>
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

                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-orange-600/20 rounded">
                                                    <Star className="h-4 w-4 text-orange-400" />
                                                </div>
                                                <h3 className="text-xs font-bold text-white">
                                                    {listDashboardManagerTasks.tasks_by_priority?.label}
                                                </h3>
                                            </div>
                                            <div className="px-2 py-0.5 bg-orange-600/20 rounded-full">
                                                <span className="text-orange-300 text-xs font-semibold">
                                                    {listDashboardManagerTasks.tasks_by_priority?.items?.reduce(
                                                        (sum: any, item: any) => sum + item.total, 0
                                                    ) || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {listDashboardManagerTasks.tasks_by_priority?.items?.length > 0 ? (
                                                listDashboardManagerTasks.tasks_by_priority.items.map((item: any, index: any) => {
                                                    const colorMap: any = {
                                                        "1": { text: "text-red-400" },
                                                        "2": { text: "text-orange-400" },
                                                        "3": { text: "text-yellow-400" },
                                                        "4": { text: "text-green-400" },
                                                    };
                                                    const colors = colorMap[item.task_priority] || { text: "text-slate-400" };
                                                    return (
                                                        <div key={index} className="flex items-center justify-between">
                                                            <span className={`text-xs font-medium ${colors.text}`}>{item.label}</span>
                                                            <span className={`text-sm font-bold px-2 py-0.5 ${colors.text} rounded`}>
                                                                {item.total}
                                                            </span>
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

                                {/* ── Row 3: Loại công việc ─────────────────────── */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-3 shadow-md">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-cyan-600/20 rounded">
                                                <Layers className="h-4 w-4 text-cyan-400" />
                                            </div>
                                            <h3 className="text-xs font-bold text-white">
                                                {listDashboardManagerTasks.tasks_by_type_task?.label}
                                            </h3>
                                        </div>
                                        <div className="px-2 py-0.5 bg-cyan-600/20 rounded-full">
                                            <span className="text-cyan-300 text-xs font-semibold">
                                                {listDashboardManagerTasks.tasks_by_type_task?.items?.reduce(
                                                    (sum: any, item: any) => sum + item.total, 0
                                                ) || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`${listDashboardManagerTasks.tasks_by_type_task?.items?.length === 0 ? "" : "grid grid-cols-3 gap-2"}`}>
                                        {listDashboardManagerTasks.tasks_by_type_task?.items?.length > 0 ? (
                                            listDashboardManagerTasks.tasks_by_type_task.items.map((item: any, index: any) => {
                                                const colorMap: any = {
                                                    "1": { bg: "bg-blue-600/20",   border: "border-blue-500",   text: "text-blue-400"   },
                                                    "2": { bg: "bg-purple-600/20", border: "border-purple-500", text: "text-purple-400" },
                                                    "3": { bg: "bg-teal-600/20",   border: "border-teal-500",   text: "text-teal-400"   },
                                                };
                                                const colors = colorMap[item.type_task] || { bg: "bg-slate-600/20", border: "border-slate-500", text: "text-slate-400" };
                                                return (
                                                    <div key={index} className={`${colors.bg} border ${colors.border} rounded-lg p-2 text-center`}>
                                                        <p className={`text-xs font-medium ${colors.text} mb-1`}>{item.label}</p>
                                                        <p className={`text-xl font-bold ${colors.text}`}>{item.total}</p>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-3 text-center py-4">
                                                <Layers className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                                                <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Row 4: KPI dropdown ───────────────────────── */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-md">
                                    <button
                                        onClick={() => setIsKpiDropdownOpen(!isKpiDropdownOpen)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-emerald-600/20 rounded">
                                                <Target className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <h3 className="text-xs font-bold text-white">
                                                {listDashboardManagerTasks.tasks_by_kpi_item?.label}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 bg-emerald-600/20 rounded-full">
                                                <span className="text-emerald-300 text-xs font-semibold">
                                                    {listDashboardManagerTasks.tasks_by_kpi_item?.items?.reduce(
                                                        (sum: any, item: any) => sum + item.total, 0
                                                    ) || 0}
                                                </span>
                                            </div>
                                            {isKpiDropdownOpen
                                                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                                                : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </button>

                                    {isKpiDropdownOpen && (
                                        <div className="px-3 pb-3 space-y-1.5 max-h-64 overflow-y-auto">
                                            {listDashboardManagerTasks.tasks_by_kpi_item?.items?.length > 0 ? (
                                                listDashboardManagerTasks.tasks_by_kpi_item.items.map((item: any, index: any) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between bg-slate-700/50 hover:bg-slate-700 rounded-md px-3 py-2 transition-all duration-200"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                            <span className="text-xs font-medium text-slate-200">{item.label}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-emerald-400 px-2 py-0.5 bg-emerald-600/20 rounded">
                                                            {item.total}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4">
                                                    <Target className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                                                    <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Loading skeleton */
                            <div className="space-y-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-slate-800 rounded-lg p-3 animate-pulse h-16" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardTaskManager;