import { Trophy, Target, Award, Shield, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

function UserProfileCard({ stats }: any) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const performanceItems = [
    { label: "Avg Score", value: `${stats?.averageScore || 0}%`, icon: Target, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Highest", value: `${stats?.highestScore || 0}%`, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Skills", value: stats?.technologies || 0, icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* PROFILE CARD */}
      <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-all duration-300">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/30 rotate-3">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-background border border-border p-2 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold">{user.username}</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-widest">{user.plan || "Free"} Member</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email Address</span>
              <span className="text-sm font-bold truncate">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Joined Date</span>
              <span className="text-sm font-bold">June 2026</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {performanceItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-background border border-border">
              <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
              <span className="text-lg font-black">{item.value}</span>
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PLAN CARD (IF FREE) */}
      {user.plan?.toLowerCase() === 'free' && (
        <div className="bg-primary p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Go Premium</h3>
            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
              Get unlimited tests, professional certificates, and priority support.
            </p>
            <button 
              onClick={() => window.location.hash = "/pricing"}
              className="w-full bg-white text-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              Upgrade Now
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      )}
    </div>
  );
}

export default UserProfileCard;
