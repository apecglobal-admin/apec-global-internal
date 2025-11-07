import { personCareer } from "@/src/services/api";
import { Briefcase, CheckCircle2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CareerTab({ userInfo }: any) {
  const dispatch = useDispatch();
  const { careers } = useSelector((state: any) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(personCareer(token as any) as any);
    }
  }, [dispatch]);

  const currentCareer = careers && careers.length > 0 ? careers[0] : null;

  if (!currentCareer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white text-sm">Đang tải thông tin nghề nghiệp...</p>
      </div>
    );
  }

  const completedRequirements = currentCareer.requirements.filter(
    (req: any) => req.is_completed
  ).length;
  const totalRequirements = currentCareer.requirements.length;
  const overallProgress = currentCareer.progress.percent;

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
                {currentCareer.career_level}
              </h2>
              <p className="text-blue-100 text-xs">
                Level {currentCareer.level_order}
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
        {currentCareer.requirements.map((req: any, index: number) => {
          const progress = req.progress_percent;
          const isCompleted = req.is_completed;

          return (
            <div
              key={req.requirement_id}
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
                      {req.name}
                    </p>

                    {req.target_value > 1 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r from-blue-500 to-cyan-400"
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isCompleted ? "text-green-400" : "text-blue-400"
                            }`}
                          >
                            {req.actual_value}/{req.target_value}
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
      {currentCareer.next_level && (
        <div className="mt-4 bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-purple-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">
                Cấp độ tiếp theo: {currentCareer.next_level.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {currentCareer.next_level.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerTab;