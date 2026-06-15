import { useState } from "react";
import { X, User, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  setUser: (user: any) => void;
  onClose: () => void;
};

function SignupModal({ setUser, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan") || "null");
      const plan = selectedPlan?.tier?.toLowerCase() || "free";

      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, plan }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      const loginResponse = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      if (loginData.success) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
        setUser(loginData.user);
      }

      localStorage.removeItem("selectedPlan");
      onClose();
      window.location.href = "#/dashboard";
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-card border border-border rounded-[2.5rem] p-10 w-full max-w-[460px] shadow-2xl overflow-hidden transition-all duration-300"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">Join SkillSpark</h2>
          <p className="text-muted-foreground font-medium text-sm">Start your technical mastery journey</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="Secure Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-destructive text-xs font-bold mt-4 text-center bg-destructive/10 p-3 rounded-xl border border-destructive/20"
          >
            {error}
          </motion.p>
        )}

        <button
          onClick={handleSignup}
          disabled={loading || !username || !email || !password}
          className="w-full bg-primary hover:opacity-95 text-white py-4 rounded-2xl mt-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Mastery Account"}
        </button>

        <p className="text-sm text-center mt-8 text-muted-foreground font-medium">
          Already have an account?{" "}
          <button
            className="text-primary font-black uppercase tracking-tighter hover:underline"
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event("open-login"));
            }}
          >
            Log In
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default SignupModal;
