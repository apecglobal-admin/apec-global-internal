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

function SkillsTab({ userInfo }: any) {

    
    const dispatch = useDispatch();
    const { totalKpiSkill } = useProfileData();
    const [expandedSkills, setExpandedSkills] = useState<Set<number>>(
        new Set()
    );
    const [showDescriptions, setShowDescriptions] = useState<Set<number>>(
        new Set()
    );

    useEffect(() => {
        if (!userInfo) return;
        const token = localStorage.getItem("userToken");
        dispatch(getTotalKpiSkill(token) as any);
    }, [userInfo]);

    // Kỹ năng cứng từ props
    const hardSkills = userInfo.map((skill: any) => ({
        id: skill.id,
        icon: skill.icon || "💼",
        name: skill.kpi.name,
        description: skill.kpi.description,
        value: parseFloat(skill.score),
        kpiItems: skill.kpi_items || [],
    }));
    

    // Lấy thông tin từ API
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

    // Dữ liệu cho biểu đồ radar
    const skillsData = hardSkills.map((skill: any) => ({
        skill: skill.name,
        value: skill.value,
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
            {/* Radar Chart với Đánh giá */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Radar Chart */}
                <div className="lg:col-span-2 w-full h-[250px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={skillsData}>
                            <PolarGrid stroke="#475569" strokeWidth={1} className="sm:stroke-[1.5]" />
                            <PolarAngleAxis
                                dataKey="skill"
                                tick={{
                                    fill: "#cbd5e1",
                                    fontSize: window.innerWidth >= 640 ? 14 : 9,
                                    fontWeight: 500,
                                }}
                                tickSize={20}
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

                {/* Bảng đánh giá tổng hợp */}
                <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-200 mb-4">
                        📊 Đánh giá tổng hợp
                    </h3>

                    {/* Overall Rating từ API */}
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

            {/* Skills List */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {hardSkills.map((skill: any, index: number) => {
                    const isExpanded = expandedSkills.has(index);
                    const showDescription = showDescriptions.has(index);
                    return (
                        <div key={index} className="flex flex-col">
                            <div className="group pb-3 lg:pb-4 border-b border-slate-800 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2 lg:mb-3">
                                    <div className="flex items-center gap-1.5 lg:gap-2">
                                        <span className="text-base lg:text-xl">
                                            {skill.icon}
                                        </span>
                                        <span className="text-xs lg:text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                                            {skill.name}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => toggleDescription(index, e)}
                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                            >
                                                <HelpCircle className="w-4 h-4 lg:w-4.5 lg:h-4.5" color="yellow"/>
                                            </button>
                                            {/* Description Tooltip */}
                                            {showDescription && (
                                                <div className="absolute left-0 top-full mt-2 z-10 w-64 p-3 bg-slate-700 rounded-lg border border-slate-600 shadow-xl">
                                                    <button
                                                        onClick={(e) => toggleDescription(index, e)}
                                                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                    <p className="text-xs lg:text-sm text-slate-300 pr-6">
                                                        {skill.description || "Chưa có mô tả"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs lg:text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                                            {skill.value}%
                                        </span>
                                        <button
                                            onClick={() => toggleSkill(index)}
                                            className="text-slate-400 hover:text-blue-400 transition-colors"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="h-1 lg:h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-300"
                                        style={{ width: `${skill.value}%` }}
                                    />
                                </div>

                                {/* KPI Items List */}
                                {isExpanded && (
                                    <div className="mt-3 max-h-40 overflow-y-auto">
                                        {skill.kpiItems && skill.kpiItems.length > 0 ? (
                                            <div className="space-y-2">
                                                {skill.kpiItems.map((item: any, itemIndex: number) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="p-2 lg:p-2.5 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-blue-400 text-xs mt-0.5">•</span>
                                                            <div className="flex-1">
                                                                <p className="text-xs lg:text-sm text-slate-300 font-medium">
                                                                    {item.name}
                                                                </p>
                                                                {item.description && (
                                                                    <p className="text-xs text-slate-500 mt-1">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                                <p className="text-xs lg:text-sm text-slate-400">
                                                    Chưa có dữ liệu KPI items
                                                </p>
                                            </div>
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