"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHistoryCheckin } from "@/src/features/attendance/api";
import { useAttendanceData } from "@/src/hooks/attendanceHook";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function padZ(n: number) { return String(n).padStart(2, "0"); }

function formatDateKey(isoString: string) {
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const mm = padZ(d.getMonth() + 1);
    const dd = padZ(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
}

function formatTime(timeStr?: string) {
    if (!timeStr) return null;
    return timeStr.slice(0, 5); // "13:46:22" → "13:46"
}

const DOW_ORDER: Record<string, number> = {
    "Thứ Hai": 1, "Thứ Ba": 2, "Thứ Tư": 3,
    "Thứ Năm": 4, "Thứ Sáu": 5, "Thứ Bảy": 6, "Chủ Nhật": 7,
};

interface HistoryItem {
    id: string;
    day_of_week: string;
    date_attendance: string;
    checkin?: string;
    checkout?: string;
    shift_work: { id: number; name: string };
}

interface DayGroup {
    dateKey: string;       // "2026-03-10"
    dow: string;           // "Thứ Ba"
    displayDate: string;   // "Thứ Ba, 10/03/2026"
    isToday: boolean;
    items: HistoryItem[];
}

function groupByDay(list: HistoryItem[]): DayGroup[] {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${padZ(today.getMonth() + 1)}-${padZ(today.getDate())}`;

    const map = new Map<string, DayGroup>();

    list.forEach((item) => {
        const key = formatDateKey(item.date_attendance);
        const d = new Date(item.date_attendance);
        const dd = padZ(d.getDate());
        const mm = padZ(d.getMonth() + 1);
        const yyyy = d.getFullYear();

        if (!map.has(key)) {
            map.set(key, {
                dateKey: key,
                dow: item.day_of_week,
                displayDate: `${item.day_of_week}, ${dd}/${mm}/${yyyy}`,
                isToday: key === todayKey,
                items: [],
            });
        }
        map.get(key)!.items.push(item);
    });

    // Sort items within day: newest checkin first
    map.forEach((group) => {
        group.items.sort((a, b) => (b.checkin ?? "").localeCompare(a.checkin ?? ""));
    });

    // Sort days: newest first
    return Array.from(map.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

// ─── Component ────────────────────────────────────────────────────────────────
const AttendanceHistoryPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { historyCheckin } = useAttendanceData();

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const fetchData = (m: number, y: number) => {
        const token = localStorage.getItem("userToken");
        const time = `${padZ(m)}/${y}`;
        dispatch(getHistoryCheckin({ time, token }) as any);
    };

    useEffect(() => { fetchData(month, year); }, [month, year]);

    const goPrev = () => {
        if (month === 1) { setMonth(12); setYear((y) => y - 1); }
        else setMonth((m) => m - 1);
    };
    const goNext = () => {
        if (month === 12) { setMonth(1); setYear((y) => y + 1); }
        else setMonth((m) => m + 1);
    };

    const items: HistoryItem[] = historyCheckin ?? [];
    const groups = groupByDay(items);

    // Build all dates of the month to show empty days too
    const daysInMonth = new Date(year, month, 0).getDate();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #f9fafb; font-family: 'DM Sans', sans-serif; }
      `}</style>

            <div className="min-h-screen bg-gray-50" style={{ maxWidth: 480, margin: "0 auto" }}>

                {/* ── Header ── */}
                <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3">
                    <button
                        onClick={() => {
                            router.push("/attendance/sheets")
                        }}
                        className="p-1 -ml-1">
                        <ChevronLeft size={22} color="#111" />
                    </button>
                    <h1 className="flex-1 text-center text-base font-bold text-gray-900">
                        Lịch sử chấm công trên ứng dụng
                    </h1>
                    <div className="w-6" />
                </div>

                {/* ── Month Nav ── */}
                <div className="bg-white mt-px px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <button onClick={goPrev} className="p-1">
                        <ChevronLeft size={20} color="#374151" />
                    </button>
                    <span className="text-base font-bold text-gray-900">
                        Tháng {padZ(month)} - {year}
                    </span>
                    <button onClick={goNext} className="p-1">
                        <ChevronRight size={20} color="#374151" />
                    </button>
                </div>


                {/* ── List ── */}
                <div className="pb-10">
                    {groups.length === 0 ? (
                        <div className="text-center py-16 text-sm text-gray-400">Không có dữ liệu</div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.dateKey} className="mb-1">
                                {/* Day header */}
                                <div className="px-4 py-2">
                                    {group.isToday ? (
                                        <span className="text-sm font-bold" style={{ color: "#ef4444" }}>
                                            Hôm nay ({group.displayDate})
                                        </span>
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-800">{group.displayDate}</span>
                                    )}
                                </div>

                                {/* Records */}
                                <div className="bg-white">
                                    {group.items.length === 0 ? (
                                        <div className="flex items-center px-4 py-3 border-b border-gray-50">
                                            <span className="w-2 h-2 rounded-full bg-gray-300 mr-3 flex-shrink-0" />
                                            <span className="text-sm text-gray-400 italic">Không có dữ liệu chấm công</span>
                                        </div>
                                    ) : (
                                        group.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#d1d5db" }} />
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {formatTime(item.checkin) ?? "--:--"}
                                                        </span>
                                                        {item.checkout && (
                                                            <span className="text-xs text-gray-400 ml-2">
                                                                → {formatTime(item.checkout)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700"
                                                    style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}
                                                >
                                                    {item.shift_work.name}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AttendanceHistoryPage;