"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAIReport } from "@/src/hooks/aiReportHook";
import { AIReportModal } from "./aiReportModal";

interface AIReportButtonProps {
  onReportGenerated?: (text: string) => void;
  onSuccess?: () => void;
}

export default function AIReportButton({
  onReportGenerated,
  onSuccess,
}: AIReportButtonProps) {
  const {
    isRecording,
    showModal,
    setShowModal,
    transcribedText,
    setTranscribedText,
    error,
    isSending,
    handleFormat,
    handleSave,
    isFormatting,
    reportResult,
    setReportResult,
    isSuccess,
    startRecording,
    stopRecording,
    resetSession,
    // We don't use isProcessing here directly but the modal needs it
    isProcessing,
  } = useAIReport(onReportGenerated, onSuccess);

  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = React.useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default browser actions (scrolling, text selection, context menu)
    e.preventDefault();
    
    isLongPressRef.current = false;
    
    // Start a timer to detect long press
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      // Start recording
      // We pass a dummy object because the hook expects an event to call preventDefault
      // but we already did that here.
      startRecording({ preventDefault: () => {} } as any);
    }, 200); // 200ms threshold for "Hold"
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isLongPressRef.current) {
        // If it was a long press (timer fired), we definitely attempted to start recording.
        // We must call stopRecording() to signal the hook that the user released the button.
        // This handles both cases:
        // 1. Recording already active -> Stops it.
        // 2. Recording still initializing (race condition) -> Sets internal ref to false so initialization aborts.
        stopRecording();
    } else {
        // Short press (timer didn't fire) -> Open Modal for manual entry
        setShowModal(true);
    }
    
    // Reset state
    isLongPressRef.current = false;
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
      // If cursor/finger leaves the button while holding
      if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
      }
      if (isRecording) {
          stopRecording();
      }
      isLongPressRef.current = false;
  };


  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={cn(
          "fixed bottom-20 md:bottom-8 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-colors duration-300 cursor-pointer",
          isRecording
            ? "bg-red-500 shadow-red-500/50"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/50 hover:shadow-blue-400/50"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        // Prevent default touch behaviors that might interfere with holding
        style={{ touchAction: "none" }}
        title="Nhấn để nhập văn bản, nhấn giữ để nói"
      >
        <Mic
          className={cn("text-white w-6 h-6", isRecording && "animate-pulse")}
        />

        {/* Ripple effect when recording */}
        {isRecording && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        )}
      </motion.button>

      {/* Modal */}
      <AIReportModal
        isOpen={showModal}
        onClose={resetSession}
        transcribedText={transcribedText}
        setTranscribedText={setTranscribedText}
        error={error}
        isSending={isSending}
        handleFormat={handleFormat}
        handleSave={handleSave}
        isRecording={isRecording}
        isProcessing={isProcessing}
        isFormatting={isFormatting}
        reportResult={reportResult}
        setReportResult={setReportResult}
        isSuccess={isSuccess}
      />

    </>
  );
}
