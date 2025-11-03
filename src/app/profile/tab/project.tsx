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
import { useState } from "react";
const mockPerformance = [
  { month: "T1", score: 85 },
  { month: "T2", score: 88 },
  { month: "T3", score: 92 },
  { month: "T4", score: 90 },
  { month: "T5", score: 95 },
  { month: "T6", score: 93 },
];

const mockProjects = [
  {
    name: "E-Commerce Platform Redesign",
    client: "TechMart Vietnam",
    status: "completed",
    progress: 100,
    startDate: "01/01/2024",
    endDate: "15/03/2024",
    team: 8,
    budget: "500M VNĐ",
  },
  {
    name: "Mobile Banking App",
    client: "VietBank Digital",
    status: "in-progress",
    progress: 75,
    startDate: "10/02/2024",
    endDate: "30/04/2024",
    team: 12,
    budget: "800M VNĐ",
  },
  {
    name: "CRM System Integration",
    client: "SalesForce VN",
    status: "completed",
    progress: 100,
    startDate: "15/12/2023",
    endDate: "28/02/2024",
    team: 6,
    budget: "350M VNĐ",
  },
  {
    name: "AI Chatbot Development",
    client: "CustomerCare Corp",
    status: "paused",
    progress: 45,
    startDate: "01/03/2024",
    endDate: "30/06/2024",
    team: 10,
    budget: "600M VNĐ",
  },
];

function ProjectsTab({ userInfo }: any) {
  const [showRecentProjects, setShowRecentProjects] = useState(false);

  const projectStats = userInfo.projects.project_status.map((status: any) => {
    let label = "";
    switch (status.id) {
      case 2:
        label = "Đang thực hiện";
        break;
      case 3:
        label = "Hoàn thành";
        break;
      case 4:
        label = "Tạm dừng";
        break;
      default:
        label = "Khác";
    }
    return {
      skill: label,
      value: status.count,
      fullMark: 50,
    };
  });

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={12} />
            Hoàn thành
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            Đang thực hiện
          </span>
        );
      case "paused":
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

  return (
    <div className="space-y-6">
      {!showRecentProjects ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="text-blue-500" size={20} />
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Dự án
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {userInfo.projects.total_projects}
              </div>
              <div className="text-xs text-slate-400">Tổng số dự án</div>
            </div>

            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-purple-500" size={20} />
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Thành viên
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {userInfo.projects.total_members_projects}
              </div>
              <div className="text-xs text-slate-400">Dự án tham gia</div>
            </div>

            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-pink-500" size={20} />
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Cấp độ
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {userInfo.level}
              </div>
              <div className="text-xs text-green-400">
                {userInfo.exp.toFixed(0)} XP
              </div>
            </div>

            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="text-yellow-500" size={20} />
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Chứng chỉ
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                1
              </div>
              <div className="text-xs text-slate-400">Đạt được</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                      domain={[0, 50]}
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
                      domain={[0, 50]}
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

            <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Hiệu suất (6 tháng)
              </h3>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:hidden"
              >
                <BarChart data={mockPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer
                width="100%"
                height={300}
                className="hidden sm:block"
              >
                <BarChart data={mockPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <>
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
              {mockProjects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 hover:border-blue-500/50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                        {project.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Khách hàng: {project.client}
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-bold text-blue-400">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar
                        size={14}
                        className="text-slate-500 flex-shrink-0"
                      />
                      <span>
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users
                        size={14}
                        className="text-slate-500 flex-shrink-0"
                      />
                      <span>{project.team} thành viên</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 col-span-2">
                      <Briefcase
                        size={14}
                        className="text-slate-500 flex-shrink-0"
                      />
                      <span>Ngân sách: {project.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsTab;
