import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

interface AIData {
  weakestSkill: string;
  weakestScore: number;
  recommendation: string;
}

function AIRecommendation() {
  const navigate = useNavigate();
  const [aiData, setAIData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    fetch(`http://localhost:5000/api/ai-recommendation/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAIData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AI Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-[2rem] p-8 h-full animate-pulse">
        <div className="h-6 w-1/3 bg-muted rounded-full mb-4" />
        <div className="h-24 w-full bg-muted rounded-2xl mb-4" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[2rem] p-8 h-full shadow-sm relative overflow-hidden group">
      {/* GLOW EFFECT */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            AI Personalized Coaching
          </span>
        </div>

        <h3 className="text-2xl font-display font-bold mb-4">
          Ready to master <span className="text-primary">{aiData?.weakestSkill || "New Skills"}</span>?
        </h3>

        <div className="bg-secondary/50 border border-border/50 rounded-2xl p-6 mb-8 flex-1">
          <p className="text-muted-foreground leading-relaxed italic">
            "{aiData?.recommendation || "Take more tests to get personalized AI recommendations and career path guidance."}"
          </p>
        </div>

        <button
          onClick={() => navigate("/select")}
          className="w-full bg-primary hover:opacity-90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>Start Practice Session</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default AIRecommendation;
