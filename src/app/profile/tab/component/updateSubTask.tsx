import React, { useState } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { updateProgressSubTask, updateStatusSubTask, updateSubTask } from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Unit } from "@/src/services/interface";

interface SubTask {
  id: string;
  name: string;
  description?: string;
  process: number;
  target_value?: number;
  units?: Unit;
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
  unit: Unit;
  subtasks: SubTask[];
  taskAssignmentId: string;
  statusTask?: StatusTask[];
  onClose: () => void;
  onSuccess: () => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

function UpdateSubTask({
  unit,
  subtasks,
  taskAssignmentId,
  statusTask,
  onClose,
  onSuccess,
}: UpdateSubTaskProps) {

  const dispatch = useDispatch();
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);
  const [actualValue, setActualValue] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // New state for name & description editing
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);

  const selectedSubTask = subtasks.find((st) => st.id === selectedSubTaskId);
  const isPercentUnit =
    unit?.name === "%" || unit?.name === null || unit?.name === undefined;

  const handleSubTaskSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subtaskId = e.target.value;
    setSelectedSubTaskId(subtaskId);
    setIsEditingInfo(false);

    const found = subtasks.find((st) => st.id === subtaskId);
    if (found) {
      setProgressValue(found.process);
      setActualValue(0);
      setEditName(found.name);
      setEditDescription(found.description ?? "");
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setProgressValue(value);
    }
  };

  const handleActualValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setActualValue(value);
      if (selectedSubTask?.target_value) {
        const percent = Math.min(
          Math.round((value / selectedSubTask.target_value) * 100),
          100
        );
        setProgressValue(percent);
      }
    }
  };


  const handleSave = async () => {
    if (!selectedSubTaskId) {
      toast.warning("Vui lòng chọn nhiệm vụ con để cập nhật");
      return;
    }

    const trimmedName = editName.trim();
    if (isEditingInfo && !trimmedName) {
      toast.warning("Tên nhiệm vụ con không được để trống");
      return;
    }
    const token = localStorage.getItem("userToken");
    const nameChanged = isEditingInfo && trimmedName !== selectedSubTask?.name;
    const descChanged = isEditingInfo && editDescription.trim() !== (selectedSubTask?.description ?? "");
    const progressChanged = progressValue !== selectedSubTask?.process;
    const actualValueChanged = !isPercentUnit && actualValue !== 0;

    const shouldUpdateProgress = progressChanged || actualValueChanged;
    const shouldUpdateInfo = nameChanged || descChanged;

    if (!shouldUpdateProgress && !shouldUpdateInfo) {
      toast.info("Không có thông tin nào thay đổi.");
      return;
    }

    setIsSaving(true);

    let progressSuccess = false;
    let infoSuccess = false;

    if (shouldUpdateProgress) {
      try {
        const progressPayload = {
          id: parseInt(selectedSubTaskId),
          value: isPercentUnit
            ? progressValue.toString()
            : actualValue.toString(),
          token
        };
        const progressResult = await dispatch(
          updateProgressSubTask(progressPayload) as any
        );

        if (progressResult?.payload?.data?.success && !progressResult?.error) {
          progressSuccess = true;
        } else {
          toast.error(
            progressResult?.payload?.data?.message ||
              "Cập nhật tiến độ thất bại"
          );
        }
      } catch (error: any) {
        toast.error("Có lỗi xảy ra khi cập nhật tiến độ.");
      }
    }

    if (shouldUpdateInfo) {
      try {
        const infoPayload = {
          id: parseInt(selectedSubTaskId),
          name: trimmedName,
          description: editDescription.trim(),
          token
        };
        const infoResult = await dispatch(updateSubTask(infoPayload) as any);

        if (infoResult?.payload?.data?.success && !infoResult?.error) {
          infoSuccess = true;
        } else {
          toast.error(
            infoResult?.payload?.data?.message ||
              "Cập nhật tên/mô tả thất bại"
          );
        }
      } catch (error: any) {
        toast.error("Có lỗi xảy ra khi cập nhật tên/mô tả.");
      }
    }


    const progressResult = !shouldUpdateProgress || progressSuccess;
    const infoResult = !shouldUpdateInfo || infoSuccess;
    const anySuccess =
      (shouldUpdateProgress && progressSuccess) ||
      (shouldUpdateInfo && infoSuccess);

    if (anySuccess) {
      onSuccess();
    }

    if (progressResult && infoResult) {
      toast.success("Cập nhật nhiệm vụ con thành công!");
      onClose();
    } else if (anySuccess) {
      toast.warning("Một số thông tin chưa được cập nhật. Vui lòng thử lại.");
    }

    setIsSaving(false);
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
              {/* Current SubTask Info with inline edit toggle */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-500">Nhiệm vụ đã chọn</div>
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo((prev) => !prev)}
                    className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Edit3 size={12} />
                    {isEditingInfo ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                  </button>
                </div>

                {isEditingInfo ? (
                  <div className="space-y-3">
                    {/* Edit Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Tên nhiệm vụ con <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={255}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                        placeholder="Nhập tên nhiệm vụ con"
                      />
                    </div>

                    {/* Edit Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                        placeholder="Nhập mô tả (tùy chọn)"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-white">
                      {selectedSubTask?.name}
                    </div>
                    {selectedSubTask?.description && (
                      <div className="text-xs text-slate-400 mt-1">
                        {selectedSubTask.description}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Progress Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {isPercentUnit
                    ? `Tiến độ (%)`
                    : `Giá trị đạt được (${unit?.name})`}
                </label>
                {isPercentUnit ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressValue}
                      onChange={handleProgressChange}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progressValue}
                      onChange={handleProgressChange}
                      className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={selectedSubTask?.target_value}
                        value={actualValue}
                        onChange={handleActualValueChange}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                        placeholder={`Nhập giá trị (tối đa ${formatNumber(Number(selectedSubTask?.target_value))})`}
                      />
                    </div>
                    <div className="text-xs text-slate-400">
                      Mục tiêu: {formatNumber(Number(selectedSubTask?.target_value))}{" "}
                      {unit?.name}
                    </div>
                  </div>
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