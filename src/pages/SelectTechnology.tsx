import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, Target } from "lucide-react";
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
    description: "Fundamentals and basic concepts",
    color: "bg-emerald-500 text-white",
  },
  {
    name: "Intermediate",
    description: "Applied knowledge and patterns",
    color: "bg-primary text-white",
  },
  {
    name: "Advanced",
    description: "Expert-level and architecture",
    color: "bg-purple-600 text-white",
  },
];

const SelectTechnology = () => {
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    const startAIPractice = async () => {
      const autoStart = localStorage.getItem("aiAutoStart");
      const technology = localStorage.getItem("aiTechnology");
      let difficulty = localStorage.getItem("aiDifficulty") as Difficulty | null;

      if (autoStart !== "true") return;
      if (!technology || !difficulty) return;

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userPlan = user?.plan?.toLowerCase() || "free";

      try {
        const response = await fetch(`http://localhost:5000/api/check-test-access/${user.id}`);
        const data = await response.json();
        if (!data.allowed) {
          alert(data.message);
          navigate("/pricing");
          return;
        }
      } catch (error) {
        console.error("Access check failed:", error);
      }

      if (userPlan === "free") difficulty = "Beginner";
      if (userPlan === "standard" && difficulty === "Advanced") difficulty = "Intermediate";

      const techObject = technologies.find((t) => t.name === technology);
      if (!techObject) return;

      localStorage.setItem("selectedTechnology", JSON.stringify(techObject));
      localStorage.setItem("selectedDifficulty", difficulty);
      localStorage.removeItem("aiAutoStart");
      localStorage.removeItem("aiTechnology");
      localStorage.removeItem("aiDifficulty");

      navigate(`/test?tech=${encodeURIComponent(technology)}&difficulty=${encodeURIComponent(difficulty)}`);
    };

    startAIPractice();
  }, [navigate]);

  const handleStart = async () => {
    if (!selectedTech || !selectedDifficulty) {
      alert("Please select technology and difficulty");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    const userPlan = user.plan?.toLowerCase() || "free";

    try {
      const response = await fetch(`http://localhost:5000/api/check-test-access/${user.id}`);
      if (!response.ok) return;
      const data = await response.json();
      if (!data.allowed) {
        alert(data.message);
        navigate("/pricing");
        return;
      }
    } catch (error) {
      console.error("Access check failed:", error);
      return;
    }

    if (userPlan === "free" && selectedDifficulty !== "Beginner") {
      alert("Free plan only allows Beginner tests");
      return;
    }

    if (userPlan === "standard" && selectedDifficulty === "Advanced") {
      alert("Advanced tests require Pro plan");
      return;
    }

    const techObject = technologies.find((t) => t.name === selectedTech);
    if (!techObject) return;

    localStorage.setItem("selectedTechnology", JSON.stringify(techObject));
    localStorage.setItem("selectedDifficulty", selectedDifficulty);
    navigate(`/test?tech=${encodeURIComponent(selectedTech)}&difficulty=${encodeURIComponent(selectedDifficulty)}`);
    
    setStep(1);
    setSelectedTech(null);
    setSelectedDifficulty(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none grayscale blur-sm"
        style={{ backgroundImage: `url(${bg1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* PROGRESS INDICATOR */}
        <div className="flex items-center gap-4 mb-16 max-w-md mx-auto">
          <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">
                  Choose Your Technology
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Select the skill you want to validate today. Each test is AI-optimized for your growth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {technologies.map((tech) => (
                  <motion.div
                    whileHover={{ y: -10 }}
                    key={tech.name}
                    onClick={() => tech.status !== "coming-soon" && setSelectedTech(tech.name)}
                    className={`
                      relative overflow-hidden cursor-pointer rounded-[2rem] border transition-all duration-300 p-8 min-h-[260px] flex flex-col justify-between group
                      ${selectedTech === tech.name
                        ? "border-primary bg-primary/10 shadow-2xl shadow-primary/10 ring-4 ring-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-xl"
                      }
                      ${tech.status === "coming-soon" ? "grayscale opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    <div>
                      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
                      <h3 className="text-2xl font-display font-bold mb-3">{tech.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{tech.description}</p>
                    </div>
                    {tech.status === "coming-soon" && (
                      <div className="mt-4 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block w-fit">
                        Coming Soon
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedTech}
                  className="bg-primary text-white h-16 px-12 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Continue to Difficulty <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-card border border-border rounded-[3rem] p-10 md:p-16 shadow-2xl max-w-3xl mx-auto transition-all duration-300">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-10 transition-colors uppercase tracking-widest"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Tech
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Select Difficulty</h2>
                </div>

                <p className="text-muted-foreground mb-12 text-lg">
                  Challenging yourself in <span className="text-primary font-black uppercase">{selectedTech}</span>
                </p>

                <div className="space-y-6">
                  {difficulties.map((diff) => (
                    <motion.div
                      whileHover={{ x: 10 }}
                      key={diff.name}
                      onClick={() => setSelectedDifficulty(diff.name)}
                      className={`
                        cursor-pointer rounded-2xl border p-8 flex items-center justify-between transition-all duration-300
                        ${selectedDifficulty === diff.name
                          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                          : "border-border bg-background hover:border-primary/30"
                        }
                      `}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${diff.color}`}>
                          {diff.name}
                        </div>
                        <p className="text-foreground font-bold text-lg">{diff.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedDifficulty === diff.name ? 'border-primary bg-primary' : 'border-muted'}`}>
                        {selectedDifficulty === diff.name && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16 flex justify-end">
                  <Button
                    onClick={handleStart}
                    disabled={!selectedDifficulty}
                    className="bg-primary text-white h-16 px-12 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Start Final Assessment <ArrowRight className="ml-2 h-5 w-5" />
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
