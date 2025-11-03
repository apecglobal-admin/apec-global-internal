import { Briefcase, CheckCircle2, Trophy } from "lucide-react";
import { useState } from "react";

const mockCareerPath = {
  currentPosition: "Senior Developer",
  currentLevel: 12,
  positions: [
    {
      id: 1,
      name: "Senior Developer",
      level: 12,
      tasksRequired: 75,
      tasksCompleted: 58,
      status: "current",
      unlocked: true,
      requirements: [
        {
          id: 1,
          text: "Hoàn thành 75 nhiệm vụ dự án",
          completed: false,
          progress: 58,
          total: 75,
        },
        {
          id: 2,
          text: "Mentor 3 junior developers",
          completed: false,
          progress: 1,
          total: 3,
        },
        {
          id: 3,
          text: "Lead 2 dự án lớn thành công",
          completed: false,
          progress: 1,
          total: 2,
        },
        {
          id: 4,
          text: "Đạt 90% review code quality",
          completed: false,
          progress: 85,
          total: 90,
        },
        {
          id: 5,
          text: "Hoàn thành 5 technical presentations",
          completed: false,
          progress: 3,
          total: 5,
        },
      ],
    },
  ],
  progressData: [
    { position: "Trainee", completed: 10 },
    { position: "Intern", completed: 20 },
    { position: "Junior", completed: 35 },
    { position: "Mid", completed: 50 },
    { position: "Senior", completed: 58 },
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
                                isCompleted ? "bg-green-500" : "bg-blue-500"
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
              Cấp độ tiếp theo: Team Lead
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
