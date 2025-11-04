
import {
  Award,
  TrendingUp,
  FileText,
  Target,

} from "lucide-react";

function LinkTab({ userInfo }: any) {
    const mockAchievements = [
    {
      title: "Tổng kho Ecoop",
      icon: Award,
      color: "bg-yellow-500",
    },
  ];
    return (
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
                <img src='https://i.imgur.com/eGuttTg.png'/>
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
    )
}

export default LinkTab;