"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";


import { buildCalendarWeeks, computeStats, getDaysInMonth, padZ } from "@/src/utils/attendance";


import { DayRecord, DOW_LABELS, LEGEND_ITEMS, UPDATE_SCHEDULE_NOTE  } from "@/src/services/interface";
import { StatCard } from "../component/StatCard";
import { DetailPage } from "../component/DetailPage";
import { DayCell } from "../component/DayCell";
import { ListItem } from "../component/ListItem";
import { MonthPicker } from "../component/MonthPicker";

export const MOCK_DATA: Record<string, DayRecord[]> = {
  "2026-3": [
    { date: 2,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:16", checkOut: "18:00", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 3,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:49", checkOut: "18:05", soCong: 1,    diMuon: 19, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 4,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:50", checkOut: "18:10", soCong: 1,    diMuon: 20, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 5,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:48", checkOut: "18:03", soCong: 1,    diMuon: 18, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 6,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:55", checkOut: "18:07", soCong: 1,    diMuon: 25, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 7,  type: "full",         shiftName: "Ca sáng thứ 7", checkIn: "07:44", checkOut: "12:00", soCong: 0.5,  diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 9,  type: "lack",         shiftName: "Ca Công Nghệ",  checkIn: "08:34",                   soCong: 0.38, diMuon: 4,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 10, type: "lack",         shiftName: "Ca Công Nghệ",  checkIn: "08:43",                   soCong: 0.38, diMuon: 13, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 11, type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:02", checkOut: "17:30", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 12, type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:00", checkOut: "17:35", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 16, type: "overtime",     shiftName: "Ca Công Nghệ",  checkIn: "08:00", checkOut: "20:15", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 2.25, lamThemLuong: 2,   lamThemNghi: 0.25, nghiDiCongTac: 0 },
    { date: 17, type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:05", checkOut: "17:30", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 18, type: "unpaid_leave", shiftName: "Ca Công Nghệ",                                      soCong: 0,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 19, type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:00", checkOut: "17:30", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
  ],
  "2026-2": [
    { date: 2,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:00", checkOut: "17:30", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 3,  type: "full",         shiftName: "Ca Công Nghệ",  checkIn: "08:05", checkOut: "17:25", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 4,  type: "lack",         shiftName: "Ca Công Nghệ",  checkIn: "09:00",                   soCong: 0.5,  diMuon: 30, veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
    { date: 9,  type: "overtime",     shiftName: "Ca Công Nghệ",  checkIn: "08:00", checkOut: "19:45", soCong: 1,    diMuon: 0,  veSom: 0, lamThemTong: 1.75, lamThemLuong: 1.5, lamThemNghi: 0.25, nghiDiCongTac: 0 },
    { date: 16, type: "unpaid_leave", shiftName: "Ca Công Nghệ",                                      soCong: 0,    diMuon: 0,  veSom: 0, lamThemTong: 0,    lamThemLuong: 0,   lamThemNghi: 0,    nghiDiCongTac: 0 },
  ],
};

// ─── Global font style ────────────────────────────────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { background: #f3f4f6; font-family: 'DM Sans', sans-serif; }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AttendanceSheetPage() {
  const router = useRouter();

  const [tab, setTab]           = useState<"bang_cong" | "danh_sach">("bang_cong");
  const [month, setMonth]       = useState(3);
  const [year, setYear]         = useState(2026);
  const [showPicker, setShowPicker] = useState(false);
  const [detailDay, setDetailDay]   = useState<number | null>(null);

  // ── Derived data ──
  const key       = `${year}-${month}`;
  const records   = MOCK_DATA[key] ?? [];
  const recordMap = new Map(records.map((r) => [r.date, r]));
  const weeks     = buildCalendarWeeks(year, month);
  const stats     = computeStats(records);

  const daysInMonth = getDaysInMonth(year, month);
  const today       = new Date();
  const todayDay    =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today.getDate()
      : -1;

  const firstDay = `01/${padZ(month)}/${year}`;
  const lastDay  = `${padZ(daysInMonth)}/${padZ(month)}/${year}`;

  // ── Detail view ──
  if (detailDay !== null) {
    const rec = recordMap.get(detailDay);
    if (rec) {
      return (
        <>
          <style>{GLOBAL_STYLE}</style>
          <DetailPage
            record={rec}
            day={detailDay}
            month={month}
            year={year}
            onBack={() => setDetailDay(null)}
          />
        </>
      );
    }
  }

  // ── Main view ──
  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="flex flex-col bg-gray-100 w-full" style={{ height: "100dvh" }}>

        {/* ── Header ── */}
        <div className="bg-white px-4 pt-10 pb-4 top-0 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Bảng công</h1>
            <button
              className="flex items-center bg-blue-600 cursor-pointer gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
              onClick={() => router.push("/attendance/history")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
              </svg>
              Lịch sử
            </button>
          </div>

          <button onClick={() => setShowPicker(true)} className="flex items-center gap-1 mb-5">
            <span className="text-sm font-medium text-gray-600">{firstDay} – {lastDay}</span>
            <ChevronDown size={14} color="#6b7280" />
          </button>

          <div className="flex items-start divide-x divide-gray-100 mb-2">
            <StatCard value={stats.tongCong} label={"Tổng công\n(ngày)"}      color="#22c55e" />
            <StatCard value={stats.lamThem}  label={"Làm thêm\n(giờ)"}        color="#2563eb" />
            <StatCard value={stats.diMuon}   label={"Đi muộn, về\nsớm (lần)"} color="#f97316" />
            <StatCard value={stats.nghi}     label={"Nghỉ\n(ngày)"}            color="#ef4444" />
          </div>
        </div>

        {/* ── Update note ── */}
        <div className="bg-white mt-2 px-4 py-3 flex-shrink-0">
          <p className="text-xs text-gray-500 leading-relaxed">{UPDATE_SCHEDULE_NOTE}</p>
        </div>

        {/* ── Tabs + legend ── */}
        <div className="bg-white mt-2 px-4 pt-3 flex-shrink-0">
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
            {(["bang_cong", "danh_sach"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: tab === t ? "#111827" : "#fff",
                  color:      tab === t ? "#fff"    : "#6b7280",
                }}
              >
                {t === "bang_cong" ? "Bảng công" : "Danh sách"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {LEGEND_ITEMS.map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Calendar tab ── */}
        {tab === "bang_cong" && (
          <div className="bg-white mt-2 flex flex-col flex-1 overflow-hidden px-4">
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 pt-3 mb-1 flex-shrink-0">
              {DOW_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold py-1"
                  style={{ color: d === "CN" ? "#ef4444" : "#6b7280" }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="text-center text-sm font-bold text-gray-800 py-2 flex-shrink-0">
              Tháng {month}
            </div>

            <div className="flex flex-col flex-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 flex-1">
                  {week.map((day, di) => (
                    <div key={di} className="flex justify-center items-center">
                      <DayCell
                        day={day ?? 0}
                        record={day ? recordMap.get(day) : undefined}
                        isToday={day === todayDay}
                        isSunday={di === 6}
                        isSaturday={di === 5}
                        isEmpty={day === null}
                        onClick={
                          day && recordMap.get(day)
                            ? () => setDetailDay(day)
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── List tab ── */}
        {tab === "danh_sach" && (
          <div className="bg-white mt-2 pb-8 overflow-y-auto flex-1">
            {records.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Không có dữ liệu tháng này
              </p>
            ) : (
              records.map((r) => (
                <ListItem
                  key={r.date}
                  record={r}
                  day={r.date}
                  month={month}
                  year={year}
                  onClick={() => setDetailDay(r.date)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {showPicker && (
        <MonthPicker
          year={year}
          month={month}
          onSelect={(y, m) => { setYear(y); setMonth(m); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}