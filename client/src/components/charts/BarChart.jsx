import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "api/stripe", complexity: 12 },
  { name: "lib/auth", complexity: 9 },
  { name: "lib/prisma", complexity: 6 },
  { name: "lib/redis", complexity: 7 },
  { name: "middleware", complexity: 5 },
  { name: "app/dashboard", complexity: 8 },
];

export function BarChart() {
  return (
    <div className="w-full h-[250px] flex items-center justify-center font-mono text-[10px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" vertical={false} />
          <XAxis dataKey="name" stroke="#a78bfa" />
          <YAxis stroke="#a78bfa" />
          <Tooltip
            contentStyle={{ background: "#12121e", borderColor: "#1e1e3a" }}
            labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
          />
          <Bar dataKey="complexity" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
