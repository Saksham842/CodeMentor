import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { subject: "Authentication", A: 87, B: 85, fullMark: 100 },
  { subject: "Database", A: 65, B: 80, fullMark: 100 },
  { subject: "Caching", A: 61, B: 75, fullMark: 100 },
  { subject: "Security", A: 35, B: 85, fullMark: 100 },
  { subject: "DevOps", A: 42, B: 70, fullMark: 100 },
  { subject: "Architecture", A: 78, B: 80, fullMark: 100 },
  { subject: "Payments", A: 79, B: 75, fullMark: 100 },
];

export function RadarChart() {
  return (
    <div className="w-full h-[320px] flex items-center justify-center font-mono text-[10px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={defaultData}>
          <PolarGrid stroke="#1e1e3a" />
          <PolarAngleAxis dataKey="subject" stroke="#a78bfa" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e1e3a" tick={false} />
          
          <Radar
            name="Senior Expected"
            dataKey="B"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.15}
          />
          <Radar
            name="Your Score"
            dataKey="A"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.3}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
