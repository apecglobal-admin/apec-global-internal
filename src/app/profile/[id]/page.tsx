"use client";

import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import SkillsTab from "./tab/skills";
import ProjectsTab from "./tab/project";
import AchievementsTab from "./tab/achievement";
import CareerTab from "./tab/career";
import TasksTab from "./tab/task";
import PersonalTab from "./tab/personal";
import TabNavigation from "./tab/tabNavigation";
import CardTab from "./tab/card";
import LinkTab from "./tab/link";
import { CircleMenu, CircleMenuItem } from "react-circular-menu";
import Flag from "react-flagkit";
import Header from "@/components/header";
import Footer from "@/components/footer";
// ==================== MOCK DATA ====================
const mockUserInfo = {
  id: 2,
  name: "Trần Văn Bảo",
  email: "tran.van.bao@company.com",
  phone: "0987 654 321",
  address: "456 Lê Lợi, Quận 3, TP.HCM",
  join_date: "2022-05-10",
  area: "Khu vực phụ",
  position_id: 10,
  department: "An ninh",
  avatar_url:
    "https://res.cloudinary.com/dpovm17vr/image/upload/v1762239382/6466c0fa019b8dc5d48a_naeesm.jpg",
  second_avatar_url:
    "https://res.cloudinary.com/dpovm17vr/image/upload/v1762239382/afd17443b522397c6033_c37hib.jpg",
  third_avatar_url:
    "https://res.cloudinary.com/dpovm17vr/image/upload/v1762239382/9dc31744d6255a7b0334_fbpfgw.jpg",
  level: 5,
  exp: 1200,
  next_exp: 300,
  skills: [
    { icon: "🛡️", name: "Security Patrol", value: "100" },
    { icon: "🚨", name: "Emergency Response", value: "80" },
    { icon: "📞", name: "Communication", value: "70" },
    { icon: "🎯", name: "Observation", value: "90" },
    { icon: "💪", name: "Physical Fitness", value: "100" },
    { icon: "📝", name: "Reporting", value: "60" },
  ],
  projects: {
    total_projects: 12,
    total_members_projects: 4,
    project_status: [
      { id: 2, count: 2 },
      { id: 3, count: 8 },
      { id: 4, count: 2 },
    ],
  },
  certificates: {
    certificate_name: "Chứng chỉ An ninh cơ bản",
  },
  educations: {
    degree_level: "cao_dang",
    major: "An ninh trật tự",
    school_name: "Trường Cao đẳng Cảnh sát Nhân dân",
    graduation_year: "2018",
  },
};

const getPositionName = (positionId: any) => {
  const positions = {
    5: "Senior Developer",
    4: "Mid-level Developer",
    3: "Junior Developer",
    2: "Intern",
    1: "Trainee",
  };
  return positions[positionId] || "Nhân viên";
};

function ProfilePage({params}: any) {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("skills");

  const currentExp = parseFloat(mockUserInfo.exp);
  const currentLevel = mockUserInfo.level;
  const expForNextLevel = currentLevel * mockUserInfo.next_exp;
  const expProgress = (currentExp / expForNextLevel) * 100;
  const expRemaining = expForNextLevel - currentExp;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const images = [
    mockUserInfo.avatar_url,
    mockUserInfo.second_avatar_url,
    mockUserInfo.third_avatar_url,
  ];

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="h-screen bg-slate-950 p-0 flex flex-col">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      <Header />
      <div className="mt-0 mx-0 max-w-none mb-0 flex-1">
        <div className="relative h-full mb-0 rounded-none border-x-0 border-t-0 border border-slate-800 bg-gradient-to-tl from-[#0c2954] to-transparent p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row mb-12">
            <div className="lg:w-1/5">
              <div className="sticky top-8 space-y-6">
                {/* Mobile: Avatar and Info side by side */}
                <div className="lg:hidden space-y-3">
                  <div className="flex gap-4">
                    <div className="relative w-32 flex-shrink-0">
                      <div className="relative w-full aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                        <div className="relative h-full w-full rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
                          <img
                            src={images[currentImage]}
                            alt="Profile"
                            className="h-full w-full"
                          />
                        </div>

                        <button
                          onClick={prevImage}
                          className="absolute left-1 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-1 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-1 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                        >
                          <ChevronRight size={14} />
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                currentImage === index
                                  ? "bg-blue-400 w-4"
                                  : "bg-slate-700 hover:bg-slate-600 w-1.5"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: User Info */}
                    <div className="flex-1">
                      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3 h-full flex flex-col justify-center">
                        <h2 className="text-lg font-bold text-slate-100 mb-1">
                          {mockUserInfo.name}
                        </h2>
                        <p className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {getPositionName(mockUserInfo.position_id)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: EXP Bar */}
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300">
                        Level {currentLevel}
                      </span>
                      <span className="text-xs font-bold text-blue-400">
                        {currentExp.toFixed(0)}/{expForNextLevel}
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                        style={{ width: `${expProgress}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {expRemaining.toFixed(0)} XP to next level
                    </p>
                  </div>
                </div>

                {/* Desktop: Original Layout */}
                <div className="hidden lg:block relative">
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                    <div className="relative h-full w-full rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
                      <img
                        src={images[currentImage]}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-2 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-2 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            currentImage === index
                              ? "bg-blue-400 w-6"
                              : "bg-slate-700 hover:bg-slate-600 w-2"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Level {currentLevel}
                    </span>
                    <span className="text-xs font-bold text-blue-400">
                      {currentExp.toFixed(0)}/{expForNextLevel}
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                      style={{ width: `${expProgress}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {expRemaining.toFixed(0)} XP to next level
                  </p>
                </div>

                <div className="hidden lg:block space-y-4">
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">
                      {mockUserInfo.name}
                    </h2>
                    <p className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {getPositionName(mockUserInfo.position_id)}
                    </p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                      <Mail size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="text-xs truncate">
                        {mockUserInfo.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                      <Briefcase
                        size={16}
                        className="text-blue-400 flex-shrink-0"
                      />
                      <span className="text-xs">{mockUserInfo.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                      <MapPin
                        size={16}
                        className="text-blue-400 flex-shrink-0"
                      />
                      <span className="text-xs">{mockUserInfo.area}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                      <Calendar
                        size={16}
                        className="text-blue-400 flex-shrink-0"
                      />
                      <span className="text-xs">
                        {formatDate(mockUserInfo.join_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 lg:w-4/5 flex flex-col">
              <div className="flex-1 mb-6">
                <TabNavigation
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {activeTab === "skills" && (
                  <SkillsTab userInfo={mockUserInfo} />
                )}
                {activeTab === "projects" && (
                  <ProjectsTab userInfo={mockUserInfo} />
                )}
                {activeTab === "achievements" && (
                  <AchievementsTab userInfo={mockUserInfo} />
                )}
                {activeTab === "career" && (
                  <CareerTab userInfo={mockUserInfo} />
                )}
                {activeTab === "tasks" && <TasksTab />}
                {activeTab === "personal" && (
                  <PersonalTab userInfo={mockUserInfo} />
                )}
                {activeTab === "card" && <CardTab userInfo={mockUserInfo} />}
                {activeTab === "link" && <LinkTab userInfo={mockUserInfo} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
