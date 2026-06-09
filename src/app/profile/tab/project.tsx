import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  Calendar, Briefcase, Award, TrendingUp, Users,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPersonalProjects, listProjects } from "@/src/services/api";
import { useProfileData } from "@/src/hooks/profileHook";

interface ProjectsTab {
  userInfo: any;
}

interface PersonalProject {
  cursor_id: number;
  id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: string;
  project_manager: { id: number | null; name: string | null };
  status: { id: number | null; name: string | null };
  total_tasks: string;
  completed_tasks: string;
  in_progress_tasks: string;
  pending_tasks: string;
}

function ProjectsTab({ userInfo }: ProjectsTab) {
  const dispatch = useDispatch();
  const { projects } = useProfileData();

  // ── Infinite scroll state ──
  const [personalList, setPersonalList] = useState<PersonalProject[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const isFetchingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Initial fetch ──
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    dispatch(listProjects(token as any) as any);

    setIsInitialLoading(true);
    (dispatch(listPersonalProjects({ token, cursor: undefined }) as any))
      .then((res: any) => {
        const data: PersonalProject[] = res?.payload?.data?.data ?? [];
        const pagination = res?.payload?.data?.pagination;
        setPersonalList(data);
        setNextCursor(pagination?.has_more ? pagination?.next_cursor : null);
        setHasMore(pagination?.has_more ?? false);
      })
      .finally(() => setIsInitialLoading(false));
  }, [dispatch]);

  // ── Load more ──
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || nextCursor === null) return;
    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const token = localStorage.getItem("userToken");
    try {
      const res = await (dispatch(
        listPersonalProjects({ token, cursor: nextCursor }) as any
      ));
      const data: PersonalProject[] = res?.payload?.data?.data ?? [];
      const pagination = res?.payload?.data?.pagination;

      setPersonalList(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        return [...prev, ...data.filter(p => !existingIds.has(p.id))];
      });
      setNextCursor(pagination?.has_more ? pagination?.next_cursor : null);
      setHasMore(pagination?.has_more ?? false);
    } finally {
      isFetchingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [dispatch, hasMore, nextCursor]);

  // ── Scroll handler ──
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  };

  // ── Helpers ──
  const projectStats = [
    {
      skill: projects?.rada_chart?.pending?.name || "Đang thực hiện",
      value: projects?.rada_chart?.pending?.count || 0,
      fullMark: parseInt(projects?.max_value_chart || "100"),
    },
    {
      skill: projects?.rada_chart?.success?.name || "Tạm dừng",
      value: projects?.rada_chart?.success?.count || 0,
      fullMark: parseInt(projects?.max_value_chart || "100"),
    },
    {
      skill: projects?.rada_chart?.stoping?.name || "Hoàn thành",
      value: projects?.rada_chart?.stoping?.count || 0,
      fullMark: parseInt(projects?.max_value_chart || "100"),
    },
  ];

  const getStatusBadge = (statusId: number | null) => {
    switch (statusId) {
      case 4:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={10} /> Hoàn thành
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={10} /> Đang thực hiện
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <AlertCircle size={10} /> Tạm dừng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">
            Chưa xác định
          </span>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatBudget = (budget: string) => {
    const num = parseFloat(budget);
    if (!num || num === 0) return "Chưa xác định";
    return `${(num / 1_000_000).toFixed(0)}M VNĐ`;
  };


  return (
    <div className="space-y-6">
      {!projects || !projects.rada_chart ? (
        <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Radar Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Tình trạng dự án</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={projectStats}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, parseInt(projects?.max_value_chart || "100")]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Radar name="Dự án" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {projectStats.map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className={`h-2.5 w-2.5 rounded-full mx-auto mb-2 ${
                      stat.skill === "Hoàn thành" ? "bg-green-500"
                      : stat.skill === "Đang thực hiện" ? "bg-blue-500"
                      : "bg-yellow-500"
                    }`} />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.skill}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Hiệu suất (6 tháng)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={projects?.performance_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" domain={[0, parseInt(projects?.max_value_chart || "100")]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="scores" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Personal Projects List ── */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-blue-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Dự án cá nhân</h3>
                {!isInitialLoading && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                    {personalList.length}{hasMore ? "+" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable list */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="overflow-y-auto max-h-[520px] divide-y divide-slate-800 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
            >
              {isInitialLoading ? (
                /* Skeleton */
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 p-4 rounded-lg bg-slate-800/40">
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-700 rounded w-2/5" />
                        <div className="h-2.5 bg-slate-700/60 rounded w-3/5" />
                        <div className="h-2 bg-slate-700/40 rounded w-1/2" />
                      </div>
                      <div className="h-6 w-24 bg-slate-700 rounded-full self-start" />
                    </div>
                  ))}
                </div>
              ) : personalList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Briefcase size={32} className="text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">Chưa có dự án cá nhân</p>
                </div>
              ) : (
                <>
                  {personalList.map((project) => {

                    return (
                      <div
                        key={project.id}
                        className="px-4 sm:px-6 py-4 hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Name + status */}
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-semibold text-white truncate max-w-xs">
                                {project.name}
                              </p>
                              {getStatusBadge(project.status.id)}
                            </div>

                            {/* Description */}
                            {project.description && (
                              <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                                {project.description}
                              </p>
                            )}

                            {/* Meta row */}
                            <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500">
                              {(project.start_date || project.end_date) && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={10} />
                                  {formatDate(project.start_date)} → {formatDate(project.end_date)}
                                </span>
                              )}
                              {project.project_manager.name && (
                                <span className="flex items-center gap-1">
                                  <Users size={10} />
                                  {project.project_manager.name}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Briefcase size={10} />
                                Ngân sách: {formatBudget(project.budget)}
                              </span>
                            </div>

                            {/* Task count chips */}
                            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                                Tổng: <span className="text-white font-semibold ml-0.5">{project.total_tasks}</span>
                              </span>
                              {parseInt(project.completed_tasks) > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px]">
                                  <CheckCircle2 size={9} /> {project.completed_tasks}
                                </span>
                              )}
                              {parseInt(project.in_progress_tasks) > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                                  <Clock size={9} /> {project.in_progress_tasks}
                                </span>
                              )}
                              {parseInt(project.pending_tasks) > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 text-[10px]">
                                  <AlertCircle size={9} /> {project.pending_tasks}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading more spinner */}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-4 gap-2">
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-xs text-slate-400">Đang tải thêm...</span>
                    </div>
                  )}

                  {/* End of list */}
                  {!hasMore && personalList.length > 0 && (
                    <div className="py-4 text-center">
                      <p className="text-xs text-slate-500">Đã hiển thị tất cả {personalList.length} dự án</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsTab;