"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { DayRecord, TYPE_COLOR, TYPE_LABEL, TYPE_NAME } from "@/src/services/interface";
import { getDowLabel, padZ } from "@/src/utils/attendance";


interface DetailPageProps {
  record: DayRecord;
  day: number;
  month: number;
  year: number;
  onBack: () => void;
}

export function DetailPage({ record, day, month, year, onBack }: DetailPageProps) {
  const [expandCong, setExpandCong] = useState(true);

  const dowLabel = getDowLabel(year, month, day);
  const color    = TYPE_COLOR[record.type];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const checkInRows = [
    { label: "Giờ vào",           value: record.checkIn        ?? "--:--" },
    { label: "Giờ ra",            value: record.checkOut       ?? "--:--" },
    { label: "Nghỉ/Đi công tác", value: record.nghiDiCongTac  ?? 0 },
  ];

  const lateEarlyRows = [
    { label: "Đi muộn (phút)", value: record.diMuon ?? 0 },
    { label: "Về sớm (phút)",  value: record.veSom  ?? 0 },
  ];

  const overtimeRows = [
    { label: "Tổng thời gian làm thêm giờ", value: record.lamThemTong  ?? 0 },
    { label: "Làm thêm hưởng lương (giờ)",  value: record.lamThemLuong ?? 0 },
    { label: "Làm thêm nghỉ bù (giờ)",      value: record.lamThemNghi  ?? 0 },
  ];

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
          <span className="text-sm font-semibold text-black">{record.score}</span>
        </div>

        {/* Số công đi làm thực tế — expandable */}
        <div>
          <button
            onClick={() => setExpandCong((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-100"
          >
            <div className="flex items-center gap-1.5">
              {expandCong
                ? <ChevronUp    size={14} className="text-black" />
                : <ChevronRight size={14} className="text-black" />}
              <span className="text-sm text-black">Số công đi làm thực tế</span>
            </div>
            <span className="text-sm font-semibold text-black">{record.score}</span>
          </button>

          {expandCong && (
            <div className="bg-white/70">
              {checkInRows.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-black">{r.label}</span>
                  <span className="text-sm font-medium text-black">{r.value}</span>
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

      </div>
    </div>
  );
}