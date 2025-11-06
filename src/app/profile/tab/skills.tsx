import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function SkillsTab({ userInfo }: any) {
  const skillsData = userInfo.skills.map((skill: any) => ({
    icon: skill.icon,
    skill: skill.name,
    value: parseFloat(skill.value),
    fullMark: 100,
  }));

  return (
    <div className="flex flex-col">
      {/* Radar Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250} className="sm:hidden">
          <RadarChart data={skillsData}>
            <PolarGrid stroke="#475569" strokeWidth={1} />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#cbd5e1", fontSize: 9, fontWeight: 500 }}
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
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.7}
              strokeWidth={2}
            />
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
              itemStyle={{ color: "#60a5fa", fontSize: "11px" }}
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
              tick={{ fill: "#cbd5e1", fontSize: 14, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickCount={6}
            />
            <Radar
              name="Kỹ năng"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.7}
              strokeWidth={2}
            />
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

      {/* Skills List */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {skillsData.map((skill: any, index: number) => (
          <div
            key={index}
            className="group pb-3 lg:pb-4 border-b border-slate-800 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="text-base lg:text-xl">{skill.icon}</span>
                <span className="text-xs lg:text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                  {skill.skill}
                </span>
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
        ))}
      </div>
    </div>
  );
}

export default SkillsTab;