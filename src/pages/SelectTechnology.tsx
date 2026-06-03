import { useEffect, useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import bg1 from "@/assets/bg1.jpg";

import {
  technologies,
  type Technology,
  type Difficulty,
} from "@/lib/questionUtils";

const difficulties: {
  name: Difficulty;
  description: string;
  color: string;
}[] = [
  {
    name: "Beginner",
    description:
      "Fundamentals and basic concepts",
    color: "bg-success text-white",
  },

  {
    name: "Intermediate",
    description:
      "Applied knowledge and patterns",
    color: "bg-accent text-white",
  },

  {
    name: "Advanced",
    description:
      "Expert-level and architecture",
    color: "bg-destructive text-white",
  },
];

const SelectTechnology = () => {

  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [selectedTech, setSelectedTech] =
    useState<Technology | null>(null);

  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState<Difficulty | null>(null);

  const [step, setStep] =
    useState<1 | 2>(1);

/* =========================
   AI AUTO START FLOW
========================= */

useEffect(() => {

  const startAIPractice =
    async () => {

      const autoStart =
        localStorage.getItem(
          "aiAutoStart"
        );

      const technology =
        localStorage.getItem(
          "aiTechnology"
        );

      let difficulty =
        localStorage.getItem(
          "aiDifficulty"
        ) as Difficulty | null;

      console.log(
        "AI AUTO START:",
        technology,
        difficulty
      );

      if (
        autoStart !== "true"
      ) return;

      if (
        !technology ||
        !difficulty
      ) {

        console.error(
          "Missing AI practice data"
        );

        return;

      }

      /* =========================
         GET USER
      ========================= */

      const user = JSON.parse(
        localStorage.getItem("user")
        || "null"
      );

      const userPlan =
        user?.plan?.toLowerCase()
        || "free";

      /* =========================
         CHECK TEST ACCESS
      ========================= */

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/check-test-access/${user.id}`
          );

        const data =
          await response.json();

        if (!data.allowed) {

          alert(data.message);

          navigate("/pricing");

          return;

        }

      } catch (error) {

        console.log(
          "Access check failed:",
          error
        );

      }

      /* =========================
         APPLY PLAN RESTRICTIONS
      ========================= */

      if (
        userPlan === "free"
      ) {

        difficulty = "Beginner";

      }

      if (
        userPlan === "standard" &&
        difficulty === "Advanced"
      ) {

        difficulty = "Intermediate";

      }

      console.log(
        "FINAL AI DIFFICULTY:",
        difficulty
      );

      /* =========================
         FIND TECHNOLOGY
      ========================= */

      const techObject =
        technologies.find(
          (t) => t.name === technology
        );

      if (!techObject) {

        console.error(
          "Technology not found:",
          technology
        );

        return;

      }

      /* =========================
         SAVE TEST SESSION
      ========================= */

      localStorage.setItem(

        "selectedTechnology",

        JSON.stringify(techObject)

      );

      localStorage.setItem(
        "selectedDifficulty",
        difficulty
      );

      /* =========================
         CLEAR AI STORAGE
      ========================= */

      localStorage.removeItem(
        "aiAutoStart"
      );

      localStorage.removeItem(
        "aiTechnology"
      );

      localStorage.removeItem(
        "aiDifficulty"
      );

      /* =========================
         REDIRECT TO TEST
      ========================= */

      navigate(

        `/test?tech=${encodeURIComponent(
          technology
        )}&difficulty=${encodeURIComponent(
          difficulty
        )}`

      );

    };

  startAIPractice();

}, [navigate]);

/* =========================
   START TEST
========================= */

const handleStart = async () => {

  /* =========================
     VALIDATION
  ========================= */

  if (!selectedTech) {

    alert(
      "Please select a technology"
    );

    return;

  }

  if (!selectedDifficulty) {

    alert(
      "Please select a difficulty"
    );

    return;

  }

  console.log(
    "Selected Technology:",
    selectedTech
  );

  console.log(
    "Selected Difficulty:",
    selectedDifficulty
  );

  /* =========================
     GET USER
  ========================= */

  const user = JSON.parse(

    localStorage.getItem("user")
    || "null"

  );

  if (!user) {

    alert(
      "Please login first"
    );

    window.dispatchEvent(
      new Event("open-login")
    );

    return;

  }

  const userPlan =
    user.plan?.toLowerCase()
    || "free";

  /* =========================
     CHECK TEST ACCESS
  ========================= */

  try {

    const response =
      await fetch(
        `http://localhost:5000/api/check-test-access/${user.id}`
      );

    if (!response.ok) {

      alert(
        "Server error while checking access"
      );

      return;

    }

    const data =
      await response.json();

    console.log(
      "ACCESS DATA:",
      data
    );

    if (!data.allowed) {

      alert(data.message);

      navigate("/pricing");

      return;

    }

  } catch (error) {

    console.log(
      "Access check failed:",
      error
    );

    alert(
      "Unable to verify plan access"
    );

    return;

  }

  /* =========================
     FREE PLAN RULES
  ========================= */

  if (

    userPlan === "free" &&
    selectedDifficulty !== "Beginner"

  ) {

    alert(
      "Free plan only allows Beginner tests"
    );

    return;

  }

  /* =========================
     STANDARD PLAN RULES
  ========================= */

  if (

    userPlan === "standard" &&
    selectedDifficulty === "Advanced"

  ) {

    alert(
      "Advanced tests require Pro plan"
    );

    return;

  }

  /* =========================
     FIND TECHNOLOGY
  ========================= */

  const techObject =
    technologies.find(
      (t) => t.name === selectedTech
    );

  if (!techObject) {

    console.error(
      "Technology configuration missing"
    );

    alert(
      "Technology configuration error"
    );

    return;

  }

  /* =========================
     SAVE TEST SESSION
  ========================= */

  localStorage.setItem(

    "selectedTechnology",

    JSON.stringify(techObject)

  );

  localStorage.setItem(
    "selectedDifficulty",
    selectedDifficulty
  );

  /* =========================
     NAVIGATE TO TEST
  ========================= */

  const testUrl =

    `/test?tech=${encodeURIComponent(
      selectedTech
    )}&difficulty=${encodeURIComponent(
      selectedDifficulty
    )}`;

  console.log(
    "Navigating to:",
    testUrl
  );

  navigate(testUrl);

  /* =========================
     RESET FLOW
  ========================= */

  setStep(1);

  setSelectedTech(null);

  setSelectedDifficulty(null);

};

  return (

    <div
      className="min-h-screen pt-20 pb-12 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-[#020817]/80 backdrop-blur-[2px]" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* =========================
            PROGRESS BAR
        ========================= */}

        <div className="flex items-center gap-3 mb-10">

          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 1
                ? "bg-cyan-400"
                : "bg-gray-700"
            }`}
          />

          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 2
                ? "bg-cyan-400"
                : "bg-gray-700"
            }`}
          />

        </div>

        <AnimatePresence mode="wait">
{/* =========================
    STEP 1
========================= */}

{step === 1 && (

  <motion.div
    key="step1"
    initial={{
      opacity: 0,
      x: 30,
    }}
    animate={{
      opacity: 1,
      x: 0,
    }}
    exit={{
      opacity: 0,
      x: -30,
    }}
    transition={{
      duration: 0.4,
    }}
  >

    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
      Choose Your Technology
    </h1>

    <div className="flex items-center justify-between mb-10">

      <div>

        <p className="text-gray-300 text-lg">
          Select the technology you want to be tested on
        </p>

      </div>

      {/* TOP NEXT BUTTON */}

      <Button
        onClick={() => setStep(2)}
        disabled={!selectedTech}
        size="lg"
        className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl px-6 py-5 text-lg shadow-[0_10px_35px_rgba(34,211,238,0.4)]"
      >

        Next

        <ArrowRight className="ml-2 h-5 w-5" />

      </Button>

    </div>

    {/* TECHNOLOGY GRID */}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {technologies.map((tech) => (

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -8,
          }}
          whileTap={{
            scale: 0.98,
          }}
          key={tech.name}
          onClick={() =>
            tech.status !== "coming-soon" &&
            setSelectedTech(tech.name)
          }
          className={`
            relative overflow-hidden cursor-pointer
            rounded-3xl border
            backdrop-blur-2xl
            transition-all duration-300
            p-7 min-h-[240px]

            ${
              selectedTech === tech.name
                ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_55px_rgba(6,182,212,0.35)]"
                : "border-[#1E3A5F] bg-[#07142b]/90 hover:bg-[#0d1b36]/95"
            }

            ${
              tech.status === "coming-soon"
                ? "grayscale opacity-60 pointer-events-none"
                : ""
            }
          `}
        >

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />

          {tech.status === "coming-soon" && (

            <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              Coming Soon
            </div>

          )}

          <div className="text-5xl mb-6 drop-shadow-lg">
            {tech.icon}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            {tech.name}
          </h3>

          <p className="text-gray-200 leading-relaxed text-sm">
            {tech.description}
          </p>

        </motion.div>

      ))}

    </div>

    {/* =========================
        BOTTOM NEXT BUTTON
    ========================= */}

    <div className="mt-10 flex justify-end">

      <Button
        onClick={() => setStep(2)}
        disabled={!selectedTech}
        size="lg"
        className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl px-6 py-5 text-lg shadow-[0_10px_35px_rgba(34,211,238,0.4)]"
      >

        Next

        <ArrowRight className="ml-2 h-5 w-5" />

      </Button>

    </div>

  </motion.div>

)}

          {/* =========================
              STEP 2
          ========================= */}

          {step === 2 && (

            <motion.div
              key="step2"
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -30,
              }}
              transition={{
                duration: 0.4,
              }}
            >

              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">

                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-gray-300 hover:text-white mb-8 transition-colors"
                >

                  <ChevronLeft className="h-4 w-4" />

                  Back

                </button>

                <h1 className="text-4xl font-bold text-white mb-3">
                  Select Difficulty
                </h1>

                <p className="text-gray-300 mb-10 text-lg">

                  Taking{" "}

                  <span className="font-semibold text-cyan-400">
                    {selectedTech}
                  </span>{" "}

                  test

                </p>

                <div className="grid gap-5 max-w-2xl">

                  {difficulties.map((diff) => (

                    <motion.div
                      whileHover={{
                        scale: 1.02,
                      }}
                      key={diff.name}
                      onClick={() =>
                        setSelectedDifficulty(diff.name)
                      }
                      className={`
                        cursor-pointer rounded-2xl
                        border backdrop-blur-lg
                        p-6 flex items-center gap-5
                        transition-all duration-300

                        ${
                          selectedDifficulty === diff.name
                            ? "border-cyan-400 bg-[#06B6D4]/10 shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                            : "border-white/20 bg-white/10 hover:bg-white/15"
                        }
                      `}
                    >

                      <div
                        className={`px-5 py-2 rounded-full text-sm font-bold ${diff.color}`}
                      >
                        {diff.name}
                      </div>

                      <p className="text-gray-200 text-base">
                        {diff.description}
                      </p>

                    </motion.div>

                  ))}

                </div>

                <div className="mt-10 flex justify-end">

                  <Button
                    onClick={handleStart}
                    disabled={!selectedDifficulty}
                    size="lg"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl px-8 py-6 text-lg shadow-[0_10px_35px_rgba(34,211,238,0.4)]"
                  >

                    Start Test

                    <ArrowRight className="ml-2 h-5 w-5" />

                  </Button>

                </div>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </div>

  );

};

export default SelectTechnology;