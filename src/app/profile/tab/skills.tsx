import { useEffect, useState } from "react";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { ChevronDown, ChevronUp, HelpCircle, X } from "lucide-react";
import { useProfileData } from "@/src/hooks/profileHook";
import { getTotalKpiSkill } from "@/src/services/api";
import { useDispatch } from "react-redux";
import { getDashboardTasks } from "@/src/features/dashboard/api/api";
import { useDashboardData } from "@/src/hooks/dashboardhook";
import { getFcmToken } from "@/src/lib/getFCMToken";

function SkillsTab({ userInfo }: any) {
    const dispatch = useDispatch();
    const { totalKpiSkill } = useProfileData();
    const { listDashboardTasks } = useDashboardData();
    const [expandedSkills, setExpandedSkills] = useState<Set<number>>(
        new Set()
    );
    const [showDescriptions, setShowDescriptions] = useState<Set<number>>(
        new Set()
    );

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        handleResize(); // Chạy lần đầu
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    


    
    useEffect(() => {
        if (!userInfo) return;
        const now = new Date();
        const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
        const token = localStorage.getItem("userToken");
        dispatch(getTotalKpiSkill(token) as any);
        dispatch(getDashboardTasks({token, month}) as any);
    }, [userInfo]);
    

    const getRankColor = (rankName: string) => {
        const colors: Record<string, string> = {
            S: "border-yellow-400 text-yellow-400 bg-yellow-400/10",
            A: "border-green-400 text-green-400 bg-green-400/10",
            B: "border-blue-400 text-blue-400 bg-blue-400/10",
            C: "border-slate-400 text-slate-400 bg-slate-400/10",
            D: "border-red-400 text-red-400 bg-red-400/10",
        };
        return colors[rankName] || colors.C;
    };

    const skillsData = userInfo.map((skill: any) => ({
        skill: skill.kpi.name,
        value: parseFloat(skill.score),
        fullMark: 100,
    }));

    const toggleSkill = (index: number) => {
        const newExpanded = new Set(expandedSkills);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSkills(newExpanded);
    };

    const toggleDescription = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newShowDescriptions = new Set(showDescriptions);
        if (newShowDescriptions.has(index)) {
            newShowDescriptions.delete(index);
        } else {
            newShowDescriptions.add(index);
        }
        setShowDescriptions(newShowDescriptions);
    };

    

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 w-full h-[250px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        <RadarChart data={skillsData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                            <PolarGrid stroke="#475569" strokeWidth={1} className="sm:stroke-[1.5]" />
                            <PolarAngleAxis
                                dataKey="skill"
                                tick={{
                                    fill: "#cbd5e1",
                                    fontSize: isMobile ? 9 : 14, // Sử dụng biến state
                                    fontWeight: 500,
                                }}
                                tickSize={isMobile ? 10 : 20}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fill: "#01f7ff", fontSize: 12 }}
                                tickCount={0}
                            />
                            <Radar
                                name="Kỹ năng"
                                dataKey="value"
                                stroke="#abf0f3"
                                fill="url(#colorGradient)"
                                fillOpacity={window.innerWidth >= 640 ? 0.9 : 0.8}
                                strokeWidth={window.innerWidth >= 640 ? 2.0 : 2.5}
                            />
                            <defs>
                                <radialGradient id="colorGradient">
                                    <stop
                                        offset="0%"
                                        stopColor="#abf0f3"
                                        stopOpacity={window.innerWidth >= 640 ? 0.4 : 0.5}
                                    />
                                    <stop
                                        offset="25%"
                                        stopColor="#abf0f3"
                                        stopOpacity={window.innerWidth >= 640 ? 0.6 : 0.45}
                                    />
                                    <stop
                                        offset="60%"
                                        stopColor="#abf0f3"
                                        stopOpacity={window.innerWidth >= 640 ? 0.75 : 0.85}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#abf0f3"
                                        stopOpacity={1}
                                    />
                                </radialGradient>
                            </defs>
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
                </div>

                <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-200 mb-4">
                        📊 Đánh giá tổng hợp
                    </h3>

                    {totalKpiSkill ? (
                        <div className="p-4 bg-slate-800/50 rounded-lg border-2 border-slate-600">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-2">
                                    Tổng quan
                                </p>
                                <div
                                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${getRankColor(
                                        totalKpiSkill.rank?.name || "C"
                                    )}`}
                                >
                                    <span className="text-3xl font-bold">
                                        {totalKpiSkill.rank?.name || "-"}
                                    </span>
                                </div>
                                <p className="text-xl font-semibold text-slate-200 mt-3">
                                    {parseFloat(totalKpiSkill.total_score).toFixed(1)}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Điểm tổng
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">
                                            Tháng/Năm:
                                        </span>
                                        <span className="text-slate-300 font-medium">
                                            {totalKpiSkill.month}/{totalKpiSkill.year}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-800/50 rounded-lg border-2 border-slate-600">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-2">
                                    Tổng quan
                                </p>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-400 text-slate-400">
                                    <span className="text-3xl font-bold">-</span>
                                </div>
                                <p className="text-lg text-slate-400 mt-3">
                                    Chưa có dữ liệu
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {userInfo.map((skill: any, index: number) => {
                    const isExpanded = expandedSkills.has(index);
                    const showDescription = showDescriptions.has(index);
                    
                    return (
                    <div 
                        key={index} 
                        className="flex flex-col bg-slate-900/40 rounded-xl p-4 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 shadow-sm"
                    >
                        <div className="group">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-4 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                            <div className="relative flex items-center gap-1.5 min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                {skill.kpi.name}
                                </span>
                                <button
                                    onClick={(e) => toggleDescription(index, e)}
                                    className="shrink-0 p-1 rounded-full transition-colors"
                                    >
                                    <HelpCircle className="w-4 h-4 lg:w-4 lg:h-4 text-yellow-200" />
                                </button>

                                {showDescription && (
                                <div className="absolute left-0 top-full mt-2 z-20 w-64 p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                                    <button
                                    onClick={(e) => toggleDescription(index, e)}
                                    className="absolute top-1.5 right-1.5 text-slate-500 hover:text-white"
                                    >
                                    <X className="w-3.5 h-3.5" />
                                    </button>
                                    <p className="text-xs leading-relaxed text-slate-300 pr-4 italic">
                                    {skill.kpi.description || "Chưa có mô tả"}
                                    </p>
                                </div>
                                )}
                            </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center">
                                    {skill.kpi.name === "Công việc" ? (
                                    (() => {
                                        const statuses = listDashboardTasks?.tasks_by_status?.items || [];
                                        const doing = statuses.find((s: any) => s.task_status === "2");
                                        const done = statuses.find((s: any) => s.task_status === "4");
                                        return (
                                        <div className="flex items-center px-2 py-0.5 bg-slate-800/80 rounded-full border border-slate-700 text-[10px] font-bold tracking-tight">
                                            <span className="text-blue-400">{doing?.total ?? 0}</span>
                                            <span className="mx-1 text-slate-600">/</span>
                                            <span className="text-emerald-400">{done?.total ?? 0}</span>
                                        </div>
                                        );
                                    })()
                                    ) : (
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 whitespace-nowrap">
                                        {skill.total_count}/tháng
                                    </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                                    <span className="text-sm font-black text-blue-400 tracking-tighter">
                                    {parseFloat(skill.score).toFixed(0)}%
                                    </span>
                                    <button
                                    onClick={() => toggleSkill(index)}
                                    className={`p-1 rounded-md transition-all ${isExpanded ? 'bg-blue-500/10 text-blue-400 rotate-180' : 'text-slate-500 hover:bg-slate-800'}`}
                                    >
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-800">
                            <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                            style={{ width: `${parseFloat(skill.score)}%` }}
                            />
                        </div>

                        {/* KPI Items Details */}
                        {isExpanded && (
                            <div className="mt-4 space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar animate-in slide-in-from-top-2 duration-300">
                            {skill.kpi.name === "Công việc" ? (
                                (() => {
                                const kpiItems = listDashboardTasks?.tasks_by_kpi_item?.items || [];
                                return kpiItems.length > 0 ? (
                                    kpiItems.map((item: any, itemIndex: number) => (
                                    <div key={itemIndex} className="flex justify-between items-center p-2.5 bg-slate-800/20 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-1 h-1 shrink-0 rounded-full bg-blue-500" />
                                        <p className="text-xs text-slate-300 font-medium truncate">{item.label}</p>
                                        </div>
                                        <span className="text-xs font-mono text-slate-400 ml-2 shrink-0">{item.total}</span>
                                    </div>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-lg">Không có dữ liệu</p>
                                );
                                })()
                            ) : (
                                skill.kpi_items && skill.kpi_items.length > 0 ? (
                                skill.kpi_items.map((item: any, itemIndex: number) => (
                                    <div key={itemIndex} className="flex justify-between items-center p-2.5 bg-slate-800/20 rounded-lg border border-slate-800/50 hover:border-slate-700">
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 shrink-0 rounded-full bg-cyan-500" />
                                        <p className="text-xs text-slate-300 font-medium truncate">{item.name}</p>
                                        </div>
                                        {item.description && <p className="text-[10px] text-slate-500 ml-3 truncate">{item.description}</p>}
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-300 ml-2 shrink-0">
                                        {item.total}
                                    </div>
                                    </div>
                                ))
                                ) : (
                                <p className="text-center py-4 text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-lg">Dữ liệu trống</p>
                                )
                            )}
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SkillsTab;

