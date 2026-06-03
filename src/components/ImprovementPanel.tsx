import { useEffect, useState } from "react";

function ImprovementPanel() {

  const [aiData, setAiData] =
    useState<any>(null);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    fetch(
      `http://localhost:5000/api/ai-insights/${user.id}`
    )

      .then((res) => res.json())

      .then((data) => {

        console.log(
          "AI Insights:",
          data
        );

        setAiData(data);

      })

      .catch((err) => {

        console.log(
          "AI Insights Error:",
          err
        );

      });

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (!aiData) {

    return (

      <div className="bg-white/5 border border-cyan-500/10 rounded-3xl p-6 backdrop-blur-lg">

        <h2 className="text-2xl font-bold text-cyan-400">

          Loading AI Insights...

        </h2>

      </div>

    );

  }

  /* =========================
     DYNAMIC DATA
  ========================= */

  const insights = [

    {
      title: "Strongest Skill",

      skill:
        aiData.strongestSkill,

      progress:
        aiData.strongestScore || 0,

      recommendation:
        "Continue advanced practice and real-world projects.",
    },

    {
      title: "Weakest Skill",

      skill:
        aiData.weakestSkill,

      progress:
        aiData.weakestScore || 0,

      recommendation:
        aiData.recommendation,
    },

  ];

  return (

    <div className="bg-white/5 border border-cyan-500/10 rounded-3xl p-6 backdrop-blur-lg">

      <p className="text-cyan-400 uppercase tracking-[4px] text-sm">

        AI Insights

      </p>

      <h2 className="text-3xl font-bold mt-3 mb-8">

        Performance Analysis

      </h2>

      <div className="space-y-6">

        {insights.map((item, index) => (

          <div
            key={index}
            className="bg-white/5 border border-cyan-500/10 rounded-2xl p-5"
          >

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="text-gray-400 text-sm">

                  {item.title}

                </p>

                <h3 className="text-xl font-bold mt-1">

                  {item.skill}

                </h3>

              </div>

              <span className="text-cyan-400 font-bold text-lg">

                {item.progress}%

              </span>

            </div>

            {/* =========================
                PROGRESS BAR
            ========================= */}

            <div className="w-full bg-black/30 rounded-full h-3 mb-4">

              <div
                className="bg-cyan-400 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${item.progress}%`,
                }}
              ></div>

            </div>

            <p className="text-gray-300 text-sm leading-6">

              {item.recommendation}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default ImprovementPanel;