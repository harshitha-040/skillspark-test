import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
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
  const technology = (searchParams.get("tech") as Technology) || "Core Java";
  const difficulty = (searchParams.get("difficulty") as Difficulty) || "Beginner";

  const [questions] = useState(() =>
    generateMockQuestions(technology, difficulty)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

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
      timestamp: Date.now(),
    };

    sessionStorage.setItem("testResult", JSON.stringify(result));
    navigate("/results");
  }, [answers, questions, technology, difficulty, timeLeft, navigate]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
    <div className="min-h-screen pt-24 pb-12 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* TOP STATUS BAR */}
        <div className="bg-card border border-border p-6 mb-8 rounded-[2rem] flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-tight">{technology}</h1>
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{difficulty} Assessment</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 font-mono text-xl font-bold ${
            isLowTime 
              ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" 
              : "bg-secondary text-foreground border-border"
          }`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-muted-foreground">
            <span>Assessment Progress</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* MAIN QUESTION AREA */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border p-10 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <span className="text-8xl font-black">{currentQuestion + 1}</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {q.type} Mode
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                Step {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 leading-snug tracking-tight">
              {q.question}
            </h2>

            <div className="space-y-4">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers({ ...answers, [q.id]: idx })}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative ${
                    answers[q.id] === idx
                      ? "border-primary bg-primary/5 text-foreground shadow-lg"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all ${
                        answers[q.id] === idx
                          ? "border-primary bg-primary text-white scale-110"
                          : "border-border text-muted-foreground group-hover:border-primary/50"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg font-medium py-0.5">{option}</span>
                  </div>
                  {answers[q.id] === idx && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                  )}
                </button>
              ))}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-between mt-14 pt-10 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="h-14 px-8 rounded-xl border-border bg-background hover:bg-secondary font-bold"
              >
                <ChevronLeft className="h-5 w-5 mr-2" /> Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="h-14 px-10 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Continue Assessment <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="h-14 px-10 bg-emerald-600 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform"
                >
                  Finalize & Submit
                </Button>
              )}
            </div>
          </motion.div>

          {/* QUESTION NAVIGATOR */}
          <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm h-fit">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-muted-foreground">Jump to Question</h3>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`aspect-square rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                    i === currentQuestion
                      ? "bg-primary text-white shadow-lg ring-4 ring-primary/10"
                      : answers[questions[i].id] !== undefined
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <Button
                onClick={() => setShowSubmitDialog(true)}
                variant="outline"
                className="w-full h-14 rounded-xl border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold transition-all"
              >
                Finish Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CONFIRMATION */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-card text-foreground border-border rounded-[2rem] p-10 max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <AlertDialogTitle className="text-3xl font-display font-bold text-center tracking-tight">
              Ready to submit?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-muted-foreground text-lg pt-2 leading-relaxed">
              You've answered <span className="text-foreground font-black">{answeredCount}</span> of {questions.length} questions.
              {answeredCount < questions.length && (
                <span className="block mt-4 p-4 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 font-bold text-sm">
                  Warning: {questions.length - answeredCount} questions are still blank.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col sm:flex-col gap-3 mt-10">
            <AlertDialogAction
              onClick={handleSubmit}
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Yes, Submit Now
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-14 border-none bg-secondary text-muted-foreground rounded-2xl font-bold">
              No, Review Answers
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestPage;
