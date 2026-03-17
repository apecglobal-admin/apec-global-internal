"use client";

import { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import {
  DayRecord,
  TYPE_COLOR,
  TYPE_LABEL,
  TYPE_NAME,
} from "@/src/services/interface";
import { getDowLabel, padZ } from "@/src/utils/attendance";
import { useRouter } from "next/navigation";

interface DetailPageProps {
  record: DayRecord;
  day: number;
  month: number;
  year: number;
  onBack: () => void;
}

export function DetailPage({
  record,
  day,
  month,
  year,
  onBack,
}: DetailPageProps) {
  const [expandCong, setExpandCong] = useState(true);

  const dowLabel = getDowLabel(year, month, day);
  const color = TYPE_COLOR[record.type];
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const checkInRows = [
    { label: "Giờ vào", value: record.checkIn ?? "--:--" },
    { label: "Giờ ra", value: record.checkOut ?? "--:--" },
    { label: "Nghỉ/Đi công tác", value: record.nghiDiCongTac ?? 0 },
  ];

  const lateEarlyRows = [
    { label: "Đi muộn (phút)", value: record.diMuon ?? 0 },
    { label: "Về sớm (phút)", value: record.veSom ?? 0 },
  ];

  const overtimeRows = [
    { label: "Tổng thời gian làm thêm giờ", value: record.lamThemTong ?? 0 },
    { label: "Làm thêm hưởng lương (giờ)", value: record.lamThemLuong ?? 0 },
    { label: "Làm thêm nghỉ bù (giờ)", value: record.lamThemNghi ?? 0 },
  ];

  const handleUpdateLetter = () => {
    router.push(`/attendance/letter?day=${day}&month=${month}&year=${year}`);
  };

  return (
    <div className="min-h-screen" style={{ maxWidth: 420, margin: "0 auto" }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={22} className="text-slate-600" />
        </button>
        <h1 className="text-base font-semibold text-slate-700 flex-1 text-center mr-6">
          Chi tiết công
        </h1>
      </div>

      {/* Date + status */}
      <div className="mx-4 mb-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-5 flex flex-col items-center gap-2.5">
        <p className="text-base font-semibold text-slate-700">
          {dowLabel}, {padZ(day)}-{padZ(month)}-{year}
        </p>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: `${color}18`, color }}
        >
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: color }}
          >
            {TYPE_LABEL[record.type]}
          </span>
          {TYPE_NAME[record.type]}
        </div>
      </div>

      {/* Stats table */}
      <div className="mx-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
        {/* Số công hưởng lương */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <span className="text-sm text-black">Số công hưởng lương</span>
          <span className="text-sm font-semibold text-black">
            {record.score}
          </span>
        </div>

        {/* Số công đi làm thực tế — expandable */}
        <div>
          <button
            onClick={() => setExpandCong((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-100"
          >
            <div className="flex items-center gap-1.5">
              {expandCong ? (
                <ChevronUp size={14} className="text-black" />
              ) : (
                <ChevronRight size={14} className="text-black" />
              )}
              <span className="text-sm text-black">Số công đi làm thực tế</span>
            </div>
            <span className="text-sm font-semibold text-black">
              {record.score}
            </span>
          </button>

          {expandCong && (
            <div className="bg-white/70">
              {checkInRows.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-black">{r.label}</span>
                  <span className="text-sm font-medium text-black">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Late / early group */}
        {/* <div className="h-px bg-slate-100" />
        <div className="mt-1">
          {lateEarlyRows.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-black">{r.label}</span>
              <span className="text-sm font-medium text-black">{r.value}</span>
            </div>
          ))}
        </div> */}

        {/* Overtime group */}
        {/* <div className="h-px bg-slate-100" />
        <div className="mt-1">
          {overtimeRows.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-black">{r.label}</span>
              <span className="text-sm font-medium text-black">{r.value}</span>
            </div>
          ))}
        </div> */}

        {record.score !== 1 && (
          <div className="mx-4 mt-4 mb-8">
            <button
              onClick={() => handleUpdateLetter()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 active:scale-[0.98] transition-all text-blue-500 font-semibold text-sm"
            >
              {/* pencil-clock icon */}
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
              Đề nghị cập nhật công
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
