type Plan = {
  tier: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    tier: "Free",
    price: 0,
    period: "month",
    features: [
      "2 tests per day",
      "Beginner-level tests",
      "Standard score summary",
      "Community support",
      "Basic achievements"
    ]
  },
  {
    tier: "Standard",
    price: 199,
    period: "month",
    features: [
      "Unlimited daily tests",
      "Beginner + Intermediate tests",
      "Detailed performance analytics",
      "Rising Developer badge",
      "Standard support"
    ]
  },
  {
    tier: "Pro",
    price: 499,
    period: "month",
    popular: true,
    features: [
      "Everything in Standard",
      "Expert-level & Architecture tests",
      "AI Master badges (Java, Python...)",
      "Priority expert support",
      "Custom learning path"
    ]
  }
];

export function PlanCard({ plan }: { plan: Plan }) {
  const isFree = plan.tier === "Free";
  const isPro = plan.tier === "Pro";

  return (
    <div className={`
      relative rounded-[2rem] border transition-all duration-500 p-10 flex flex-col justify-between h-full group
      ${isPro
        ? "bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-card border-yellow-500/30 shadow-xl shadow-yellow-500/5"
        : "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/30"
      }
    `}>

      {/* 🔥 MOST POPULAR */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}

      <div>
        {/* TITLE */}
        <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${
          isPro ? "text-yellow-500" : isFree ? "text-primary" : "text-purple-500"
        }`}>
          {plan.tier}
        </h3>

        {/* PRICE */}
        <div className="flex items-baseline gap-2 mb-10">
          <span className="text-5xl font-black text-foreground tracking-tighter">₹{plan.price}</span>
          <span className="text-muted-foreground font-bold text-sm">/{plan.period}</span>
        </div>

        {/* FEATURES */}
        <ul className="space-y-5 mb-12">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-4 text-muted-foreground text-sm font-medium transition-colors group-hover:text-foreground">
              <span className={`flex-shrink-0 mt-0.5 ${
                isPro ? "text-yellow-500" : isFree ? "text-primary" : "text-purple-500"
              }`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* BUTTON */}
      <button
        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
          isPro
            ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-xl shadow-yellow-500/20"
            : isFree
              ? "bg-secondary text-muted-foreground border border-border"
              : "bg-primary hover:opacity-90 text-white shadow-xl shadow-primary/20"
        }`}
      >
        {isFree ? "Current Plan" : "Upgrade Now"}
      </button>
    </div>
  );
}
