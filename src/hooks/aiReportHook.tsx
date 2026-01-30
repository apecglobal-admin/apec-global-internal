import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { sendAudioToGemini, formatReport, saveReport } from "../features/ai-report/api/api";
import { useSelector } from "react-redux";

export interface AIReportResult {
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

export const useAIReport = (
  onReportGenerated?: (text: string) => void,
  onSuccess?: () => void
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false); // Used for saving
  const [isFormatting, setIsFormatting] = useState(false); // Used for formatting
  const [reportResult, setReportResult] = useState<AIReportResult[] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const userInfo = useSelector((state: any) => state.user.userInfo.data);
  const positions = useSelector((state: any) => state.user.positions.data);
  const departments = useSelector((state: any) => state.user.departments.data);

  const userName = userInfo?.name || "Unknown User";
  const userEmail = userInfo?.email || "";
  const userDepartment = departments?.find((d: any) => d.id === userInfo?.department_id)?.name || "Unknown Department";
  const userPosition = positions?.find((p: any) => p.id === userInfo?.position_id)?.title || "Unknown Position";

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
          "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập."
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
            prev ? prev + " " + data.text : data.text
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
      // Assuming response.data contains the structured data array.
      let result: AIReportResult[] = [];
      if (Array.isArray(response.data)) {
        result = response.data;
      } else if (typeof response.data === 'object') {
         // Fallback incase it returns a single object
         result = [response.data];
      }
      setReportResult(result);
      // Do NOT close modal or reset session yet
    } catch (err: any) {
      console.error("Error formatting report:", err);
      setError("Xảy ra lỗi khi AI xử lý báo cáo. Vui lòng thử lại.");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSave = async (updatedResult?: AIReportResult[]) => {
    const dataToSave = updatedResult || reportResult;
    if (!dataToSave) return;

    setIsSending(true);
    try {
      await saveReport(dataToSave, userName, userEmail, userDepartment, userPosition);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
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
