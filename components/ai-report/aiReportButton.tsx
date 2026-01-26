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
    isProcessing,
    showModal,
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
  } = useAIReport(onReportGenerated, onSuccess);


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
