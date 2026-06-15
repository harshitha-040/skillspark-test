import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Clock, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Brain, title: "AI-Generated Questions", description: "Smart questions tailored to your chosen technology and skill level" },
  { icon: Clock, title: "Timed Assessments", description: "30-minute tests that simulate real certification exams" },
  { icon: Award, title: "Instant Results", description: "Get your score, performance analysis, and AI feedback immediately" },
  { icon: CheckCircle, title: "10+ Technologies", description: "From Java and Python to React and SQL — test what matters" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
        
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-[15%] left-[5%] text-[12vw] font-black text-foreground/[0.03] dark:text-white/[0.02] rotate-[-12deg] whitespace-nowrap">
            TESTING SPEED
          </div>
          <div className="absolute bottom-[10%] right-[5%] text-[10vw] font-black text-foreground/[0.02] dark:text-white/[0.01] rotate-[5deg] whitespace-nowrap">
            IT ASSESSMENT
          </div>
          <div className="absolute top-[40%] right-[15%] text-primary/[0.05] text-7xl font-mono">
            {"{ code: 'mastery' }"}
          </div>
          <div className="absolute bottom-[20%] left-[15%] text-primary/[0.05] text-6xl font-mono">
            {"<skills />"}
          </div>
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 tracking-tight">
              Online Test for{" "}
              <span className="gradient-text block mt-2">IT Technologies</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl font-medium">
              Evaluate your technical skills with AI-generated assessments. Choose your technology, select your level, and prove your expertise.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button
                size="lg"
                className="bg-primary text-white hover:opacity-90 text-lg px-12 h-16 rounded-[2rem] font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (!user) {
                    window.dispatchEvent(new Event("open-login"));
                  } else {
                    window.location.href = "#/select";
                  }
                }}
              >
                Start Free Test <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-background border-t border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Professional-grade assessments designed to evaluate real-world technical skills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card/50 backdrop-blur-sm border border-border p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-secondary/30 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 text-center text-sm text-muted-foreground font-bold uppercase tracking-[0.2em]">
          © 2026 MX Infotech — Professional AI-Powered Assessment Ecosystem
        </div>
      </footer>
    </div>
  );
};

export default Index;
