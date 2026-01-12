import { useState } from "react";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";

function SkillsTab({ userInfo }: any) {
    const [expandedSkills, setExpandedSkills] = useState<Set<number>>(
        new Set()
    );

    // Kỹ năng cứng từ props với sub-skills
    const hardSkills = userInfo.map((skill: any) => ({
        icon: skill.icon || "💼",
        name: skill.kpi.name,
        value: parseFloat(skill.score),
        subSkills: [
            { name: "Thực hành", value: parseFloat(skill.value) - 5 },
            { name: "Lý thuyết", value: parseFloat(skill.value) + 5 },
            { name: "Ứng dụng", value: parseFloat(skill.value) },
        ],
    }));

    // Tính toán thống kê
    const getRating = (value: number) => {
        if (value >= 90) return "S";
        if (value >= 80) return "A";
        if (value >= 70) return "B";
        return "C";
    };

    const getRatingColor = (rating: string) => {
        const colors = {
            S: "border-yellow-400 text-yellow-400",
            A: "border-green-400 text-green-400",
            B: "border-blue-400 text-blue-400",
            C: "border-slate-400 text-slate-400",
        };
        return colors[rating as keyof typeof colors] || colors.C;
    };

    const ratingStats = hardSkills.reduce(
        (acc: any, skill: any) => {
            const rating = getRating(skill.value);
            acc[rating as keyof typeof acc] =
                (acc[rating as keyof typeof acc] || 0) + 1;
            return acc;
        },
        { S: 0, A: 0, B: 0, C: 0 }
    );

    const averageScore =
        hardSkills.reduce((sum: any, skill: any) => sum + skill.value, 0) /
        hardSkills.length;
    const overallRating = getRating(averageScore);

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

    return (
        <div className="flex flex-col">
            {/* Radar Chart với Đánh giá */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Radar Chart */}
                <div className="lg:col-span-2 w-full">
                    <ResponsiveContainer
                        width="100%"
                        height={250}
                        className="sm:hidden"
                    >
                        <RadarChart data={skillsData}>
                            <PolarGrid stroke="#475569" strokeWidth={1} />
                            <PolarAngleAxis
                                dataKey="skill"
                                tick={{
                                    fill: "#cbd5e1",
                                    fontSize: 9,
                                    fontWeight: 500,
                                }}
                                tickSize={20}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fill: "#94a3b8", fontSize: 9 }}
                                tickCount={6}
                            />
                            <Radar
                                name="Kỹ năng"
                                dataKey="value"
                                stroke="#abf0f3"
                                fill="url(#colorGradient)"
                                fillOpacity={0.8}
                                strokeWidth={2.5}
                            />
                            <defs>
                                <radialGradient id="colorGradient">
                                    <stop
                                        offset="0%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.5}
                                    />
                                    <stop
                                        offset="25%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.45}
                                    />
                                    <stop
                                        offset="60%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.85}
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
                                    padding: "6px 8px",
                                }}
                                labelStyle={{
                                    color: "#e2e8f0",
                                    fontWeight: "bold",
                                    fontSize: "11px",
                                }}
                                itemStyle={{
                                    color: "#60a5fa",
                                    fontSize: "11px",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                        width="100%"
                        height={400}
                        className="hidden sm:block"
                    >
                        <RadarChart data={skillsData}>
                            <PolarGrid stroke="#475569" strokeWidth={1.5} />
                            <PolarAngleAxis
                                dataKey="skill"
                                tick={{
                                    fill: "#cbd5e1",
                                    fontSize: 14,
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
                                fillOpacity={0.9}
                                strokeWidth={2.0}
                            />
                            <defs>
                                <radialGradient id="colorGradient">
                                    <stop
                                        offset="0%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="25%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.6}
                                    />
                                    <stop
                                        offset="60%"
                                        stopColor="#abf0f3"
                                        stopOpacity={0.75}
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

                    {/* Overall Rating */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border-2 border-slate-600">
                        <div className="text-center">
                            <p className="text-xs text-slate-400 mb-2">
                                Tổng quan
                            </p>
                            <div
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-4 ${getRatingColor(
                                    overallRating
                                )}`}
                            >
                                <span className="text-2xl font-bold">
                                    {overallRating}
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-slate-200 mt-2">
                                {averageScore.toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {hardSkills.length} kỹ năng
                            </p>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-400 mb-3">
                            Phân bố đánh giá
                        </p>
                        {["S", "A", "B", "C"].map((rating) => {
                            const count =
                                ratingStats[rating as keyof typeof ratingStats];
                            const percentage =
                                (count / hardSkills.length) * 100;
                            return (
                                <div key={rating} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 text-xs font-bold rounded border ${getRatingColor(
                                                    rating
                                                )}`}
                                            >
                                                {rating}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {count} kỹ năng
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor:
                                                    rating === "S"
                                                        ? "#facc15"
                                                        : rating === "A"
                                                        ? "#4ade80"
                                                        : rating === "B"
                                                        ? "#60a5fa"
                                                        : "#94a3b8",
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {hardSkills.map((skill: any, index: number) => {
                    const isExpanded = expandedSkills.has(index);
                    return (
                        <div key={index} className="flex flex-col">
                            <div
                                className="group pb-3 lg:pb-4 border-b border-slate-800 transition-all duration-300 cursor-pointer"
                                onClick={() => toggleSkill(index)}
                            >
                                <div className="flex items-center justify-between mb-2 lg:mb-3">
                                    <div className="flex items-center gap-1.5 lg:gap-2">
                                        <span className="text-base lg:text-xl">
                                            {skill.icon}
                                        </span>
                                        <span className="text-xs lg:text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                                            {skill.name}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400" />
                                        )}
                                    </div>
                                    <span className="text-xs lg:text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                                        {skill.value}%
                                    </span>
                                </div>
                                <div className="h-1 lg:h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 group-hover:border-blue-500/30 transition-colors">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-300"
                                        style={{ width: `${skill.value}%` }}
                                    />
                                </div>
                            </div>

                            {/* Sub-skills */}
                            {isExpanded && skill.subSkills && (
                                <div className="mt-2 mb-3 space-y-2 pl-4 lg:pl-6">
                                    {skill.subSkills.map(
                                        (subSkill: any, subIndex: number) => (
                                            <div
                                                key={subIndex}
                                                className="flex items-center justify-between py-1.5 px-2 bg-slate-800/40 rounded-lg"
                                            >
                                                <span className="text-xs text-slate-400">
                                                    {subSkill.name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 w-12 lg:w-16 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-blue-400"
                                                            style={{
                                                                width: `${subSkill.value}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-400 w-8 text-right">
                                                        {subSkill.value}%
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SkillsTab;
