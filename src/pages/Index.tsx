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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        <div className="relative container mx-auto px-6 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-accent">AI-Powered Testing Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 text-primary-foreground">
              Online Test for{" "}
              <span className="gradient-text">IT Technologies</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 leading-relaxed max-w-xl">
              Evaluate your technical skills with AI-generated assessments. Choose your technology, select your level, and prove your expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
  size="lg"
  className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12 rounded-xl font-semibold shadow-lg"
  onClick={() => {
    console.log("clicked"); // 🔥 debug

    const user = localStorage.getItem("user");

    if (!user) {
      window.dispatchEvent(new Event("open-login"));
    } else {
      window.location.href = "#/select";
    }
  }}
>
  Start Test <ArrowRight className="ml-2 h-5 w-5" />
</Button>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional-grade assessments designed to evaluate real-world technical skills
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-elevated p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 MX Infotech — AI-Powered IT Assessment Platform
        </div>
      </footer>
    </div>
  );
};

export default Index;
