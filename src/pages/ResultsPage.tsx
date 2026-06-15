import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Home,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  type TestResult,
  getPerformanceLevel,
  generateFeedback,
} from "@/lib/questionUtils";

const ResultsPage = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get("id");

  const [result, setResult] =
    useState<TestResult | null>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {

    if (resultId) {
      /* =========================
         FETCH OLD RESULT
      ========================= */
      fetch(`http://localhost:5000/api/result/${resultId}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setResult({
              technology: data.technology_name || "Unknown",
              difficulty: data.difficulty,
              totalQuestions: data.total_questions,
              correctAnswers: data.correct_answers,
              wrongAnswers: data.total_questions - data.correct_answers,
              scorePercentage: data.score,
              timeTaken: data.time_taken,
              timestamp: new Date(data.created_at).getTime(),
              answers: {},
              questions: []
            });
            setSaveStatus("saved");
          }
        })
        .catch(err => {
          console.error("Error fetching single result:", err);
          setSaveStatus("error");
        });
      
      return;
    }

    const data =
      sessionStorage.getItem("testResult");

    if (!data) {

      navigate("/");
      return;

    }

    const parsedResult =
      JSON.parse(data);

    setResult(parsedResult);

    /* =========================
       GET USER
    ========================= */

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    /* =========================
       FETCH TECHNOLOGY HISTORY
    ========================= */

    fetch(`http://localhost:5000/api/results/${user.id}`)
      .then(res => res.json())
      .then(allResults => {
        if (Array.isArray(allResults)) {
          const techHistory = allResults.filter((r: any) => 
            (r.technology_name || "").toLowerCase().trim() === (parsedResult.technology || "").toLowerCase().trim()
          );
          setHistory(techHistory);
        }
      })
      .catch(err => console.error("History fetch error:", err));

    /* =========================
       PREVENT DUPLICATE SAVE
    ========================= */

    const saveKey = `saved_test_${parsedResult.timestamp}`;

    const alreadySaved =
      sessionStorage.getItem(saveKey);

    if (alreadySaved === "true") {
      setSaveStatus("saved");
      return;

    }

    /* =========================
       SAVE TO DATABASE
    ========================= */
    setSaveStatus("saving");

    fetch("http://localhost:5000/api/technologies")
      .then((res) => res.json())
      .then((technologies) => {

        const selectedTechnology = technologies.find(
          (t: any) => t.name.toLowerCase().trim() === parsedResult.technology.toLowerCase().trim()
        );

        if (!selectedTechnology) {
          console.error("Tech not found in DB:", parsedResult.technology);
          setSaveStatus("error");
          return null;
        }

        const payload = {
          user_id: user.id,
          technology_id: selectedTechnology.id,
          score: parsedResult.scorePercentage,
          total_questions: parsedResult.totalQuestions,
          correct_answers: parsedResult.correctAnswers,
          difficulty: parsedResult.difficulty,
          time_taken: parsedResult.timeTaken,
        };

        return fetch("http://localhost:5000/api/save-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      })
      .then(async (res) => {
        if (!res) return;
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem(saveKey, "true");
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      })
      .catch((err) => {
        console.error("Save Result Error:", err);
        setSaveStatus("error");
      });

  }, [navigate, resultId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse text-xl font-black tracking-widest">LOADING ANALYTICS...</div>
      </div>
    );
  }

  const performance = getPerformanceLevel(result.scorePercentage);
  const feedback = generateFeedback(result);
  const timeTakenMin = Math.floor(result.timeTaken / 60);
  const timeTakenSec = result.timeTaken % 60;
  const isPass = result.scorePercentage >= 70;

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* DB STATUS BADGE */}
          <div className="flex justify-center mb-8">
            {saveStatus === "saving" && (
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-yellow-500/20 animate-pulse">
                Syncing with Cloud...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
                ✓ Assessment Verified & Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-red-500/20">
                ⚠ Local View Only
              </span>
            )}
          </div>

          <div className="bg-card border border-border rounded-[2.5rem] p-10 md:p-16 text-center mb-10 shadow-sm relative overflow-hidden transition-all duration-300">
            {/* BACKGROUND GLOW */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b opacity-10 pointer-events-none ${isPass ? 'from-emerald-500 to-transparent' : 'from-red-500 to-transparent'}`} />

            <div className={`inline-flex p-5 rounded-3xl mb-8 ${isPass ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <Trophy className="h-12 w-12" />
            </div>

            <h1 className="text-5xl font-display font-bold mb-3 tracking-tight">
              Test Completed!
            </h1>

            <p className="text-muted-foreground text-lg mb-10 font-medium">
              {result.technology} <span className="mx-2 opacity-30">•</span> {result.difficulty} Level
            </p>

            <div className={`text-8xl font-black mb-6 tracking-tighter ${isPass ? 'text-primary' : 'text-red-500'}`}>
              {result.scorePercentage}%
            </div>

            <div className="text-xl font-bold uppercase tracking-widest mb-12">
              {performance.level}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto relative z-10">
              <div className="bg-secondary/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-black mb-1">{result.totalQuestions}</div>
                <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Questions</div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-black text-emerald-500 mb-1">{result.correctAnswers}</div>
                <div className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">Correct</div>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-black text-red-500 mb-1">{result.wrongAnswers}</div>
                <div className="text-[10px] uppercase font-black text-red-500 tracking-widest">Incorrect</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-12 text-muted-foreground font-bold">
              <Clock className="h-4 w-4" />
              <span>
                Completion Time: {result.timeTaken > 0 ? (
                  `${Math.floor(result.timeTaken / 60)}m ${String(result.timeTaken % 60).padStart(2, '0')}s`
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>

          {/* PROGRESS ANALYSIS */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-[2rem] p-8 mb-10 shadow-sm transition-all duration-300">
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                Performance Benchmark ({result.technology})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background border border-border p-6 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Historical Best</p>
                  <div className="text-3xl font-black">
                    {Math.max(...history.map(h => h.score))}%
                  </div>
                </div>

                <div className="bg-background border border-border p-6 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Skill Trend</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black">
                      {history[0].score}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      result.scorePercentage > history[0].score 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : result.scorePercentage < history[0].score 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {result.scorePercentage > history[0].score ? '↑ Improved' : result.scorePercentage < history[0].score ? '↓ Lower' : '↔ Stable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI FEEDBACK */}
          <div className="bg-card border border-border rounded-[2rem] p-10 mb-12 shadow-sm transition-all duration-300">
            <h2 className="text-2xl font-display font-bold mb-6 text-primary flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              AI Insight Engine
            </h2>

            <p className="text-muted-foreground leading-relaxed text-lg italic">
              "{feedback}"
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate(`/test?tech=${encodeURIComponent(result.technology)}&difficulty=${result.difficulty}`)}
              className="bg-primary text-white px-10 h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.05] transition-transform"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/select")}
              className="border-border bg-card hover:bg-secondary h-14 px-8 rounded-2xl font-bold"
            >
              <Search className="h-4 w-4 mr-2" />
              Explore Others
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border bg-card hover:bg-secondary h-14 px-8 rounded-2xl font-bold"
            >
              <Home className="h-4 w-4 mr-2" />
              Main Menu
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );

};

export default ResultsPage;
