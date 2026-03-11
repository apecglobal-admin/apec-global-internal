"use client";

import { useState } from "react";
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
  const [expandCong, setExpandCong] = useState(false);

  const dowLabel = getDowLabel(year, month, day);
  const color    = TYPE_COLOR[record.type];

  const checkInRows = [
    { label: "Giờ vào",             value: record.checkIn  ?? "--:--" },
    { label: "Giờ ra",              value: record.checkOut ?? "--:--" },
    { label: "Nghỉ/Đi công tác",   value: record.nghiDiCongTac ?? 0 },
  ];

  const lateEarlyRows = [
    { label: "Đi muộn (phút)", value: record.diMuon ?? 0 },
    { label: "Về sớm (phút)",  value: record.veSom  ?? 0 },
  ];

  const overtimeRows = [
    { label: "Tổng thời gian làm thêm giờ", value: record.lamThemTong   ?? 0 },
    { label: "Làm thêm hưởng lương (giờ)",  value: record.lamThemLuong  ?? 0 },
    { label: "Làm thêm nghỉ bù (giờ)",      value: record.lamThemNghi   ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-100" style={{ maxWidth: 420, margin: "0 auto" }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={22} color="#111" />
        </button>
        <h1 className="text-base font-bold text-gray-900 flex-1 text-center mr-6">
          Chi tiết công
        </h1>
      </div>

      {/* Date + status */}
      <div className="bg-white mt-2 px-4 py-5 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft size={14} color="#374151" />
          </button>
          <p className="text-base font-bold text-gray-900">
            {dowLabel}, {padZ(day)}-{padZ(month)}-{year}
          </p>
          {/* placeholder to keep date centred */}
          <div className="w-7" />
        </div>

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
      <div className="bg-white mt-2">
        {/* Số công hưởng lương */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <span className="text-sm text-gray-700">Số công hưởng lương</span>
          <span className="text-sm font-bold text-gray-900">{record.score}</span>
        </div>

        {/* Số công đi làm thực tế — expandable */}
        <div>
          <button
            onClick={() => setExpandCong((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100"
          >
            <div className="flex items-center gap-1.5">
              {expandCong
                ? <ChevronUp   size={14} color="#6b7280" />
                : <ChevronRight size={14} color="#6b7280" />}
              <span className="text-sm text-gray-700">Số công đi làm thực tế</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{record.score}</span>
          </button>

          {expandCong && (
            <div className="bg-gray-50">
              {checkInRows.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-600">{r.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Late / early group */}
        <div className="h-2 bg-gray-100" />
        {lateEarlyRows.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-700">{r.label}</span>
            <span className="text-sm font-semibold text-gray-900">{r.value}</span>
          </div>
        ))}

        {/* Overtime group */}
        <div className="h-2 bg-gray-100" />
        {overtimeRows.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-700">{r.label}</span>
            <span className="text-sm font-semibold text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}