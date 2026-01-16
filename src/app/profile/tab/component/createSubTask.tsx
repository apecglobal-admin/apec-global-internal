import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { toast } from "react-toastify";

import {     
    createSubTask
} from "@/src/features/task/api";
import { useDispatch } from "react-redux";

interface StatusTask {
    id: string;
    name: string;
}

interface Task {
    id: string;
    task: {
        id: number;
        name: string;
    };
    project: {
        id: number;
        name: string;
    };
    status: {
        id: number;
        name: string;
    };
}

interface CreateSubTaskProps {
    task: Task;
    statusTask?: StatusTask[];
    onClose: () => void;
    onSuccess?: () => void;
}

function CreateSubTask({ task, statusTask, onClose, onSuccess }: CreateSubTaskProps) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        process: 0,
        subtask_status: statusTask?.[0]?.id || "2",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "process" ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.warning("Vui lòng nhập tên nhiệm vụ con");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name.trim(),
                task_id: task.task.id,
                task_assignment_id: parseInt(task.id),
                subtask_status: parseInt(formData.subtask_status),
                process: formData.process,
            };

            // TODO: Dispatch action to create subtask
            console.log("Creating subtask:", payload);

            const result = await dispatch(createSubTask(payload) as any);
            if (result?.payload.data.success) {
                toast.success("Tạo nhiệm vụ con thành công!");
                onSuccess?.();
                onClose();
            } else {
                toast.error(result?.payload?.data?.message || "Tạo thất bại")
            }
            
        } catch (error) {
            console.error("Error creating subtask:", error);
            toast.error("Có lỗi xảy ra khi tạo nhiệm vụ con");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            process: 0,
            subtask_status: statusTask?.[0]?.id || "2",
        });
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
                        {/* Task Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                                Tên nhiệm vụ con <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="VD: Phân tích API"
                                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                                Trạng thái
                            </label>
                            <select
                                name="subtask_status"
                                value={formData.subtask_status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                            >
                                {statusTask && statusTask.length > 0 ? (
                                    statusTask.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="2">Đang thực hiện</option>
                                )}
                            </select>
                        </div>

                        {/* Progress */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-2">
                                Tiến độ (%)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    name="process"
                                    min="0"
                                    max="100"
                                    value={formData.process}
                                    onChange={handleInputChange}
                                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <input
                                    type="number"
                                    name="process"
                                    min="0"
                                    max="100"
                                    value={formData.process}
                                    onChange={handleInputChange}
                                    className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            
                            {/* Progress Preview */}
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-slate-500">Xem trước</span>
                                    <span className="text-xs font-bold text-blue-400">
                                        {formData.process}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                                        style={{ width: `${formData.process}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
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
                        disabled={!formData.name.trim() || isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                    >
                        <Save size={18} />
                        {isSubmitting ? "Đang tạo..." : "Tạo nhiệm vụ con"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateSubTask;