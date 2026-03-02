import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "react-toastify";

import {
    createSubTask
} from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { Task } from "@/src/services/interface";

interface StatusTask {
    id: string;
    name: string;
}

interface SubTaskForm {
    name: string;
    description: string;
    target_value: number;
}

interface CreateSubTaskProps {
    task: Task;
    statusTask?: StatusTask[];
    onClose: () => void;
    onSuccess?: (refreshTask?: boolean) => void;
}

const defaultSubTask: SubTaskForm = { name: "", description: "", target_value: 0 };

function CreateSubTask({ task, statusTask, onClose, onSuccess }: CreateSubTaskProps) {
    const dispatch = useDispatch();
    const [subTasks, setSubTasks] = useState<SubTaskForm[]>([{ ...defaultSubTask }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const formatNumber = (num: number) => num.toLocaleString("vi-VN");

    const handleSubTaskChange = (index: number, field: keyof SubTaskForm, value: string | number) => {
        setSubTasks(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const addSubTask = () => {
        setSubTasks(prev => [...prev, { ...defaultSubTask }]);
    };

    const removeSubTask = (index: number) => {
        if (subTasks.length === 1) return;
        setSubTasks(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setSubTasks([{ ...defaultSubTask }]);
    };

    const handleSubmit = async () => {
        if (subTasks.some(st => !st.name.trim())) {
            toast.warning("Vui lòng nhập tên cho tất cả nhiệm vụ con");
            return;
        }
    
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                token,
                subtasks: subTasks.map(st => ({
                    name: st.name.trim(),
                    description: st.description,
                    task_id: task.task.id,
                    task_assignment_id: parseInt(task.id),
                    target_value: st.target_value,
                })),
            };

    
            const result = await dispatch(createSubTask(payload) as any);
            if (result?.payload?.data?.success) {
                toast.success("Tạo nhiệm vụ con thành công!");
                onSuccess?.(true);
                onClose();
            } else {
                toast.error(result?.payload?.data?.message || "Tạo thất bại");
            }
        } catch (error) {
            console.error("Error creating subtask:", error);
            toast.error("Có lỗi xảy ra khi tạo nhiệm vụ con");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-950 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Plus size={24} className="text-blue-400" />
                        Tạo nhiệm vụ con
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Parent Task Info */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-2">Nhiệm vụ cha</p>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white mb-1">
                                    {task.task.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Dự án: {task.project.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subtask Form */}
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

                                {/* Target Value */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                                        {task.units?.name === "%" ? `Tiến độ cần đạt (${task.units?.name})` : `Giá trị cần đạt (${task.units?.name || "%"})`}
                                    </label>

                                    {task.units?.name === "%" || task.units?.name === null ? (
                                        // ✅ PHẦN % - Cố định 100%, không cho sửa
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-blue-500 rounded-lg" />
                                            <div className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-blue-400 text-sm text-center font-semibold select-none cursor-not-allowed">
                                                100
                                            </div>
                                        </div>
                                    ) : (
                                        // ✅ PHẦN ĐƠN VỊ KHÁC - Có chú thích + input bình thường
                                        <div className="space-y-2">

                                            {/* Hint box - chỉ hiện khi không phải % */}
                                            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">
                                                <svg className="text-amber-400 mt-0.5 flex-shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                                </svg>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    <span className="text-amber-400 font-semibold">Gợi ý: </span>
                                                    Nhiệm vụ cha cần đạt{" "}
                                                    <span className="text-white font-semibold">
                                                        {formatNumber(Number(task.target_value))} {task.units?.name}
                                                    </span>
                                                    . Hãy chia nhỏ theo giai đoạn — mỗi nhiệm vụ con nên đảm nhận trong khoảng{" "}
                                                    <span className="text-blue-400 font-semibold">
                                                        {formatNumber(Math.round(Number(task.target_value) / subTasks.length))} {task.units?.name}
                                                    </span>
                                                    {subTasks.length > 1 ? ` (chia đều cho ${subTasks.length} nhiệm vụ con)` : " để dễ theo dõi tiến độ"}.
                                                </p>
                                            </div>

                                            <input
                                                type="number"
                                                min="0"
                                                max={task.target_value}
                                                value={subTask.target_value}
                                                onChange={e => handleSubTaskChange(index, "target_value", parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                                                placeholder={`Nhập giá trị (tối đa ${formatNumber(Number(task.target_value))})`}
                                            />
                                            <div className="text-xs text-slate-400">
                                                Mục tiêu: {formatNumber(Number(task.target_value))} {task.units?.name}
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