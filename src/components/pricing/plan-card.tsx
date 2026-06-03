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
      "2 tests per month",
      "Beginner-level tests",
      "Watermarked certificate",
      "Basic score summary"
    ]
  },
  {
    tier: "Standard",
    price: 199,
    period: "month",
    features: [
      "Beginner + Intermediate tests",
      "Unlimited attempts",
      "Verified certificate download",
      "Basic performance analytics",
      "Email support"
    ]
  },
  {
    tier: "Pro",
    price: 499,
    period: "month",
    popular: true,
    features: [
      "All levels: Beginner → Advanced",
      "MCQ + coding assessments",
      "Detailed analytics & insights",
      "Shareable resume badge",
      "Priority support",
      "3-day free trial"
    ]
  }
];

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between">

      {/* 🔥 MOST POPULAR */}
      {plan.popular && (
        <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
          Most popular
        </span>
      )}

      <div>
        {/* TITLE */}
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {plan.tier}
        </h3>

        {/* PRICE */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ₹{plan.price}
          <span className="text-sm text-gray-500">/{plan.period}</span>
        </h2>

        {/* FEATURES */}
        <ul className="space-y-2 mb-6">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center text-gray-600 text-sm">
              ✔ <span className="ml-2">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* BUTTON */}
      <button
        className={`w-full py-2 rounded-lg text-white font-medium transition ${
          plan.tier === "Pro"
            ? "bg-purple-500 hover:bg-purple-600"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {plan.tier === "Free" ? "Start for free" : "Get Started"}
      </button>
    </div>
  );
}