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
     AUTO PLAN ACTIVATION
  ========================= */

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
      || "null"
    );

    const selectedPlan =
      JSON.parse(
        localStorage.getItem(
          "selectedPlan"
        ) || "null"
      );

    if (
      !user ||
      !selectedPlan
    ) return;

    activatePlan(
      selectedPlan,
      user
    );

  }, []);

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

        /* =========================
           USER NOT LOGGED IN
        ========================= */

        if (!user) {

          localStorage.setItem(

            "selectedPlan",

            JSON.stringify(plan)

          );

          window.dispatchEvent(
  new Event("open-signup")
);

return;

        }

        /* =========================
           UPDATE PLAN
        ========================= */

        const response =
          await fetch(

            "http://localhost:5000/api/select-plan",

            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                userId: user.id,

                plan:
                  plan.tier.toLowerCase(),

              }),

            }

          );

        const data =
          await response.json();

        /* =========================
           SUCCESS
        ========================= */

        if (data.success) {

          const updatedUser = {

            ...user,

            plan:
              plan.tier.toLowerCase(),

          };

          localStorage.setItem(

            "user",

            JSON.stringify(
              updatedUser
            )

          );

          localStorage.removeItem(
            "selectedPlan"
          );

          alert(
            `${plan.tier} plan activated`
          );

          navigate(
            "/dashboard"
          );

        } else {

          alert(
            "Plan activation failed"
          );

        }

      } catch (error) {

        console.log(
          "Plan Error:",
          error
        );

        alert(
          "Server error"
        );

      }

    };

  return (

    <div className="min-h-screen bg-gray-50">

      <SiteHeader />

      {/* =========================
          HEADER
      ========================= */}

      <div className="text-center pt-16">

        <h1 className="text-4xl font-bold text-gray-900">

          Choose Your Plan

        </h1>

        {/* BILLING TOGGLE */}

        <div className="mt-6">

          <button

            onClick={() =>
              setBilling(
                "monthly"
              )
            }

            className={`px-4 py-2 rounded-l ${
              billing ===
              "monthly"

                ? "bg-blue-500 text-white"

                : "bg-gray-200"
            }`}

          >

            Monthly

          </button>

          <button

            onClick={() =>
              setBilling(
                "yearly"
              )
            }

            className={`px-4 py-2 rounded-r ${
              billing ===
              "yearly"

                ? "bg-blue-500 text-white"

                : "bg-gray-200"
            }`}

          >

            Yearly

          </button>

        </div>

      </div>

      {/* =========================
          PLAN CARDS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-10 max-w-6xl mx-auto">

        {plans.map((p) => (

          <div
            key={p.tier}
            onClick={() =>
              activatePlan(p)
            }
            className="cursor-pointer"
          >

            <PlanCard plan={p} />

          </div>

        ))}

      </div>

    </div>

  );

}

export default PricingPage;