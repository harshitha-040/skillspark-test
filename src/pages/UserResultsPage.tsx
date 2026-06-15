import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Calendar, 
  Trophy, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  Award, 
  Target,
  FileJson,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { getPerformanceLevel } from "@/lib/questionUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Result {
  id: number;
  technology_name: string;
  technology_icon: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  difficulty: string;
  time_taken: number;
  created_at: string;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899"];

const UserResultsPage = () => {
  const { theme } = useTheme();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [techFilter, setTechFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

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
  const textColor = isDark ? "#94A3B8" : "#64748B";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg = isDark ? "#1E293B" : "#FFFFFF";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    fetch(`http://localhost:5000/api/results/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (results.length === 0) {
      return { 
        total: 0, avg: 0, highest: 0, 
        proficiency: { value: "--", trendText: "", trendColor: "", caption: "Take your first assessment" } 
      };
    }
    
    const total = results.length;
    const avg = Math.round(results.reduce((acc, r) => acc + r.score, 0) / total);
    const highest = Math.max(...results.map(r => r.score));
    
    let trendText = "";
    let trendColor = "";
    let caption = `Based on ${total} assessment${total > 1 ? 's' : ''}`;

    if (total === 1) {
      trendText = "First Assessment Completed";
      trendColor = "text-muted-foreground";
    } else {
      const latestScore = results[0].score;
      const previousScore = results[1].score;
      const diff = latestScore - previousScore;
      
      if (diff > 0) {
        trendText = "↗ Improving";
        trendColor = "text-emerald-500";
      } else if (diff < 0) {
        trendText = "↘ Needs Practice";
        trendColor = "text-red-500";
      } else {
        trendText = "→ Stable";
        trendColor = "text-muted-foreground";
      }
    }

    return { total, avg, highest, proficiency: { value: `${avg}%`, trendText, trendColor, caption } };
  }, [results]);

  const chartData = useMemo(() => {
    return [...results].reverse().map(r => ({
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: r.score,
      tech: r.technology_name
    }));
  }, [results]);

  const techBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    results.forEach(r => {
      counts[r.technology_name || "Specialized"] = (counts[r.technology_name || "Specialized"] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [results]);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = results.length;
      const percentage = Math.round((data.value / total) * 100);
      
      return (
        <div className="bg-card border border-border p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: payload[0].payload.fill || payload[0].color }} 
            />
            <p className="font-bold text-foreground">{data.name}</p>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {data.value} {data.value === 1 ? 'Assessment' : 'Assessments'} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const uniqueTechs = useMemo(() => {
    return ["All", ...Array.from(new Set(results.map(r => r.technology_name || "Specialized")))];
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchesSearch = (r.technology_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = techFilter === "All" || r.technology_name === techFilter;
      
      let matchesScore = true;
      if (scoreFilter === "70+") matchesScore = r.score >= 70;
      else if (scoreFilter === "90+") matchesScore = r.score >= 90;
      else if (scoreFilter === "<70") matchesScore = r.score < 70;

      let matchesDate = true;
      const rDate = new Date(r.created_at);
      const now = new Date();
      if (dateFilter === "Today") matchesDate = rDate.toDateString() === now.toDateString();
      else if (dateFilter === "Week") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        matchesDate = rDate >= lastWeek;
      } else if (dateFilter === "Month") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        matchesDate = rDate >= lastMonth;
      }

      return matchesSearch && matchesTech && matchesScore && matchesDate;
    });
  }, [results, searchTerm, techFilter, scoreFilter, dateFilter]);

  const exportCSV = () => {
    const headers = ["Test Name", "Technology", "Score", "Difficulty", "Date", "Time Taken"];
    const rows = filteredResults.map(r => [
      `${r.technology_name || "Unknown"} ${r.difficulty} Test`,
      r.technology_name || "Specialized",
      `${r.score}%`,
      r.difficulty,
      new Date(r.created_at).toLocaleDateString(),
      `${Math.floor(r.time_taken / 60)}m ${r.time_taken % 60}s`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillspark_results_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("SkillSpark Performance Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableHeaders = [["Test Assessment", "Category", "Score", "Date", "Duration"]];
    const tableData = filteredResults.map(r => [
      `${r.technology_name || "Unknown"} - ${r.difficulty}`,
      r.technology_name || "Specialized",
      `${r.score}%`,
      new Date(r.created_at).toLocaleDateString(),
      `${Math.floor(r.time_taken / 60)}m ${r.time_taken % 60}s`
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`skillspark_report_${new Date().getTime()}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse text-xl font-black uppercase tracking-[0.3em]">
          MX Talent Analytics
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 space-y-8 transition-colors duration-300">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 rounded-[1.25rem] bg-primary/10 border border-primary/20 shadow-sm">
              <ClipboardList className="text-primary h-7 w-7" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Assessment Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">Detailed insights and history of your technical journey.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-border bg-card hover:bg-secondary font-bold text-sm" onClick={exportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" /> Export CSV
          </Button>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-border bg-card hover:bg-secondary font-bold text-sm" onClick={exportPDF}>
            <Download className="mr-2 h-4 w-4 text-primary" /> Download PDF
          </Button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Assessments", value: stats.total, icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Average Score", value: `${stats.avg}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Highest Score", value: `${stats.highest}%`, icon: Award, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { 
            label: "Current Proficiency", 
            value: stats.proficiency.value, 
            icon: Target, 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10",
            trendText: stats.proficiency.trendText,
            trendColor: stats.proficiency.trendColor,
            caption: stats.proficiency.caption
          },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-card border border-border p-8 rounded-[2rem] shadow-sm relative overflow-hidden group"
          >
            <div className={`relative z-10 flex justify-between ${('caption' in stat) ? 'items-start' : 'items-center'}`}>
              <div>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <h3 className="text-4xl font-black tracking-tight">{stat.value}</h3>
                {('caption' in stat) && stat.caption && (
                  <div className="mt-4 space-y-1">
                    {stat.trendText && <p className={`text-sm font-bold ${stat.trendColor}`}>{stat.trendText}</p>}
                    <p className="text-xs text-muted-foreground">{stat.caption}</p>
                  </div>
                )}
              </div>
              <div className={`p-5 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        {/* PROGRESS CHART */}
        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" /> Performance Trend
            </h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: "1.25rem", border: `1px solid ${tooltipBorder}`, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  itemStyle={{ color: "var(--primary)" }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
          <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
            <Award className="h-6 w-6 text-purple-500" /> Topic Distribution
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {techBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDark ? "#0F172A" : "#FFFFFF"} strokeWidth={4} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '30px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FILTERS & TABLE */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300">
        {/* FILTER BAR */}
        <div className="p-8 border-b border-border flex flex-wrap items-center gap-6 bg-secondary/20">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by technology name..." 
              className="bg-background border-border pl-12 rounded-2xl h-14 focus:ring-primary focus:border-primary text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Technology", value: techFilter, options: uniqueTechs, onChange: setTechFilter },
              { label: "Score Range", value: scoreFilter, options: ["All", "90+", "70+", "<70"], onChange: setScoreFilter },
              { label: "Timeframe", value: dateFilter, options: ["All", "Today", "Week", "Month"], onChange: setDateFilter },
            ].map((filter, i) => (
              <div key={i} className="relative group">
                <select 
                  className="appearance-none bg-background border border-border rounded-2xl h-14 pl-5 pr-12 text-sm font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[140px]"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                >
                  {filter.options.map(opt => <option key={opt} value={opt} className="bg-card">{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {filteredResults.length === 0 ? (
            <div className="py-32 text-center">
              <ClipboardList className="h-16 w-16 text-muted mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-display font-bold text-muted-foreground">No matching assessments</h3>
              <p className="text-muted-foreground mt-2 font-medium">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Technology Assessment</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-center">Score Result</th>
                  <th className="px-8 py-6">Level</th>
                  <th className="px-8 py-6">Date Completed</th>
                  <th className="px-8 py-6">Duration</th>
                  <th className="px-8 py-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResults.map((result) => {
                  const isPass = result.score >= 70;
                  const date = new Date(result.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={result.id} className="group hover:bg-secondary/20 transition-all duration-200">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-5">
                          <div className="text-3xl w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-border group-hover:scale-110 transition-transform shadow-sm">
                            {result.technology_icon || "📝"}
                          </div>
                          <div>
                            <p className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                              {result.technology_name || "Specialized"}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mt-1">Technical Skills Test</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          isPass ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}>
                          {isPass ? "Certified" : "Not Passed"}
                        </span>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-black ${
                            result.score >= 90 ? "text-yellow-500" : isPass ? "text-primary" : "text-red-500"
                          }`}>
                            {result.score}%
                          </span>
                          <div className="w-20 h-1.5 bg-secondary rounded-full mt-2 overflow-hidden border border-border/50">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${isPass ? "bg-primary" : "bg-red-500"}`}
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          result.difficulty === 'Advanced' ? 'text-yellow-500' : 'text-muted-foreground'
                        }`}>
                          {result.difficulty}
                        </span>
                      </td>
                      <td className="px-8 py-7 text-sm font-medium text-muted-foreground">
                        {date}
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <Clock className="h-4 w-4 opacity-50" />
                          {result.time_taken > 0 ? (
                            `${Math.floor(result.time_taken / 60)}m ${String(result.time_taken % 60).padStart(2, '0')}s`
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => window.location.hash = `/results?id=${result.id}`}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex justify-center pb-20 pt-8">
        <Button 
          onClick={() => window.location.hash = "/select"}
          className="bg-primary text-white px-12 h-16 rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-transform active:scale-95"
        >
          <Award className="mr-3 h-6 w-6" /> Take New Assessment
        </Button>
      </div>
    </div>
  );
};

export default UserResultsPage;
