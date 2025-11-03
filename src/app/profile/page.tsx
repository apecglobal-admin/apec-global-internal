"use client";

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
  Trophy,
  Star,
  ListTodo,
  ClipboardList,
  ArrowUp,
  Lock,
  Unlock,
  FileUser,
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
// ==================== MOCK DATA ====================
const mockUserInfo = {
  id: 1,
  name: "Nguyễn Văn An",
  email: "nguyen.van.an@company.com",
  phone: "0123 456 789",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  join_date: "2023-01-15",
  area: "Khu vực chính",
  position_id: 5,
  department: "Phát triển phần mềm",
  avatar_url:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  second_avatar_url:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  third_avatar_url:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
  level: 12,
  exp: 8500,
  next_exp: 1000,
  skills: [
    { icon: "⚛️", name: "React.js", value: "95" },
    { icon: "🌐", name: "Node.js", value: "88" },
    { icon: "🔹", name: "TypeScript", value: "92" },
    { icon: "🎨", name: "UI/UX Design", value: "85" },
    { icon: "👥", name: "Team Leadership", value: "90" },
    { icon: "📊", name: "Project Management", value: "87" },
  ],
  projects: {
    total_projects: 24,
    total_members_projects: 18,
    project_status: [
      { id: 2, count: 5 },
      { id: 3, count: 16 },
      { id: 4, count: 3 },
    ],
  },
  certificates: {
    certificate_name: "AWS Certified Solutions Architect",
  },
  educations: {
    degree_level: "thac_si",
    major: "Khoa học máy tính",
    school_name: "Đại học Bách Khoa TP.HCM",
    graduation_year: "2020",
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

function ProfilePage() {
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

      <div className="mt-0 mx-0 max-w-none mb-0 flex-1">
        <div className="relative h-full mb-0 rounded-none border-x-0 border-t-0 border border-slate-800 bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-row lg:flex-col items-start lg:items-start lg:w-1/4 rounded-xl border-2 border-slate-800 bg-slate-950/50 p-4 sm:p-5 gap-4">
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

              <div className="flex-1 lg:mt-6 w-full">
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
                    Còn {expRemaining.toFixed(0)} XP để lên cấp{" "}
                    {currentLevel + 1}
                  </p>
                </div>

                <div className="text-left lg:text-left p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-slate-800 bg-slate-950/50">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-1 lg:mb-2">
                    {mockUserInfo.name}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-blue-400 font-semibold mb-3 lg:mb-4">
                    {getPositionName(mockUserInfo.position_id)}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail
                        size={14}
                        className="text-slate-500 flex-shrink-0 lg:hidden"
                      />
                      <Mail
                        size={16}
                        className="text-slate-500 flex-shrink-0 hidden lg:block"
                      />
                      <span className="text-xs lg:text-sm break-all">
                        {mockUserInfo.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone
                        size={14}
                        className="text-slate-500 flex-shrink-0 lg:hidden"
                      />
                      <FileUser
                        size={16}
                        className="text-slate-500 flex-shrink-0 hidden lg:block"
                      />
                      <span className="text-xs lg:text-sm">
                        {mockUserInfo.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin
                        size={14}
                        className="text-slate-500 flex-shrink-0 lg:hidden"
                      />
                      <MapPin
                        size={16}
                        className="text-slate-500 flex-shrink-0 hidden lg:block"
                      />
                      <span className="text-xs lg:text-sm">
                        {mockUserInfo.area}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar
                        size={14}
                        className="text-slate-500 flex-shrink-0 lg:hidden"
                      />
                      <Calendar
                        size={16}
                        className="text-slate-500 flex-shrink-0 hidden lg:block"
                      />
                      <span className="text-xs lg:text-sm">
                        Ngày vào: {formatDate(mockUserInfo.join_date)}
                      </span>
                    </div>
                  </div>
                </div>

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
                    Còn {expRemaining.toFixed(0)} XP để lên cấp{" "}
                    {currentLevel + 1}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 lg:w-3/4 flex flex-col">
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
                {activeTab === "card" && (
                  <CardTab userInfo={mockUserInfo} />
                )}
                {activeTab === "link" && (
                  <LinkTab userInfo={mockUserInfo} />
                )}
              </div>
            </div>
          </div>
          {/* <div style={{ position: 'absolute', bottom: '100px', right: '20px' }}>
      <CircleMenu
        startAngle={90}
        rotationAngle={270}
        itemSize={2}
        radius={4}
        rotationAngleInclusive={false}
      >
        <CircleMenuItem
          onClick={() => alert("Clicked the item")}
          tooltip="Email"
          tooltipPlacement="right"
        >
          <CheckCircle2 />
        </CircleMenuItem>
        <CircleMenuItem tooltip="Help">
          <Users />
        </CircleMenuItem>
        <CircleMenuItem tooltip="Location" tooltipPlacement="top">
          <Mail />
        </CircleMenuItem>
        <CircleMenuItem tooltip="Info">
          <Flag country="US" />
        </CircleMenuItem>
      </CircleMenu>
    </div> */}
        </div>
        
      </div>
    </div>
  );
}

export default ProfilePage;
