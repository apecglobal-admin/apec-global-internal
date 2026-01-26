"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

interface AIReportStatusProps {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export const AIReportStatus = ({
  isRecording,
  isProcessing,
  error,
}: AIReportStatusProps) => {
  const showStatus =
    isRecording ||
    (isProcessing && !error) ||
    error === "Vui lòng nói ít nhất 3 giây.";

  return (
    <AnimatePresence mode="wait">
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-100 px-5 py-3 rounded-full shadow-xl flex items-center gap-3 pointer-events-none whitespace-nowrap"
        >
          {error === "Vui lòng nói ít nhất 3 giây." ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-100">{error}</span>
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
  );
};
