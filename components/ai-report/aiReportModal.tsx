"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  AlertCircle,
  Trash2,
  ListTodo,
  Clock3,
  Plus,
  TrendingUp,
  FileEdit,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AIReportStatus } from "./aiReportStatus";
import type {
  AIReportResponse,
  NTLReportItem,
  GenericReportData,
  GenericReportItem,
  AIReportParentTask,
  AIReportReviewOptions,
  AIReportSelectOption,
} from "@/src/features/ai-report/types";
import {
  loadAIReportProjectOptions,
  loadAIReportReviewOptions,
} from "@/src/features/ai-report/api/api";
import apiAxiosInstance from "@/src/services/axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ReportInstructionButton } from "./reportInstructions";
import { removeReportAtIndex } from "./aiReportResultUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NTLReportResult = Extract<AIReportResponse, { report_project: "ntl" }>;
type OtherReportResult = Extract<AIReportResponse, { report_project: "other" }>;

const EMPTY_REVIEW_OPTIONS: AIReportReviewOptions = {
  taskTypes: [],
  priorities: [],
  companies: [],
  projects: [],
  kpiItems: [],
};

const toReportSelectOptions = (options: AIReportSelectOption[]) =>
  options.map((option) => ({
    value: String(option.id),
    label: option.name,
  }));

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  error: string | null;
  clearError: () => void;
  isSending: boolean;
  handleFormat: () => void;
  handleSave: (
    result?: AIReportResponse,
    modalParentTasks?: AIReportParentTask[],
  ) => void;
  isRecording: boolean;
  isProcessing: boolean;
  isFormatting: boolean;
  reportResult: AIReportResponse | null;
  setReportResult: (result: AIReportResponse | null) => void;
  isSuccess?: boolean;
}

// Helper Components
const getLabelClass = (theme?: "green" | "amber" | "blue" | "default") => {
  if (theme === "green") return "text-xs font-bold text-emerald-400";
  if (theme === "amber") return "text-xs font-bold text-amber-400";
  return "text-xs font-bold text-slate-200";
};

const getFocusClass = (theme?: "green" | "amber" | "blue" | "default") => {
  if (theme === "green") return "focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50";
  if (theme === "amber") return "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50";
  return "focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50";
};

const ReportInput = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  theme,
}: {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
  type?: string;
  disabled?: boolean;
  theme?: "green" | "amber" | "blue" | "default";
}) => (
  <div className="m-0 flex flex-col gap-1">
    <label className={cn(getLabelClass(theme))}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;
        onChange(
          type === "number" && nextValue !== ""
            ? Number(nextValue)
            : nextValue,
        );
      }}
      disabled={disabled}
      className={cn(
        "w-full bg-slate-800/50 text-slate-200 text-sm px-2.5 py-1 rounded-lg border border-slate-600/50 outline-none transition-all",
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-900/50"
          : getFocusClass(theme),
      )}
    />
  </div>
);

const ReportSliderInput = ({
  label,
  value,
  onChange,
  theme,
}: {
  label: string;
  value: number | null;
  onChange: (val: number | null) => void;
  theme?: "green" | "amber" | "blue" | "default";
}) => (
  <div className="m-0 flex flex-col gap-1">
    <label className={cn(getLabelClass(theme))}>{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0}
        max={100}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "flex-1 h-1.5 cursor-pointer accent-blue-500",
          theme === "green" && "accent-emerald-500",
          theme === "amber" && "accent-amber-500"
        )}
      />
      <input
        type="number"
        min={0}
        max={100}
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(
            nextValue === ""
              ? null
              : Math.min(100, Math.max(0, Number(nextValue))),
          );
        }}
        className={cn(
          "w-16 bg-slate-800/50 text-slate-200 text-sm px-2 py-1 rounded-lg border border-slate-600/50 outline-none text-center transition-all",
          getFocusClass(theme),
        )}
      />
    </div>
  </div>
);

const ReportTextarea = ({
  label,
  value,
  onChange,
  minHeight = "60px",
  disabled = false,
  theme,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
  disabled?: boolean;
  theme?: "green" | "amber" | "blue" | "default";
}) => (
  <div className="m-0 flex flex-col gap-1">
    <label className={cn(getLabelClass(theme))}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        `w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-1.5 rounded-lg border border-slate-600/50 outline-none resize-none custom-scrollbar transition-all`,
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-900/50"
          : getFocusClass(theme),
      )}
      style={{ minHeight }}
    />
  </div>
);

const DeleteReportButton = ({
  reportIndex,
  disabled,
  onDelete,
}: {
  reportIndex: number;
  disabled: boolean;
  onDelete: (reportIndex: number) => void;
}) => (
  <button
    type="button"
    aria-label={`Xóa báo cáo #${reportIndex + 1}`}
    onClick={() => onDelete(reportIndex)}
    disabled={disabled}
    className={cn(
      "inline-flex shrink-0 items-center justify-center p-0 bg-transparent border-none text-red-400 transition-colors duration-150",
      disabled
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer hover:text-red-300 active:scale-95",
    )}
  >
    <Trash2 size={16} />
  </button>
);

const ReportSelect = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Chọn...",
  alertWhenEmpty = false,
  theme,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  alertWhenEmpty?: boolean;
  theme?: "green" | "amber" | "blue" | "default";
}) => {
  let statusClasses = "";
  if (label === "Trạng thái") {
    if (value === "2") statusClasses = "border-blue-500/40 text-blue-300 focus:border-blue-500 focus:ring-blue-500/30";
    else if (value === "3") statusClasses = "border-amber-500/40 text-amber-300 focus:border-amber-500 focus:ring-amber-500/30";
    else if (value === "4") statusClasses = "border-emerald-500/40 text-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/30";
    else if (value === "5") statusClasses = "border-red-500/40 text-red-300 focus:border-red-500 focus:ring-red-500/30";
  }

  return (
    <div className="m-0 flex flex-col gap-1">
      <label className={cn(getLabelClass(theme))}>{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full bg-slate-800/50 text-sm px-2.5 py-1 rounded-lg border outline-none transition-all",
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-900/50 border-slate-600/50 text-slate-200"
            : alertWhenEmpty && !value
              ? "border-red-500/70 text-red-400 focus:border-red-500/80"
              : cn("border-slate-600/50 text-slate-200", getFocusClass(theme), statusClasses),
        )}
      >
        <option value="" disabled hidden className="text-slate-400">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-200 bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ReportMultiSelect = ({
  label,
  values,
  onChange,
  options,
  disabled = false,
  alertWhenEmpty = false,
  theme,
}: {
  label: string;
  values: number[];
  onChange: (values: number[]) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  alertWhenEmpty?: boolean;
  theme?: "green" | "amber" | "blue" | "default";
}) => (
  <div className="m-0 flex flex-col gap-1">
    <label className={cn(getLabelClass(theme))}>{label}</label>
    <select
      multiple
      value={values.map(String)}
      onChange={(event) =>
        onChange(
          Array.from(event.currentTarget.selectedOptions, (option) =>
            Number(option.value),
          ),
        )
      }
      disabled={disabled}
      size={Math.min(4, Math.max(2, options.length))}
      className={cn(
        "w-full rounded-lg border bg-slate-800/50 px-2.5 py-1 text-sm outline-none transition-all",
        disabled
          ? "cursor-not-allowed border-slate-600/50 text-slate-400 opacity-50"
          : alertWhenEmpty && values.length === 0
            ? "border-red-500/70 text-red-300 focus:border-red-500/80"
            : cn("border-slate-600/50 text-slate-200", getFocusClass(theme)),
      )}
    >
      {options.length === 0 ? (
        <option disabled>Không có lựa chọn</option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-slate-800 text-slate-200">
          {option.label}
        </option>
      ))}
    </select>
    <span className="text-[11px] text-slate-400 mt-0.5">
      Có thể chọn nhiều giá trị.
    </span>
  </div>
);

const getTaskProgress = (task: AIReportParentTask): number => {
  const rawProgress = Number(task.process ?? 0);
  return Number.isFinite(rawProgress)
    ? Math.min(100, Math.max(0, Math.round(rawProgress)))
    : 0;
};

const formatTaskDeadline = (date: string | undefined): string => {
  if (!date) return "Chưa có hạn";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return format(parsedDate, "dd/MM/yyyy");
};

const TaskContextPanel = ({
  tasks,
  isLoading,
  error,
  onSelectTask,
}: {
  tasks: AIReportParentTask[];
  isLoading: boolean;
  error: string | null;
  onSelectTask: (text: string) => void;
}) => {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string | number, boolean>>({});
  const [subtasksMap, setSubtasksMap] = useState<Record<string | number, { data: any[]; isLoading: boolean; error: string | null }>>({});

  const visibleTasks = useMemo(() => {
    return [...tasks]
      .sort((firstTask, secondTask) => {
        if (firstTask.is_overdue !== secondTask.is_overdue) {
          return firstTask.is_overdue ? -1 : 1;
        }
        return String(firstTask.task?.date_end ?? "").localeCompare(
          String(secondTask.task?.date_end ?? "")
        );
      });
  }, [tasks]);

  const handleToggleExpand = async (task: AIReportParentTask) => {
    const taskId = task.id;
    const isCurrentlyExpanded = !!expandedTaskIds[taskId];
    setExpandedTaskIds(prev => ({
      ...prev,
      [taskId]: !isCurrentlyExpanded
    }));

    if (!isCurrentlyExpanded && !subtasksMap[taskId]) {
      setSubtasksMap(prev => ({
        ...prev,
        [taskId]: { data: [], isLoading: true, error: null }
      }));
      try {
        const token = localStorage.getItem("userToken");
        const response = await apiAxiosInstance.get("/tasks/sub/detail", {
          params: { task_assignment_id: taskId, subtask_status: 2 },
          headers: { Authorization: `Bearer ${token}` }
        });
        const subtasks = (response.data?.data ?? []).filter((sub: any) => {
          return sub.status?.id === 2;
        });
        setSubtasksMap(prev => ({
          ...prev,
          [taskId]: { data: subtasks, isLoading: false, error: null }
        }));
      } catch (err: any) {
        setSubtasksMap(prev => ({
          ...prev,
          [taskId]: { data: [], isLoading: false, error: "Không tải được việc con" }
        }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 py-1 text-xs text-slate-400">
        <Loader2 className="animate-spin w-3.5 h-3.5" />
        <span>Đang tải công việc...</span>
      </div>
    );
  }

  if (error || tasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-1.5 mb-3 text-left">
      <div className="flex items-center text-[11px] text-slate-400 font-bold">
        <ListTodo className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
        Chèn nhanh mẫu báo cáo (Click nút bên phải):
      </div>
      <div className="max-h-[150px] overflow-y-auto pr-1.5 custom-scrollbar flex flex-col gap-1">
        {visibleTasks.map((task) => {
          const taskName = task.task?.name || "Nhiệm vụ chưa đặt tên";
          const progress = getTaskProgress(task);
          const isOverdue = task.is_overdue;
          const isExpanded = !!expandedTaskIds[task.id];
          const subtaskState = subtasksMap[task.id];

          return (
            <div
              key={String(task.id)}
              className="flex flex-col bg-slate-800/10 rounded-md px-2 py-1 border border-slate-700/20 hover:border-slate-600/30 transition-all"
            >
              {/* Parent Task Header Row */}
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleExpand(task)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-left flex-1 min-w-0"
                  title="Click để xem danh sách việc con"
                >
                  <ChevronRight className={cn(
                    "w-3 h-3 transition-transform duration-200 shrink-0 text-slate-400 hover:text-white",
                    isExpanded && "rotate-90"
                  )} />
                  {isOverdue && (
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  )}
                  <span className="truncate text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                    {taskName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-normal shrink-0">
                    ({formatTaskDeadline(task.task?.date_end)})
                  </span>
                  <span className={cn(
                    "text-[9px] px-1 py-0.2 rounded font-bold ml-1 shrink-0",
                    isOverdue ? "bg-red-950/60 text-red-300" : "bg-blue-950/60 text-blue-300"
                  )}>
                    {progress}%
                  </span>
                </button>

                {/* Parent Task Actions */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectTask(
                        `Trong "${taskName}", đã làm: `,
                      )
                    }
                    className="p-0.5 rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                    title="Thêm việc con mới"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTask(`Cập nhật "${taskName}" lên 99%`)}
                    className="p-0.5 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 active:scale-95 transition-all cursor-pointer"
                    title="Cập nhật tiến độ nhiệm vụ cha"
                  >
                    <TrendingUp size={12} />
                  </button>
                </div>
              </div>

              {/* Subtasks Section */}
              {isExpanded && (
                <div className="pl-3 pr-0.5 py-1 border-l border-slate-700/50 flex flex-col gap-1 bg-slate-900/10 rounded-r mt-0.5">
                  {subtaskState?.isLoading && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Loader2 className="animate-spin w-2.5 h-2.5" />
                      <span>Đang tải việc con...</span>
                    </div>
                  )}
                  {subtaskState?.error && (
                    <span className="text-xs text-red-400">{subtaskState.error}</span>
                  )}
                  {!subtaskState?.isLoading && !subtaskState?.error && (subtaskState?.data?.length ?? 0) === 0 && (
                    <span className="text-xs text-slate-500 italic">Chưa có việc con</span>
                  )}
                  {!subtaskState?.isLoading && !subtaskState?.error && subtaskState?.data?.map((subtask: any) => {
                    const subtaskName = subtask.name;
                    const subtaskProgress = Math.round(Number(subtask.process ?? 0));
                    const isSubtaskCompleted = subtaskProgress === 100;

                    return (
                      <div
                        key={String(subtask.id)}
                        className="flex items-center justify-between gap-1.5 text-xs py-0.5 pl-1 pr-1 bg-slate-800/10 rounded border border-slate-700/10 hover:border-slate-600/20 transition-all"
                      >
                        <span className="truncate text-slate-300 font-medium flex-1" title={subtaskName}>
                          {subtaskName}
                          <span className={cn(
                            "ml-1 text-[11px] px-0.5 py-0.2 rounded",
                            isSubtaskCompleted ? "bg-green-950/60 text-green-300" : "bg-slate-950/60 text-amber-400"
                          )}>
                            {subtaskProgress}%
                          </span>
                        </span>

                        {/* Subtask Action Buttons */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectTask(
                                `Trong "${taskName}", hoàn thành việc con "${subtaskName}"`,
                              )
                            }
                            className="p-0.5 rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                            title="Báo cáo hoàn thành việc con này"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onSelectTask(
                                `Trong "${taskName}", cập nhật việc con "${subtaskName}" lên 99%`,
                              )
                            }
                            className="p-0.5 rounded text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 active:scale-95 transition-all cursor-pointer"
                            title="Cập nhật tiến độ việc con này"
                          >
                            <FileEdit size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AIReportModal = ({
  isOpen,
  onClose,
  transcribedText,
  setTranscribedText,
  error,
  clearError,
  isSending,
  handleFormat,
  handleSave,
  isRecording,
  isProcessing,
  isFormatting,
  reportResult,
  setReportResult,
  isSuccess = false,
}: AIReportModalProps) => {
  const [parentTasks, setParentTasks] = useState<AIReportParentTask[]>([]);
  const [subtaskNames, setSubtaskNames] = useState<Record<string, string>>({});
  const [isLoadingParentTasks, setIsLoadingParentTasks] = useState(false);
  const [reviewOptions, setReviewOptions] = useState<AIReportReviewOptions>(
    EMPTY_REVIEW_OPTIONS,
  );
  const [isLoadingReviewOptions, setIsLoadingReviewOptions] = useState(false);
  const [isLoadingProjectOptions, setIsLoadingProjectOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const projectOptionsRequestIdRef = useRef(0);
  const [taskContextError, setTaskContextError] = useState<string | null>(null);
  const [reviewOptionsError, setReviewOptionsError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đã lưu báo cáo thành công!");
      onClose();
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (!isOpen) {
      projectOptionsRequestIdRef.current += 1;
      setSubtaskNames({});
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      setIsLoadingParentTasks(false);
      setIsLoadingReviewOptions(false);
      setParentTasks([]);
      setReviewOptions(EMPTY_REVIEW_OPTIONS);
      setTaskContextError("Không tìm thấy phiên đăng nhập.");
      setReviewOptionsError("Không tìm thấy phiên đăng nhập.");
      return;
    }

    let isCancelled = false;
    setIsLoadingParentTasks(true);
    setIsLoadingReviewOptions(true);
    setIsLoadingProjectOptions(false);
    setTaskContextError(null);
    setReviewOptionsError(null);

    const loadModalData = async (): Promise<void> => {
      const [parentTasksResult, reviewOptionsResult] =
        await Promise.allSettled([
          apiAxiosInstance.get<{ data?: AIReportParentTask[] }>(
            "/profile/tasks",
            {
              params: { page: 1, limit: 1000, statusFilter: 2 },
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          loadAIReportReviewOptions(token),
        ]);

      if (isCancelled) return;

      if (parentTasksResult.status === "fulfilled") {
        setParentTasks(parentTasksResult.value.data?.data ?? []);
      } else {
        console.error(
          "Failed to fetch AI Report task context:",
          parentTasksResult.reason,
        );
        setParentTasks([]);
        setTaskContextError("Không tải được ngữ cảnh công việc.");
      }

      if (reviewOptionsResult.status === "fulfilled") {
        setReviewOptions(reviewOptionsResult.value);
      } else {
        console.error(
          "Failed to fetch AI Report review options:",
          reviewOptionsResult.reason,
        );
        setReviewOptions(EMPTY_REVIEW_OPTIONS);
        setReviewOptionsError("Không tải được danh sách lựa chọn.");
      }

      setIsLoadingParentTasks(false);
      setIsLoadingReviewOptions(false);
    };

    void loadModalData();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !reportResult || reportResult.report_project !== "other") return;
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const subtaskReports = reportResult.reports.filter(
      (r) => r.targetType === "subtask" && r.sub_task_id && !subtaskNames[String(r.sub_task_id)]
    );

    if (subtaskReports.length === 0) return;

    const parentAssignmentIds = Array.from(
      new Set(subtaskReports.map((r) => r.task_assignment_id).filter(Boolean))
    );

    parentAssignmentIds.forEach(async (assignmentId) => {
      try {
        const response = await apiAxiosInstance.get("/tasks/sub/detail", {
          params: { task_assignment_id: assignmentId, subtask_status: 2 },
          headers: { Authorization: `Bearer ${token}` }
        });
        const subtasks = response.data?.data ?? [];
        const newNames: Record<string, string> = {};
        subtasks.forEach((sub: any) => {
          if (sub.id) {
            newNames[String(sub.id)] = sub.name;
          }
        });
        setSubtaskNames((prev) => ({ ...prev, ...newNames }));
      } catch (err) {
        console.error("Failed to load subtask names:", err);
      }
    });
  }, [isOpen, reportResult, subtaskNames]);

  const handleSelectTaskContext = (taskName: string) => {
    const trimmed = transcribedText.trim();
    const newText = trimmed ? `${trimmed}\n${taskName}` : taskName;
    setTranscribedText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  const handleModalSave = () => {
    if (!reportResult) return;

    if (reportResult.report_project === "other") {
      for (let i = 0; i < reportResult.reports.length; i++) {
        const report = reportResult.reports[i];
        if (report.action === "create") {
          if (!report.data.task_name?.trim()) {
            toast.warning(
              `Vui lòng nhập tên công việc cho thao tác #${i + 1}.`,
            );
            return;
          }

          if (!report.data.date_start || !report.data.date_end) {
            toast.warning(
              `Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc cho thao tác #${i + 1}.`,
            );
            return;
          }

          if (report.data.date_end < report.data.date_start) {
            toast.warning(
              `Ngày kết thúc phải từ ngày bắt đầu trở đi ở thao tác #${i + 1}.`,
            );
            return;
          }

          if (report.data.progress == null) {
            toast.warning(
              `Vui lòng nhập tiến độ cho thao tác #${i + 1}.`,
            );
            return;
          }

          if (
            report.targetType === "subtask" &&
            (!report.parent_task_id || !report.task_assignment_id)
          ) {
            toast.warning(
              `Vui lòng chọn Nhiệm vụ cha cho thao tác #${i + 1}.`,
            );
            return;
          }

          if (
            report.targetType === "personal_task" &&
            (!report.data.type_task ||
              !report.data.task_priority ||
              !report.data.kpi_item_id ||
              !report.data.projects?.length ||
              !report.data.companies?.length)
          ) {
            toast.warning(
              `Vui lòng chọn đầy đủ loại công việc, độ ưu tiên, công ty, dự án và KPI cho thao tác #${i + 1}.`,
            );
            return;
          }
        } else if (
          report.data.progress == null &&
          report.data.achieved_value == null &&
          report.data.status == null
        ) {
          toast.warning(
            `Vui lòng nhập tiến độ, kết quả hoặc trạng thái cho thao tác #${i + 1}.`,
          );
          return;
        }
      }
    }

    handleSave(reportResult, parentTasks);
  };

  const handleDeleteReport = (
    currentReportResult: AIReportResponse,
    reportIndex: number,
  ) => {
    setReportResult(removeReportAtIndex(currentReportResult, reportIndex));
    clearError();
  };

  const renderOtherReport = (
    currentReportResult: OtherReportResult,
    report: GenericReportItem,
    index: number,
  ) => {
    const updateDataField = <Field extends keyof GenericReportData>(
      field: Field,
      value: GenericReportData[Field],
    ) => {
      if (!reportResult || reportResult.report_project !== "other") return;
      const newReports = [...reportResult.reports];
      const newData: GenericReportData = {
        ...newReports[index].data,
        [field]: value,
      };

      if (field === "progress") {
        if (Number(value) === 100) {
          newData.status = 4;
        } else if (value == null) {
          newData.status = null;
        } else if (Number(value) < 100) {
          newData.status = 2;
        }
      }

      newReports[index] = {
        ...newReports[index],
        data: newData,
      };
      setReportResult({ ...reportResult, reports: newReports });
    };

    const updateParentTask = (value: string) => {
      if (!reportResult || reportResult.report_project !== "other") return;
      const selectedParent = parentTasks.find(
        (task) => String(task.task?.id ?? task.id) === value,
      );
      const newReports = [...reportResult.reports];
      newReports[index] = {
        ...newReports[index],
        parent_task_id: value,
        task_assignment_id: selectedParent ? String(selectedParent.id) : null,
      };
      setReportResult({ ...reportResult, reports: newReports });
    };

    const updateCompanies = (values: number[]): void => {
      if (!reportResult || reportResult.report_project !== "other") return;

      const newReports = [...reportResult.reports];
      newReports[index] = {
        ...newReports[index],
        data: {
          ...newReports[index].data,
          companies: values,
          projects: null,
        },
      };
      setReportResult({ ...reportResult, reports: newReports });

      const token = localStorage.getItem("userToken");
      if (!token) {
        setReviewOptionsError("Không tìm thấy phiên đăng nhập.");
        return;
      }

      setIsLoadingProjectOptions(true);
      setReviewOptionsError(null);
      const requestId = projectOptionsRequestIdRef.current + 1;
      projectOptionsRequestIdRef.current = requestId;
      void loadAIReportProjectOptions(token, values)
        .then((projects) => {
          if (requestId !== projectOptionsRequestIdRef.current) return;
          setReviewOptions((currentOptions) => ({
            ...currentOptions,
            projects,
          }));
        })
        .catch((caughtError: unknown) => {
          if (requestId !== projectOptionsRequestIdRef.current) return;
          console.error(
            "Failed to fetch AI Report project options:",
            caughtError,
          );
          setReviewOptions((currentOptions) => ({
            ...currentOptions,
            projects: [],
          }));
          setReviewOptionsError("Không tải được danh sách dự án.");
        })
        .finally(() => {
          if (requestId !== projectOptionsRequestIdRef.current) return;
          setIsLoadingProjectOptions(false);
        });
    };

    const selectedParent = parentTasks.find(
      (task) =>
        String(task.task?.id ?? "") === String(report.parent_task_id ?? "") ||
        String(task.id) === String(report.task_assignment_id ?? ""),
    );
    const isCreate = report.action === "create";
    const isProgressUpdate = report.action === "update_progress";
    const isSubtask = report.targetType === "subtask";
    const isPersonalTaskCreate = isCreate && !isSubtask;
    const actionLabels: Record<GenericReportItem["action"], string> = {
      create: "Thêm mới",
      update_progress: "Cập nhật tiến độ",
    };
    const targetLabel = isSubtask
      ? "Nhiệm vụ con cấp 1"
      : "Nhiệm vụ cha";
    return (
      <div
        key={index}
        className="flex flex-col gap-2.5 rounded-xl border border-white/40 bg-slate-800/30 p-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {report.action === "create" ? (
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                  Thêm mới
                </span>
              ) : (
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap bg-amber-500/15 text-amber-400 border-amber-500/30">
                  Cập nhật tiến độ
                </span>
              )}
              {isSubtask ? (
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap bg-cyan-500/15 text-cyan-400 border-cyan-500/30">
                  Nhiệm vụ con cấp 1
                </span>
              ) : (
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap bg-indigo-500/15 text-indigo-300 border-indigo-400/40">
                  Nhiệm vụ cha
                </span>
              )}
            </div>
          </div>
          <DeleteReportButton
            reportIndex={index}
            disabled={isSending}
            onDelete={(reportIndex) =>
              handleDeleteReport(currentReportResult, reportIndex)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {isSubtask ? (
              <>
                <div className="md:col-span-2">
                  <ReportSelect
                    label="Nhiệm vụ cha"
                    value={String(
                      selectedParent?.task?.id ?? report.parent_task_id ?? "",
                    )}
                    onChange={updateParentTask}
                    options={parentTasks.map((task) => ({
                      value: String(task.task?.id ?? task.id),
                      label: task.task?.name || "Nhiệm vụ không xác định",
                    }))}
                    placeholder="Chọn nhiệm vụ cha..."
                    disabled={!isCreate}
                    alertWhenEmpty
                  />
                </div>
                {isCreate ? (
                  <div className="md:col-span-2 flex gap-2 items-start pl-3 border-l border-indigo-500/40 mt-1">
                    <div className="text-indigo-400 font-bold text-xs pt-5">└─</div>
                    <div className="flex-1">
                      <ReportInput
                        label="Tên nhiệm vụ con cấp 1"
                        value={report.data.task_name ?? ""}
                        onChange={(value) => updateDataField("task_name", String(value))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 flex gap-2 items-start pl-3 border-l border-indigo-500/40 mt-1">
                    <div className="text-indigo-400 font-bold text-xs pt-5">└─</div>
                    <div className="flex-1">
                      <ReportInput
                        label="Tên nhiệm vụ con cấp 1"
                        value={subtaskNames[String(report.sub_task_id)] ?? "Đang tải tên nhiệm vụ con..."}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              isCreate ? (
                <div className="md:col-span-2">
                  <ReportInput
                    label="Tên nhiệm vụ cha"
                    value={report.data.task_name ?? ""}
                    onChange={(value) => updateDataField("task_name", String(value))}
                  />
                </div>
              ) : null
            )}

            {isPersonalTaskCreate ? (
              <ReportSelect
                label="Loại công việc"
                value={String(report.data.type_task ?? "")}
                onChange={(value) => updateDataField("type_task", Number(value))}
                options={toReportSelectOptions(reviewOptions.taskTypes)}
                placeholder={
                  isLoadingReviewOptions ? "Đang tải..." : "Chọn loại công việc..."
                }
                disabled={isLoadingReviewOptions || reviewOptions.taskTypes.length === 0}
                alertWhenEmpty
              />
            ) : null}

            {isPersonalTaskCreate ? (
              <ReportSelect
                label="Độ ưu tiên"
                value={String(report.data.task_priority ?? "")}
                onChange={(value) =>
                  updateDataField("task_priority", Number(value))
                }
                options={toReportSelectOptions(reviewOptions.priorities)}
                placeholder={
                  isLoadingReviewOptions ? "Đang tải..." : "Chọn độ ưu tiên..."
                }
                disabled={isLoadingReviewOptions || reviewOptions.priorities.length === 0}
                alertWhenEmpty
              />
            ) : null}

            {isPersonalTaskCreate ? (
              <ReportMultiSelect
                label="Công ty"
                values={report.data.companies ?? []}
                onChange={updateCompanies}
                options={toReportSelectOptions(reviewOptions.companies)}
                disabled={isLoadingReviewOptions || reviewOptions.companies.length === 0}
                alertWhenEmpty
              />
            ) : null}

            {isPersonalTaskCreate ? (
              <ReportMultiSelect
                label="Dự án"
                values={report.data.projects ?? []}
                onChange={(values) => updateDataField("projects", values)}
                options={toReportSelectOptions(reviewOptions.projects)}
                disabled={
                  isLoadingReviewOptions ||
                  isLoadingProjectOptions ||
                  reviewOptions.projects.length === 0
                }
                alertWhenEmpty
              />
            ) : null}

            {isPersonalTaskCreate ? (
              <ReportSelect
                label="KPI"
                value={String(report.data.kpi_item_id ?? "")}
                onChange={(value) =>
                  updateDataField("kpi_item_id", Number(value))
                }
                options={toReportSelectOptions(reviewOptions.kpiItems)}
                placeholder={isLoadingReviewOptions ? "Đang tải..." : "Chọn KPI..."}
                disabled={isLoadingReviewOptions || reviewOptions.kpiItems.length === 0}
                alertWhenEmpty
              />
            ) : null}

            {isPersonalTaskCreate && reviewOptionsError ? (
              <div className="md:col-span-2 flex items-center gap-2 text-sm text-orange-300">
                <AlertCircle className="size-4 shrink-0" />
                <span>{reviewOptionsError}</span>
              </div>
            ) : null}

            {isCreate ? (
              <>
                <ReportInput
                  label="Ngày bắt đầu"
                  value={report.data.date_start || ""}
                  onChange={(value) => updateDataField("date_start", String(value))}
                  type="date"
                />
                <ReportInput
                  label="Ngày kết thúc"
                  value={report.data.date_end || ""}
                  onChange={(value) => updateDataField("date_end", String(value))}
                  type="date"
                />
              </>
            ) : null}

            {isCreate || isProgressUpdate ? (
              <ReportSliderInput
                label="Tiến độ (%)"
                value={report.data.progress ?? null}
                onChange={(value) => updateDataField("progress", value)}
              />
            ) : null}

            {isProgressUpdate && report.data.achieved_value != null ? (
              <ReportInput
                label="Kết quả vừa đạt được"
                value={report.data.achieved_value}
                onChange={(value) =>
                  updateDataField("achieved_value", Number(value))
                }
                type="number"
              />
            ) : null}


        </div>
      </div>
    );
  };

  // NTL Render Helper
  const renderNTLReport = (
    currentReportResult: NTLReportResult,
    report: NTLReportItem,
    index: number,
  ) => {
    const updateField = (
      field: keyof NTLReportItem,
      value: string | number,
    ) => {
      if (!reportResult || reportResult.report_project !== "ntl") return;
      const newReports = [...reportResult.reports];
      newReports[index] = { ...newReports[index], [field]: String(value) };
      setReportResult({ ...reportResult, reports: newReports });
    };

    return (
      <div
        key={index}
        className="flex flex-col gap-3.5 rounded-xl border border-white/50 bg-slate-800/30 p-3"
      >
        <div className="border-b border-slate-300/50 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="flex-1 text-blue-100 font-bold text-lg bg-blue-900/40 py-2 rounded-lg text-center border border-indigo-500/30">
              Báo cáo {report.area ? `- ${report.area}` : `#${index + 1}`}
            </h4>
            <DeleteReportButton
              reportIndex={index}
              disabled={isSending}
              onDelete={(reportIndex) =>
                handleDeleteReport(currentReportResult, reportIndex)
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <ReportInput
              label="Ngày báo cáo"
              value={report.report_date}
              onChange={(v) => updateField("report_date", v)}
            />
            <ReportInput
              label="Khu vực"
              value={report.area}
              onChange={(v) => updateField("area", v)}
            />
          </div>
        </div>

        {/* SECTION 1: TÌNH HÌNH KHÁCH HÀNG */}
        <div className="flex flex-col gap-2.5">
          <h5 className="text-green-500 font-bold text-sm uppercase tracking-wider border-l-4 border-green-500 pl-3">
            Tình hình khách hàng
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ReportInput
              label="Khách hàng mới (ra quân)"
              value={report.new_customers_opened}
              onChange={(v) => updateField("new_customers_opened", v)}
              theme="green"
            />
            <ReportInput
              label="Khách hàng thanh lý (rút quân)"
              value={report.customers_closed_withdrawn}
              onChange={(v) => updateField("customers_closed_withdrawn", v)}
              theme="green"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ReportInput
              label="Tăng vị trí"
              value={report.positions_increased}
              onChange={(v) => updateField("positions_increased", v)}
              theme="green"
            />
            <ReportInput
              label="Giảm vị trí"
              value={report.positions_decreased}
              onChange={(v) => updateField("positions_decreased", v)}
              theme="green"
            />
          </div>
          <ReportTextarea
            label="Ý kiến / Phản ánh của khách hàng / Sự cố"
            value={report.customer_feedback_incidents}
            onChange={(v) => updateField("customer_feedback_incidents", v)}
            theme="green"
          />
          <ReportTextarea
            label="Ghi chú"
            value={report.notes}
            onChange={(v) => updateField("notes", v)}
            minHeight="60px"
            theme="green"
          />
        </div>

        {/* SECTION 2: TÌNH HÌNH NHÂN SỰ */}
        <div className="flex flex-col gap-2.5 border-t border-slate-300/50 pt-3">
          <h5 className="text-amber-400 font-bold text-sm uppercase tracking-wider border-l-4 border-amber-500 pl-3">
            Tình hình nhân sự
          </h5>
          <ReportInput
            label="Quân số (Thực tế/Hợp đồng)"
            value={report.actual_vs_contracted_staff}
            onChange={(v) => updateField("actual_vs_contracted_staff", v)}
            theme="amber"
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ReportInput
              label="Tuyển mới"
              value={report.new_staff_hired}
              onChange={(v) => updateField("new_staff_hired", v)}
              theme="amber"
            />
            <ReportInput
              label="Nghỉ việc"
              value={report.staff_resigned}
              onChange={(v) => updateField("staff_resigned", v)}
              theme="amber"
            />
          </div>
          <ReportTextarea
            label="Nhân sự vi phạm"
            value={report.staff_violations}
            onChange={(v) => updateField("staff_violations", v)}
            theme="amber"
          />

          <ReportTextarea
            label="Ý kiến / Đề xuất của nhân sự"
            value={report.staff_suggestions_feedback}
            onChange={(v) => updateField("staff_suggestions_feedback", v)}
            theme="amber"
          />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 pb-18 md:pb-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!isRecording && !isProcessing) onClose();
            }}
          />

          <div className="relative w-full max-w-lg">
            <motion.div
              initial={{ y: 30, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.9 }}
              className="relative z-[102] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 w-full pointer-events-auto max-h-[75vh] md:max-h-[85vh] overflow-y-auto custom-scrollbar"
              onClick={() => {
                if (error) clearError();
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100">Báo cáo AI</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="min-h-[100px] flex flex-col items-center justify-center text-center">
                {/* Input State: Show only if NO result yet */}
                {!reportResult && (
                  <div className="w-full text-left">
                    <TaskContextPanel
                      tasks={parentTasks}
                      isLoading={isLoadingParentTasks}
                      error={taskContextError}
                      onSelectTask={handleSelectTaskContext}
                    />
                    <div className="relative w-full">
                      <textarea
                        ref={textareaRef}
                        value={transcribedText}
                        onChange={(e) => setTranscribedText(e.target.value)}
                        className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 pr-8 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[120px] custom-scrollbar"
                        placeholder="Nhập nội dung báo cáo hoặc nhấn giữ mic để nói..."
                      />
                      {transcribedText && (
                        <button
                          type="button"
                          onClick={() => {
                            setTranscribedText("");
                            textareaRef.current?.focus();
                          }}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                          title="Xóa toàn bộ nội dung"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <ReportInstructionButton />
                      <button
                        className={cn(
                          "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                          isFormatting && "opacity-70 cursor-not-allowed",
                        )}
                        onClick={handleFormat}
                        disabled={isFormatting}
                      >
                        {isFormatting ? (
                          <div className="flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Đang xử lý...</span>
                          </div>
                        ) : (
                          "Gửi"
                        )}
                      </button>
                    </div>
                    {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                      <div className="flex items-center gap-2 text-orange-400 mt-2 text-sm">
                        <AlertCircle className="size-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Preview State */}
                {reportResult && (
                  <div className="flex w-full flex-col gap-4 text-left">
                    {reportResult.report_project === "ntl" && (
                      <div className="flex flex-col gap-3">
                        {reportResult.reports.map((report, idx) =>
                          renderNTLReport(reportResult, report, idx),
                        )}
                      </div>
                    )}

                    {reportResult.report_project === "other" && (
                      <div className="flex flex-col gap-3">
                        {reportResult.reports.map((report, idx) =>
                          renderOtherReport(reportResult, report, idx),
                        )}
                      </div>
                    )}

                    {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <AlertCircle className="size-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="mt-2 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <ReportInstructionButton />
                      <button
                        className={cn(
                          "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                          isSending && "opacity-70 cursor-not-allowed",
                        )}
                        onClick={handleModalSave}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <div className="flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Đang lưu...</span>
                          </div>
                        ) : (
                          "Lưu lại"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Status Indicator */}
            <AIReportStatus
              isRecording={isRecording}
              isProcessing={isProcessing}
              error={error}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
