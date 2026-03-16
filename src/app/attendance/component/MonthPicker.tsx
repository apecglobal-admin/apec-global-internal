"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_LABELS } from "@/src/services/interface";

interface MonthPickerProps {
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

export function MonthPicker({ year, month, onSelect, onClose }: MonthPickerProps) {
  const [pickerYear, setPickerYear] = useState(year);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl md:rounded-2xl pt-3 pb-8 px-5 md:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Year navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setPickerYear((y) => y - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100"
          >
            <ChevronLeft size={18} color="#374151" />
          </button>
          <span className="text-base font-bold text-gray-900">{pickerYear}</span>
          <button
            onClick={() => setPickerYear((y) => y + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100"
          >
            <ChevronRight size={18} color="#374151" />
          </button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-2">
          {MONTH_LABELS.map((label, idx) => {
            const m = idx + 1;
            const isSelected = m === month && pickerYear === year;
            return (
              <button
                key={m}
                onClick={() => { onSelect(pickerYear, m); onClose(); }}
                className="py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isSelected ? "#111827" : "#f3f4f6",
                  color:      isSelected ? "#fff"    : "#374151",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}