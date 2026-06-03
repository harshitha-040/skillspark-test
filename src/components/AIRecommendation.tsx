import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AIData {
  weakestSkill: string;
  weakestScore: number;
  recommendation: string;
}

function AIRecommendation() {

  const navigate = useNavigate();

  const [aiData, setAiData] =
    useState<AIData | null>(null);

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
          "AI Recommendation:",
          data
        );

        setAiData(data);

      })

      .catch((err) => {

        console.log(
          "AI Recommendation Error:",
          err
        );

      });

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (!aiData) {

    return (

      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-cyan-400">

          Loading AI Recommendation...

        </h2>

      </div>

    );

  }

  /* =========================
     GET USER PLAN
  ========================= */

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userPlan =
    user?.plan?.toLowerCase() || "free";

  /* =========================
     DETERMINE DIFFICULTY
  ========================= */

  let difficulty = "Beginner";

  /* FREE */

  if (userPlan === "free") {

    difficulty = "Beginner";

  }

  /* STANDARD */

  else if (
    userPlan === "standard"
  ) {

    if (
      aiData.weakestScore >= 40
    ) {

      difficulty = "Intermediate";

    } else {

      difficulty = "Beginner";

    }

  }

  /* PRO */

  else if (
    userPlan === "pro"
  ) {

    if (
      aiData.weakestScore >= 70
    ) {

      difficulty = "Advanced";

    }

    else if (
      aiData.weakestScore >= 40
    ) {

      difficulty = "Intermediate";

    }

    else {

      difficulty = "Beginner";

    }

  }

  console.log(
    "Recommended Difficulty:",
    difficulty
  );

  /* =========================
     PRACTICE TITLE
  ========================= */

  const practiceTitle =
    `${difficulty} Assessment`;

  /* =========================
     START PRACTICE
  ========================= */

  const handleStartPractice = () => {

    console.log(
      "AI DATA:",
      aiData
    );

    const technology =
      aiData?.weakestSkill;

    if (
      !technology ||
      technology === "No Data"
    ) {

      alert(
        "No weak skill found"
      );

      return;

    }

    /* =========================
       SAVE AI SESSION
    ========================= */

    localStorage.setItem(
      "aiTechnology",
      technology
    );

    localStorage.setItem(
      "aiDifficulty",
      difficulty
    );

    localStorage.setItem(
      "aiAutoStart",
      "true"
    );

    console.log(
      "Saved AI Session:",
      technology,
      difficulty
    );

    navigate("/select");

  };

  return (

    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-6">

      <p className="text-cyan-400 uppercase tracking-[4px] text-sm">

        AI Recommendation

      </p>

      <h2 className="text-3xl font-bold mt-3">

        Improve Your{" "}

        {aiData.weakestSkill}

        {" "}Skills

      </h2>

      <p className="text-gray-300 mt-4 leading-7">

        {aiData.recommendation}

      </p>

      <div className="mt-6 bg-black/20 rounded-2xl p-4 border border-cyan-500/10">

        <p className="text-gray-400 text-sm">

          Recommended Practice

        </p>

        <h3 className="text-cyan-400 text-xl font-bold mt-2">

          {practiceTitle}

        </h3>

      </div>

      <button

        onClick={handleStartPractice}

        className="mt-6 bg-cyan-500 hover:bg-cyan-400 transition-all text-black px-6 py-3 rounded-2xl font-bold"

      >

        Start Practice

      </button>

    </div>

  );

}

export default AIRecommendation;