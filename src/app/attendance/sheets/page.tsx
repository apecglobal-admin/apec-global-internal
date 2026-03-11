"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { buildCalendarWeeks, computeStats, getDaysInMonth, padZ } from "@/src/utils/attendance";
import { DayRecord, DOW_LABELS, LEGEND_ITEMS, UPDATE_SCHEDULE_NOTE } from "@/src/services/interface";
import { getPersonalAttendance } from "@/src/features/attendance/api";

import { StatCard } from "../component/StatCard";
import { DetailPage } from "../component/DetailPage";
import { DayCell } from "../component/DayCell";
import { ListItem } from "../component/ListItem";
import { MonthPicker } from "../component/MonthPicker";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hooks/attendanceHook";

// ─── Map API response item → DayRecord ───────────────────────────────────────
function mapApiItemToDayRecord(item: {
  id: string;
  date_attendance: string;
  checkin: string | null;
  checkout: string | null;
  score: number;
  shift_work: string;
  type: string;
}): DayRecord {
  const formatTime = (t: string | null): string =>
    t ? t.slice(0, 5) : "";

  return {
    date:          parseInt(item.date_attendance, 10),
    type:          item.type as DayRecord["type"],
    shiftName:     item.shift_work,
    checkIn:       formatTime(item.checkin),
    checkOut:      formatTime(item.checkout),
    score:         Math.round((item.score ?? 0) * 1000) / 1000,
    diMuon:        0,
    veSom:         0,
    lamThemTong:   0,
    lamThemLuong:  0,
    lamThemNghi:   0,
    nghiDiCongTac: 0,
  };
}

// ─── Helper: lấy array thô từ store (tương thích mọi cấu trúc response) ──────
function getRawItems(personalAttendance: any): any[] {
  if (!personalAttendance) return [];
  if (Array.isArray(personalAttendance)) return personalAttendance;
  if (Array.isArray(personalAttendance?.data)) return personalAttendance.data;
  if (Array.isArray(personalAttendance?.data?.data)) return personalAttendance.data.data;
  return [];
}

// ─── Global font style ────────────────────────────────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { background: #f3f4f6; font-family: 'DM Sans', sans-serif; }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AttendanceSheetPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loadingPersonalAttendance, personalAttendance } = useAttendanceData();

  const [tab, setTab]               = useState<"bang_cong" | "danh_sach">("bang_cong");
  const [month, setMonth]           = useState(3);
  const [year, setYear]             = useState(2026);
  const [showPicker, setShowPicker] = useState(false);
  const [detailDay, setDetailDay]   = useState<number | null>(null);

  // ── Derive records TRƯỚC các useEffect để tránh dùng biến chưa khai báo ──
  const rawItems: any[]      = getRawItems(personalAttendance);
  const records: DayRecord[] = rawItems.map(mapApiItemToDayRecord);
  const recordMap            = new Map(records.map((r) => [r.date, r]));
  const weeks                = buildCalendarWeeks(year, month);
  const stats                = computeStats(records);

  const daysInMonth = getDaysInMonth(year, month);
  const today       = new Date();
  const todayDay    =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today.getDate()
      : -1;

  const firstDay = `01/${padZ(month)}/${year}`;
  const lastDay  = `${padZ(daysInMonth)}/${padZ(month)}/${year}`;

  // ── Fetch attendance khi đổi tháng/năm ──
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const time  = `${padZ(month)}/${year}`;
    dispatch(
      getPersonalAttendance({ key: "personalAttendance", time, token }) as any
    );
  }, [month, year]);

  // ── Fetch detail khi chọn ngày ──
  useEffect(() => {
    if (detailDay === null) return;

    const rawItem = rawItems.find(
      (item: any) => parseInt(item.date_attendance, 10) === detailDay
    );
    if (!rawItem) return;

    const token = localStorage.getItem("userToken");
    const time  = `${padZ(month)}/${year}`;
    dispatch(
      getPersonalAttendance({
        key:   "detailPersonalAttendance",
        time,
        id:    rawItem.id,
        token,
      }) as any
    );
  }, [detailDay]);

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

        {/* ── Loading state ── */}
        {loadingPersonalAttendance && (
          <div className="flex items-center justify-center py-10">
            <span className="text-sm text-gray-400">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* ── Calendar tab ── */}
        {!loadingPersonalAttendance && tab === "bang_cong" && (
          <div className="bg-white mt-2 flex flex-col flex-1 overflow-hidden px-4">
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
        {!loadingPersonalAttendance && tab === "danh_sach" && (
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