import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/pricing/site-header";
import {
  PlanCard,
  PLANS,
} from "../components/pricing/plan-card";

function PricingPage() {

  const [billing, setBilling] =
    useState<"monthly" | "yearly">(
      "monthly"
    );

  const navigate = useNavigate();

  /* =========================
     BILLING
  ========================= */

  const plans = PLANS.map((p) =>
    billing === "yearly" &&
    p.price > 0
      ? {
          ...p,
          price: Math.round(
            p.price * 10
          ),
          period: "year",
        }
      : p
  );

  /* =========================
     ACTIVATE PLAN
  ========================= */

  const activatePlan =
    async (
      plan: any,
      currentUser?: any
    ) => {

      try {
        const user =
          currentUser ||
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "null"
          );

        if (!user) {
          localStorage.setItem("selectedPlan", JSON.stringify(plan));
          window.dispatchEvent(new Event("open-signup"));
          return;
        }

        const response = await fetch("http://localhost:5000/api/select-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            plan: plan.tier.toLowerCase(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          const updatedUser = { ...user, plan: plan.tier.toLowerCase() };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.removeItem("selectedPlan");
          alert(`${plan.tier} plan activated`);
          navigate("/dashboard");
        } else {
          alert("Plan activation failed");
        }
      } catch (error) {
        console.error("Plan Error:", error);
        alert("Server error");
      }
    };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SiteHeader />

      {/* =========================
          HERO SECTION
      ========================= */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            Level Up Your <span className="text-primary">Career</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium">
            Choose the perfect plan to validate your skills, earn industry-recognized badges, and accelerate your growth with AI-powered insights.
          </p>

          {/* BILLING TOGGLE */}
          <div className="flex items-center justify-center gap-6 mb-16">
            <span className={`text-sm font-bold uppercase tracking-widest ${billing === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>

            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className="w-20 h-10 bg-secondary rounded-full p-1.5 transition-all duration-300 border border-border shadow-inner"
            >
              <div className={`w-7 h-7 bg-primary rounded-full transition-all duration-500 shadow-lg ${billing === "yearly" ? "translate-x-10" : "translate-x-0"}`} />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold uppercase tracking-widest ${billing === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly
              </span>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md border border-primary/20">SAVE 20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          PLAN CARDS
      ========================= */}
      <div className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.tier}
              onClick={() => activatePlan(p)}
              className="h-full cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <PlanCard plan={p} />
            </div>
          ))}
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="bg-secondary/30 border-t border-border py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-12 font-black uppercase tracking-[0.3em] text-xs">Trusted by Technical Professionals Worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 dark:opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
             <span className="text-3xl font-black italic tracking-tighter">JAVA</span>
             <span className="text-3xl font-black italic tracking-tighter">PYTHON</span>
             <span className="text-3xl font-black italic tracking-tighter">REACT</span>
             <span className="text-3xl font-black italic tracking-tighter">SELENIUM</span>
             <span className="text-3xl font-black italic tracking-tighter">AWS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
