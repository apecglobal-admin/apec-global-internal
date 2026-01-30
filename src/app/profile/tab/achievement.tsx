import { useProfileData } from "@/src/hooks/profileHook";
import { listAchievements } from "@/src/services/api";
import { Award, TrendingUp, FileText, Target, LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  "file-text": FileText,
  "target": Target,
  "award": Award,
  "trending-up": TrendingUp,
};

// Map category names to colors
const categoryColorMap: Record<string, string> = {
  "Chứng chỉ": "bg-green-500",
  "Năng suất": "bg-blue-500",
  "Giải thưởng": "bg-yellow-500",
  "default": "bg-purple-500",
};

function AchievementsTab({ userInfo }: any) {
  const dispatch = useDispatch();
  const { achievements } = useProfileData();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if(token) {
      dispatch(listAchievements(token as any) as any);
    }
  }, [dispatch]);

  const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Award;
  };

  const getCategoryColor = (categoryName: string): string => {
    return categoryColorMap[categoryName] || categoryColorMap.default;
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements && achievements.length > 0 ? (
          achievements.map((achievement: any) => {
            const Icon = getIconComponent(achievement.achievement_category.icon);
            const colorClass = getCategoryColor(achievement.achievement_category.name);
            
            return (
              <div
                key={achievement.id}
                className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 p-5 hover:border-blue-500 transition"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${colorClass} flex-shrink-0`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-white leading-tight">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {achievement.achievement_category.name}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center text-slate-400 py-8">
            Chưa có thành tựu nào
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-5">
        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FileText size={20} className="text-blue-400" />
          Trình độ học vấn
        </h4>
        {userInfo?.educations ? (
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
              {userInfo.educations.major || "N/A"}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">Trường:</span>{" "}
              {userInfo.educations.school_name || "N/A"}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">Năm tốt nghiệp:</span>{" "}
              {userInfo.educations.graduation_year || "N/A"}
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-4">
            Chưa có dữ liệu học vấn
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementsTab;