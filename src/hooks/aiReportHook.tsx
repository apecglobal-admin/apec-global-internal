import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { sendAudioToGemini, formatReport, saveReport } from "../features/ai-report/api/api";
import { useSelector } from "react-redux";

export interface AIReportResult {
  category: string;
  summary: string;
  details: string;
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
  const [reportResult, setReportResult] = useState<AIReportResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const userInfo = useSelector((state: any) => state.user.userInfo.data);
  const userName = userInfo?.name || "Unknown User";

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isHoldingRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      // Assuming response.data contains the structured data. Adjust if nested.
      const result: AIReportResult = response.data;
      setReportResult(result);
      // Do NOT close modal or reset session yet
    } catch (err: any) {
      console.error("Error formatting report:", err);
      setError("Xảy ra lỗi khi AI xử lý báo cáo. Vui lòng thử lại.");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSave = async (updatedResult?: AIReportResult) => {
    const dataToSave = updatedResult || reportResult;
    if (!dataToSave) return;

    setIsSending(true);
    try {
      await saveReport(dataToSave, userName);
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

  const handleSpeak = () => {
    if (!transcribedText) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(transcribedText);
    utterance.lang = "vi";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const resetSession = () => {
    handleStopSpeak();
    setTranscribedText("");
    setError(null);
    setReportResult(null);
    setIsSuccess(false);
    setShowModal(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    isRecording,
    isProcessing,
    showModal,
    transcribedText,
    setTranscribedText,
    error,
    isSending,
    isSpeaking,
    startRecording,
    stopRecording,
    resetSession,
    handleFormat,
    handleSave,
    handleSpeak,
    handleStopSpeak,
    isFormatting,
    reportResult,
    setReportResult,
    isSuccess,
  };
};
