"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AIReportStatus } from "./aiReportStatus";
import {
  AIReportResponse,
  NTLReportItem,
  GenericReportItem,
} from "@/src/hooks/aiReportHook";
import apiAxiosInstance from "@/src/services/axios";
import { toast } from "react-toastify";
import { ReportInstructionButton } from "./reportInstructions";

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  error: string | null;
  clearError: () => void;
  isSending: boolean;
  handleFormat: () => void;
  handleSave: (result?: AIReportResponse, modalParentTasks?: any[]) => void;
  isRecording: boolean;
  isProcessing: boolean;
  isFormatting: boolean;
  reportResult: AIReportResponse | null;
  setReportResult: (result: AIReportResponse) => void;
  isSuccess?: boolean;
}

// Helper Components
const ReportInput = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string | number;
  onChange: (val: any) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <div className="space-y-1 m-0">
    <label className="text-xs font-semibold text-blue-200">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      disabled={disabled}
      className={cn(
        "w-full bg-slate-800/50 text-slate-200 text-sm px-2.5 py-1.5 rounded-lg border border-slate-500/50 outline-none mt-1",
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-900/50"
          : "focus:border-blue-500/50",
      )}
    />
  </div>
);

const ReportTextarea = ({
  label,
  value,
  onChange,
  minHeight = "60px",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
  disabled?: boolean;
}) => (
  <div className="space-y-1 m-0">
    <label className="text-xs font-semibold text-blue-200">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        `w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-1.5 mt-1 rounded-lg border border-slate-500/50 outline-none resize-none theme-scrollbar min-h-[${minHeight}]`,
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-900/50"
          : "focus:border-blue-500/50",
      )}
      style={{ minHeight }}
    />
  </div>
);

const ReportSelect = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Chọn...",
  alertWhenEmpty = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  alertWhenEmpty?: boolean;
}) => (
  <div className="space-y-1 m-0">
    <label className="text-xs font-semibold text-blue-200">{label}</label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "w-full bg-slate-800/50 text-sm px-2.5 py-1.5 rounded-lg border outline-none mt-1",
        disabled
          ? "opacity-50 cursor-not-allowed bg-slate-900/50 border-slate-500/50 text-slate-200"
          : alertWhenEmpty && !value
            ? "border-red-500/70 text-red-400 focus:border-red-500/80"
            : "border-slate-500/50 text-slate-200 focus:border-blue-500/50",
      )}
    >
      <option value="" disabled hidden className="text-slate-400">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-slate-200">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const AIReportModal = ({
  isOpen,
  onClose,
  transcribedText,
  setTranscribedText,
  error,
  clearError,
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
  const [parentTasks, setParentTasks] = useState<any[]>([]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đã lưu báo cáo thành công!");
      onClose();
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("userToken");
      if (token) {
        apiAxiosInstance
          .get("/profile/tasks", {
            params: { page: 1, limit: 1000, statusFilter: 2 },
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setParentTasks(res.data?.data || []);
          })
          .catch((err) => {
            console.error("Failed to fetch parent tasks:", err);
          });
      }
    }
  }, [isOpen]);

  // Generic Render helper for 'other' project types
  const renderOtherReport = (report: GenericReportItem, index: number) => {
    console.log("parentTasks: ", parentTasks);
    const isUpdate = report.action === "update";
    const isParent = report.targetType === "parent";
    const canEditName = !isUpdate && !isParent; // If insert subtask, can edit name

    // Helper to update specific data field
    const updateDataField = (field: keyof typeof report.data, value: any) => {
      if (!reportResult || reportResult.report_project !== "other") return;
      const newReports = [...reportResult.reports];

      let newData = {
        ...newReports[index].data,
        [field]: value,
      };

      if (field === "status" && Number(value) === 4) {
        newData.progress = 100;
      } else if (field === "progress" && Number(value) === 100) {
        newData.status = 4;
      }

      newReports[index] = {
        ...newReports[index],
        data: newData,
      };
      setReportResult({ ...reportResult, reports: newReports });
    };

    const updateParentTaskId = (value: string) => {
      if (!reportResult || reportResult.report_project !== "other") return;
      const newReports = [...reportResult.reports];
      newReports[index] = {
        ...newReports[index],
        parent_task_id: value,
      };
      setReportResult({ ...reportResult, reports: newReports });
    };

    return (
      <div
        key={index}
        className="bg-slate-800/30 p-4 rounded-xl border border-white/40 space-y-4"
      >
        <div className="flex flex-wrap items-center border-b border-white/10 pb-2 gap-y-1">
          <span
            className={cn(
              "text-xs px-2 py-0.5 mr-2 rounded-md border",
              report.action === "insert"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30",
            )}
          >
            {report.action === "insert" ? "Thêm mới" : "Cập nhật"}
          </span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 mr-2 rounded-md border bg-blue-500/20 text-blue-300 border-blue-500/30",
            )}
          >
            {isParent ? "Nhiệm vụ cha" : "Nhiệm vụ con"}
          </span>
          <h4
            className={cn(
              "text-xs flex items-center gap-2 w-full md:w-auto",
              report.action === "insert" ? "text-green-300" : "text-amber-300",
            )}
          >
            {isParent
              ? parentTasks.find(
                  (t: any) =>
                    t?.task?.id?.toString() ===
                      report.parent_task_id?.toString() ||
                    t?.id?.toString() === report.parent_task_id?.toString(),
                )?.task?.name || `ID: ${report.parent_task_id}`
              : report.data.task_name || "Nhiệm vụ con mới"}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {!isParent && (
            <ReportSelect
              label="Nhiệm vụ cha"
              value={
                parentTasks
                  .find(
                    (t: any) =>
                      t?.task?.id?.toString() ===
                        report.parent_task_id?.toString() ||
                      t?.id?.toString() === report.parent_task_id?.toString(),
                  )
                  ?.task?.id?.toString() ||
                report.parent_task_id ||
                ""
              }
              onChange={updateParentTaskId}
              options={parentTasks.map((t: any) => ({
                value: t?.task?.id?.toString() || t?.id?.toString() || "",
                label: t?.task?.name || "Nhiệm vụ không xác định",
              }))}
              placeholder="Chọn nhiệm vụ cha..."
              disabled={isUpdate}
              alertWhenEmpty
            />
          )}

          {!isParent && (
            <ReportInput
              label="Nhiệm vụ con"
              value={report.data.task_name || ""}
              onChange={(v) => updateDataField("task_name", v)}
              disabled={!canEditName}
            />
          )}

          <ReportSelect
            label="Trạng thái"
            value={report.data.status?.toString() || ""}
            onChange={(v) => updateDataField("status", Number(v))}
            options={[
              { value: "2", label: "Đang thực hiện" },
              { value: "3", label: "Tạm dừng" },
              { value: "4", label: "Hoàn thành" },
              { value: "5", label: "Hủy" },
            ]}
            placeholder="Chọn trạng thái..."
          />

          {!isParent && report.action === "insert" && (
            <ReportInput
              label="Tiến độ cần đạt (%)"
              value={report.data.target_value ?? 100}
              onChange={(v) => updateDataField("target_value", v)}
              type="number"
            />
          )}

          {!isParent && (
            <ReportInput
              label="Tiến độ (%)"
              value={report.data.progress ?? ""}
              onChange={(v) => updateDataField("progress", v)}
              type="number"
            />
          )}

          {isParent && (
            <ReportInput
              label="Kết quả đạt được"
              value={report.data.achieved_value ?? ""}
              onChange={(v) => updateDataField("achieved_value", v)}
              type="number"
            />
          )}
        </div>
      </div>
    );
  };

  // NTL Render Helper
  const renderNTLReport = (report: NTLReportItem, index: number) => {
    const updateField = (field: keyof NTLReportItem, value: any) => {
      if (!reportResult || reportResult.report_project !== "ntl") return;
      const newReports = [...reportResult.reports];
      newReports[index] = { ...newReports[index], [field]: value };
      setReportResult({ ...reportResult, reports: newReports });
    };

    return (
      <div
        key={index}
        className="bg-slate-800/30 p-4 rounded-xl border border-white/50 space-y-6"
      >
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
          <h5 className="text-green-500 font-bold text-sm uppercase tracking-wider border-l-4 border-green-500 pl-3">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4 mt-3">
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
    );
  };

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
              onClick={() => {
                if (error) clearError();
              }}
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
                {/* Input State: Show only if NO result yet */}
                {!reportResult && (
                  <div className="w-full text-left">
                    <textarea
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      className="w-full bg-slate-800/50 text-slate-200 text-sm leading-relaxed p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[200px] theme-scrollbar"
                      placeholder="Nhập nội dung báo cáo hoặc nhấn giữ mic để nói..."
                    />
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <ReportInstructionButton />
                      <button
                        className={cn(
                          "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                          isFormatting && "opacity-70 cursor-not-allowed",
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
                    {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                      <div className="flex items-center gap-2 text-orange-400 mt-2 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Preview State */}
                {reportResult && (
                  <div className="w-full text-left space-y-4">
                    {reportResult.report_project === "ntl" && (
                      <div className="space-y-6">
                        {reportResult.reports.map((report, idx) =>
                          renderNTLReport(report, idx),
                        )}
                      </div>
                    )}

                    {reportResult.report_project === "other" && (
                      <div className="space-y-6">
                        {reportResult.reports.map((report, idx) =>
                          renderOtherReport(report, idx),
                        )}
                      </div>
                    )}

                    {error && error !== "Vui lòng nói ít nhất 3 giây." && (
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="mt-2 pt-3 border-t border-slate-700 flex justify-between items-center">
                      <ReportInstructionButton />
                      <button
                        className={cn(
                          "px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium cursor-pointer",
                          isSending && "opacity-70 cursor-not-allowed",
                        )}
                        onClick={() => handleSave(reportResult, parentTasks)}
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
