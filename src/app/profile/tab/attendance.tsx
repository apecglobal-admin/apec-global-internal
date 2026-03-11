import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAttendanceData } from '@/src/hooks/attendanceHook';
import { getTypeAttendanceAbsences, getStatusAttendanceAbsences, getListAttendanceManagerAbsences } from '@/src/features/attendance/api';
import {
  Calendar, Clock, MapPin, FileText, User, Search, X,
  ClipboardList, Filter, Eye, Loader2,
  ChevronDown
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

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

const STATUS_COLORS: Record<number, { bg: string; text: string; border: string; dot: string }> = {
  1: { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30',   dot: 'bg-amber-400'   },
  2: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  3: { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/30',     dot: 'bg-red-400'     },
};

const ABSENCE_COLORS: Record<number, string> = {
  1: 'text-sky-400',
  2: 'text-violet-400',
  3: 'text-teal-400',
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatTime = (t: string) => t?.slice(0, 5) ?? '';

const Attendance = () => {
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

  // filters
  const [searchFilter, setSearchFilter]   = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [absenceFilter, setAbsenceFilter] = useState('all');

  // detail modal
  const [detailItem, setDetailItem]   = useState<AbsenceItem | null>(null);
  const [showDetail, setShowDetail]   = useState(false);
  const [showFilter, setShowFilter]   = useState(false);

  /* ── initial loads ── */
  useEffect(() => {
    dispatch(getTypeAttendanceAbsences() as any);
    dispatch(getStatusAttendanceAbsences() as any);
  }, []);

  /* ── list load on page change ── */
  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage]);

  /* ── debounced filter → reset to page 1 ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchList(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchFilter, statusFilter, absenceFilter]);

  /* ── sync list redux → local ── */
  useEffect(() => {
    if (listAttendanceManagerAbsences?.data) {
      setItems(listAttendanceManagerAbsences.data);
      if (listAttendanceManagerAbsences.pagination)
        setPagination(listAttendanceManagerAbsences.pagination);
    }
  }, [listAttendanceManagerAbsences]);

  /* ── sync detail redux → local ── */
  useEffect(() => {
    if (!detailListAttendanceManagerAbsences) return;
    const data = detailListAttendanceManagerAbsences;
    setDetailItem(Array.isArray(data) ? (data[0] ?? null) : (data ?? null));
  }, [detailListAttendanceManagerAbsences]);

  const fetchList = (page: number) => {
    const token = localStorage.getItem('userToken');
    dispatch(getListAttendanceManagerAbsences({
      token,
      page,
      search:     searchFilter  || undefined,
      status:     statusFilter  !== 'all' ? statusFilter  : undefined,
      absence_id: absenceFilter !== 'all' ? absenceFilter : undefined,
      key: 'listAttendanceManagerAbsences',
    }) as any);
  };

  const handleViewDetail = (id: string) => {
    setDetailItem(null);
    setShowDetail(true);
    const token = localStorage.getItem('userToken');
    dispatch(getListAttendanceManagerAbsences({
      token,
      id,
      key: 'detailListAttendanceManagerAbsences',
    }) as any);
  };

  /* ── helpers ── */
  const statusColor  = (id: number) => STATUS_COLORS[id]  ?? STATUS_COLORS[1];
  const absenceColor = (id: number) => ABSENCE_COLORS[id] ?? 'text-slate-400';

  // Count active filters (excluding search, since it's always visible)
  const activeFilterCount = [
    statusFilter  !== 'all' ? statusFilter  : '',
    absenceFilter !== 'all' ? absenceFilter : '',
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

  /* ── shared card renderer for both list & detail ── */
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
            { label: 'Bắt đầu', date: item.start_date, time: item.start_time },
            { label: 'Kết thúc', date: item.end_date,   time: item.end_time   },
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
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <ClipboardList className="text-sky-400" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý đơn từ</h1>
              </div>
              <p className="text-slate-400 text-sm ml-14">
                Tổng: <span className="text-white font-semibold">{pagination.total}</span> đơn
              </p>
            </div>
          </div>

          {/* ── Filter bar ── */}
          <div className="mb-6 space-y-2">

            {/* Toggle button */}
            <button
              onClick={() => setShowFilter(p => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium text-white hover:bg-slate-700/70 transition-colors"
            >
              {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Collapsible panel */}
            <div
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                showFilter ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                {/* Selects row */}
                <div className="flex flex-wrap gap-3">
                  {/* Loại đơn */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Loại đơn</label>
                    <Select value={absenceFilter} onValueChange={setAbsenceFilter}>
                      <SelectTrigger className="bg-slate-900/80 border-slate-700 text-white text-sm h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white text-sm">Tất cả</SelectItem>
                        {Array.isArray(listTypeAttendanceAbsences) && listTypeAttendanceAbsences.map((t: any) => (
                          <SelectItem key={t.id} value={String(t.id)} className="text-white text-sm">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Trạng thái */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Trạng thái</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-900/80 border-slate-700 text-white text-sm h-9">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white text-sm">Tất cả</SelectItem>
                        {Array.isArray(listStatusAttendanceAbsences) && listStatusAttendanceAbsences.map((s: any) => (
                          <SelectItem key={s.id} value={String(s.id)} className="text-white text-sm">{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    placeholder="Tìm kiếm tên nhân viên, lý do..."
                    className="w-full rounded-lg bg-slate-900/80 border border-slate-700 pl-9 pr-8 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Reset */}
                {activeFilterCount > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setStatusFilter('all'); setAbsenceFilter('all'); }}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={12} /> Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          {loadingListAttendanceManagerAbsences && items.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-slate-600 border-t-sky-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Đang tải...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-800/40 rounded-xl border border-slate-700">
              <ClipboardList className="text-slate-600 mb-3" size={52} />
              <p className="text-slate-400">Không có đơn nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {items.map(item => {
                  const sc = statusColor(item.status.id);
                  return (
                    <div key={item.id}
                        onClick={() => handleViewDetail(item.id)}
                        className="group bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-sky-500/40 hover:bg-slate-800/80 transition-all shadow-lg cursor-pointer"
                    >
                      {/* top row */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          {item.employee.avatar ? (
                            <img src={item.employee.avatar} alt={item.employee.name}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-500/40" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-sky-500/10 ring-2 ring-sky-500/30 flex items-center justify-center">
                              <User className="text-sky-400" size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">{item.employee.name}</h3>
                          <span className={`text-xs font-medium ${absenceColor(item.absence.id)}`}>{item.absence.name}</span>
                        </div>
                        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {item.status.name}
                        </div>
                      </div>

                      {/* time */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: 'Từ', date: item.start_date, time: item.start_time },
                          { label: 'Đến', date: item.end_date,   time: item.end_time   },
                        ].map(({ label, date, time }) => (
                          <div key={label} className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2.5">
                            <Calendar className="text-slate-500 flex-shrink-0" size={14} />
                            <div>
                              <p className="text-xs text-slate-500 leading-none mb-0.5">{label}</p>
                              <p className="text-xs text-white font-medium">{formatDate(date)}</p>
                              <p className="text-xs text-slate-400">{formatTime(time)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* reason */}
                      <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg px-3 py-2 mb-3">
                        <div className="flex items-start gap-2">
                          <FileText className="text-slate-500 mt-0.5 flex-shrink-0" size={13} />
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.reason}</p>
                        </div>
                      </div>

                      {/* address + view btn */}
                      <div className="flex items-center justify-between gap-2">
                        {item.address ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                            <MapPin size={12} className="flex-shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        ) : <div />}

                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>
                    {renderPages()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                        className={`cursor-pointer ${currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 m-0"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* modal header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <ClipboardList className="text-sky-400" size={18} />
                </div>
                <h2 className="text-white font-bold text-base">Chi tiết đơn</h2>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* modal body */}
            <div className="p-5 overflow-y-auto flex-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e293b' }}>
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
};

export default Attendance;