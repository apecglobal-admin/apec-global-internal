import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import apiAxiosInstance from "../services/axios";

import {
  formatReport,
  saveReport,
  sendAudioToGemini,
} from "../features/ai-report/api/api";
import type {
  AIReportAnalysisResponse,
  AIReportParentTask,
  AIReportResponse,
  GenericReportItem,
  NTLReportItem,
  TaskOperationResult,
} from "../features/ai-report/types";
import {
  createPersonalTask,
  createSubTask,
  updateProgressSubTask,
  updateProgressTask,
  updateStatusSubTask,
} from "../features/task/api";
import type { AppDispatch, RootState } from "../lib/store";

export type {
  AIReportResponse,
  GenericReportData,
  GenericReportItem,
  NTLReportItem,
} from "../features/ai-report/types";

interface AIReportUserInfo {
  name?: string;
  email?: string;
  department_id?: number;
  position_id?: number;
}

interface NamedOption {
  id: number;
  name?: string;
  title?: string;
}

type PreventablePointerEvent = Pick<React.PointerEvent, "preventDefault">;

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readRecord = (value: unknown): JsonRecord => (isRecord(value) ? value : {});

const readString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const readNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getThunkPayload = (result: unknown): JsonRecord => {
  const resultRecord = isRecord(result) ? result : {};
  return isRecord(resultRecord.payload) ? resultRecord.payload : {};
};

const getThunkDataRecords = (result: unknown): JsonRecord[] => {
  const records: JsonRecord[] = [];
  let current: unknown = getThunkPayload(result);

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      current = current[0];
      continue;
    }
    if (!isRecord(current)) break;
    records.push(current);
    current = current.data;
  }

  return records;
};

const getCreatedSubtaskId = (result: unknown): number | null => {
  // Duyệt qua các records thông thường (object lồng nhau)
  const records = getThunkDataRecords(result);
  for (let index = records.length - 1; index >= 0; index -= 1) {
    const record = records[index];
    const id = readNumber(record.subtask_id) ?? readNumber(record.id);
    if (id !== null) return id;
  }

  // Fallback: API trả về array trong payload.data.data (vd: { data: { data: [{ id: 123 }] } })
  const payload = getThunkPayload(result);
  const payloadData = isRecord(payload.data) ? payload.data : payload;
  const innerData = isRecord(payloadData) ? payloadData.data : null;
  const arr = Array.isArray(innerData) ? innerData : Array.isArray(payload.data) ? payload.data : [];
  for (const item of arr) {
    if (!isRecord(item)) continue;
    const id = readNumber(item.subtask_id) ?? readNumber(item.id);
    if (id !== null) return id;
  }

  return null;
};

interface CreatedParentTaskIds {
  taskId: number;
  taskAssignmentId: number;
}

const getCreatedParentTaskIds = (
  result: unknown,
): CreatedParentTaskIds | null => {
  const records = getThunkDataRecords(result);
  let taskId: number | null = null;
  let taskAssignmentId: number | null = null;

  for (const record of records) {
    taskId ??=
      readNumber(record.task_id) ?? readNumber(readRecord(record.task).id);
    taskAssignmentId ??=
      readNumber(record.task_assignment_id) ??
      readNumber(record.assignment_id);

    if (taskId === null && taskAssignmentId !== null) {
      taskId = readNumber(record.id);
    }

    if (taskId !== null && taskAssignmentId === null) {
      taskAssignmentId = readNumber(record.id);
    }
  }

  return taskId !== null && taskAssignmentId !== null
    ? { taskId, taskAssignmentId }
    : null;
};

const getCaughtErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const responseData = isRecord(error.response?.data) ? error.response.data : {};
    const responseError = isRecord(responseData.error) ? responseData.error : {};
    return (
      readString(responseError.message) ||
      readString(responseData.message) ||
      error.message ||
      fallback
    );
  }

  return error instanceof Error ? error.message : fallback;
};

const TELEGRAM_BOT_TOKEN = "8864694864:AAFr_Vg0dLU7tiVrm86K9v2Tuxlnjbqq8Wk";
const TELEGRAM_CHAT_ID = "7248349177";

const getDetailedErrorString = (error: unknown): string => {
  if (isAxiosError(error)) {
    const details = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      responseData: error.response?.data,
    };
    return JSON.stringify(details, null, 2);
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}\nStack Trace:\n${error.stack || "N/A"}`;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
};

const escapeHtml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const sendErrorToTelegram = async (
  error: unknown,
  context: string,
  userInfo?: AIReportUserInfo | null,
) => {
  try {
    const detailedError = getDetailedErrorString(error);
    const userDetail = userInfo
      ? `${userInfo.name || "N/A"}`
      : "N/A";
    const text = `📬 <b>User:</b> ${escapeHtml(userDetail)}\n\n<b>Context:</b> ${escapeHtml(context)}\n\n<b>Detailed Error:</b>\n<pre>${escapeHtml(detailedError)}</pre>`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (caughtTelegramError) {
    console.error("Failed to send error to Telegram:", caughtTelegramError);
  }
};

const getThunkResult = (
  result: unknown,
): { success: boolean; message: string } => {
  const resultRecord = isRecord(result) ? result : {};
  const payload = getThunkPayload(result);
  const data = isRecord(payload.data) ? payload.data : payload;
  const meta = isRecord(resultRecord.meta) ? resultRecord.meta : {};
  const status = readNumber(data.status);
  const success =
    data.success !== false &&
    (data.success === true ||
      status === 200 ||
      status === 201 ||
      status === 204 ||
      meta.requestStatus === "fulfilled");
  const message =
    readString(data.message) ||
    readString(payload.message) ||
    (success ? "Thao tác thành công." : "Backend từ chối thao tác.");

  return { success, message };
};

const parseRequiredId = (value: string | null | undefined, field: string): number => {
  const parsed = readNumber(value);
  if (parsed === null) throw new Error(`Thiếu hoặc sai ${field}.`);
  return parsed;
};

const findParentTask = (
  tasks: AIReportParentTask[],
  report: GenericReportItem,
): AIReportParentTask | undefined =>
  tasks.find(
    (task) =>
      String(task.task?.id ?? "") === String(report.parent_task_id ?? "") ||
      String(task.id) === String(report.task_assignment_id ?? ""),
  );

const ntlFields: Array<keyof NTLReportItem> = [
  "report_date",
  "area",
  "new_customers_opened",
  "customers_closed_withdrawn",
  "positions_increased",
  "positions_decreased",
  "customer_feedback_incidents",
  "notes",
  "actual_vs_contracted_staff",
  "new_staff_hired",
  "staff_resigned",
  "staff_violations",
  "staff_suggestions_feedback",
];

const parseLegacyNTLReports = (value: unknown): NTLReportItem[] | null => {
  if (!Array.isArray(value)) return null;

  const reports = value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const report = Object.fromEntries(
      ntlFields.map((field) => [field, String(item[field] ?? "")]),
    ) as unknown as NTLReportItem;
    return [report];
  });

  return reports.length > 0 ? reports : null;
};

export const useAIReport = (
  onReportGenerated?: (text: string) => void,
  onSuccess?: () => void,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [reportResult, setReportResult] = useState<AIReportResponse | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const userInfo = useSelector(
    (state: RootState) => state.user.userInfo.data,
  ) as AIReportUserInfo | null;
  const positions = useSelector(
    (state: RootState) => state.user.positions.data,
  ) as NamedOption[];
  const departments = useSelector(
    (state: RootState) => state.user.departments.data,
  ) as NamedOption[];

  const userName = userInfo?.name || "Unknown User";
  const userEmail = userInfo?.email || "";
  const userDepartment =
    departments.find((department) => department.id === userInfo?.department_id)
      ?.name || "Unknown Department";
  const userPosition =
    positions.find((position) => position.id === userInfo?.position_id)?.title ||
    "Unknown Position";

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isHoldingRef = useRef(false);
  const startTimeRef = useRef(0);

  const handleSendAudio = async (audioBlob: Blob) => {
    try {
      const data = await sendAudioToGemini(audioBlob, transcribedText);

      if (!data.text.trim() || data.text.trim() === ".") {
        setError("Không nghe rõ thông tin. Vui lòng thử lại.");
        return;
      }

      setTranscribedText((previousText) =>
        previousText ? `${previousText} ${data.text}` : data.text,
      );
      onReportGenerated?.(data.text);
    } catch (caughtError: unknown) {
      console.error("Error sending audio to Gemini:", caughtError);
      sendErrorToTelegram(
        caughtError,
        "Gửi âm thanh tới Gemini (transcribe)",
        userInfo,
      );
      setError("Có lỗi xảy ra khi xử lý giọng nói. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async (event: PreventablePointerEvent) => {
    event.preventDefault();
    isHoldingRef.current = true;

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isHoldingRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (audioEvent) => {
        if (audioEvent.data.size > 0) audioChunksRef.current.push(audioEvent.data);
      };

      mediaRecorder.onstop = async () => {
        const duration = Date.now() - startTimeRef.current;
        if (duration < 3000) {
          setError("Vui lòng nói ít nhất 3 giây.");
          setIsProcessing(false);
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await handleSendAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setShowModal(true);
    } catch (caughtError: unknown) {
      console.error("Error accessing microphone:", caughtError);
      if (isHoldingRef.current) {
        setError(
          "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.",
        );
        setShowModal(true);
      }
    }
  };

  const stopRecording = () => {
    isHoldingRef.current = false;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleFormat = async () => {
    if (!transcribedText.trim()) return;

    setIsFormatting(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Không tìm thấy phiên đăng nhập.");

      const response = await formatReport(
        transcribedText,
        userName,
        token,
      );
      const rawAnalysis: unknown = response.data;
      const legacyNTLReports = parseLegacyNTLReports(rawAnalysis);
      if (legacyNTLReports) {
        setReportResult({ report_project: "ntl", reports: legacyNTLReports });
        return;
      }

      const analysis = rawAnalysis as AIReportAnalysisResponse;

      if (
        analysis.report_project === "ntl" ||
        analysis.report_project === "other"
      ) {
        setReportResult(analysis);
        return;
      }

      throw new Error("Cấu trúc phản hồi AI không hợp lệ.");
    } catch (caughtError: unknown) {
      console.error("Error formatting AI report:", caughtError);
      sendErrorToTelegram(
        caughtError,
        `Định dạng báo cáo AI (Đầu vào: "${transcribedText}")`,
        userInfo,
      );
      setError(
        getCaughtErrorMessage(
          caughtError,
          "Xảy ra lỗi khi AI xử lý báo cáo. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsFormatting(false);
    }
  };

  const executeReport = async (
    report: GenericReportItem,
    parentTasks: AIReportParentTask[],
  ): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("Không tìm thấy phiên đăng nhập.");

    const { data } = report;
    let thunkResult: unknown;

    if (report.targetType === "personal_task") {
      if (report.action === "create") {
        if (
          !data.task_name ||
          !data.date_start ||
          !data.date_end ||
          !data.type_task ||
          !data.task_priority ||
          !data.kpi_item_id ||
          !data.projects?.length ||
          !data.companies?.length ||
          data.progress == null
        ) {
          throw new Error("Thông tin tạo Nhiệm vụ cha chưa đầy đủ.");
        }

        thunkResult = await dispatch(
          createPersonalTask({
            name: data.task_name,
            type_task: data.type_task,
            date_start: data.date_start,
            date_end: data.date_end,
            task_priority: data.task_priority,
            projects: data.projects,
            kpi_item_id: data.kpi_item_id,
            target_type: data.target_type ?? 3,
            target_value: data.target_value ?? 100,
            min_count_reject: data.min_count_reject ?? 2,
            max_count_reject: data.max_count_reject ?? 3,
            time_repeat: data.time_repeat ?? null,
            companies: data.companies,
            token,
          }),
        );

        const createResult = getThunkResult(thunkResult);
        if (createResult.success && data.progress != null) {
          const createdIds = getCreatedParentTaskIds(thunkResult);
          if (!createdIds) {
            return {
              success: true,
              message:
                "Đã tạo Nhiệm vụ cha nhưng không xác định được ID để cập nhật tiến độ.",
            };
          }

          const updateResult = await dispatch(
            updateProgressTask({
              id: createdIds.taskAssignmentId,
              task_id: createdIds.taskId,
              status: data.status ?? (data.progress === 100 ? 4 : 2),
              process: data.progress,
              value: data.progress,
              token,
            }),
          );
          const updateResponse = getThunkResult(updateResult);
          if (!updateResponse.success) {
            return {
              success: true,
              message: `Đã tạo Nhiệm vụ cha nhưng cập nhật tiến độ thất bại: ${updateResponse.message}`,
            };
          }
        }
      } else {
        const parentTask = findParentTask(parentTasks, report);
        const taskId = parseRequiredId(report.parent_task_id, "parent_task_id");
        const taskAssignmentId = parseRequiredId(
          report.task_assignment_id ?? String(parentTask?.id ?? ""),
          "task_assignment_id",
        );
        thunkResult = await dispatch(
          updateProgressTask({
            id: taskAssignmentId,
            task_id: taskId,
            status: data.status ?? 2,
            process: data.progress ?? parentTask?.process ?? 0,
            value:
              data.achieved_value ??
              data.progress ??
              parentTask?.value ??
              0,
            token,
          }),
        );
      }
    } else if (report.action === "create") {
      if (
        !data.task_name ||
        !data.date_start ||
        !data.date_end ||
        data.progress == null
      ) {
        throw new Error(
          "Thông tin tạo Nhiệm vụ con cấp 1 chưa đầy đủ.",
        );
      }
      thunkResult = await dispatch(
        createSubTask({
          token,
          subtasks: [
            {
              name: data.task_name,
              task_id: parseRequiredId(report.parent_task_id, "parent_task_id"),
              task_assignment_id: parseRequiredId(
                report.task_assignment_id,
                "task_assignment_id",
              ),
              target_value: data.target_value ?? 100,
              start_date: data.date_start,
              end_date: data.date_end,
              subtask_id: null,
            },
          ],
        }),
      );

      // Dùng meta.requestStatus thay vì parse body — đáng tin cậy hơn với Redux Toolkit
      const createMeta = isRecord((thunkResult as any)?.meta) ? (thunkResult as any).meta : {};
      const createFulfilled = createMeta.requestStatus === "fulfilled";

      if (createFulfilled && data.progress != null) {
        // Thử parse ID từ response trực tiếp
        let newSubTaskId = getCreatedSubtaskId(thunkResult);

        // Fallback: nếu không parse được, fetch subtask list và lấy ID mới nhất
        if (newSubTaskId === null) {
          try {
            const taskAssignmentId = parseRequiredId(report.task_assignment_id, "task_assignment_id");
            const res = await apiAxiosInstance.get("/tasks/sub/detail", {
              params: { task_assignment_id: taskAssignmentId },
              headers: { Authorization: `Bearer ${token}` },
            });
            const items: unknown[] = Array.isArray(res.data?.data)
              ? res.data.data
              : Array.isArray(res.data)
                ? res.data
                : [];
            // Lấy subtask ID lớn nhất (mới nhất)
            const maxId = items.reduce<number | null>((best, item) => {
              if (!isRecord(item)) return best;
              const itemId = readNumber(item.subtask_id) ?? readNumber(item.id);
              return itemId !== null && (best === null || itemId > best) ? itemId : best;
            }, null);
            newSubTaskId = maxId;
          } catch {
            // fallback thất bại — tiếp tục trả về thành công không có update tiến độ
          }
        }

        if (newSubTaskId !== null) {
          const updateResult = await dispatch(
            updateProgressSubTask({
              id: newSubTaskId,
              value: String(data.progress),
              subtask_status: data.status ?? (data.progress === 100 ? 4 : 2),
              token,
            }),
          );
          const updateRes = getThunkResult(updateResult);
          if (!updateRes.success) {
            return {
              success: true,
              message: `Đã tạo Nhiệm vụ con cấp 1 nhưng cập nhật tiến độ thất bại: ${updateRes.message}`,
            };
          }
        } else {
          return {
            success: true,
            message: "Đã tạo Nhiệm vụ con cấp 1 nhưng không xác định được ID để cập nhật tiến độ.",
          };
        }
      }
    } else {
      const parentTask = findParentTask(parentTasks, report);
      const unitName = parentTask?.units?.name ?? "%";
      const value =
        unitName === "%"
          ? data.progress
          : (data.achieved_value ?? data.progress);
      const subtaskId = parseRequiredId(report.sub_task_id, "sub_task_id");

      if (value == null && data.status == null) {
        throw new Error(
          "Vui lòng nhập tiến độ, kết quả hoặc trạng thái.",
        );
      }

      thunkResult =
        value == null
          ? await dispatch(
              updateStatusSubTask({
                ids: [subtaskId],
                status: data.status,
                token,
              }),
            )
          : await dispatch(
              updateProgressSubTask({
                id: subtaskId,
                value: String(value),
                subtask_status: data.status ?? 2,
                token,
              }),
            );
    }

    return getThunkResult(thunkResult);
  };

  const executeTaskOperations = async (
    reports: GenericReportItem[],
    parentTasks: AIReportParentTask[],
  ): Promise<TaskOperationResult[]> => {
    const results: TaskOperationResult[] = [];

    for (let reportIndex = 0; reportIndex < reports.length; reportIndex += 1) {
      const report = reports[reportIndex];
      try {
        const result = await executeReport(report, parentTasks);
        results.push({ reportIndex, ...result });
      } catch (caughtError: unknown) {
        const message =
          caughtError instanceof Error ? caughtError.message : String(caughtError);
        console.error("AI task operation failed:", {
          reportIndex,
          action: report.action,
          targetType: report.targetType,
          message,
        });
        results.push({ reportIndex, success: false, message });
      }
    }

    return results;
  };

  const handleSave = async (
    updatedResult?: AIReportResponse,
    modalParentTasks: AIReportParentTask[] = [],
  ) => {
    const dataToSave = updatedResult || reportResult;
    if (!dataToSave) return;

    setIsSending(true);
    setError(null);
    try {
      if (dataToSave.report_project === "ntl") {
        await saveReport(
          dataToSave,
          userName,
          userEmail,
          userDepartment,
          userPosition,
        );
      } else {
        const results = await executeTaskOperations(
          dataToSave.reports,
          modalParentTasks,
        );
        const failures = results.filter((result) => !result.success);
        const successCount = results.length - failures.length;

        if (successCount === 0) {
          const failureMessage = failures.map((failure) => failure.message).join("; ");
          throw new Error(failureMessage || "Không có thao tác nào thành công.");
        }

        if (failures.length > 0) {
          toast.warning(
            `Hoàn thành ${successCount} thao tác, ${failures.length} thao tác thất bại: ${failures
              .map((failure) => failure.message)
              .join("; ")}`,
          );
        }
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (caughtError: unknown) {
      console.error("Error saving AI report:", caughtError);
      sendErrorToTelegram(
        caughtError,
        `Lưu báo cáo AI (Dự án: ${reportResult?.report_project})`,
        userInfo,
      );
      setError(
        getCaughtErrorMessage(
          caughtError,
          "Lưu báo cáo thất bại. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const resetSession = () => {
    setTranscribedText("");
    setError(null);
    setReportResult(null);
    setIsSuccess(false);
    setShowModal(false);
  };

  return {
    isRecording,
    isProcessing,
    showModal,
    transcribedText,
    setTranscribedText,
    error,
    setError,
    isSending,
    startRecording,
    stopRecording,
    resetSession,
    handleFormat,
    handleSave,
    isFormatting,
    reportResult,
    setReportResult,
    isSuccess,
    setShowModal,
  };
};
