"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { buildCalendarWeeks, computeStats, getDaysInMonth, padZ } from "@/src/utils/attendance";
import { DayRecord, DOW_LABELS, LEGEND_ITEMS } from "@/src/services/interface";
import { getListEmployeeLetter, getPersonalAttendance } from "@/src/features/attendance/api";
import { fetchUserInfo } from "@/src/services/api";

import { StatCard } from "../component/StatCard";
import { DetailPage } from "../component/DetailPage";
import { DayCell } from "../component/DayCell";
import { ListItem } from "../component/ListItem";
import { MonthPicker } from "../component/MonthPicker";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hooks/attendanceHook";
import { useProfileData } from "@/src/hooks/profileHook";
import { LeaveBalanceCard } from "../component/Leavebalancecard";

function mapApiItemToDayRecord(item: {
  id: string;
  date_attendance: string;
  checkin: string | null;
  checkout: string | null;
  score: number;
  shift_work: string;
  type: string;
}): DayRecord {
  const formatTime = (t: string | null): string => t ? t.slice(0, 5) : "";
  return {
    date: parseInt(item.date_attendance, 10),
    type: item.type as DayRecord["type"],
    shiftName: item.shift_work,
    checkIn: formatTime(item.checkin),
    checkOut: formatTime(item.checkout),
    score: Math.round((item.score ?? 0) * 1000) / 1000,
    diMuon: 0,
    veSom: 0,
    lamThemTong: 0,
    lamThemLuong: 0,
    lamThemNghi: 0,
    nghiDiCongTac: 0,
  };
}

function getRawItems(personalAttendance: any): any[] {
  if (!personalAttendance) return [];
  if (Array.isArray(personalAttendance)) return personalAttendance;
  if (Array.isArray(personalAttendance?.data)) return personalAttendance.data;
  if (Array.isArray(personalAttendance?.data?.data)) return personalAttendance.data.data;
  return [];
}

export default function AttendanceSheetPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { userInfo } = useProfileData();
  const { loadingPersonalAttendance, personalAttendance, employeeLetter } = useAttendanceData();


  const [tab, setTab] = useState<"bang_cong" | "danh_sach">("bang_cong");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showPicker, setShowPicker] = useState(false);
  const [detailDay, setDetailDay] = useState<number | null>(null);

  const rawItems: any[] = getRawItems(personalAttendance);
  const records: DayRecord[] = rawItems.map(mapApiItemToDayRecord);
  const recordMap = new Map(records.map((r) => [r.date, r]));
  const weeks = buildCalendarWeeks(year, month);
  const stats = computeStats(records);

  const daysInMonth = getDaysInMonth(year, month);
  const today = new Date();
  const todayDay =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today.getDate() : -1;

  const firstDay = `01/${padZ(month)}/${year}`;
  const lastDay = `${padZ(daysInMonth)}/${padZ(month)}/${year}`;


  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token) {
      const payload: any = {
        token,
        status: 1
      }
      dispatch(getListEmployeeLetter(payload) as any);
    };
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token && !userInfo) dispatch(fetchUserInfo(token) as any);
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    dispatch(getPersonalAttendance({ key: "personalAttendance", time: `${padZ(month)}/${year}`, token }) as any);
  }, [month, year]);

  useEffect(() => {
    if (detailDay === null) return;
    const rawItem = rawItems.find((item: any) => parseInt(item.date_attendance, 10) === detailDay);
    if (!rawItem) return;
    const token = localStorage.getItem("userToken");
    dispatch(getPersonalAttendance({ key: "detailPersonalAttendance", time: `${padZ(month)}/${year}`, id: rawItem.id, token }) as any);
  }, [detailDay]);


  if (detailDay !== null) {
    const rec = recordMap.get(detailDay);
    if (rec) {
      return (
        <div className="min-h-screen bg-white">
          <DetailPage record={rec} day={detailDay} month={month} year={year} onBack={() => setDetailDay(null)} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-10 space-y-10 sm:px-6 sm:py-12 sm:space-y-12 md:px-8 md:py-14 lg:px-8 lg:py-16 lg:space-y-16">

        {/* ── Header ── */}
        <div className="bg-white px-4 pt-10 pb-4 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Bảng công</h1>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 cursor-pointer whitespace-nowrap"
                onClick={() => router.push("/attendance/history")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                </svg>
                <span className="hidden sm:inline">Lịch sử</span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 cursor-pointer whitespace-nowrap"
                onClick={() => router.push("/attendance/letter")}
              >
                <FilePlus size={13} className="flex-shrink-0" />
                <span className="hidden sm:inline">Đơn từ</span>
              </button>
            </div>
          </div>

          <button onClick={() => setShowPicker(true)} className="flex items-center gap-1 mb-5">
            <span className="text-sm font-medium text-gray-600">{firstDay} – {lastDay}</span>
            <ChevronDown size={14} color="#6b7280" />
          </button>

          <div className="flex items-start divide-x divide-gray-100 mb-2">
            <StatCard value={stats.tongCong} label={"Tổng công\n(ngày)"} color="#22c55e" />
            <StatCard value={stats.lamThem} label={"Làm thêm\n(giờ)"} color="#2563eb" />
            <StatCard value={stats.diMuon} label={"Đi muộn, về\nsớm (lần)"} color="#f97316" />
            <StatCard value={stats.nghi} label={"Nghỉ\n(ngày)"} color="#ef4444" />
          </div>
        </div>

        {/* ── Leave balance ── */}
        {userInfo && (
          <div className="flex-shrink-0">
            <LeaveBalanceCard
              leaveBalance={{
                total_granted: userInfo.total_granted,
                used_leave: userInfo.used_leave,
                remaining_leave: userInfo.remaining_leave,
              }}
            />
          </div>
        )}
        {/* ── Employee Letters ── */}
        <div className="px-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-blue-600" />
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Đơn từ của tôi</h2>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {employeeLetter?.length ?? 0} đơn
            </span>
          </div>

          {!employeeLetter || employeeLetter.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Không có dữ liệu</p>
          ) : (
            <div 
              className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1"
              style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
            >
              {employeeLetter.map((letter: any) => {
                const statusColor =
                  letter.status?.id === 1
                    ? { bg: "#fff7ed", text: "#f97316", dot: "#f97316" }   // Chờ duyệt - orange
                    : letter.status?.id === 2
                      ? { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" }   // Đã duyệt - green
                      : { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" };  // Từ chối - red

                const formatDate = (iso: string) => {
                  const d = new Date(iso);
                  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                };

                const startDate = formatDate(letter.start_date);
                const endDate = formatDate(letter.end_date);
                const startTime = letter.start_time?.slice(0, 5);
                const endTime = letter.end_time?.slice(0, 5);

                return (
                  <div
                    key={letter.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    {/* Top row: absence type + status badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        {letter.absence?.name ?? "Đơn từ"}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: statusColor.bg, color: statusColor.text }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: statusColor.dot }}
                        />
                        {letter.status?.name}
                      </span>
                    </div>

                    {/* Date/time range */}
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-xs text-gray-500">
                        {startDate} {startTime} – {endDate} {endTime}
                      </span>
                    </div>

                    {/* Reason */}
                    {letter.reason && (
                      <div className="flex items-start gap-2 mb-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="text-xs text-gray-500 line-clamp-2">{letter.reason}</span>
                      </div>
                    )}

                    {/* Approver */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {letter.approver?.avatar ? (
                          <img
                            src={letter.approver.avatar}
                            alt={letter.approver.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {letter.approver?.name ?? "Chưa có người duyệt"}
                        </span>
                      </div>

                      {/* Document link */}
                      {letter.document && (
                        <a
                          href={letter.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                          </svg>
                          Xem tài liệu
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                  color: tab === t ? "#fff" : "#6b7280",
                }}
              >
                {t === "bang_cong" ? "Bảng công" : "Danh sách"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {LEGEND_ITEMS.map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Loading ── */}
        {loadingPersonalAttendance && (
          <div className="flex items-center justify-center py-10 flex-shrink-0">
            <span className="text-sm text-gray-400">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* ── Calendar tab ── */}
        {!loadingPersonalAttendance && tab === "bang_cong" && (
          <div className="bg-white mt-2 flex flex-col flex-1 px-4 pb-2">

            {/* Header ngày trong tuần */}
            <div className="grid grid-cols-7 pt-2 mb-1 flex-shrink-0">
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

            <div className="text-center text-sm font-bold text-gray-800 py-1 flex-shrink-0">
              Tháng {month}
            </div>

            {/* Các tuần chia đều chiều cao còn lại */}
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
          <div className="bg-white mt-2 pb-8">
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
                  isToday={r.date === todayDay}
                  onClick={() => setDetailDay(r.date)}
                />
              ))
            )}
          </div>
        )}

      </main>

      {showPicker && (
        <MonthPicker
          year={year}
          month={month}
          onSelect={(y, m) => { setYear(y); setMonth(m); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}