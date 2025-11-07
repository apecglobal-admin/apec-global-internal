import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProjects } from "@/src/services/api";

function ProjectsTab({ userInfo }: any) {
  const dispatch = useDispatch();
  const { projects } = useSelector((state: any) => state.user);

  const [showRecentProjects, setShowRecentProjects] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(listProjects(token as any) as any);
    }
  }, [dispatch]);

  // Tạo projectStats từ rada_chart trong projects
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

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 4: // Hoàn thành
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={12} />
            Hoàn thành
          </span>
        );
      case 2: // Đang thực hiện
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            Đang thực hiện
          </span>
        );
      case 3: // Tạm dừng
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <AlertCircle size={12} />
            Tạm dừng
          </span>
        );
      default:
        return null;
    }
  };

  // Format date từ ISO string hoặc string format YYYY-MM-DD sang dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format budget
  const formatBudget = (budget: number) => {
    if (!budget || budget === 0) return "Chưa xác định";
    return `${(budget / 1000000).toFixed(0)}M VNĐ`;
  };

  return (
    <div className="space-y-6">
      {/* Hiển thị loading hoặc no data message nếu không có dữ liệu */}
      {!projects || !projects.rada_chart ? (
        <div className="text-center py-10 text-slate-400">
          Đang tải dữ liệu...
        </div>
      ) : !showRecentProjects ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Radar Chart - Tình trạng dự án */}
            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Tình trạng dự án
                </h3>
                <button
                  onClick={() => setShowRecentProjects(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  Chi tiết
                </button>
              </div>
              <div className="flex justify-center">
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  className="sm:hidden"
                >
                  <RadarChart data={projectStats}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, parseInt(projects?.max_value_chart || "100")]}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Radar
                      name="Dự án"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  className="hidden sm:block"
                >
                  <RadarChart data={projectStats}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#94a3b8", fontSize: 14 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, parseInt(projects?.max_value_chart || "100")]}
                      tick={{ fill: "#64748b" }}
                    />
                    <Radar
                      name="Dự án"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {projectStats.map((stat: any, index: any) => (
                  <div
                    key={index}
                    className="text-center p-3 sm:p-4 rounded-lg bg-slate-950 border border-slate-800"
                  >
                    <div
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full mx-auto mb-2 ${
                        stat.skill === "Hoàn thành"
                          ? "bg-green-500"
                          : stat.skill === "Đang thực hiện"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400">{stat.skill}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart - Hiệu suất */}
            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Hiệu suất (6 tháng)
              </h3>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:hidden"
              >
                <BarChart data={projects?.performance_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 11 }}
                    domain={[0, parseInt(projects?.max_value_chart || "100")]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="scores" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer
                width="100%"
                height={300}
                className="hidden sm:block"
              >
                <BarChart data={projects?.performance_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis 
                    stroke="#94a3b8"
                    domain={[0, parseInt(projects?.max_value_chart || "100")]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="scores" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Chi tiết dự án */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Dự án gần đây
              </h3>
              <button
                onClick={() => setShowRecentProjects(false)}
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                ← Quay lại
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {projects?.project_list?.length > 0 ? (
                projects.project_list.map((projectItem: any) => (
                  <div
                    key={projectItem.id}
                    className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 hover:border-blue-500/50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                          {projectItem.project.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {projectItem.project.client_name
                            ? `Khách hàng: ${projectItem.project.client_name}`
                            : projectItem.project.description}
                        </p>
                      </div>
                      {getStatusBadge(projectItem.project_status_id)}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-bold text-blue-400">
                          {projectItem.project.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                          style={{ width: `${projectItem.project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar
                          size={14}
                          className="text-slate-500 flex-shrink-0"
                        />
                        <span className="truncate">
                          {formatDate(projectItem.project.start_date)} -{" "}
                          {formatDate(projectItem.project.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users
                          size={14}
                          className="text-slate-500 flex-shrink-0"
                        />
                        <span>{projectItem.project.team_size} thành viên</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 col-span-2">
                        <Briefcase
                          size={14}
                          className="text-slate-500 flex-shrink-0"
                        />
                        <span>
                          Ngân sách: {formatBudget(projectItem.project.budget)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-10 text-slate-400">
                  Không có dự án nào
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsTab;