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
    <div>
      <ResponsiveContainer width="100%" height={300} className="sm:hidden">
        <RadarChart data={skillsData}>
          <PolarGrid stroke="#475569" strokeWidth={1.5} />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#cbd5e1", fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
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
              padding: "8px",
            }}
            labelStyle={{ color: "#e2e8f0", fontWeight: "bold", fontSize: "12px" }}
            itemStyle={{ color: "#60a5fa", fontSize: "12px" }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
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
            labelStyle={{ color: "#e2e8f0", fontWeight: "bold", marginBottom: "5px" }}
            itemStyle={{ color: "#60a5fa" }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {skillsData.map((skill: any, index: any) => (
          <div
            key={index}
            className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-slate-950/50"
          >
            <div className="">{skill.icon}</div>
            <span className="text-xs sm:text-sm text-slate-300 font-medium flex-1">
              {skill.skill}
            </span>
            <span className="text-xs sm:text-sm font-bold text-blue-400">
              {skill.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsTab;