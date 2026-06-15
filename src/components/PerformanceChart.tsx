import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

const COLORS_DARK = [
  "#60A5FA", // Blue 400
  "#A78BFA", // Violet 400
  "#2DD4BF", // Teal 400
  "#FBBF24", // Amber 400
  "#34D399", // Emerald 400
  "#FB923C", // Orange 400
  "#F87171", // Red 400
  "#F472B6", // Pink 400
];

const COLORS_LIGHT = [
  "#2563EB", // Blue 600
  "#7C3AED", // Violet 600
  "#0D9488", // Teal 600
  "#CA8A04", // Amber 600
  "#059669", // Emerald 600
  "#EA580C", // Orange 600
  "#DC2626", // Red 600
  "#DB2777", // Pink 600
];

function PerformanceChart() {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [techData, setTechData] = useState<any[]>([]);
  const [scoreData, setScoreData] = useState<any[]>([]);

  // Correctly resolve "system" theme
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    setResolvedTheme(isDark ? "dark" : "light");

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
  
  // High contrast colors
  const textColor = isDark ? "#F8FAFC" : "#0F172A"; 
  const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const tooltipBg = isDark ? "#1E293B" : "#FFFFFF";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const chartPrimary = isDark ? "#3B82F6" : "#2563EB";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    fetch(`http://localhost:5000/api/dashboard/${user.id}`)
      .then((res) => res.json())
      .then((data) => setDashboardData(data));

    fetch(`http://localhost:5000/api/chart-data/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPerformanceData(data.performanceData || []);
        setTechData(data.techData || []);
        setScoreData(data.scoreData || []);
      })
      .catch((err) => console.error("Chart Error:", err));
  }, []);

  return (
    <div className="space-y-8">
      {/* =========================
          TOP PERFORMANCE CHART
      ========================= */}
      <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">
              Performance Analytics
            </p>
            <h2 className="text-3xl font-display font-bold tracking-tight">
              Skill Progression
            </h2>
            <p className="text-muted-foreground mt-1">
              Visualize your growth across various technology domains.
            </p>
          </div>

          <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl text-primary font-black shadow-sm text-center">
            AVG {dashboardData?.averageScore || 0}%
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartPrimary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartPrimary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke={textColor} 
              fontSize={11} 
              fontWeight={600}
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={11} 
              fontWeight={600}
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]} 
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div 
                      className="rounded-2xl p-4 shadow-2xl backdrop-blur-md border"
                      style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
                    >
                      <p className="text-muted-foreground text-[10px] font-bold uppercase mb-2">
                        {data.label}
                      </p>
                      <div className="space-y-1">
                        <p className="text-primary font-bold text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartPrimary }} />
                          {data.technology}
                        </p>
                        <p className="text-foreground font-black text-2xl">
                          {data.score}%
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={chartPrimary}
              fill="url(#colorScore)"
              strokeWidth={5}
              dot={{ r: 6, fill: isDark ? "#071028" : "#FFFFFF", stroke: chartPrimary, strokeWidth: 3 }}
              activeDot={{ r: 8, strokeWidth: 0, fill: chartPrimary }}
            />
            </AreaChart>
            </ResponsiveContainer>
            </div>
            </div>

            {/* =========================
            PIE + BAR SECTION
            ========================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PIE CHART */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-all duration-300">
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">
            Distribution
            </p>
            <h2 className="text-2xl font-display font-bold mb-8 tracking-tight">
            Skill Breakdown
            </h2>

            <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={techData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={75}
                paddingAngle={8}
              >
                {techData.map((_: any, index) => (
                  <Cell 
                    key={index} 
                    fill={colors[index % colors.length]} 
                    stroke={isDark ? "#0F172A" : "#FFFFFF"} 
                    strokeWidth={4}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  borderRadius: "16px", 
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
                }}
                itemStyle={{ color: isDark ? "#F8FAFC" : "#0F172A", fontWeight: 'bold' }}
              />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle" 
                wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: 'bold' }}
              />
            </PieChart>
            </ResponsiveContainer>
            </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-all duration-300">
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2">
            Benchmarking
            </p>
            <h2 className="text-2xl font-display font-bold mb-8 tracking-tight">
            Technology Scores
            </h2>

            <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} barCategoryGap={35}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="tech" 
                stroke={textColor} 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke={textColor} 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]} 
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: chartPrimary, opacity: 0.1 }}
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  borderRadius: "16px", 
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
                }}
              />
              <Bar 
                dataKey="score" 
                fill={chartPrimary} 
                radius={[10, 10, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>

            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;
