import React, { useState } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { updateProgressSubTask } from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface SubTask {
  id: string;
  name: string;
  description?: string;
  process: number;
  status: {
    id: number;
    name: string;
  };
}

interface StatusTask {
  id: string;
  name: string;
}

interface UpdateSubTaskProps {
  subtasks: SubTask[];
  taskAssignmentId: string;
  statusTask?: StatusTask[];
  onClose: () => void;
  onSuccess: () => void;
}

function UpdateSubTask({
  subtasks,
  taskAssignmentId,
  statusTask,
  onClose,
  onSuccess,
}: UpdateSubTaskProps) {
  const dispatch = useDispatch();
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubTaskSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subtaskId = e.target.value;
    setSelectedSubTaskId(subtaskId);

    // Auto-fill current values when selecting a subtask
    const selectedSubTask = subtasks.find((st) => st.id === subtaskId);
    if (selectedSubTask) {
      setProgressValue(selectedSubTask.process);
      setSelectedStatus(selectedSubTask.status.id);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setProgressValue(value);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = parseInt(e.target.value);
    setSelectedStatus(newStatus);

    // Auto set progress to 100% when status is 4 (Hoàn thành)
    if (newStatus === 4) {
      setProgressValue(100);
    }
  };

  const handleSave = async () => {
    if (!selectedSubTaskId) {
      toast.warning("Vui lòng chọn nhiệm vụ con để cập nhật");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: parseInt(selectedSubTaskId),
        process: progressValue.toString(),
        task_assignment_id: parseInt(taskAssignmentId),
        status: selectedStatus,
      };

      const result = await dispatch(updateProgressSubTask(payload) as any);

      if (result?.payload?.data?.success && !result?.error) {
        toast.success("Cập nhật nhiệm vụ con thành công!");
        onSuccess();
        onClose();
      } else {
        toast.error(result?.payload?.data?.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-5 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit3 size={20} className="text-blue-400" />
            Cập nhật nhiệm vụ con
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* SubTask Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Chọn nhiệm vụ con
            </label>
            <select
              value={selectedSubTaskId}
              onChange={handleSubTaskSelect}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">-- Chọn nhiệm vụ con --</option>
              {subtasks.map((subtask) => (
                <option key={subtask.id} value={subtask.id}>
                  {subtask.name} ({subtask.process}%)
                </option>
              ))}
            </select>
          </div>

          {/* Show details only when a subtask is selected */}
          {selectedSubTaskId && (
            <>
              {/* Current SubTask Info */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">
                  Nhiệm vụ đã chọn
                </div>
                <div className="text-sm font-semibold text-white">
                  {subtasks.find((st) => st.id === selectedSubTaskId)?.name}
                </div>
                {subtasks.find((st) => st.id === selectedSubTaskId)
                  ?.description && (
                  <div className="text-xs text-slate-400 mt-1">
                    {
                      subtasks.find((st) => st.id === selectedSubTaskId)
                        ?.description
                    }
                  </div>
                )}
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Trạng thái
                </label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                >
                  {statusTask &&
                    statusTask.map((status) => (
                      <option key={status.id} value={parseInt(status.id)}>
                        {status.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Progress Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tiến độ (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={handleProgressChange}
                    disabled={selectedStatus === 4}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={handleProgressChange}
                    disabled={selectedStatus === 4}
                    className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {selectedStatus === 4 && (
                  <p className="text-xs text-slate-500 mt-2">
                    Tiến độ tự động đặt thành 100% khi hoàn thành
                  </p>
                )}
              </div>

              {/* Progress Bar Preview */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Xem trước tiến độ
                  </span>
                  <span className="text-xs font-bold text-blue-400">
                    {progressValue}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-5 py-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedSubTaskId}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            <Save size={16} />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateSubTask;