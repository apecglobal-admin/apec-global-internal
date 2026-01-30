"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AIReportStatus } from "./aiReportStatus";
import { AIReportResult } from "@/src/hooks/aiReportHook";
import { toast } from "react-toastify";


interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  error: string | null;
  isSending: boolean;
  handleFormat: () => void;
  handleSave: (result?: AIReportResult[]) => void;
  isRecording: boolean;
  isProcessing: boolean;
  isFormatting: boolean;
  reportResult: AIReportResult[] | null;
  setReportResult: (result: AIReportResult[]) => void;
  isSuccess?: boolean;
}

// Helper Components
const ReportInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text" 
}: { 
  label: string; 
  value: string | number; 
  onChange: (val: any) => void; 
  type?: string;
}) => (
  <div className="space-y-1 m-0">
    <label className="text-xs font-semibold text-slate-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      className="w-full bg-slate-800/50 text-slate-200 text-sm px-2.5 py-1.5 rounded-lg border border-slate-500/50 focus:border-blue-500/50 outline-none mt-1"
    />
  </div>
);

const ReportTextarea = ({ 
  label, 
  value, 
  onChange,
  minHeight = "60px"
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  minHeight?: string; 
}) => (
  <div className="space-y-1 m-0">
    <label className="text-xs font-semibold text-slate-300">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-1.5 mt-1 rounded-lg border border-slate-500/50 focus:border-blue-500/50 outline-none resize-none theme-scrollbar min-h-[${minHeight}]`}
      style={{ minHeight }}
    />
  </div>
);


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
  useEffect(() => {
    if (isSuccess) {
      toast.success("Đã lưu báo cáo thành công!");
      onClose();
    }
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

                  {/* Result State - Allow manual input even if transcribedText is empty (as long as we are not showing a report result) */}
                  {!reportResult && (
                      <div className="w-full text-left">
                        <textarea
                          value={transcribedText}
                          onChange={(e) => setTranscribedText(e.target.value)}
                          className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[200px] theme-scrollbar"
                          placeholder="Nhập nội dung báo cáo hoặc nhấn giữ mic để nói..."
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
                  {reportResult && reportResult.length > 0 && (
                    <div className="w-full text-left space-y-8">

                      {reportResult.map((report, index) => {
                        const updateField = (field: keyof AIReportResult, value: any) => {
                          const newReports = [...reportResult];
                          (newReports[index] as any)[field] = value;
                          setReportResult(newReports);
                        };

                        return (
                        <div key={index} className="bg-slate-800/30 p-4 rounded-xl border border-white/50 space-y-6">
                          <div className="border-b border-slate-300/50 pb-3">
                            <h4 className="text-blue-100 font-bold text-lg bg-blue-900/40 py-2 rounded-lg text-center border border-indigo-500/30">
                               Báo cáo {report.area ? `- ${report.area}` : `#${index + 1}`}
                            </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
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
                          <div className="space-y-4">
                            <h5 className="text-blue-400 font-bold text-sm uppercase tracking-wider border-l-4 border-blue-500 pl-3">
                              Tình hình khách hàng
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReportInput 
                                  label="Khách hàng mới (ra quân)" 
                                  value={report.new_customers_opened} 

                                  onChange={(v) => updateField("new_customers_opened", v)} 
                                />
                                <ReportInput 
                                  label="Khách hàng thanh lý (rút quân)" 
                                  value={report.customers_closed_withdrawn} 

                                  onChange={(v) => updateField("customers_closed_withdrawn", v)} 
                                />
                                <ReportInput 
                                  label="Tăng vị trí" 
                                  value={report.positions_increased} 

                                  onChange={(v) => updateField("positions_increased", v)} 
                                />
                                <ReportInput 
                                  label="Giảm vị trí" 
                                  value={report.positions_decreased} 

                                  onChange={(v) => updateField("positions_decreased", v)} 
                                />
                            </div>
                             <ReportTextarea 
                               label="Ý kiến / Phản ánh của khách hàng / Sự cố" 
                               value={report.customer_feedback_incidents} 
                               onChange={(v) => updateField("customer_feedback_incidents", v)} 
                             />
                             <ReportTextarea 
                               label="Ghi chú" 
                               value={report.notes} 
                               onChange={(v) => updateField("notes", v)} 
                               minHeight="60px"
                             />
                          </div>

                          {/* SECTION 2: TÌNH HÌNH NHÂN SỰ */}
                          <div className="space-y-4 pt-4 border-t border-slate-300/50">
                            <h5 className="text-amber-400 font-bold text-sm uppercase tracking-wider border-l-4 border-amber-500 pl-3">
                              Tình hình nhân sự
                            </h5> 
                            <ReportInput 
                              label="Quân số (Thực tế/Hợp đồng)" 
                              value={report.actual_vs_contracted_staff} 
                              onChange={(v) => updateField("actual_vs_contracted_staff", v)} 
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <ReportInput 
                                  label="Tuyển mới" 
                                  value={report.new_staff_hired} 

                                  onChange={(v) => updateField("new_staff_hired", v)} 
                                />
                                <ReportInput 
                                  label="Nghỉ việc" 
                                  value={report.staff_resigned} 

                                  onChange={(v) => updateField("staff_resigned", v)} 
                                />
                             </div>

                             <ReportTextarea 
                               label="Nhân sự vi phạm" 
                               value={report.staff_violations} 
                               onChange={(v) => updateField("staff_violations", v)} 
                             />
                              
                             <ReportTextarea 
                               label="Ý kiến / Đề xuất của nhân sự" 
                               value={report.staff_suggestions_feedback} 
                               onChange={(v) => updateField("staff_suggestions_feedback", v)} 
                             />
                          </div>

                        </div>
                      );})}

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
