"use client";

import PopupComponent from "@/components/PopupComponent";
import {
  getListEmployeeLetter,
  getListLetter,
  getListStatusLetter,
  createLetter,
  updateLetter,
  deleteLetter,
} from "@/src/features/attendance/api";
import { uploadFileTask, uploadImageTask } from "@/src/features/task/api";
import { useAttendanceData } from "@/src/hooks/attendanceHook";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type ViewMode = "list" | "grid";

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
const isImage = (filename: string) =>
  IMAGE_EXTS.some((ext) => filename.toLowerCase().endsWith(`.${ext}`));

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const statusColor: Record<string, string> = {
  "Chờ duyệt": "bg-amber-50 text-amber-600 border-amber-200",
  "Từ chối":   "bg-red-50 text-red-600 border-red-200",
  "Đã duyệt":  "bg-green-50 text-green-600 border-green-200",
};
const statusDot: Record<string, string> = {
  "Chờ duyệt": "bg-amber-500 animate-pulse",
  "Từ chối":   "bg-red-500",
  "Đã duyệt":  "bg-green-500",
};

const letterIconColors: Record<string, string> = {
  "1": "#FF8C42",
  "2": "#2196F3",
  "3": "#9C27B0",
  "4": "#F44336",
  "5": "#4CAF50",
};

function LetterIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill={color} />
      <rect x="10" y="8"  width="20" height="24" rx="3" fill="white" />
      <rect x="14" y="14" width="12" height="2"  rx="1" fill={color} />
      <rect x="14" y="18" width="8"  height="2"  rx="1" fill={color} />
      <rect x="14" y="22" width="10" height="2"  rx="1" fill={color} />
      <rect x="16" y="6"  width="8"  height="4"  rx="2" fill={color} opacity="0.7" />
    </svg>
  );
}

const ChevronRight = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const Required = () => <span className="text-red-500 ml-0.5">*</span>;

const CloseBtn = ({ onClose }: { onClose: () => void }) => (
  <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const FormRow = ({ label, value, required, onClick, clearable, onClear, muted }: {
  label: string; value?: string; required?: boolean; onClick?: () => void;
  clearable?: boolean; onClear?: () => void; muted?: boolean;
}) => (
  <div
    className={`px-5 py-4 border-b border-gray-100 ${onClick ? "cursor-pointer hover:bg-gray-50" : ""} ${muted ? "bg-gray-50" : "bg-white"} transition-colors`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}{required && <Required />}</p>
        {value && <p className="font-semibold text-gray-800 mt-0.5 text-base">{value}</p>}
      </div>
      <div className="flex items-center gap-2 ml-3">
        {clearable && value && (
          <button onClick={(e) => { e.stopPropagation(); onClear?.(); }} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {onClick && <ChevronRight />}
      </div>
    </div>
  </div>
);

const SuggestChips = ({ chips, onSelect }: { chips: string[]; onSelect?: (c: string) => void }) => (
  <div className="flex gap-2 flex-wrap px-5 py-2 pb-3">
    {chips.map((c) => (
      <span key={c} onClick={() => onSelect?.(c)} className="px-3 py-1.5 rounded-full border border-blue-200 text-blue-500 text-xs font-medium cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap max-w-[200px] truncate">
        {c}
      </span>
    ))}
  </div>
);

const AIBubble = () => (
  <div className="absolute right-4 bottom-2 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shadow">
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  </div>
);

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-6 bg-gray-100 rounded-full w-24 mt-2" />
    </div>
  );
}

const DAY_HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function MonthCalendar({ year, month, fromDay, toDay, onSelectDay }: {
  year: number; month: number;
  fromDay: { y: number; m: number; d: number } | null;
  toDay:   { y: number; m: number; d: number } | null;
  onSelectDay: (y: number, m: number, d: number) => void;
}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay    = new Date(year, month - 1, 1).getDay();
  const offset      = firstDay === 0 ? 6 : firstDay - 1;

  const isSame = (d: number, ref: { y: number; m: number; d: number } | null) =>
    !!ref && ref.y === year && ref.m === month && ref.d === d;
  const isInRange = (d: number) => {
    if (!fromDay || !toDay) return false;
    const cur = new Date(year, month - 1, d).getTime();
    const f   = new Date(fromDay.y, fromDay.m - 1, fromDay.d).getTime();
    const t   = new Date(toDay.y,   toDay.m - 1,   toDay.d).getTime();
    return cur > f && cur < t;
  };
  return (
    <div className="px-4 pb-4">
      <p className="text-center font-bold text-gray-800 py-4">Tháng {month}, {year}</p>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isFrom  = isSame(day, fromDay);
          const isTo    = isSame(day, toDay);
          const inRange = isInRange(day);
          return (
            <button key={day} onClick={() => onSelectDay(year, month, day)} className={[
              "flex items-center justify-center mx-auto w-9 h-9 text-sm font-medium transition-all",
              isFrom || isTo  ? "bg-blue-500 text-white rounded-full shadow-md shadow-blue-200 z-10" : "",
              inRange         ? "bg-blue-100 text-blue-700" : "",
              !isFrom && !isTo && !inRange ? "text-gray-700 hover:bg-gray-100 rounded-full" : "",
            ].join(" ")}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeDrum({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  const ITEM_H = 40; const VISIBLE = 5;
  const ref   = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = value * ITEM_H; }, [value]);
  const handleScroll = () => {
    if (!ref.current) return;
    const idx     = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(max - 1, idx));
    if (clamped !== value) onChange(clamped);
  };
  return (
    <div className="relative select-none" style={{ width: 48, height: ITEM_H * VISIBLE }}>
      <div className="absolute left-0 right-0 pointer-events-none z-10 border-t border-b border-gray-300" style={{ top: ITEM_H * 2, height: ITEM_H }} />
      <div className="absolute inset-x-0 top-0    h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      <div ref={ref} onScroll={handleScroll} className="overflow-y-auto h-full" style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}>
        <div style={{ height: ITEM_H * 2 }} />
        {Array.from({ length: max }, (_, v) => (
          <div key={v} onClick={() => { onChange(v); if (ref.current) ref.current.scrollTop = v * ITEM_H; }}
            className={`flex items-center justify-center cursor-pointer transition-all ${v === value ? "text-gray-900 text-2xl font-bold" : "text-gray-400 text-lg"}`}
            style={{ height: ITEM_H, scrollSnapAlign: "center" }}>
            {String(v).padStart(2, "0")}
          </div>
        ))}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

interface CalendarValue {
  fromDay: { y: number; m: number; d: number };
  toDay:   { y: number; m: number; d: number };
  fromHour: number; fromMin: number;
  toHour:   number; toMin:   number;
}

function CalendarPicker({ initial, onClose, onDone }: {
  initial?: Partial<CalendarValue>;
  onClose: () => void;
  onDone:  (v: CalendarValue) => void;
}) {
  const today = new Date();
  const [activeEnd, setActiveEnd] = useState<"from" | "to">("from");
  const [fromDay,  setFromDay]  = useState(initial?.fromDay  ?? { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() });
  const [toDay,    setToDay]    = useState(initial?.toDay    ?? { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() });
  const [fromHour, setFromHour] = useState(initial?.fromHour ?? 9);
  const [fromMin,  setFromMin]  = useState(initial?.fromMin  ?? 0);
  const [toHour,   setToHour]   = useState(initial?.toHour   ?? 18);
  const [toMin,    setToMin]    = useState(initial?.toMin    ?? 0);

  const fmt = (d: { y: number; m: number; d: number }, h: number, m: number) =>
    `${String(d.d).padStart(2,"0")}/${String(d.m).padStart(2,"0")}/${d.y} ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;

  const handleSelectDay = (y: number, m: number, d: number) => {
    if (activeEnd === "from") { setFromDay({ y, m, d }); setActiveEnd("to"); }
    else setToDay({ y, m, d });
  };

  const months = Array.from({ length: 4 }, (_, i) => {
    const raw = today.getMonth() + 1 + i;
    return raw > 12 ? { y: today.getFullYear() + 1, m: raw - 12 } : { y: today.getFullYear(), m: raw };
  });

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans top-[72px] sm:top-[80px] lg:top-[86px]">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Chọn thời gian</h2>
        <button onClick={() => onDone({ fromDay, toDay, fromHour, fromMin, toHour, toMin })} className="text-blue-500 font-semibold text-base px-2">Xong</button>
      </div>
      <div className="flex border-b border-gray-100 shrink-0">
        {(["from", "to"] as const).map((end) => {
          const isActive = activeEnd === end;
          const label = end === "from" ? "Từ ngày" : "Đến ngày";
          const display = end === "from" ? fmt(fromDay, fromHour, fromMin) : fmt(toDay, toHour, toMin);
          return (
            <React.Fragment key={end}>
              {end === "to" && <div className="w-px bg-gray-100 my-2" />}
              <button onClick={() => setActiveEnd(end)} className={`flex-1 px-5 py-3 text-center border-b-2 transition-all ${isActive ? "border-blue-500" : "border-transparent"}`}>
                <p className={`text-xs font-medium mb-0.5 ${isActive ? "text-blue-500" : "text-gray-400"}`}>{label}</p>
                <p className={`text-sm font-bold ${isActive ? "text-blue-500" : "text-gray-700"}`}>{display}</p>
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <div className="grid grid-cols-7 px-4 py-2 bg-white border-b border-gray-50 shrink-0">
        {DAY_HEADERS.map((d) => <div key={d} className="text-center text-xs text-gray-400 font-medium">{d}</div>)}
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        {months.map(({ y, m }) => <MonthCalendar key={`${y}-${m}`} year={y} month={m} fromDay={fromDay} toDay={toDay} onSelectDay={handleSelectDay} />)}
      </div>
      <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-center gap-2">
          {activeEnd === "from" ? (
            <><TimeDrum value={fromHour} max={24} onChange={setFromHour} /><span className="text-gray-400 font-bold text-xl pb-1">:</span><TimeDrum value={fromMin} max={60} onChange={setFromMin} /></>
          ) : (
            <><TimeDrum value={toHour} max={24} onChange={setToHour} /><span className="text-gray-400 font-bold text-xl pb-1">:</span><TimeDrum value={toMin} max={60} onChange={setToMin} /></>
          )}
        </div>
      </div>
    </div>
  );
}

function LetterTypeScreen({ letters, selected, onSelect, onBack }: {
  letters: any[]; selected: any | null;
  onSelect: (t: any) => void; onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-white font-sans flex flex-col top-[72px] sm:top-[80px] lg:top-[86px]">
      <div className="bg-white border-b border-gray-100 sticky top-0 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-9">Loại đơn</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto w-full divide-y divide-gray-100 flex-1 overflow-auto">
        {letters.map((t) => (
          <button key={t.id} onClick={() => { onSelect(t); onBack(); }} className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left">
            <div>
              <span className={`text-base ${selected?.id === t.id ? "font-medium text-gray-800" : "text-gray-700"}`}>{t.name}</span>
              {t.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.description}</p>}
            </div>
            {selected?.id === t.id && <svg className="w-5 h-5 text-blue-500 shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
          </button>
        ))}
      </div>
    </div>
  );
}

function FileUploadSection({
  token,
  onUploaded,
  existingUrl,
  onRemove,
}: {
  token: string;
  onUploaded: (url: string) => void;
  existingUrl?: string;
  onRemove?: () => void;
}) {
  const dispatch  = useDispatch();
  const inputRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName]   = useState<string | null>(null);

  const displayUrl = existingUrl || null;
  const isImg      = displayUrl ? IMAGE_EXTS.some((ext) => displayUrl.toLowerCase().includes(`.${ext}`)) : false;

  const handleFile = async (file: File) => {
    setUploading(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const action = isImage(file.name) ? uploadImageTask : uploadFileTask;
      const result = await (dispatch as any)(action({ formData, token }));
      const url    = result?.payload?.data?.url || result?.payload?.data?.path || "";
      onUploaded(url);
    } catch (e) { console.error("Upload error", e); }
    finally { setUploading(false); }
  };

  return (
    <div className="bg-white mt-3 border-y border-gray-100">
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Tài liệu đính kèm</p>
        {displayUrl && onRemove && (
          <button onClick={onRemove} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa tệp
          </button>
        )}
      </div>
      {displayUrl && (
        <div className="mx-4 mb-3">
          {isImg ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              <img src={displayUrl} alt="Tài liệu đính kèm" className="w-full max-h-52 object-cover" />
              <a href={displayUrl} target="_blank" rel="noopener noreferrer"
                className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full hover:bg-black/70 transition-colors">
                Xem đầy đủ ↗
              </a>
            </div>
          ) : (
            <a href={displayUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors">
              <svg className="w-8 h-8 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-600 truncate">Xem tài liệu</p>
                <p className="text-xs text-blue-400 truncate">{displayUrl.split("/").pop()}</p>
              </div>
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
      <div className="mx-4 mb-4 border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {uploading ? (
          <p className="text-blue-500 font-semibold text-sm">Đang tải lên...</p>
        ) : fileName && !existingUrl ? (
          <>
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <p className="text-green-600 font-semibold text-sm">{fileName}</p>
            <p className="text-gray-400 text-xs">Nhấp để đổi tệp</p>
          </>
        ) : (
          <>
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="text-blue-500 font-semibold text-sm">
              {displayUrl ? "Nhấp để thay tệp mới" : "Nhấp vào đây để tải tệp"}
            </p>
            <p className="text-gray-400 text-xs">Chấp nhận file có dung lượng dưới 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}

interface LetterFormProps {
  onClose:           () => void;
  letters:           any[];
  token:             string;
  editData?:         any;
  defaultAbsence?:   any;
  initialCalValue?:  CalendarValue;
  initialAbsenceId?: number;
  fromParams?:       boolean;
  onSuccess?:        () => void;
}

function LetterForm({
  onClose,
  letters,
  token,
  editData,
  defaultAbsence,
  initialCalValue,
  initialAbsenceId,
  fromParams = false,
  onSuccess,
}: LetterFormProps) {
  const dispatch = useDispatch();
  const router   = useRouter();
  const isEdit   = !!editData;

  const parseISODay = (iso: string) => { const d = new Date(iso); return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }; };
  const parseTime   = (t: string)   => { const [h, m] = t.split(":").map(Number); return { h, m }; };

  const resolveInitAbsence = () => {
    if (editData)         return letters.find((l) => l.id === String(editData.absence?.id)) || null;
    if (initialAbsenceId) return letters.find((l) => Number(l.id) === initialAbsenceId) || null;
    return defaultAbsence || null;
  };

  const today        = new Date();
  const initFromDay  = editData ? parseISODay(editData.start_date) : { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };
  const initToDay    = editData ? parseISODay(editData.end_date)   : initFromDay;
  const initFromTime = editData ? parseTime(editData.start_time)   : { h: 9,  m: 0 };
  const initToTime   = editData ? parseTime(editData.end_time)     : { h: 18, m: 0 };

  const [selectedLetter, setSelectedLetter] = useState<any | null>(resolveInitAbsence);
  const [showTypeScreen, setShowTypeScreen]  = useState(false);
  const [showCal,        setShowCal]         = useState(false);
  const [calValue, setCalValue] = useState<CalendarValue>(
    initialCalValue ?? {
      fromDay:  initFromDay,
      toDay:    initToDay,
      fromHour: initFromTime.h,
      fromMin:  initFromTime.m,
      toHour:   initToTime.h,
      toMin:    initToTime.m,
    }
  );
  const [reason,   setReason]   = useState(editData?.reason   || "");
  const [address,  setAddress]  = useState(editData?.address  || "");
  const [document, setDocument] = useState(editData?.document || "");
  const [loading,  setLoading]  = useState(false);

  const [popup, setPopup] = useState<{
    open: boolean; type: "error" | "warning" | "success"; title: string; message: string;
  }>({ open: false, type: "error", title: "", message: "" });
  const showPopup = (type: "error" | "warning" | "success", title: string, message: string) =>
    setPopup({ open: true, type, title, message });

  useEffect(() => {
    if (!isEdit && initialAbsenceId && letters.length > 0 && !selectedLetter) {
      const found = letters.find((l) => Number(l.id) === initialAbsenceId);
      if (found) setSelectedLetter(found);
    }
  }, [letters, initialAbsenceId, isEdit, selectedLetter]);

  const fmtCalLabel = (cv: CalendarValue) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const f = `${pad(cv.fromDay.d)}/${pad(cv.fromDay.m)}/${cv.fromDay.y} ${pad(cv.fromHour)}:${pad(cv.fromMin)}`;
    const t = `${pad(cv.toDay.d)}/${pad(cv.toDay.m)}/${cv.toDay.y} ${pad(cv.toHour)}:${pad(cv.toMin)}`;
    return `${f} - ${t}`;
  };
  const toISODate = (d: { y: number; m: number; d: number }) =>
    `${d.y}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
  const toTimeStr = (h: number, m: number) =>
    `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`;

  const handleBack = () => {
    if (fromParams) router.push("/attendance/sheets");
    else onClose();
  };

  const handleSubmit = async () => {
    if (!selectedLetter) return showPopup("warning", "Thiếu thông tin", "Vui lòng chọn loại đơn");
    if (!reason.trim())  return showPopup("warning", "Thiếu thông tin", "Vui lòng nhập lý do");
    setLoading(true);
    try {
      const payload: any = {
        token,
        absence_id: Number(selectedLetter.id),
        start_date: toISODate(calValue.fromDay),
        end_date:   toISODate(calValue.toDay),
        start_time: toTimeStr(calValue.fromHour, calValue.fromMin),
        end_time:   toTimeStr(calValue.toHour,   calValue.toMin),
        reason, document, address,
      };
      if (isEdit) {
        payload.id = editData.id;
        const res = await (dispatch as any)(updateLetter(payload));
        if (res.payload.status == 200 || res.payload.status == 201) toast.success(res.payload.data.message);
      } else {
        const res = await (dispatch as any)(createLetter(payload));
        if (res.payload.status == 200 || res.payload.status == 201) toast.success(res.payload.data.message);
      }
      if (fromParams) {
        router.push("/attendance/sheets");
      } else {
        onSuccess?.();
        onClose();
      }
    } catch (e) {
      console.error(e);
      showPopup("error", "Gửi thất bại", "Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showTypeScreen && <LetterTypeScreen letters={letters} selected={selectedLetter} onSelect={setSelectedLetter} onBack={() => setShowTypeScreen(false)} />}
      {showCal        && <CalendarPicker initial={calValue} onClose={() => setShowCal(false)} onDone={(v) => { setCalValue(v); setShowCal(false); }} />}
      <PopupComponent
        isOpen={popup.open}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
        type={popup.type} title={popup.title} message={popup.message}
        showActionButtons={false} showCloseButton={true}
      />
      <div className="fixed inset-x-0 bottom-0 z-40 bg-gray-50 font-sans flex flex-col overflow-auto top-[72px] sm:top-[80px] lg:top-[86px]">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <ChevronLeft onClick={handleBack} color="black" className="cursor-pointer" />
            <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-9">
              {isEdit ? "Chỉnh sửa đơn" : "Thêm đơn mới"}
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full flex-1">
          {/* Loại đơn */}
          <div className="bg-white mt-3 border-y border-gray-100">
            <div className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setShowTypeScreen(true)}>
              <div>
                <p className="text-sm text-gray-500">Loại đơn <Required /></p>
                <p className={`font-bold mt-0.5 text-base ${selectedLetter ? "text-gray-800" : "text-gray-300"}`}>
                  {selectedLetter?.name || "Chọn loại đơn"}
                </p>
              </div>
              <ChevronRight />
            </div>
          </div>

          {/* Thời gian */}
          <div className="bg-white mt-3 border-y border-gray-100">
            <div className="px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setShowCal(true)}>
              <p className="text-sm text-gray-500">Thời gian <Required /></p>
              <p className="font-bold text-gray-800 mt-0.5 text-base">{fmtCalLabel(calValue)}</p>
            </div>
          </div>

          {/* Địa điểm + Lý do */}
          <div className="bg-white mt-3 border-y border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa điểm (nếu có)..."
                className="w-full text-gray-700 text-base outline-none placeholder-gray-300 bg-transparent font-medium" />
            </div>
            <div className="px-5 pt-4 pb-2 relative">
              <p className="text-sm text-gray-500 mb-2">Lý do <Required /></p>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do..." rows={3}
                className="w-full text-gray-700 text-sm outline-none resize-none placeholder-gray-300 bg-transparent" />
              <AIBubble />
            </div>
            <SuggestChips
              chips={["Xin nghỉ phép cá nhân", "Đi công tác theo kế hoạch", "Cập nhật giờ chấm công"]}
              onSelect={(c) => setReason(c)}
            />
          </div>

          <FileUploadSection
            token={token}
            existingUrl={document || undefined}
            onUploaded={(url) => setDocument(url)}
            onRemove={() => setDocument("")}
          />
          <div className="h-4" />
        </div>

        {/* Bottom buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
          <button
            onClick={() => {/* lưu nháp */}}
            className="flex-1 py-3.5 rounded-2xl border-2 border-blue-300 text-blue-400 font-semibold text-base hover:bg-blue-50 transition-colors"
          >
            Lưu nháp
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-blue-400 text-white font-semibold text-base hover:bg-blue-500 transition-colors disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </>
  );
}

function EmployeeLetterCard({ item, onEdit, onDelete }: { item: any; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusName = item.status?.name || "";
  const colorClass = statusColor[statusName] || "bg-gray-50 text-gray-600 border-gray-200";
  const dotClass   = statusDot[statusName]   || "bg-gray-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-bold text-gray-800 text-base">{item.absence?.name || "Đơn từ"}</span>
          <p className="text-blue-500 font-medium text-sm mt-0.5">
            {fmtDate(item.start_date)} {item.start_time?.slice(0, 5)} – {fmtDate(item.end_date)} {item.end_time?.slice(0, 5)}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[120px]">
              <button onClick={() => { setMenuOpen(false); onEdit();   }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl">Chỉnh sửa</button>
              <button onClick={() => { setMenuOpen(false); onDelete(); }} className="w-full text-left px-4 py-3 text-sm text-red-500  hover:bg-red-50  rounded-b-xl">Xóa</button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1.5 text-sm">
        {item.approver?.name && (
          <div className="flex gap-2"><span className="text-gray-400 w-28 shrink-0">Người duyệt:</span><span className="font-semibold text-gray-700">{item.approver.name}</span></div>
        )}
        <div className="flex gap-2"><span className="text-gray-400 w-28 shrink-0">Lý do:</span><span className="text-gray-700">{item.reason}</span></div>
        {item.address && <div className="flex gap-2"><span className="text-gray-400 w-28 shrink-0">Địa điểm:</span><span className="text-gray-700">{item.address}</span></div>}
      </div>
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
          {statusName || "Không rõ"}
        </span>
        {item.document && (
          <a href={item.document} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Tài liệu
          </a>
        )}
      </div>
    </div>
  );
}


const DEFAULT_ABSENCE_ID_FROM_PARAMS = 3;

// ─── Inner component that uses useSearchParams ────────────────────────────────
function LetterPage() {
  const token        = typeof window !== "undefined" ? localStorage.getItem("userToken") || "" : "";
  const dispatch     = useDispatch();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [deletePopup, setDeletePopup] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const { letters, statusLetter, employeeLetter, totalEmployeeLetter } = useAttendanceData();

  const [page,         setPage]         = useState<"menu" | string>("menu");
  const [viewMode,     setViewMode]     = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editItem,     setEditItem]     = useState<any | null>(null);

  const [paramCalValue,  setParamCalValue]  = useState<CalendarValue | null>(null);
  const [paramAbsenceId, setParamAbsenceId] = useState<number | null>(null);
  const [fromParams,     setFromParams]     = useState(false);

  useEffect(() => {
    dispatch(getListLetter()       as any);
    dispatch(getListStatusLetter() as any);
  }, [dispatch]);

  useEffect(() => {
    const dayParam   = searchParams.get("day");
    const monthParam = searchParams.get("month");
    const yearParam  = searchParams.get("year");

    if (dayParam && monthParam && yearParam) {
      const d = { y: Number(yearParam), m: Number(monthParam), d: Number(dayParam) };
      const cv: CalendarValue = {
        fromDay: d, toDay: d,
        fromHour: 9, fromMin: 0,
        toHour: 18, toMin: 0,
      };
      setParamCalValue(cv);
      setParamAbsenceId(DEFAULT_ABSENCE_ID_FROM_PARAMS);
      setFromParams(true);
      setEditItem(null);
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchEmployeeLetters = (absenceId: string, status: number | null, letterId?: string | null) => {
    setLoading(true);
    (dispatch as any)(
      getListEmployeeLetter({
        token,
        absence_id: absenceId,
        limit: totalEmployeeLetter,
        page: 1,
        ...(status !== null ? { status } : {}),
        ...(letterId        ? { id: letterId } : {}),
      } as any)
    ).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (page !== "menu") fetchEmployeeLetters(page, filterStatus);
  }, [page, filterStatus, totalEmployeeLetter]);

  const handleMenuClick = (letterId: string) => { setFilterStatus(null); setPage(letterId); };

  const currentLetter = (letters || []).find((l: any) => l.id === page) || null;

  const handleDelete = (id: string) => setDeletePopup({ open: true, id });

  const confirmDelete = async () => {
    if (!deletePopup.id) return;
    setDeletePopup({ open: false, id: null });
    await (dispatch as any)(deleteLetter({ id: deletePopup.id, token }));
    fetchEmployeeLetters(page, filterStatus);
  };

  const handleEditClick = (item: any) => {
    setEditItem(item);
    setParamCalValue(null);
    setParamAbsenceId(null);
    setFromParams(false);
    setShowForm(true);
    if (page !== "menu") fetchEmployeeLetters(page, filterStatus, item.id);
  };

  const handleSuccess = () => fetchEmployeeLetters(page, filterStatus);

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    setParamCalValue(null);
    setParamAbsenceId(null);
    setFromParams(false);
  };

  const openNewForm = () => {
    setEditItem(null);
    setParamCalValue(null);
    setParamAbsenceId(null);
    setFromParams(false);
    setShowForm(true);
  };

  const letterList: any[] = employeeLetter || [];

  return (
    <>
      <PopupComponent
        isOpen={deletePopup.open}
        onClose={() => setDeletePopup({ open: false, id: null })}
        type="warning"
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa đơn này không? Hành động này không thể hoàn tác."
        confirmText="Xóa" cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => setDeletePopup({ open: false, id: null })}
        showCloseButton={false}
      />

      {showForm && (
        <LetterForm
          onClose={handleFormClose}
          letters={letters || []}
          token={token}
          editData={editItem || undefined}
          defaultAbsence={editItem || paramAbsenceId ? undefined : currentLetter}
          initialCalValue={paramCalValue ?? undefined}
          initialAbsenceId={paramAbsenceId ?? undefined}
          fromParams={fromParams}
          onSuccess={handleSuccess}
        />
      )}

      {/* ── Sub-page: letter list ── */}
      {page !== "menu" && (
        <div className="min-h-screen bg-gray-50 font-sans">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
              <button onClick={() => setPage("menu")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800">{currentLetter?.name || "Đơn từ"}</h1>
              <button onClick={openNewForm} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="max-w-2xl mx-auto px-4 flex border-t border-gray-100 overflow-x-auto">
              <button onClick={() => setFilterStatus(null)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all border-b-2 ${filterStatus === null ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                Tất cả
              </button>
              {(statusLetter || []).map((s: any) => (
                <button key={s.id} onClick={() => setFilterStatus(s.id)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all border-b-2 ${filterStatus === s.id ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            {loading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : letterList.length === 0 ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Chưa có đơn nào</p>
                  <button onClick={openNewForm} className="mt-4 px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors">
                    + Tạo đơn mới
                  </button>
                </div>
              </div>
            ) : (
              letterList.map((item: any) => (
                <EmployeeLetterCard
                  key={item.id}
                  item={item}
                  onEdit={()  => handleEditClick(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Menu page ── */}
      {page === "menu" && (
        <div className="min-h-screen bg-gray-50 font-sans">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600" onClick={() => router.back()}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Đơn từ</h1>
              <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                {viewMode === "list" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3"  y="3"  width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="3"  width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="3"  y="14" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="max-w-2xl mx-auto px-4 py-6">
            {(letters || []).length === 0 ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 h-4 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : viewMode === "list" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {(letters || []).map((item: any) => (
                  <button key={item.id} onClick={() => handleMenuClick(item.id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left group">
                    <div className="w-11 h-11 shrink-0"><LetterIcon color={letterIconColors[item.id] || "#9E9E9E"} /></div>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-700 font-medium text-base">{item.name}</span>
                      {item.is_paid !== null && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.is_paid ? "Có lương" : "Không lương"}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {(letters || []).map((item: any) => (
                  <button key={item.id} onClick={() => handleMenuClick(item.id)} className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="w-14 h-14"><LetterIcon color={letterIconColors[item.id] || "#9E9E9E"} /></div>
                    <span className="text-gray-600 text-xs font-medium text-center leading-tight">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Default export wrapped in Suspense to satisfy Next.js App Router ─────────
export default function LetterPageWrapper() {
  return (
    <Suspense fallback={null}>
      <LetterPage />
    </Suspense>
  );
}