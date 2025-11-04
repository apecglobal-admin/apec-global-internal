import {
  Award,
  TrendingUp,
  FileText,
  Target,

} from "lucide-react";
import { useState } from "react";

function AchievementsTab({ userInfo }: any) {
  const mockAchievements = [
    {
      title: "Nhân viên xuất sắc Q1 2024",
      icon: Award,
      color: "bg-yellow-500",
    },
    {
      title: `Hoàn thành ${userInfo.projects.total_projects} dự án`,
      icon: Target,
      color: "bg-blue-500",
    },
    {
      title: userInfo.certificates.certificate_name,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: `Level ${userInfo.level}`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
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

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-5">
        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FileText size={20} className="text-blue-400" />
          Trình độ học vấn
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-slate-300">
            <span className="text-slate-500">Bằng cấp:</span>{" "}
            {userInfo.educations.degree_level === "tien_si"
              ? "Tiến sĩ"
              : userInfo.educations.degree_level === "thac_si"
              ? "Thạc sĩ"
              : userInfo.educations.degree_level === "dai_hoc"
              ? "Đại học"
              : "N/A"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Chuyên ngành:</span>{" "}
            {userInfo.educations.major}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Trường:</span>{" "}
            {userInfo.educations.school_name}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Năm tốt nghiệp:</span>{" "}
            {userInfo.educations.graduation_year}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AchievementsTab;
