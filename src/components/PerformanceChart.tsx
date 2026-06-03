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

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#14b8a6",
  "#facc15",
  "#22c55e",
  "#f97316",
];

function PerformanceChart() {

  const [dashboardData, setDashboardData] =
    useState<any>(null);

  const [performanceData, setPerformanceData] =
    useState<any[]>([]);

  const [techData, setTechData] =
    useState<any[]>([]);

  const [scoreData, setScoreData] =
    useState<any[]>([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    fetch(
      `http://localhost:5000/api/dashboard/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        setDashboardData(data);

      });

    fetch(
      `http://localhost:5000/api/chart-data/${user.id}`
    )
      .then((res) => res.json())

      .then((data) => {

        console.log(
          "TECH DATA:",
          data.techData
        );

        setPerformanceData(
          data.performanceData || []
        );

        setTechData(
          data.techData || []
        );

        setScoreData(
          data.scoreData || []
        );

      })

      .catch((err) => {

        console.log(
          "Chart Error:",
          err
        );

      });

  }, []);

  return (

    <div className="space-y-8">

      {/* =========================
          TOP PERFORMANCE CHART
      ========================= */}

      <div className="bg-[#111c44]/80 border border-cyan-500/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.08)]">

        <div className="flex items-center justify-between mb-8">

          <div>

            <p className="text-cyan-400 uppercase tracking-[5px] text-sm font-semibold">
              Analytics
            </p>

            <h2 className="text-4xl font-bold mt-2 text-white">
              Weekly Performance
            </h2>

            <p className="text-gray-400 mt-2">
              Track your coding progress and assessment growth.
            </p>

          </div>

          <div className="bg-cyan-500/10 border border-cyan-400/20 px-5 py-3 rounded-2xl text-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)]">

            Avg {dashboardData?.averageScore || 0}%

          </div>

        </div>

        <div className="h-[420px]">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={performanceData}>

              <defs>

                <linearGradient
                  id="colorScore"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#22d3ee"
                    stopOpacity={0.4}
                  />

                  <stop
                    offset="95%"
                    stopColor="#22d3ee"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="label"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
                domain={[0, 100]}
              />

              <Tooltip
                content={({ active, payload }) => {

                  if (
                    active &&
                    payload &&
                    payload.length
                  ) {

                    const data =
                      payload[0].payload;

                    return (

                      <div className="bg-[#0f172a] border border-cyan-400 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">

                        <p className="text-white font-semibold mb-2">

                          {data.label}

                        </p>

                        <p className="text-cyan-400 text-sm">

                          Technology:
                          {" "}
                          {data.technology}

                        </p>

                        <p className="text-white text-sm mt-1">

                          Score:
                          {" "}
                          {data.score}%

                        </p>

                      </div>

                    );

                  }

                  return null;

                }}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#22d3ee"
                fill="url(#colorScore)"
                strokeWidth={4}

                dot={(props: any) => {

                  const {
                    cx,
                    cy,
                    payload,
                  } = props;

                  let color =
                    "#8b5cf6";

                  const tech =
                    payload?.technology
                      ?.toLowerCase()
                      ?.trim();

                  if (tech === "core java") {

                    color = "#22d3ee";

                  }

                  else if (tech === "python") {

                    color = "#facc15";

                  }

                  else if (tech === "react") {

                    color = "#3b82f6";

                  }

                  else if (tech === "javascript") {

                    color = "#22c55e";

                  }

                  return (

                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill={color}
                      stroke="#0f172a"
                      strokeWidth={3}
                    />

                  );

                }}
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

        <div className="bg-[#111c44]/80 border border-cyan-500/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.08)]">

          <p className="text-cyan-400 uppercase tracking-[5px] text-sm mb-3 font-semibold">
            Skills
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">
            Average Scores by Technology
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={techData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={4}
                  label={({ name, value }: any) =>
  `${name} ${value}%`
}
                >

                  {techData.map(
                    (_: any, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BAR CHART */}

        <div className="bg-[#111c44]/80 border border-cyan-500/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.08)]">

          <p className="text-cyan-400 uppercase tracking-[5px] text-sm mb-3 font-semibold">
            Reports
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">
            Technology-wise Scores
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={scoreData}
                barCategoryGap={40}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="tech"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                  domain={[0, 100]}
                />

                <Tooltip />

                <Bar
                  dataKey="score"
                  fill="#22d3ee"
                  radius={[12, 12, 0, 0]}
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