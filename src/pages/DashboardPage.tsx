import { useEffect, useState } from "react";

import PerformanceChart from "@/components/PerformanceChart";
import UserProfileCard from "@/components/UserProfileCard";
import AIRecommendation from "@/components/AIRecommendation";
import ImprovementPanel from "@/components/ImprovementPanel";

const DashboardPage = () => {

  const [stats, setStats] =
    useState<any>(null);

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
        setStats(data);
      })

      .catch((err) => {
        console.error("Dashboard Error:", err);
      });

  }, []);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userPlan = user.plan?.toLowerCase() || "free";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 space-y-8 transition-colors duration-300">
      {/* =========================
          WELCOME BANNER
      ========================= */}
      <div className={`rounded-[2.5rem] p-10 border transition-all duration-500 overflow-hidden relative ${
        userPlan === "pro"
          ? "bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-card border-yellow-500/20 shadow-xl shadow-yellow-500/5"
          : "bg-gradient-to-br from-primary/10 via-blue-500/5 to-card border-primary/20 shadow-xl shadow-primary/5"
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Welcome back, {user.username || "Explorer"}!
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              {userPlan === "pro"
                ? "You're on the Pro plan. All advanced features and master badges are unlocked. Keep leading the way."
                : userPlan === "standard"
                  ? "Standard plan active. Your progress is accelerating. Keep pushing your limits to reach Elite status."
                  : "You're currently exploring on the Free plan. Upgrade to unlock advanced tests, professional certifications, and deeper AI insights."
              }
            </p>
          </div>

          {userPlan === "free" && (
            <button
              onClick={() => window.location.hash = "/pricing"}
              className="bg-primary hover:opacity-90 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-primary/30 active:scale-95 whitespace-nowrap"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
        
        {/* DECORATIVE BACKGROUND */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">
        <UserProfileCard stats={stats} />

        <div className="space-y-8">
          <PerformanceChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AIRecommendation />
            <ImprovementPanel />
          </div>
        </div>
      </div>
    </div>
  );

};

export default DashboardPage;
