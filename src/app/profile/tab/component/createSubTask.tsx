import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "react-toastify";

import { createSubTask } from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { formatDate, formatDate2 } from "@/src/utils/formatDate";

interface StatusTask {
    id: string;
    name: string;
}

interface SubTaskForm {
    name: string;
    description: string;
    target_value: number;
    start_date: string;
    end_date: string;
}

// ── Minimal task info cần để tạo subtask ──
interface TaskInfo {
    task_id: number;              
    task_assignment_id: number;   
    project_name?: string;        
    task_name?: string;           
    target_value?: number | string;
    unit_name?: string | null; 
    date_start: string;   
    date_end: string;
}

interface CreateSubTaskProps {
    taskInfo: TaskInfo;
    statusTask?: StatusTask[];
    onClose: () => void;
    onSuccess?: (refreshTask?: boolean) => void;
    subtask_id?: any;
}

const defaultSubTask: SubTaskForm = {
    name: "",
    description: "",
    target_value: 0,
    start_date: "",
    end_date: "",
};

function CreateSubTask({ taskInfo, statusTask, onClose, onSuccess, subtask_id }: CreateSubTaskProps) {
    const dispatch = useDispatch();
    const [subTasks, setSubTasks] = useState<SubTaskForm[]>([{ ...defaultSubTask }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<number, { start_date?: boolean; end_date?: boolean }>>({});

    const formatNumber = (num: number) => num.toLocaleString("vi-VN");

    const handleSubTaskChange = (index: number, field: keyof SubTaskForm, value: string | number) => {
        setSubTasks(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
        if (field === "start_date" || field === "end_date") {
            setErrors(prev => {
                const updated = { ...prev };
                if (updated[index]) {
                    delete updated[index][field];
                    if (!updated[index].start_date && !updated[index].end_date) {
                        delete updated[index];
                    }
                }
                return updated;
            });
        }
    };

    const addSubTask = () => {
        setSubTasks(prev => [...prev, { ...defaultSubTask }]);
    };

    const removeSubTask = (index: number) => {
        if (subTasks.length === 1) return;
        setSubTasks(prev => prev.filter((_, i) => i !== index));
        setErrors(prev => {
            const updated: typeof prev = {};
            Object.keys(prev).forEach(k => {
                const key = Number(k);
                if (key < index) updated[key] = prev[key];
                else if (key > index) updated[key - 1] = prev[key];
            });
            return updated;
        });
    };

    const resetForm = () => {
        setSubTasks([{ ...defaultSubTask }]);
        setErrors({});
    };

    const handleFormattedTargetChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const input = e.target;
        const selectionStart = input.selectionStart || 0;
        const rawValue = input.value;
        const numericString = rawValue.replace(/\./g, "");
        if (!/^\d*$/.test(numericString)) return;
        const value = Number(numericString);
        const maxValue = Number(taskInfo.target_value ?? 0);
        const validatedValue = Math.min(Math.max(value, 0), maxValue);
        const formatted = formatNumber(validatedValue);
        const dotsBefore = (rawValue.slice(0, selectionStart).match(/\./g) || []).length;
        const newDotsBefore = (formatted.slice(0, selectionStart).match(/\./g) || []).length;
        const caretPosition = selectionStart + (newDotsBefore - dotsBefore);
        handleSubTaskChange(index, "target_value", validatedValue);
        setTimeout(() => {
            input.setSelectionRange(caretPosition, caretPosition);
        }, 0);
    };

    const handleSubmit = async () => {
        if (subTasks.some(st => !st.name.trim())) {
            toast.warning("Vui lòng nhập tên cho tất cả nhiệm vụ con");
            return;
        }

        const newErrors: typeof errors = {};
        let hasDateError = false;

        for (let i = 0; i < subTasks.length; i++) {
            const st = subTasks[i];
            const label = subTasks.length > 1 ? ` (nhiệm vụ con #${i + 1})` : "";

            if (!st.start_date || !st.end_date) {
                newErrors[i] = {
                    start_date: !st.start_date,
                    end_date: !st.end_date,
                };
                if (!hasDateError) {
                    toast.warning(`Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc${label}`);
                }
                hasDateError = true;
            } else if (st.end_date < st.start_date) {
                newErrors[i] = { end_date: true };
                if (!hasDateError) {
                    toast.warning(`Ngày kết thúc phải sau ngày bắt đầu${label}`);
                }
                hasDateError = true;
            }
        }

        setErrors(newErrors);
        if (hasDateError) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                token,
                subtasks: subTasks.map(st => ({
                    name: st.name.trim(),
                    description: st.description,
                    task_id: taskInfo.task_id,
                    task_assignment_id: taskInfo.task_assignment_id,
                    target_value: st.target_value,
                    start_date: st.start_date,
                    end_date: st.end_date,
                    subtask_id: subtask_id ?? null,
                })),
            };

            const result = await dispatch(createSubTask(payload) as any);
            if (result?.payload?.data?.success) {
                toast.success("Tạo mới thành công!");
                onSuccess?.(true);
                onClose();
            } else {
                toast.error(result?.payload?.data?.message || "Tạo thất bại");
            }
        } catch (error) {
            console.error("Error creating subtask:", error);
            toast.error("Có lỗi xảy ra khi Tạo mới");
        } finally {
            setIsSubmitting(false);
        }
    };

    const unitName = taskInfo.unit_name;
    const isPercentUnit = !unitName || unitName === "%";
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-950 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Plus size={24} className="text-blue-400" />
                        Tạo mới
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Parent Task Info */}
                    {(taskInfo.task_name || taskInfo.project_name) && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-xs text-slate-400 mb-2">Nhiệm vụ cha</p>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    {taskInfo.task_name && (
                                        <p className="text-sm font-semibold text-white mb-1">{taskInfo.task_name}</p>
                                    )}
                                    {taskInfo.project_name && (
                                        <p className="text-xs text-slate-400">Dự án: {taskInfo.project_name}</p>
                                    )}
                                    <p className="text-xs text-slate-400">Thời gian: {formatDate2(taskInfo?.date_start)} - {formatDate2(taskInfo?.date_end)}</p>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subtask Forms */}
                    <div className="space-y-4">
                        {subTasks.map((subTask, index) => (
                            <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-blue-400">Nhiệm vụ con #{index + 1}</span>
                                    {subTasks.length > 1 && (
                                        <button
                                            onClick={() => removeSubTask(index)}
                                            className="text-slate-500 hover:text-red-400 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                                        Tên nhiệm vụ con <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subTask.name}
                                        onChange={e => handleSubTaskChange(index, "name", e.target.value)}
                                        placeholder="VD: Phân tích API"
                                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                                        Mô tả
                                    </label>
                                    <input
                                        type="text"
                                        value={subTask.description}
                                        onChange={e => handleSubTaskChange(index, "description", e.target.value)}
                                        placeholder="Mô tả nhiệm vụ"
                                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Start Date & End Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                                            Ngày bắt đầu <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={subTask.start_date}
                                            onChange={e => handleSubTaskChange(index, "start_date", e.target.value)}
                                            className={`w-[90%] sm:w-full px-3 py-2.5 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none transition [color-scheme:dark] ${
                                                errors[index]?.start_date
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                        />
                                        {errors[index]?.start_date && (
                                            <p className="text-xs text-red-400 mt-1">Vui lòng chọn ngày bắt đầu</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                                            Ngày kết thúc <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={subTask.end_date}
                                            min={subTask.start_date || undefined}
                                            onChange={e => handleSubTaskChange(index, "end_date", e.target.value)}
                                            className={`w-[90%] sm:w-full px-3 py-2.5 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none transition [color-scheme:dark] ${
                                                errors[index]?.end_date
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                        />
                                        {errors[index]?.end_date && (
                                            <p className="text-xs text-red-400 mt-1">
                                                {!subTask.end_date ? "Vui lòng chọn ngày kết thúc" : "Phải sau ngày bắt đầu"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Target Value */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                                        {isPercentUnit
                                            ? "Tiến độ cần đạt (%)"
                                            : `Giá trị cần đạt (${unitName})`}
                                    </label>

                                    {isPercentUnit ? (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-blue-500 rounded-lg" />
                                            <div className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-blue-400 text-sm text-center font-semibold select-none cursor-not-allowed">
                                                100
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">
                                                <svg className="text-amber-400 mt-0.5 flex-shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                                </svg>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    <span className="text-amber-400 font-semibold">Gợi ý: </span>
                                                    Nhiệm vụ cha cần đạt{" "}
                                                    <span className="text-white font-semibold">
                                                        {formatNumber(Number(taskInfo.target_value))} {unitName}
                                                    </span>
                                                    . Hãy chia nhỏ theo giai đoạn — mỗi nhiệm vụ con nên đảm nhận trong khoảng{" "}
                                                    <span className="text-blue-400 font-semibold">
                                                        {formatNumber(Math.round(Number(taskInfo.target_value) / subTasks.length))} {unitName}
                                                    </span>
                                                    {subTasks.length > 1 ? ` (chia đều cho ${subTasks.length} nhiệm vụ con)` : " để dễ theo dõi tiến độ"}.
                                                </p>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatNumber(subTask.target_value)}
                                                onChange={(e) => handleFormattedTargetChange(e, index)}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                                                placeholder={`Nhập giá trị (tối đa ${formatNumber(Number(taskInfo.target_value))})`}
                                            />
                                            <div className="text-xs text-slate-400">
                                                Mục tiêu: {formatNumber(Number(taskInfo.target_value))} {unitName}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add button */}
                        <button
                            onClick={addSubTask}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-lg transition"
                        >
                            <Plus size={16} />
                            Thêm nhiệm vụ con
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-slate-950 border-t border-slate-800 p-4 sm:p-6 flex gap-3">
                    <button
                        onClick={resetForm}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
                    >
                        Đặt lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={subTasks.every(st => !st.name.trim()) || isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                    >
                        <Save size={18} />
                        {isSubmitting ? "Đang tạo..." : `Tạo ${subTasks.length > 1 ? `${subTasks.length} ` : ""}nhiệm vụ con`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateSubTask;