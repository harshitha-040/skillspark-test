import { useEffect, useState } from "react";

import PerformanceChart from "@/components/PerformanceChart";
import UserProfileCard from "@/components/UserProfileCard";
import AIRecommendation from "@/components/AIRecommendation";
import ImprovementPanel from "@/components/ImprovementPanel";
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer,Legend,} from "recharts";

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

        console.log(
          "Dashboard Stats:",
          data
        );

        setStats(data);

      })

      .catch((err) => {

        console.log(
          "Dashboard Error:",
          err
        );

      });

  }, []);

  return (

    <div className="min-h-screen bg-[#071028] text-white p-8 space-y-8">

      <UserProfileCard stats={stats} />

      <PerformanceChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <AIRecommendation />

        <ImprovementPanel />

      </div>

    </div>

  );

};

export default DashboardPage;