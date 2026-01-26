"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, X, Loader2, Sparkles, AlertCircle, Volume2, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { cn } from "@/src/lib/utils";
import { toast } from "react-toastify";

interface AIReportButtonProps {
  onReportGenerated?: (text: string) => void;
  onSuccess?: () => void;
}

export default function AIReportButton({
  onReportGenerated,
  onSuccess,
}: AIReportButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isHoldingRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Function to start recording
  const startRecording = async (e: React.PointerEvent) => {
    e.preventDefault();
    isHoldingRef.current = true;

    try {
      setError(null);
      // Don't clear transcribedText here to allow appending
      // setTranscribedText("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check if user has already released the button while we were waiting for permissions
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
        await sendAudioToAPI(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Final check before starting
      if (!isHoldingRef.current) {
         stream.getTracks().forEach((track) => track.stop());
         return;
      }

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setShowModal(true); // Show modal immediately
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Only show error if we are still "holding" or if it was a genuine failure that matters
      if (isHoldingRef.current) {
          setError(
            "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.",
          );
          setShowModal(true); // Show modal to display error
      }
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    isHoldingRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true); // Transition to processing state
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    if (!transcribedText) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(transcribedText);
    utterance.lang = "vi";
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Stop speech when modal closes or component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const sendAudioToAPI = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      // Send current text as context so AI knows what has been said
      formData.append("context", transcribedText);

      const response = await axios.post("/api/gemini", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (typeof response.data.text === "string") {
        if (response.data.text.trim()) {
          setTranscribedText((prev) =>
            prev ? prev + " " + response.data.text : response.data.text,
          );
          if (onReportGenerated) {
            onReportGenerated(response.data.text);
          }
        } else {
          setError("Không nghe rõ thông tin. Vui lòng thử lại.");
        }
      } else {
        setError("Không nhận được phản hồi từ AI.");
      }
    } catch (err: any) {
      console.error("Error sending audio to API:", err);
      if (err.response && err.response.data) {
        console.error("Server Error Details:", err.response.data);
      }
      setError("Có lỗi xảy ra khi xử lý báo cáo. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReport = async () => {
    if (!transcribedText) return;

    setIsSending(true);
    try {
      await axios.post("/api/webhook", {
        text: transcribedText,
        timestamp: new Date().toISOString(),
      });

      // Clear session on success
      resetSession();
      toast.success("Báo cáo đã được gửi và AI đang xử lý!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Error sending to n8n:", err);
      let errorMessage = "Gửi báo cáo thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const resetSession = () => {
    handleStopSpeak(); // Stop speaking if active
    setTranscribedText("");
    setError(null);
    setShowModal(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={cn(
          "fixed bottom-20 md:bottom-8 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-colors duration-300 cursor-pointer",
          isRecording
            ? "bg-red-500 shadow-red-500/50"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/50 hover:shadow-blue-400/50",
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={startRecording}
        onPointerUp={stopRecording}
        onPointerLeave={() => {
          // Safety measure: if user drags finger off button, stop recording
          stopRecording();
        }}
        // Prevent default touch behaviors that might interfere with holding
        style={{ touchAction: "none" }}
      >
        <Mic
          className={cn("text-white w-6 h-6", isRecording && "animate-pulse")}
        />

        {/* Ripple effect when recording */}
        {isRecording && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        )}
      </motion.button>

      {/* Modal - Rendered via Portal or absolute (using fixed here for simplicity) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
          >
            {/* Backdrop with blur - blocks interaction with background */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                // Optional: Close modal on backdrop click if not recording/processing
                if (!isRecording && !isProcessing) resetSession();
              }}
            />

            <motion.div
              initial={{ y: 30, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.9 }}
              className="relative z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100">Báo cáo AI</h3>
                </div>
                <button
                  onClick={resetSession}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="min-h-[100px] flex flex-col items-center justify-center text-center">
                {/* State: Error */}
                {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                  <div className="text-orange-400 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto" />
                    <p>{error}</p>
                  </div>
                )}

                {/* State: Result - Show even when recording if text exists */}
                {(!error || error === "Vui lòng nói ít nhất 3 giây.") && transcribedText && (
                  <div className="w-full text-left">
                    <textarea
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[200px] theme-scrollbar"
                      placeholder="Nội dung sẽ xuất hiện ở đây..."
                    />
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center gap-2">
                       {/* Text-to-Speech Controls */}
                       <button
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors font-medium border cursor-pointer",
                          isSpeaking 
                            ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20" 
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        )}
                        onClick={isSpeaking ? handleStopSpeak : handleSpeak}
                        title={isSpeaking ? "Dừng đọc" : "Đọc lại"}
                      >
                         {isSpeaking ? <Square size={14} className="fill-current" /> : <Volume2 size={14} />}
                         {isSpeaking ? "Dừng" : "Nghe lại"}
                      </button>

                      <button
                        className={cn(
                          "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                          isSending && "opacity-70 cursor-not-allowed"
                        )}
                        onClick={handleSendReport}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <div className="flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Đang gửi...</span>
                          </div>
                        ) : (
                          "Gửi"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!isRecording &&
                  !isProcessing &&
                  !error &&
                  !transcribedText && (
                    <p className="text-slate-500 text-sm">
                      Nhấn và giữ nút microphone để bắt đầu nói.
                    </p>
                  )}
              </div>
            {/* Listening/Processing Indicator - Absolute positioned relative to modal */}
            <AnimatePresence mode="wait">
              {(isRecording || (isProcessing && !error) || error === "Vui lòng nói ít nhất 3 giây.") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-100 px-5 py-3 rounded-full shadow-xl flex items-center gap-3 pointer-events-none whitespace-nowrap"
                >
                  {error === "Vui lòng nói ít nhất 3 giây." ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-100">
                        {error}
                      </span>
                    </>
                  ) : isRecording ? (
                    <>
                      {/* Wave animation */}
                      <div className="flex justify-center gap-1 h-4 items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-blue-500 rounded-full"
                            animate={{ height: [4, 16, 4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-blue-100">
                        Đang nghe...
                      </span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="text-sm font-medium text-blue-100">
                        Đang xử lý...
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
