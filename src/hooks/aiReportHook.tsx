import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  sendAudioToGemini,
  formatReport,
  saveReport,
} from "../features/ai-report/api/api";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProgressTask,
  updateProgressSubTask,
  createSubTask,
} from "../features/task/api";

export interface NTLReportItem {
  report_date: string;
  area: string;
  new_customers_opened: string;
  customers_closed_withdrawn: string;
  positions_increased: string;
  positions_decreased: string;
  customer_feedback_incidents: string;
  notes: string;
  actual_vs_contracted_staff: string;
  new_staff_hired: string;
  staff_resigned: string;
  staff_violations: string;
  staff_suggestions_feedback: string;
}

export interface GenericReportData {
  task_name?: string;
  progress?: number;
  status: number;
  achieved_value?: number;
}

export interface GenericReportItem {
  action: "insert" | "update";
  targetType: "parent" | "subtask";
  parent_task_id: string | null;
  sub_task_id?: string | null;
  data: GenericReportData;
}

export type AIReportResponse =
  | { report_project: "ntl"; reports: NTLReportItem[] }
  | { report_project: "other"; reports: GenericReportItem[] };

export const useAIReport = (
  onReportGenerated?: (text: string) => void,
  onSuccess?: () => void,
) => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false); // Used for saving
  const [isFormatting, setIsFormatting] = useState(false); // Used for formatting
  const [reportResult, setReportResult] = useState<AIReportResponse | null>(
    null,
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const userInfo = useSelector((state: any) => state.user.userInfo.data);
  const positions = useSelector((state: any) => state.user.positions.data);
  const departments = useSelector((state: any) => state.user.departments.data);
  const tasksData = useSelector((state: any) => state.user.tasks?.data);
  const parentTasks: any[] = tasksData?.data || [];

  const userName = userInfo?.name || "Unknown User";
  const userEmail = userInfo?.email || "";
  const userDepartment =
    departments?.find((d: any) => d.id === userInfo?.department_id)?.name ||
    "Unknown Department";
  const userPosition =
    positions?.find((p: any) => p.id === userInfo?.position_id)?.title ||
    "Unknown Position";

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isHoldingRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const startRecording = async (e: React.PointerEvent) => {
    e.preventDefault();
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

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
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

      if (!isHoldingRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setShowModal(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
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
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    try {
      const data = await sendAudioToGemini(audioBlob, transcribedText);

      if (typeof data.text === "string") {
        if (data.text.trim()) {
          setTranscribedText((prev) =>
            prev ? prev + " " + data.text : data.text,
          );
          if (onReportGenerated) {
            onReportGenerated(data.text);
          }
        } else {
          setError("Không nghe rõ thông tin. Vui lòng thử lại.");
        }
      } else {
        setError("Không nhận được phản hồi từ AI.");
      }
    } catch (err: any) {
      console.error("Error sending audio to API:", err);
      setError("Có lỗi xảy ra khi xử lý báo cáo. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormat = async () => {
    if (!transcribedText) return;

    setIsFormatting(true);
    try {
      const response = await formatReport(transcribedText, userName);
      if (
        response.data &&
        (response.data.report_project === "ntl" ||
          response.data.report_project === "other")
      ) {
        setReportResult(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        if (Array.isArray(response.data)) {
          setReportResult({
            report_project: "ntl",
            reports: response.data,
          } as any);
        } else {
          setReportResult(null);
          setError("Cấu trúc dữ liệu không hợp lệ.");
        }
      }
    } catch (err: any) {
      console.error("Error formatting report:", err);
      setError("Xảy ra lỗi khi AI xử lý báo cáo. Vui lòng thử lại.");
    } finally {
      setIsFormatting(false);
    }
  };

  // Execute actual task operations for "other" reports
  const executeTaskOperations = async (
    reports: GenericReportItem[],
  ): Promise<{ successes: number; failures: number }> => {
    const token = localStorage.getItem("userToken");
    let successes = 0;
    let failures = 0;

    for (const report of reports) {
      if (!report.parent_task_id) {
        console.warn("Skipping report with null parent_task_id:", report);
        failures++;
        continue;
      }

      // Find the parent task - parent_task_id from dropdown is task_assignment_id (t.id)
      const parentTask = parentTasks.find(
        (t: any) => t?.id?.toString() === report.parent_task_id,
      );

      if (!parentTask) {
        console.warn(
          `Parent task not found for id: ${report.parent_task_id}`,
          report,
        );
        failures++;
        continue;
      }

      const taskId = parentTask?.task?.id; // actual task ID
      const taskAssignmentId = parentTask?.id; // task assignment ID
      const statusId = report.data.status ?? 2;

      try {
        if (report.action === "update" && report.targetType === "parent") {
          // Update parent task progress
          const payload = {
            id: parseInt(taskAssignmentId),
            task_id: parseInt(taskId),
            status: statusId,
            value: report.data.achieved_value ?? 0,
            token,
          };
          console.log("Updating parent task:", payload);
          const result = await dispatch(updateProgressTask(payload) as any);
          if (result?.payload?.data?.success) {
            successes++;
          } else {
            console.error("Update parent task failed:", result?.payload);
            failures++;
          }
        } else if (
          report.action === "update" &&
          report.targetType === "subtask"
        ) {
          // Update subtask progress
          if (!report.sub_task_id) {
            console.warn(
              "Skipping subtask update with null sub_task_id:",
              report,
            );
            failures++;
            continue;
          }
          const payload = {
            id: parseInt(report.sub_task_id),
            task_assignment_id: parseInt(taskAssignmentId),
            process: (report.data.progress ?? 0).toString(),
            status: statusId,
            token,
          };
          console.log("Updating subtask:", payload);
          const result = await dispatch(updateProgressSubTask(payload) as any);
          if (result?.payload?.data?.success) {
            successes++;
          } else {
            console.error("Update subtask failed:", result?.payload);
            failures++;
          }
        } else if (
          report.action === "insert" &&
          report.targetType === "subtask"
        ) {
          // Create new subtask
          const payload = {
            token,
            subtasks: [
              {
                name: report.data.task_name || "Nhiệm vụ con mới",
                description: "",
                task_id: parseInt(taskId),
                task_assignment_id: parseInt(taskAssignmentId),
                target_value: report.data.progress ?? 0,
              },
            ],
          };
          console.log("Creating subtask:", payload);
          const result = await dispatch(createSubTask(payload) as any);
          if (result?.payload?.data?.success) {
            successes++;
          } else {
            console.error("Create subtask failed:", result?.payload);
            failures++;
          }
        }
      } catch (err: any) {
        console.error("Task operation error:", err);
        failures++;
      }
    }

    return { successes, failures };
  };

  const handleSave = async (updatedResult?: AIReportResponse) => {
    const dataToSave = updatedResult || reportResult;
    if (!dataToSave) return;

    setIsSending(true);
    try {
      if (dataToSave.report_project === "other") {
        // For "other" reports: execute actual task operations, no webhook
        const { successes, failures } = await executeTaskOperations(
          dataToSave.reports as GenericReportItem[],
        );

        if (failures > 0 && successes === 0) {
          setError("Tất cả thao tác task đều thất bại. Vui lòng thử lại.");
          return;
        }

        if (failures > 0) {
          toast.warning(
            `Hoàn thành ${successes} thao tác, ${failures} thao tác thất bại.`,
          );
        }

        setIsSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // For NTL reports: send to webhook as before
        await saveReport(
          dataToSave,
          userName,
          userEmail,
          userDepartment,
          userPosition,
        );
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error("Error saving report:", err);
      setError("Lưu báo cáo thất bại. Vui lòng thử lại.");
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
