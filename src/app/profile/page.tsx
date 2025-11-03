"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { fetchUserInfo } from "@/src/services/api";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.user);

  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("skills");
  const [showRecentProjects, setShowRecentProjects] = useState(false);

  const images = [
    userInfo?.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    userInfo?.second_avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    userInfo?.third_avatar_url || "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Transform API data to chart format
  const skillsData = userInfo?.skills?.map((skill: any) => ({
    skill: skill.name,
    value: parseFloat(skill.value),
    fullMark: 100
  })) || [];

  // Project statistics from API
  const projectStats = userInfo?.projects?.project_status?.map((status: any) => {
    let label = "";
    switch(status.id) {
      case 2: label = "Đang thực hiện"; break;
      case 3: label = "Hoàn thành"; break;
      case 4: label = "Tạm dừng"; break;
      default: label = "Khác";
    }
    return {
      skill: label,
      value: status.count,
      fullMark: 50
    };
  }) || [];

  // Mock performance data (since not available in API)
  const mockPerformance = [
    { month: "T1", score: 85 },
    { month: "T2", score: 88 },
    { month: "T3", score: 92 },
    { month: "T4", score: 90 },
    { month: "T5", score: 95 },
    { month: "T6", score: 93 },
  ];

  // Mock achievements (since not available in API)
  const mockAchievements = [
    { title: "Nhân viên xuất sắc Q1 2024", icon: Award, color: "bg-yellow-500" },
    { title: `Hoàn thành ${userInfo?.projects?.total_projects || 0} dự án`, icon: Target, color: "bg-blue-500" },
    { title: userInfo?.certificates?.certificate_name || "Chứng chỉ chuyên môn", icon: FileText, color: "bg-green-500" },
    { title: `Level ${userInfo?.level || 1}`, icon: TrendingUp, color: "bg-purple-500" },
  ];

  // Mock projects (since detailed project list not in API)
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
  ];

  // Calculate level progress
  const currentExp = parseFloat(userInfo?.exp || 0);
  const currentLevel = userInfo?.level || 1;
  const expForNextLevel = currentLevel * userInfo?.next_exp; // Example: 1000 XP per level
  const expProgress = (currentExp / expForNextLevel) * 100;
  const expRemaining = expForNextLevel - currentExp;

  // Format date
  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Get position name (you can map position_id to actual names)
  const getPositionName = (positionId: any) => {
    const positions = {
      5: "Senior Developer",
      // Add more position mappings
    };
    return positions[positionId] || "Nhân viên";
  };

  const getStatusBadge = (status : any) => {
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
    <div className="min-h-screen bg-slate-950 p-0">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="mt-0 mx-0 max-w-none mb-0">
        <div className="mb-0 rounded-none border-x-0 border-t-0 border border-slate-800 bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Side: Avatar & Info */}
            <div className="flex flex-row lg:flex-col items-start lg:items-start lg:w-1/4 rounded-xl border-2 border-slate-800 bg-slate-950/50 p-4 sm:p-5 gap-4">
              {/* Carousel Avatar */}
              <div className="relative w-32 sm:w-40 lg:w-full lg:max-w-xs flex-shrink-0">
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 lg:mx-auto border-4 shadow-lg overflow-hidden rounded">
                  <img
                    src={images[currentImage]}
                    alt={`Profile ${currentImage + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-900/90 hover:bg-slate-800 text-white p-1.5 lg:p-2 rounded-full border border-slate-700 hover:border-blue-500 transition"
                >
                  <ChevronLeft size={16} className="lg:hidden" />
                  <ChevronLeft size={20} className="hidden lg:block" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900/90 hover:bg-slate-800 text-white p-1.5 lg:p-2 rounded-full border border-slate-700 hover:border-blue-500 transition"
                >
                  <ChevronRight size={16} className="lg:hidden" />
                  <ChevronRight size={20} className="hidden lg:block" />
                </button>

                <div className="flex justify-center gap-2 mt-2 lg:mt-3">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full transition ${
                        currentImage === index
                          ? "bg-blue-500 w-4 lg:w-6"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 lg:mt-6 w-full">
                {/* Experience Bar - Desktop */}
                <div className="hidden lg:block mb-6 w-full max-w-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300">
                      Cấp độ {currentLevel}
                    </span>
                    <span className="text-xs font-medium text-blue-400">
                      {currentExp.toFixed(0)} / {expForNextLevel} XP
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                      style={{ width: `${expProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 text-center lg:text-left">
                    Còn {expRemaining.toFixed(0)} XP để lên cấp {currentLevel + 1}
                  </p>
                </div>

                <div className="text-left lg:text-left p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-slate-800 bg-slate-950/50">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-1 lg:mb-2">
                    {userInfo?.name || "N/A"}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-blue-400 font-semibold mb-3 lg:mb-4">
                    {getPositionName(userInfo?.position_id)}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail size={14} className="text-slate-500 flex-shrink-0 lg:hidden" />
                      <Mail size={16} className="text-slate-500 flex-shrink-0 hidden lg:block" />
                      <span className="text-xs lg:text-sm break-all">
                        {userInfo?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone size={14} className="text-slate-500 flex-shrink-0 lg:hidden" />
                      <Phone size={16} className="text-slate-500 flex-shrink-0 hidden lg:block" />
                      <span className="text-xs lg:text-sm">
                        {userInfo?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={14} className="text-slate-500 flex-shrink-0 lg:hidden" />
                      <MapPin size={16} className="text-slate-500 flex-shrink-0 hidden lg:block" />
                      <span className="text-xs lg:text-sm">
                        {userInfo?.address || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar size={14} className="text-slate-500 flex-shrink-0 lg:hidden" />
                      <Calendar size={16} className="text-slate-500 flex-shrink-0 hidden lg:block" />
                      <span className="text-xs lg:text-sm">
                        Gia nhập: {formatDate(userInfo?.join_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Bar - Mobile */}
                <div className="lg:hidden mt-3 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Cấp độ {currentLevel}
                    </span>
                    <span className="text-xs font-medium text-blue-400">
                      {currentExp.toFixed(0)} / {expForNextLevel} XP
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                      style={{ width: `${expProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Còn {expRemaining.toFixed(0)} XP để lên cấp {currentLevel + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Tabs Content */}
            <div className="flex-1 lg:w-3/4 flex flex-col">
              <div className="flex-1 mb-6">
                {/* Tabs Navigation */}
                <div className="relative border-b border-slate-800 mb-6">
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setActiveTab("skills");
                        setShowRecentProjects(false);
                      }}
                      className={`relative px-6 py-4 text-sm sm:text-base font-semibold transition-all ${
                        activeTab === "skills"
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Kỹ năng chuyên môn
                      {activeTab === "skills" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"></div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("projects");
                        setShowRecentProjects(false);
                      }}
                      className={`relative px-6 py-4 text-sm sm:text-base font-semibold transition-all ${
                        activeTab === "projects"
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Dự án & Hiệu suất
                      {activeTab === "projects" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"></div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("achievements");
                        setShowRecentProjects(false);
                      }}
                      className={`relative px-6 py-4 text-sm sm:text-base font-semibold transition-all ${
                        activeTab === "achievements"
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Thành tích
                      {activeTab === "achievements" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"></div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tab Content: Skills */}
                {activeTab === "skills" && (
                  <div>
                    {skillsData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300} className="sm:hidden">
                          <RadarChart data={skillsData}>
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
                              labelStyle={{ color: "#e2e8f0", fontWeight: "bold", fontSize: "12px" }}
                              itemStyle={{ color: "#60a5fa", fontSize: "12px" }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
                          <RadarChart data={skillsData}>
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
                              labelStyle={{ color: "#e2e8f0", fontWeight: "bold", marginBottom: "5px" }}
                              itemStyle={{ color: "#60a5fa" }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {skillsData.map((skill: any, index: any) => (
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
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        Chưa có dữ liệu kỹ năng
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content: Projects & Performance */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    {!showRecentProjects ? (
                      <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-2">
                              <Briefcase className="text-blue-500" size={20} />
                              <span className="text-xs font-semibold text-slate-500 uppercase">
                                Dự án
                              </span>
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                              {userInfo?.projects?.total_projects || 0}
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
                              {userInfo?.projects?.total_members_projects || 0}
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
                              {currentLevel}
                            </div>
                            <div className="text-xs text-green-400">
                              {currentExp.toFixed(0)} XP
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
                              {userInfo?.certificates ? 1 : 0}
                            </div>
                            <div className="text-xs text-slate-400">Đạt được</div>
                          </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* Project Stats Chart */}
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
                            {projectStats.length > 0 ? (
                              <>
                                <div className="flex justify-center">
                                  <ResponsiveContainer width="100%" height={250} className="sm:hidden">
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
                                  <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
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
                                    <div key={index} className="text-center p-3 sm:p-4 rounded-lg bg-slate-950 border border-slate-800">
                                      <div className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full mx-auto mb-2 ${
                                        stat.skill === "Hoàn thành" ? "bg-green-500" :
                                        stat.skill === "Đang thực hiện" ? "bg-blue-500" :
                                        "bg-yellow-500"
                                      }`}></div>
                                      <div className="text-xl sm:text-2xl font-bold text-white">
                                        {stat.value}
                                      </div>
                                      <div className="text-xs text-slate-400">{stat.skill}</div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-12 text-slate-400">
                                Chưa có dữ liệu dự án
                              </div>
                            )}
                          </div>

                          {/* Performance Chart */}
                          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                              Hiệu suất (6 tháng)
                            </h3>
                            <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                              <BarChart data={mockPerformance}>
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
                        {/* Recent Projects View */}
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
                          {mockProjects.length > 0 ? (
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
                                      <Calendar size={14} className="text-slate-500 flex-shrink-0" />
                                      <span>
                                        {project.startDate} - {project.endDate}
                                      </span>
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
                          ) : (
                            <div className="text-center py-12 text-slate-400">
                              Chưa có dữ liệu dự án chi tiết
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab Content: Achievements */}
                {activeTab === "achievements" && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockAchievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 p-5 hover:border-blue-500 transition"
                          >
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-full ${achievement.color} flex-shrink-0`}
                            >
                              <Icon size={28} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-semibold text-white leading-tight">
                                {achievement.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Additional Info */}
                    {userInfo?.educations && (
                      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-5">
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <FileText size={20} className="text-blue-400" />
                          Trình độ học vấn
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-300">
                            <span className="text-slate-500">Bằng cấp:</span>{" "}
                            {userInfo.educations.degree_level === "tien_si" ? "Tiến sĩ" :
                             userInfo.educations.degree_level === "thac_si" ? "Thạc sĩ" :
                             userInfo.educations.degree_level === "dai_hoc" ? "Đại học" : "N/A"}
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-500">Chuyên ngành:</span> {userInfo.educations.major}
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-500">Trường:</span> {userInfo.educations.school_name}
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-500">Năm tốt nghiệp:</span> {userInfo.educations.graduation_year}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
