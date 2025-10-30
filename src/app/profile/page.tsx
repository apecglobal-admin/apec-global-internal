"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  FileText,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

export default function ProfilePage() {
  const mockData = {
    skills: [
      { skill: "Quản lý dự án", value: 95, fullMark: 100 },
      { skill: "Phát triển phần mềm", value: 85, fullMark: 100 },
      { skill: "Phân tích dữ liệu", value: 80, fullMark: 100 },
      { skill: "Thiết kế UI/UX", value: 70, fullMark: 100 },
      { skill: "Marketing", value: 65, fullMark: 100 },
    ],
    projectStats: [
      { skill: "Hoàn thành", value: 45, fullMark: 50 },
      { skill: "Đang thực hiện", value: 12, fullMark: 50 },
      { skill: "Tạm dừng", value: 3, fullMark: 50 },
    ],
    performance: [
      { month: "T1", score: 85 },
      { month: "T2", score: 88 },
      { month: "T3", score: 92 },
      { month: "T4", score: 90 },
      { month: "T5", score: 95 },
      { month: "T6", score: 93 },
    ],
    achievements: [
      {
        title: "Nhân viên xuất sắc Q1 2024",
        icon: Award,
        color: "bg-yellow-500",
      },
      { title: "Hoàn thành 50+ dự án", icon: Target, color: "bg-blue-500" },
      { title: "Leader của năm", icon: Users, color: "bg-purple-500" },
      { title: "Chứng chỉ PMP", icon: FileText, color: "bg-green-500" },
    ],
    projects: [
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
        name: "AI Chatbot Integration",
        client: "Smart Solutions Corp",
        status: "in-progress",
        progress: 45,
        startDate: "01/03/2024",
        endDate: "15/05/2024",
        team: 6,
        budget: "350M VNĐ",
      },
      {
        name: "Cloud Migration Project",
        client: "Enterprise Global",
        status: "paused",
        progress: 30,
        startDate: "15/01/2024",
        endDate: "30/06/2024",
        team: 10,
        budget: "1.2B VNĐ",
      },
      {
        name: "CRM System Upgrade",
        client: "Sales Force Asia",
        status: "completed",
        progress: 100,
        startDate: "01/11/2023",
        endDate: "28/02/2024",
        team: 7,
        budget: "450M VNĐ",
      },
    ],
  };

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
    <div className="min-h-screen bg-slate-950 p-3 sm:p-6 lg:p-8">
      <Header />
      <div className="mt-5 mx-auto max-w-7xl mb-5">
        {/* Header Profile */}
        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Side: Avatar & Info */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/3">
              <div className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border-4 border-blue-600 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl sm:text-5xl lg:text-6xl font-bold text-white shadow-lg shadow-blue-500/50">
                NT
              </div>
              
              <div className="mt-6 w-full">
                <div className="text-center lg:text-left mb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    Nguyễn Văn Tâm
                  </h1>
                  <p className="text-base sm:text-lg text-blue-400 font-semibold mb-4">
                    Senior Project Manager
                  </p>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300">
                      <Mail size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm break-all">tam.nguyen@apecglobal.com</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300">
                      <Phone size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">+84 901 234 567</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300">
                      <MapPin size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">TP. Hồ Chí Minh, Việt Nam</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300">
                      <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Gia nhập: 15/03/2020</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">
                    Chỉnh sửa
                  </button>
                  <button className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:border-blue-500 hover:text-white transition">
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Skills Radar Chart */}
            <div className="flex-1 lg:w-2/3">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Kỹ năng chuyên môn
              </h3>
              <ResponsiveContainer width="100%" height={300} className="sm:hidden">
                <RadarChart data={mockData.skills}>
                  <PolarGrid stroke="#475569" strokeWidth={1.5} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#cbd5e1", fontSize: 10, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Kỹ năng"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.7}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                    labelStyle={{
                      color: "#e2e8f0",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#60a5fa", fontSize: "12px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
                <RadarChart data={mockData.skills}>
                  <PolarGrid stroke="#475569" strokeWidth={1.5} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#cbd5e1", fontSize: 14, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Kỹ năng"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.7}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                    labelStyle={{
                      color: "#e2e8f0",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                    itemStyle={{ color: "#60a5fa" }}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Skills Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {mockData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-slate-950/50"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-slate-300 font-medium flex-1">
                      {skill.skill}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-blue-400">
                      {skill.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="text-blue-500" size={20} />
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Dự án
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">60</div>
            <div className="text-xs text-green-400">
              +12% tháng trước
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-purple-500" size={20} />
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Hiệu suất
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">93%</div>
            <div className="text-xs text-green-400">+5% tháng trước</div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-pink-500" size={20} />
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Đội nhóm
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">24</div>
            <div className="text-xs text-slate-400">Thành viên</div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-yellow-500" size={20} />
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Thành tích
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">18</div>
            <div className="text-xs text-slate-400">Giải thưởng</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Project Stats Chart */}
          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Tình trạng dự án
            </h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                <RadarChart data={mockData.projectStats}>
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
              <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                <RadarChart data={mockData.projectStats}>
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
              <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full mx-auto mb-2 bg-green-500"></div>
                <div className="text-xl sm:text-2xl font-bold text-white">45</div>
                <div className="text-xs text-slate-400">Hoàn thành</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full mx-auto mb-2 bg-blue-500"></div>
                <div className="text-xl sm:text-2xl font-bold text-white">12</div>
                <div className="text-xs text-slate-400">Đang làm</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full mx-auto mb-2 bg-yellow-500"></div>
                <div className="text-xl sm:text-2xl font-bold text-white">3</div>
                <div className="text-xs text-slate-400">Tạm dừng</div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Hiệu suất (6 tháng)
            </h3>
            <ResponsiveContainer width="100%" height={250} className="sm:hidden">
              <BarChart data={mockData.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
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
            <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
              <BarChart data={mockData.performance}>
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

        {/* Projects List */}
        <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Dự án gần đây
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {mockData.projects.map((project, index) => (
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
                    <span className="text-xs sm:text-sm text-slate-400">
                      Tiến độ
                    </span>
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
                    <Calendar size={14} className="text-slate-500 flex-shrink-0" />
                    <span>{project.startDate} - {project.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={14} className="text-slate-500 flex-shrink-0" />
                    <span>{project.team} thành viên</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 col-span-2">
                    <Briefcase size={14} className="text-slate-500 flex-shrink-0" />
                    <span>Ngân sách: {project.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Thành tích nổi bật
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {mockData.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 rounded-lg border border-slate-800 bg-slate-950 p-3 sm:p-4 hover:border-blue-500 transition"
                >
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${achievement.color} flex-shrink-0`}
                  >
                    <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                      {achievement.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}