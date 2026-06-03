import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  generateMockQuestions,
  type Technology,
  type Difficulty,
  type TestResult,
} from "@/lib/questionUtils";

const TOTAL_TIME = 20 * 60;

const TestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const technology =
  (searchParams.get("tech") as Technology) || "Core Java";

const difficulty =
  (searchParams.get("difficulty") as Difficulty) || "Beginner";

  const [questions] = useState(() =>
    generateMockQuestions(technology, difficulty)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent accidental close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });

    const result: TestResult = {
  technology,
  difficulty,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: questions.length - correct,
      scorePercentage: Math.round((correct / questions.length) * 100),
      answers,
      questions,
      timeTaken: TOTAL_TIME - timeLeft,
    };

    sessionStorage.setItem("testResult", JSON.stringify(result));
    navigate("/results");
  }, [answers, questions, technology, difficulty, timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const q = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const isLowTime = timeLeft < 300;

  if (!searchParams.get("tech") || !searchParams.get("difficulty")) {
  navigate("/select");
  return null;
}

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[#0F172A] text-[#E2E8F0]">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Top bar */}
        <div className="bg-[#1E293B]/80 backdrop-blur-lg border border-[#334155] p-4 mb-6 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-sm text-[#94A3B8]">{technology}</span>
            <span className="mx-2 text-[#334155]">|</span>
            <span className="text-sm font-medium">{difficulty}</span>
          </div>

          <div className={`flex items-center gap-2 font-mono text-lg font-semibold ${
            isLowTime ? "text-red-400" : "text-[#E2E8F0]"
          }`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 text-[#94A3B8]">
            <span>{answeredCount} of {questions.length} answered</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-[1fr_240px] gap-6">

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E293B]/80 backdrop-blur-lg border border-[#334155] p-8 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold">
                {q.type === "mcq" ? "Multiple Choice" : q.type === "scenario" ? "Scenario" : "Conceptual"}
              </span>
              <span className="text-sm text-[#94A3B8]">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-6 leading-relaxed">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers({ ...answers, [q.id]: idx })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    answers[q.id] === idx
                      ? "border-[#6366F1] bg-[#6366F1]/10 text-white"
                      : "border-[#334155] hover:border-[#6366F1]/40 hover:bg-[#1E293B] text-[#94A3B8]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                        answers[q.id] === idx
                          ? "border-[#6366F1] bg-[#6366F1] text-white"
                          : "border-[#334155] text-[#94A3B8]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="rounded-xl border-[#334155] text-[#94A3B8] hover:bg-[#1E293B]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-lg"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl shadow-lg"
                >
                  Submit Test
                </Button>
              )}
            </div>
          </motion.div>

          {/* Side Panel */}
          <div className="bg-[#1E293B]/80 border border-[#334155] p-4 rounded-xl shadow-lg">
            <h3 className="font-semibold text-sm mb-3">Questions</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center ${
                    i === currentQuestion
                      ? "bg-[#6366F1] text-white"
                      : answers[questions[i].id] !== undefined
                      ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-white"
                      : "bg-[#0F172A] text-[#94A3B8]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#334155]">
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="w-full rounded-xl border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white"
              >
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-[#1E293B] text-[#E2E8F0] border-[#334155]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Submit Test?
            </AlertDialogTitle>

            <AlertDialogDescription>
              You answered {answeredCount} / {questions.length}
              {answeredCount < questions.length && (
                <span className="block mt-2 text-red-400">
                  {questions.length - answeredCount} unanswered
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#334155] text-[#94A3B8] hover:bg-[#1E293B]">
              Continue
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestPage;