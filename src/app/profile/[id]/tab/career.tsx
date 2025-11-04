import { Briefcase, CheckCircle2, Trophy } from "lucide-react";
import { useState } from "react";

const mockCareerPath = {
  currentPosition: "Nhân viên bảo vệ",
  currentLevel: 3,
  positions: [
    {
      id: 1,
      name: "Nhân viên bảo vệ",
      level: 3,
      tasksRequired: 50,
      tasksCompleted: 35,
      status: "current",
      unlocked: true,
      requirements: [
        {
          id: 1,
          text: "Hoàn thành 50 ca tuần tra",
          completed: false,
          progress: 35,
          total: 50,
        },
        {
          id: 2,
          text: "Kiểm tra camera an ninh 100%",
          completed: false,
          progress: 70,
          total: 100,
        },
        {
          id: 3,
          text: "Hoàn thành báo cáo sự cố tuần",
          completed: false,
          progress: 8,
          total: 12,
        },
      ],
    },
    {
      id: 2,
      name: "Trưởng ca bảo vệ",
      level: 5,
      tasksRequired: 100,
      tasksCompleted: 0,
      status: "locked",
      unlocked: false,
      requirements: [
        {
          id: 4,
          text: "Quản lý và phân công 3 nhân viên bảo vệ",
          completed: false,
          progress: 0,
          total: 3,
        },
        {
          id: 5,
          text: "Giám sát ít nhất 10 sự kiện thành công",
          completed: false,
          progress: 0,
          total: 10,
        },
        {
          id: 6,
          text: "Đạt đánh giá an ninh 90% trở lên",
          completed: false,
          progress: 0,
          total: 90,
        },
      ],
    },
    {
      id: 3,
      name: "Quản lý an ninh",
      level: 8,
      tasksRequired: 200,
      tasksCompleted: 0,
      status: "locked",
      unlocked: false,
      requirements: [
        {
          id: 7,
          text: "Quản lý toàn bộ nhân viên bảo vệ của chi nhánh",
          completed: false,
          progress: 0,
          total: 1,
        },
        {
          id: 8,
          text: "Tổ chức huấn luyện kỹ năng định kỳ",
          completed: false,
          progress: 0,
          total: 5,
        },
        {
          id: 9,
          text: "Đảm bảo 100% an ninh khu vực",
          completed: false,
          progress: 0,
          total: 100,
        },
      ],
    },
  ],
  progressData: [
    { position: "Nhân viên bảo vệ", completed: 35 },
    { position: "Trưởng ca bảo vệ", completed: 0 },
    { position: "Quản lý an ninh", completed: 0 },
  ],
};

function CareerTab({ userInfo }: any) {
  const currentPosition = mockCareerPath.positions.find(
    (p) => p.status === "current"
  );
  const completedRequirements =
    currentPosition?.requirements.filter(
      (r) => r.completed || r.progress >= r.total
    ).length || 0;
  const totalRequirements = currentPosition?.requirements.length || 0;
  const overallProgress =
    totalRequirements > 0
      ? (completedRequirements / totalRequirements) * 100
      : 0;

  if (!currentPosition) return null;

  return (
    <div className="max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="border border-white rounded-xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {currentPosition.name}
              </h2>
              <p className="text-blue-100 text-xs">
                Level {currentPosition.level}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <p className="text-sm font-bold text-white">
                {overallProgress.toFixed(0)}%
              </p>
              <p className="text-[10px] text-blue-100">
                {completedRequirements}/{totalRequirements}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items - Compact */}
      <div className="space-y-2">
        {currentPosition.requirements.map((req, index) => {
          const progress =
            req.total > 1
              ? (req.progress / req.total) * 100
              : req.completed
              ? 100
              : 0;
          const isCompleted = req.completed || req.progress >= req.total;

          return (
            <div
              key={req.id}
              className={`relative rounded-lg border transition-all ${
                isCompleted
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="p-3">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-slate-600"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-green-400 line-through"
                          : "text-white"
                      }`}
                    >
                      {req.text}
                    </p>

                    {req.total > 1 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-cyan-400"
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isCompleted ? "text-green-400" : "text-blue-400"
                            }`}
                          >
                            {req.progress}/{req.total}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Next Level */}
      <div className="mt-4 bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-purple-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">
              Cấp độ tiếp theo: Trưởng Ca Bảo Vệ
            </p>
            <p className="text-[11px] text-slate-400">
              Hoàn thành tất cả yêu cầu để mở khóa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerTab;
