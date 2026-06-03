import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Home,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  type TestResult,
  getPerformanceLevel,
  generateFeedback,
} from "@/lib/questionUtils";

const ResultsPage = () => {

  const navigate = useNavigate();

  const [result, setResult] =
    useState<TestResult | null>(null);

  useEffect(() => {

    const data =
      sessionStorage.getItem("testResult");

    if (!data) {

      navigate("/");
      return;

    }

    const parsedResult =
      JSON.parse(data);

console.log(
  "RESULT TECHNOLOGY:",
  parsedResult.technology
);

    setResult(parsedResult);

    /* =========================
       PREVENT DUPLICATE SAVE
    ========================= */

    const saveKey =
      `saved_${parsedResult.technology}_${parsedResult.scorePercentage}`;

    const alreadySaved =
      sessionStorage.getItem(saveKey);

    if (alreadySaved === "true") {

      return;

    }

    /* =========================
       GET USER
    ========================= */

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    /* =========================
       FETCH TECHNOLOGIES
    ========================= */

    fetch(
      "http://localhost:5000/api/technologies"
    )

      .then((res) => res.json())

      .then((technologies) => {

        const selectedTechnology =
          technologies.find(
            (t: any) =>

              t.name
                .toLowerCase()
                .trim() ===
              parsedResult.technology
                .toLowerCase()
                .trim()

          );

        if (!selectedTechnology) {

          return null;

        }

        const score =
          Math.round(

            (
              parsedResult.correctAnswers /
              parsedResult.totalQuestions
            ) * 100

          );

        const payload = {

          user_id: user.id,

          technology_id:
            selectedTechnology.id,

          score: score,

          total_questions:
            parsedResult.totalQuestions,

          correct_answers:
            parsedResult.correctAnswers,

          difficulty:
            parsedResult.difficulty,

        };

        return fetch(
          "http://localhost:5000/api/save-result",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),

          }
        );

      })

      .then(async (res) => {

        if (!res) return;

        await res.json();

        sessionStorage.setItem(
          saveKey,
          "true"
        );
        const currentTests =
  Number(
    localStorage.getItem(
      "totalTests"
    ) || 0
  );

localStorage.setItem(
  "totalTests",
  String(currentTests + 1)
);

      })

      .catch((err) => {

        console.log(err);

      });

  }, [navigate]);

  if (!result) return null;

  const performance =
    getPerformanceLevel(
      result.scorePercentage
    );

  const feedback =
    generateFeedback(result);

  const timeTakenMin =
    Math.floor(result.timeTaken / 60);

  const timeTakenSec =
    result.timeTaken % 60;

  return (

    <div className="min-h-screen bg-[#071028] text-white pt-24 pb-12">

      <div className="container mx-auto px-6 max-w-3xl">

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.95,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            duration: 0.5,
          }}

        >

          <div className="bg-[#111c44]/80 border border-cyan-500/10 rounded-3xl p-8 text-center mb-8">

            <Trophy className="h-12 w-12 mx-auto mb-4 text-cyan-400" />

            <h1 className="text-4xl font-bold mb-2">
              Test Complete!
            </h1>

            <p className="text-gray-400 mb-6">

              {result.technology}
              {" — "}
              {result.difficulty}

            </p>

            <div className="text-6xl font-bold text-cyan-400 mb-4">

              {result.scorePercentage}%

            </div>

            <div className="text-lg mb-6">

              {performance.level}

            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">

              <div className="bg-[#1a254f]/80 rounded-2xl p-4">

                <div className="text-3xl font-bold">

                  {result.totalQuestions}

                </div>

                <div className="text-sm text-gray-400">

                  Total

                </div>

              </div>

              <div className="bg-[#1a254f]/80 rounded-2xl p-4">

                <div className="text-3xl font-bold text-green-400">

                  {result.correctAnswers}

                </div>

                <div className="text-sm text-gray-400">

                  Correct

                </div>

              </div>

              <div className="bg-[#1a254f]/80 rounded-2xl p-4">

                <div className="text-3xl font-bold text-red-400">

                  {result.wrongAnswers}

                </div>

                <div className="text-sm text-gray-400">

                  Wrong

                </div>

              </div>

            </div>

            <p className="text-sm text-gray-400 mt-6">

              Time taken:
              {" "}
              {timeTakenMin}m
              {" "}
              {timeTakenSec}s

            </p>

          </div>

          <div className="bg-[#111c44]/80 border border-cyan-500/10 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-4 text-cyan-400">

              AI Performance Feedback

            </h2>

            <p className="text-gray-300">

              {feedback}

            </p>

          </div>

          <div className="flex flex-wrap gap-4 justify-center">

  {/* RETAKE TEST */}

  <Button

    onClick={() =>

      navigate(
        `/test?tech=${encodeURIComponent(
          result.technology
        )}&difficulty=${result.difficulty}`
      )

    }

    className="bg-cyan-500 hover:bg-cyan-600 text-white"

  >

    <RotateCcw className="h-4 w-4 mr-2" />

    Retake Test

  </Button>

  {/* CHOOSE ANOTHER TEST */}

  <Button

    variant="outline"

    onClick={() =>
      navigate("/select")
    }

    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"

  >

    Choose Another Test

  </Button>

  {/* HOME */}

  <Button

    variant="outline"

    onClick={() =>
      navigate("/")
    }

    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"

  >

    <Home className="h-4 w-4 mr-2" />

    Home

  </Button>

  {/* REVIEW ANSWERS */}

  <Button

    variant="outline"

    onClick={() =>
      navigate("/review")
    }

    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"

  >

    Review Answers

  </Button>

</div>

        </motion.div>

      </div>

    </div>

  );

};

export default ResultsPage;