import { CheckCircle2, Clock, AlertCircle, XCircle, CalendarClock, Filter, RotateCcw, Search, X, Flame, AlarmClock } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useProfileData } from "@/src/hooks/profileHook";
import { useTaskData } from "@/src/hooks/taskhook";
import { PersonTask } from "@/src/services/interface";
import FilterableSelector from "@/components/FilterableSelector";
import { listPersonalProjects } from "@/src/services/api";
import { getListCompanyTask, getListProject } from "@/src/features/task/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProjectFilters {
  company_id: number | null;
  project_id: number | null;
  type: "all" | "personal" | null;
  search: string;
}

const TYPE_OPTIONS = [
  { id: "all", name: "Tất cả" },
  { id: "personal", name: "Cá nhân" },
];

// ─── Component ───────────────────────────────────────────────────────────────

function ProjectsTab() {
  const dispatch = useDispatch();
  const { personalProjects } = useProfileData();
  const { listCompanyTask, listProject } = useTaskData();

  const [filters, setFilters] = useState<ProjectFilters>({
    company_id: null,
    project_id: null,
    type: "personal",
    search: "",
  });

  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<any | null>(TYPE_OPTIONS[1]); // default: Cá nhân

  // ─── Pagination / infinite scroll state ─────────────────────────────────
  const [rows, setRows] = useState<PersonTask[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const sentinelRef = useRef<HTMLTableRowElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ─── Fetch ───────────────────────────────────────────────────────────────
  // append = false → fresh load (reset rows)
  // append = true  → load next page (concat rows)
  const fetchProjects = useCallback(
    async (overrides?: Partial<ProjectFilters>, append = false, nextCursor: string | null = null) => {
      if (isFetching) return;
      setIsFetching(true);

      const token = localStorage.getItem("userToken");
      const merged = { ...filters, ...overrides };

      const result = await dispatch(
        listPersonalProjects({
          token,
          ...(nextCursor && { cursor: nextCursor }),
          ...(merged.company_id != null && { company_id: merged.company_id }),
          ...(merged.project_id != null && { project_id: merged.project_id }),
          ...(merged.type != null && { type: merged.type }),
          ...(merged.search?.trim() && { search: merged.search.trim() }),
        }) as any
      );

      const payload = result?.payload?.data;
      if (payload) {
        const newRows: PersonTask[] = payload.data ?? [];
        const pagination = payload.pagination ?? {};

        setRows((prev) => (append ? [...prev, ...newRows] : newRows));
        setCursor(pagination.cursor ?? null);
        setHasMore(pagination.has_more ?? false);
      }

      setIsFetching(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, filters, isFetching]
  );

  // ─── Fresh fetch whenever filters change ─────────────────────────────────
  const resetAndFetch = useCallback(
    (overrides?: Partial<ProjectFilters>) => {
      setCursor(null);
      setRows([]);
      // small timeout so state flushes before fetch reads it
      setTimeout(() => fetchProjects(overrides, false, null), 0);
    },
    [fetchProjects]
  );

  // ─── Init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!listCompanyTask) dispatch(getListCompanyTask({ search: null }) as any);
    resetAndFetch();
  }, [dispatch]);

  // ─── IntersectionObserver for infinite scroll ────────────────────────────
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchProjects(undefined, true, cursor);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching, cursor, fetchProjects]);

  // ─── Filter handlers ──────────────────────────────────────────────────────
  const handleCompanyChange = (item: any) => {
    const company = item ?? null;
    setSelectedCompany(company);
    setSelectedProject(null);
    const companyId = company?.id ?? null;
    const next: ProjectFilters = { ...filters, company_id: companyId, project_id: null };
    setFilters(next);
    if (companyId) dispatch(getListProject({ companies: String(companyId) }) as any);
    resetAndFetch({ company_id: companyId, project_id: null });
  };

  const handleProjectChange = (item: any) => {
    const project = item ?? null;
    setSelectedProject(project);
    const projectId = project?.id ?? null;
    const next: ProjectFilters = { ...filters, project_id: projectId };
    setFilters(next);
    resetAndFetch({ project_id: projectId });
  };

  const handleTypeChange = (item: any) => {
    const t = item ?? null;
    setSelectedType(t);
    const type = t?.id ?? null;
    const next: ProjectFilters = { ...filters, type };
    setFilters(next);
    resetAndFetch({ type });
  };

  const handleSearchChange = (value: string) => {
    const next: ProjectFilters = { ...filters, search: value };
    setFilters(next);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => resetAndFetch({ search: value }), 400);
  };

  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedType(null);
    const reset: ProjectFilters = { company_id: null, project_id: null, type: null, search: "" };
    setFilters(reset);
    resetAndFetch(reset);
  };

  const hasActiveFilter = !!(
    filters.company_id || filters.project_id || filters.type || filters.search.trim()
  );

  // ─── UI helpers ──────────────────────────────────────────────────────────
  const getStatusBadge = (status: PersonTask["status"] | null) => {
    const id = status?.id ?? null;
    switch (id) {
      case 4:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30 whitespace-nowrap">
            <CheckCircle2 size={11} /> Hoàn thành
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 whitespace-nowrap">
            <Clock size={11} /> Đang thực hiện
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            <AlertCircle size={11} /> Tạm dừng
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30 whitespace-nowrap">
            <XCircle size={11} /> Đã huỷ
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 whitespace-nowrap">
            <CalendarClock size={11} /> Lên kế hoạch
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600 whitespace-nowrap">
            Chưa xác định
          </span>
        );
    }
  };

  const getBarColor = (statusId: number | null) => {
    switch (statusId) {
      case 4: return "bg-green-500";
      case 2: return "bg-blue-500";
      case 3: return "bg-amber-400";
      case 5: return "bg-red-500";
      case 1: return "bg-purple-400";
      default: return "bg-slate-500";
    }
  };

  const getRowBg = (project: PersonTask) => {
    if (project.is_overdue) return "bg-red-500/10 hover:bg-red-500/15";
    if (project.is_near_due) return "bg-orange-500/10 hover:bg-orange-500/15";
    return "hover:bg-slate-700/40";
  };

  const parsePercent = (process: string) => {
    const val = parseFloat(process);
    return isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* ── Filter bar ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Filter size={13} />
            <span>Lọc</span>
          </div>

          {/* Search */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm dự án..."
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-md text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            {filters.search && (
              <button onClick={() => handleSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                <X size={14} />
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-600 transition whitespace-nowrap ml-auto">
              <RotateCcw size={12} /> Xoá lọc
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Công ty */}
          <div className="flex-1 min-w-[160px] max-w-[220px]">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Công ty</label>
            <FilterableSelector
              data={listCompanyTask ?? []}
              multi={false}
              onFilter={(search) => dispatch(getListCompanyTask({ search: search || null }) as any)}
              onSelect={(item) => handleCompanyChange(Array.isArray(item) ? (item[0] ?? null) : item)}
              value={selectedCompany}
              placeholder="Tất cả công ty"
              displayField="name"
              emptyMessage="Không có công ty"
            />
          </div>

          {/* Dự án */}
          <div className="flex-1 min-w-[160px] max-w-[220px]">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Dự án
              {!selectedCompany && <span className="ml-1 normal-case text-slate-600 font-normal">(chọn công ty trước)</span>}
            </label>
            <div className={!selectedCompany ? "opacity-40 pointer-events-none" : ""}>
              <FilterableSelector
                data={listProject ?? []}
                multi={false}
                onFilter={(search) => dispatch(getListProject({ filter: search || null, companies: filters.company_id ? String(filters.company_id) : null }) as any)}
                onSelect={(item) => handleProjectChange(Array.isArray(item) ? (item[0] ?? null) : item)}
                value={selectedProject}
                placeholder="Tất cả dự án"
                displayField="name"
                emptyMessage="Không có dự án"
              />
            </div>
          </div>

          {/* Loại */}
          <div className="flex-1 min-w-[150px] max-w-[200px]">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Loại</label>
            <FilterableSelector
              data={TYPE_OPTIONS}
              multi={false}
              isSearch={false}
              onSelect={(item) => handleTypeChange(Array.isArray(item) ? (item[0] ?? null) : item)}
              value={selectedType}
              placeholder="Tất cả"
              displayField="name"
              emptyMessage=""
            />
          </div>
        </div>

        {/* Active tags */}
        {hasActiveFilter && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {selectedCompany && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-purple-500/15 text-purple-400 border border-purple-500/30">
                {selectedCompany.name}
                <button onClick={() => handleCompanyChange(null)} className="hover:text-white ml-0.5">×</button>
              </span>
            )}
            {selectedProject && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {selectedProject.name}
                <button onClick={() => handleProjectChange(null)} className="hover:text-white ml-0.5">×</button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-700 text-slate-300 border border-slate-600">
                {selectedType.name}
                <button onClick={() => handleTypeChange(null)} className="hover:text-white ml-0.5">×</button>
              </span>
            )}
            {filters.search.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-700 text-slate-300 border border-slate-600">
                "{filters.search.trim()}"
                <button onClick={() => handleSearchChange("")} className="hover:text-white ml-0.5">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="w-full rounded-xl border border-slate-700 bg-slate-800 shadow-sm overflow-hidden">
        <div
          className="overflow-x-auto overflow-y-auto overscroll-contain"
          style={{ maxHeight: "calc(100vh - 120px)", minHeight: "200px" }}
        >
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-800">
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 w-[22%]">Dự Án</th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Tổng<br />CV</th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Hoàn<br />Thành</th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Trễ<br />Hạn</th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Đang<br />Thực Hiện</th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Tạm<br />Dừng</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500 min-w-[280px]">Tiến Độ & Timeline</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">Trạng Thái</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && !isFetching ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 text-sm">
                    Không có dự án nào
                  </td>
                </tr>
              ) : (
                <>
                  {rows.map((project: PersonTask) => {
                    const pct = parsePercent(project.process);
                    const barColor = getBarColor(project.status?.id ?? null);

                    return (
                      <tr
                        key={project.id}
                        className={`border-b border-slate-700/60 transition-colors`}
                      >
                        {/* Name + alert badges */}
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap items-start gap-1.5 mb-1">
                            <p className="font-bold text-slate-100 text-[13px] leading-tight">{project.name}</p>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{project.description}</p>
                        </td>

                        <td className="px-3 py-4 text-center align-middle">
                          <p className="font-bold text-slate-200 text-[15px]">{project.total_tasks}</p>
                          <p className="text-[10px] text-slate-500">công việc</p>
                        </td>

                        <td className="px-3 py-4 text-center align-middle">
                          <span className="font-bold text-[15px] text-green-400">{project.completed_tasks}</span>
                        </td>

                        <td className="px-3 py-4 text-center align-middle">
                          <span className={`font-bold text-[15px] ${project.overdue_tasks > 0 ? "text-red-400" : "text-slate-600"}`}>
                            {project.overdue_tasks}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-center align-middle">
                          <span className={`font-bold text-[15px] ${project.in_progress_tasks > 0 ? "text-blue-400" : "text-slate-600"}`}>
                            {project.in_progress_tasks}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-center align-middle">
                          <span className={`font-bold text-[15px] ${project.paused_tasks > 0 ? "text-orange-400" : "text-slate-600"}`}>
                            {project.paused_tasks}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-middle min-w-[280px]">
                          {/* Progress bar tiến độ */}
                          <p className="text-[11px] font-bold text-white mb-1">{pct}%</p>
                          <div className="relative w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`absolute top-0 h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>

                          {/* Timeline bar thời gian */}
                          {(() => {
                            const start = project.start_date ? new Date(project.start_date).getTime() : null;
                            const end = project.end_date ? new Date(project.end_date).getTime() : null;
                            const now = Date.now();
                            let timePct = 0;
                            let isOverdue = false;
                            if (start && end && end > start) {
                              timePct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                              isOverdue = now > end;
                            }
                            const timeBarColor = isOverdue
                              ? "bg-red-500"
                              : timePct > 80
                              ? "bg-orange-400"
                              : "bg-slate-400";

                            return (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] text-white">Thời gian</span>
                                </div>
                                <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`absolute top-0 h-full rounded-full transition-all ${timeBarColor}`}
                                    style={{ width: `${Math.min(timePct, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-[10px] text-white">{project.start_date?.slice(0, 10) ?? "—"}</span>
                                  <span className="text-[10px] text-white">{project.end_date?.slice(0, 10) ?? "—"}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </td>

                        <td className="px-4 py-4 text-center align-middle">
                          {getStatusBadge(project.status)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* ── Sentinel row for IntersectionObserver ── */}
                  <tr ref={sentinelRef}>
                    <td colSpan={8} className="py-4 text-center">
                      {isFetching && (
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                          <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Đang tải thêm...
                        </div>
                      )}
                      {!hasMore && rows.length > 0 && !isFetching && (
                        <p className="text-[11px] text-slate-600">Đã hiển thị tất cả {rows.length} dự án</p>
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProjectsTab;