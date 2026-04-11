"use client";

import React, { useEffect, useState } from "react";
import { FilePlus, Calendar, FileText, MapPin, User, Search, X, ChevronDown, Check, Ban, Loader2, ClipboardList } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hooks/attendanceHook";
import {
  getListEmployeeLetter,
  getTypeAttendanceAbsences,
  getStatusAttendanceAbsences,
  getListAttendanceManagerAbsences,
  approveAttendanceAbsences,
  rejectAttendanceAbsences,
} from "@/src/features/attendance/api";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "react-toastify";
import { useProfileData } from "@/src/hooks/profileHook";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface AbsenceItem {
  id: string;
  absence: { id: number; name: string };
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  reason: string;
  document: string | null;
  address: string | null;
  status: { id: number; name: string };
  employee: { id: number; name: string; avatar: string | null };
}

interface PaginationData {
  total: number;
  limit: number;
  totalPages: number;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const STATUS_COLORS: Record<number, { bg: string; text: string; border: string; dot: string }> = {
  1: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   dot: "bg-amber-400"   },
  2: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  3: { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/30",     dot: "bg-red-400"     },
};

const ABSENCE_COLORS: Record<number, string> = {
  1: "text-sky-400",
  2: "text-violet-400",
  3: "text-teal-400",
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
const formatTime = (t: string) => t?.slice(0, 5) ?? "";

/* ─────────────────────────────────────────────
   Sub-tab: Đơn từ của tôi
───────────────────────────────────────────── */
function MyLettersTab() {
  const { employeeLetter } = useAttendanceData();

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
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
                ? { bg: "#fff7ed", text: "#f97316", dot: "#f97316" }
                : letter.status?.id === 3
                  ? { bg: "#f0fdf4", text: "#22c55e", dot: "#22c55e" }
                  : { bg: "#fef2f2", text: "#ef4444", dot: "#ef4444" };

            const startDate = formatDate(letter.start_date);
            const endDate = formatDate(letter.end_date);
            const startTime = letter.start_time?.slice(0, 5);
            const endTime = letter.end_time?.slice(0, 5);

            return (
              <div key={letter.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                {/* Top row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">
                    {letter.absence?.name ?? "Đơn từ"}
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: statusColor.bg, color: statusColor.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor.dot }} />
                    {letter.status?.name}
                  </span>
                </div>

                {/* Date/time */}
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
                      <img src={letter.approver.avatar} alt={letter.approver.name} className="w-5 h-5 rounded-full object-cover" />
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
  );
}

/* ─────────────────────────────────────────────
   Sub-tab: Duyệt đơn
───────────────────────────────────────────── */
function ApprovalTab() {
  const dispatch = useDispatch();
  const {
    listAttendanceManagerAbsences,
    loadingListAttendanceManagerAbsences,
    detailListAttendanceManagerAbsences,
    loadingDetailListAttendanceManagerAbsences,
    listTypeAttendanceAbsences,
    listStatusAttendanceAbsences,
  } = useAttendanceData();

  const [items, setItems]             = useState<AbsenceItem[]>([]);
  const [pagination, setPagination]   = useState<PaginationData>({ total: 0, limit: 5, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  const [searchFilter, setSearchFilter]   = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [absenceFilter, setAbsenceFilter] = useState("all");

  const [detailItem, setDetailItem] = useState<AbsenceItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [actionLoading, setActionLoading] = useState<{ id: string; type: "approve" | "reject" } | null>(null);

  /* initial loads */
  useEffect(() => {
    dispatch(getTypeAttendanceAbsences() as any);
    dispatch(getStatusAttendanceAbsences() as any);
  }, []);

  /* list on page change */
  useEffect(() => { fetchList(currentPage); }, [currentPage]);

  /* debounced filter */
  useEffect(() => {
    const t = setTimeout(() => { setCurrentPage(1); fetchList(1); }, 350);
    return () => clearTimeout(t);
  }, [searchFilter, statusFilter, absenceFilter]);

  /* sync list redux → local */
  useEffect(() => {
    if (listAttendanceManagerAbsences?.data) {
      setItems(listAttendanceManagerAbsences.data);
      if (listAttendanceManagerAbsences.pagination)
        setPagination(listAttendanceManagerAbsences.pagination);
    }
  }, [listAttendanceManagerAbsences]);

  /* sync detail redux → local */
  useEffect(() => {
    if (!detailListAttendanceManagerAbsences) return;
    const data = detailListAttendanceManagerAbsences;
    setDetailItem(Array.isArray(data) ? (data[0] ?? null) : (data ?? null));
  }, [detailListAttendanceManagerAbsences]);

  const fetchList = (page: number) => {
    const token = localStorage.getItem("userToken");
    dispatch(getListAttendanceManagerAbsences({
      token, page,
      search:     searchFilter  || undefined,
      status:     statusFilter  !== "all" ? statusFilter  : undefined,
      absence_id: absenceFilter !== "all" ? absenceFilter : undefined,
      key: "listAttendanceManagerAbsences",
    }) as any);
  };

  const handleViewDetail = (id: string) => {
    setDetailItem(null);
    setShowDetail(true);
    const token = localStorage.getItem("userToken");
    dispatch(getListAttendanceManagerAbsences({
      token, id,
      key: "detailListAttendanceManagerAbsences",
    }) as any);
  };

  const handleApprove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (actionLoading) return;
    const token = localStorage.getItem("userToken");
    setActionLoading({ id, type: "approve" });
    try {
        const res = await dispatch(approveAttendanceAbsences({ id, token }) as any);
        if(res.payload.data.success){
            toast.success(res.payload.data.message)
            fetchList(currentPage);

        }else{
            toast.success(res.payload.data.message)
        }
      
    } finally { setActionLoading(null); }
  };

  const handleReject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (actionLoading) return;
    const token = localStorage.getItem("userToken");
    setActionLoading({ id, type: "reject" });
    try {
      const res = await dispatch(rejectAttendanceAbsences({ id, token }) as any);
        if(res.payload.data.success){
            toast.success(res.payload.data.message)
            fetchList(currentPage);

        }else{
            toast.success(res.payload.data.message)
        }
    } finally { setActionLoading(null); }
  };

  const statusColor  = (id: number) => STATUS_COLORS[id]  ?? STATUS_COLORS[1];
  const absenceColor = (id: number) => ABSENCE_COLORS[id] ?? "text-slate-400";

  const activeFilterCount = [
    statusFilter  !== "all" ? statusFilter  : "",
    absenceFilter !== "all" ? absenceFilter : "",
  ].filter(Boolean).length;

  const renderPages = () => {
    const { totalPages } = pagination;
    const pages: React.ReactNode[] = [];
    const add = (i: number) => pages.push(
      <PaginationItem key={i}>
        <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink>
      </PaginationItem>
    );
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) add(i);
    } else {
      add(1);
      if (currentPage > 3) pages.push(<PaginationItem key="e1"><PaginationEllipsis /></PaginationItem>);
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) add(i);
      if (currentPage < totalPages - 2) pages.push(<PaginationItem key="e2"><PaginationEllipsis /></PaginationItem>);
      add(totalPages);
    }
    return pages;
  };

  const renderDetailBody = (item: AbsenceItem) => {
    const sc = statusColor(item.status.id);
    return (
      <div className="space-y-4">
        {/* employee */}
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
          {item.employee.avatar ? (
            <img src={item.employee.avatar} alt={item.employee.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/40" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-sky-500/10 ring-2 ring-sky-500/30 flex items-center justify-center">
              <User className="text-sky-400" size={22} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{item.employee.name}</p>
            <p className={`text-xs font-medium ${absenceColor(item.absence.id)}`}>{item.absence.name}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {item.status.name}
          </div>
        </div>

        {/* time */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Bắt đầu", date: item.start_date, time: item.start_time },
            { label: "Kết thúc", date: item.end_date,  time: item.end_time   },
          ].map(({ label, date, time }) => (
            <div key={label} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1.5 font-medium">{label}</p>
              <p className="text-sm text-white font-semibold">{formatDate(date)}</p>
              <p className="text-xs text-sky-400 mt-0.5">{formatTime(time)}</p>
            </div>
          ))}
        </div>

        {/* reason */}
        <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1.5 font-medium flex items-center gap-1.5">
            <FileText size={12} /> Lý do
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">{item.reason}</p>
        </div>

        {/* address */}
        {item.address && (
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1.5 font-medium flex items-center gap-1.5">
              <MapPin size={12} /> Địa chỉ
            </p>
            <p className="text-sm text-slate-200">{item.address}</p>
          </div>
        )}

        {/* document */}
        {item.document && (
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2 font-medium">Tài liệu đính kèm</p>
            <a href={item.document} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sky-400 text-sm hover:underline">
              <FileText size={14} /> Xem tài liệu
            </a>
          </div>
        )}

        {/* approve/reject in modal */}
        {item.status.id === 1 && (
          <div className="flex gap-3 pt-1">
            <button onClick={(e) => handleApprove(e, item.id)} disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {actionLoading?.id === item.id && actionLoading.type === "approve" ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Duyệt
            </button>
            <button onClick={(e) => handleReject(e, item.id)} disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {actionLoading?.id === item.id && actionLoading.type === "reject" ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
              Từ chối
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="px-4">
        {/* filter bar */}
        <div className="mb-4 space-y-2">
          <button
            onClick={() => setShowFilter(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-gray-700 hover:bg-slate-200 transition-colors"
          >
            {showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            <ChevronDown size={14} className={`transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`} />
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className={`transition-all duration-200 ease-in-out overflow-hidden ${showFilter ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
              <div className="flex flex-wrap gap-3">
                {/* Loại đơn */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Loại đơn</label>
                  <Select value={absenceFilter} onValueChange={setAbsenceFilter}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm h-9 min-w-[120px]">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">Tất cả</SelectItem>
                      {Array.isArray(listTypeAttendanceAbsences) && listTypeAttendanceAbsences.map((t: any) => (
                        <SelectItem key={t.id} value={String(t.id)} className="text-sm">{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trạng thái */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Trạng thái</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm h-9 min-w-[120px]">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-sm">Tất cả</SelectItem>
                      {Array.isArray(listStatusAttendanceAbsences) && listStatusAttendanceAbsences.map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)} className="text-sm">{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Tìm tên nhân viên, lý do..."
                  className="w-full rounded-lg bg-white border border-gray-300 pl-9 pr-8 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                {searchFilter && (
                  <button onClick={() => setSearchFilter("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {activeFilterCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => { setStatusFilter("all"); setAbsenceFilter("all"); }}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} /> Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* total count */}
        <p className="text-xs text-gray-500 mb-3">
          Tổng: <span className="font-semibold text-gray-800">{pagination.total}</span> đơn
        </p>

        {/* content */}
        {loadingListAttendanceManagerAbsences && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Đang tải...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-gray-100">
            <ClipboardList className="text-gray-300 mb-2" size={40} />
            <p className="text-sm text-gray-400">Không có đơn nào</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              {items.map(item => {
                const sc = statusColor(item.status.id);
                const isPending = item.status.id === 1;
                const isApproving = actionLoading?.id === item.id && actionLoading.type === "approve";
                const isRejecting = actionLoading?.id === item.id && actionLoading.type === "reject";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleViewDetail(item.id)}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    {/* top row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        {item.employee.avatar ? (
                          <img src={item.employee.avatar} alt={item.employee.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-50 ring-2 ring-blue-100 flex items-center justify-center">
                            <User className="text-blue-400" size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">{item.employee.name}</p>
                        <span className={`text-xs font-medium ${absenceColor(item.absence.id)}`}>{item.absence.name}</span>
                      </div>

                      {isPending ? (
                        <div className="flex-shrink-0 flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleApprove(e, item.id)}
                            disabled={!!actionLoading}
                            title="Duyệt đơn"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isApproving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            <span className="hidden sm:inline">Duyệt</span>
                          </button>
                          <button
                            onClick={(e) => handleReject(e, item.id)}
                            disabled={!!actionLoading}
                            title="Từ chối đơn"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRejecting ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
                            <span className="hidden sm:inline">Từ chối</span>
                          </button>
                        </div>
                      ) : (
                        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {item.status.name}
                        </div>
                      )}
                    </div>

                    {/* time */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { label: "Từ",  date: item.start_date, time: item.start_time },
                        { label: "Đến", date: item.end_date,   time: item.end_time   },
                      ].map(({ label, date, time }) => (
                        <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                          <Calendar className="text-gray-400 flex-shrink-0" size={13} />
                          <div>
                            <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
                            <p className="text-xs text-gray-800 font-medium">{formatDate(date)}</p>
                            <p className="text-xs text-gray-500">{formatTime(time)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* reason */}
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-2">
                      <div className="flex items-start gap-2">
                        <FileText className="text-gray-400 mt-0.5 flex-shrink-0" size={12} />
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{item.reason}</p>
                      </div>
                    </div>

                    {/* address */}
                    {item.address && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
                        <MapPin size={11} className="flex-shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                  {renderPages()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                      className={`cursor-pointer ${currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 m-0"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <ClipboardList className="text-sky-400" size={18} />
                </div>
                <h2 className="text-white font-bold text-base">Chi tiết đơn</h2>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#3b82f6 #1e293b" }}>
              {loadingDetailListAttendanceManagerAbsences || !detailItem ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="text-sky-400 animate-spin" size={32} />
                </div>
              ) : (
                renderDetailBody(detailItem)
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────── */
type LetterTab = "my_letters" | "approval";

export function EmployeeLettersSection() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<LetterTab>("my_letters");
  const { permission } = useProfileData();

  /* load my letters on mount */
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const payload: any = { token };
    if (token) dispatch(getListEmployeeLetter(payload) as any);
  }, [dispatch]);

  /* load approval data when switching to approval tab */
  useEffect(() => {
    if (activeTab === "approval") {
      dispatch(getTypeAttendanceAbsences() as any);
      dispatch(getStatusAttendanceAbsences() as any);
    }
  }, [activeTab, dispatch]);

  const allTabs: { key: LetterTab; label: string; icon: React.ReactNode; requirePermission?: boolean }[] = [
    {
      key: "my_letters",
      label: "Đơn từ của tôi",
      icon: <FilePlus size={14} className="flex-shrink-0" />,
    },
    {
      key: "approval",
      label: "Duyệt đơn",
      icon: <ClipboardList size={14} className="flex-shrink-0" />,
      requirePermission: true,
    },
  ];

  const visibleTabs = allTabs.filter((t) => !t.requirePermission || permission);

  /* nếu tab đang active bị ẩn đi (mất permission), reset về my_letters */
  useEffect(() => {
    if (!visibleTabs.find((t) => t.key === activeTab)) {
      setActiveTab("my_letters");
    }
  }, [permission]);

  return (
    <div className="flex-shrink-0">
      {/* Section header */}
      <div className="px-4 flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full bg-blue-600" />
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Đơn từ</h2>
      </div>

      {/* Tab switcher — chỉ render nếu có > 1 tab */}
      {visibleTabs.length > 1 && (
        <div className="px-4 mb-4">
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {visibleTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: activeTab === t.key ? "#111827" : "#fff",
                  color:      activeTab === t.key ? "#fff"    : "#6b7280",
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab content */}
      {activeTab === "my_letters" && <MyLettersTab />}
      {activeTab === "approval" && permission && <ApprovalTab />}
    </div>
  );
}