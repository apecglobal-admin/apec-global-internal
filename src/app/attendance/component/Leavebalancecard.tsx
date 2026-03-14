"use client";

import React, { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeaveBalance {
  total_granted: number;
  used_leave: number;
  remaining_leave: number;
}

interface LeaveBalanceCardProps {
  leaveBalance: LeaveBalance;
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedValue(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Donut SVG chart ──────────────────────────────────────────────────────────
function DonutChart({
  used,
  total,
  size = 150,
}: {
  used: number;
  total: number;
  size?: number;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? used / total : 0;
  const dashUsed = circumference * animated;
  const dashRemaining = circumference * (1 - animated);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const duration = 1000;
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimated(eased * pct);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(timeout);
  }, [pct]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#f0f4ff"
        strokeWidth={14}
      />
      {/* Remaining (green) */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#22c55e"
        strokeWidth={14}
        strokeDasharray={`${dashRemaining} ${dashUsed}`}
        strokeDashoffset={-dashUsed}
        strokeLinecap="round"
      />
      {/* Used (orange) */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#f97316"
        strokeWidth={14}
        strokeDasharray={`${dashUsed} ${dashRemaining}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LeaveBalanceCard({ leaveBalance }: LeaveBalanceCardProps) {
  const { total_granted, used_leave, remaining_leave } = leaveBalance;

  const animUsed      = useAnimatedValue(used_leave);
  const animRemaining = useAnimatedValue(remaining_leave);
  const animTotal     = useAnimatedValue(total_granted);

  const usedPct = total_granted > 0 ? Math.round((used_leave / total_granted) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl px-4 pt-5 pb-4 mt-2 shadow-sm">

      {/* Title row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Ngày phép</h2>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg px-3 py-1">
          Năm {new Date().getFullYear()}
        </span>
      </div>

      {/* Chart + stats */}
      <div className="flex items-center gap-5">

        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <DonutChart used={used_leave} total={total_granted} size={150} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-gray-900 leading-none">
              {animRemaining}
            </span>
            <span className="text-[10px] text-gray-500 font-medium mt-1">còn lại</span>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0" />
              <span className="text-sm text-gray-500 font-medium">Tổng phép</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {animTotal}{" "}
              <span className="text-xs font-medium text-gray-400">ngày</span>
            </span>
          </div>

          {/* Used */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="text-sm text-gray-500 font-medium">Đã dùng</span>
            </div>
            <span className="text-sm font-bold text-orange-400">
              {animUsed}{" "}
              <span className="text-xs font-medium text-gray-400">ngày</span>
            </span>
          </div>

          {/* Remaining */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-500 font-medium">Còn lại</span>
            </div>
            <span className="text-sm font-bold text-green-500">
              {animRemaining}{" "}
              <span className="text-xs font-medium text-gray-400">ngày</span>
            </span>
          </div>


        </div>
      </div>
    </div>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
export default function LeaveBalanceDemo() {
  const sampleLeaveBalance: LeaveBalance = {
    total_granted: 4,
    used_leave: 0,
    remaining_leave: 4,
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <LeaveBalanceCard leaveBalance={sampleLeaveBalance} />
    </div>
  );
}