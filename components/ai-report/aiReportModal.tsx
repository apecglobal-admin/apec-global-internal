"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AIReportStatus } from "./aiReportStatus";
import { AIReportResult } from "@/src/hooks/aiReportHook";


interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  error: string | null;
  isSending: boolean;
  handleFormat: () => void;
  handleSave: (result?: AIReportResult) => void;
  isRecording: boolean;
  isProcessing: boolean;
  isFormatting: boolean;
  reportResult: AIReportResult | null;
  setReportResult: (result: AIReportResult) => void;
  isSuccess?: boolean;
}


export const AIReportModal = ({
  isOpen,
  onClose,
  transcribedText,
  setTranscribedText,
  error,
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
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccess, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 pb-18 md:pb-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!isRecording && !isProcessing) onClose();
            }}
          />

            <div className="relative w-full max-w-lg">
              {!isSuccess && (
                <motion.div
                  initial={{ y: 30, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 30, scale: 0.9 }}
                  className="relative z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-6 w-full pointer-events-auto max-h-[75vh] md:max-h-[85vh] overflow-y-auto theme-scrollbar"
                >
                <div className="flex items-center justify-between mb-4">
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
                  {/* Error State */}
                  {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                    <div className="text-orange-400 space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Result State */}
                  {(!error || error === "Vui lòng nói ít nhất 3 giây.") &&
                    transcribedText &&
                    !reportResult && (
                      <div className="w-full text-left">
                        <textarea
                          value={transcribedText}
                          onChange={(e) => setTranscribedText(e.target.value)}
                          className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[200px] theme-scrollbar"
                          placeholder="Nội dung sẽ xuất hiện ở đây..."
                        />
                        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end items-center gap-2">


                          <button
                            className={cn(
                              "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                              isFormatting && "opacity-70 cursor-not-allowed"
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
                      </div>
                    )}

                  {/* Preview State */}
                  {reportResult && (
                    <div className="w-full text-left space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">
                          Phân loại
                        </label>
                        <input
                          type="text"
                          value={reportResult.category}
                          onChange={(e) =>
                            setReportResult({
                              ...reportResult,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/50 text-slate-200 text-sm p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">
                          Tóm tắt
                        </label>
                        <textarea
                          value={reportResult.summary}
                          onChange={(e) =>
                            setReportResult({
                              ...reportResult,
                              summary: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none theme-scrollbar min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">
                          Chi tiết
                        </label>
                        <textarea
                          value={reportResult.details}
                          onChange={(e) =>
                            setReportResult({
                              ...reportResult,
                              details: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[150px] theme-scrollbar"
                        />
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end items-center gap-2">
                        <button
                          className={cn(
                            "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                            isSending && "opacity-70 cursor-not-allowed"
                          )}
                          onClick={() => handleSave(reportResult)}
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

                  {!isRecording &&
                    !isProcessing &&
                    !error &&
                    !transcribedText && (
                      <p className="text-slate-500 text-sm">
                        Nhấn và giữ nút microphone để bắt đầu nói.
                      </p>
                    )}
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {isSuccess && (
               <motion.div
                initial={{ y: 30, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 30, scale: 0.9 }}
                className="relative z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-6 w-full pointer-events-auto overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white">Đã lưu thành công!</h3>

                  <a 
                    href="https://docs.google.com/spreadsheets/d/18oUTgeRvBRpofnoY-73j5lEv3PEUXGMdX81kotSxwy4/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                  >
                    <FileSpreadsheet size={16} />
                    Xem trên Google Sheets
                  </a>

                  <p className="text-slate-500 text-xs mt-4">
                    Tự động đóng sau <span className="font-mono text-slate-300">{countdown}s</span>
                  </p>
                </div>
              </motion.div>
            )}

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
