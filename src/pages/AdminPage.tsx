import React from "react";
import { ShieldCheck, Database, Users, Settings, BarChart3, ArrowRight } from "lucide-react";

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-4 md:p-8 lg:p-12 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <ShieldCheck className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                Admin Console
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Central management for questions, users, and ecosystem settings.
            </p>
          </div>
          
          <div className="bg-purple-500/10 text-purple-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-purple-500/20">
            Secure Environment
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: "Questions Management", 
              desc: "Add, edit, or delete questions for different technologies and difficulty levels.", 
              icon: Database, 
              color: "text-primary", 
              bg: "bg-primary/10",
              btn: "bg-primary text-white"
            },
            { 
              title: "User Management", 
              desc: "View technical talent, track their skill evolution, and manage platform access.", 
              icon: Users, 
              color: "text-cyan-500", 
              bg: "bg-cyan-500/10",
              btn: "bg-cyan-500 text-white"
            },
            { 
              title: "Platform Settings", 
              desc: "Configure core assessment rules, timing, and system-wide configurations.", 
              icon: Settings, 
              color: "text-amber-500", 
              bg: "bg-amber-500/10",
              btn: "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
            },
            { 
              title: "Ecosystem Analytics", 
              desc: "Monitor global test performance, aggregate results, and user engagement metrics.", 
              icon: BarChart3, 
              color: "text-purple-500", 
              bg: "bg-purple-500/10",
              btn: "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
            },
          ].map((card, i) => (
            <div key={i} className="bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.02] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6`}>
                  <card.icon className={`w-7 h-7 ${card.color}`} />
                </div>
                
                <h2 className="text-2xl font-display font-bold mb-3 tracking-tight">
                  {card.title}
                </h2>
                
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                  {card.desc}
                </p>

                <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${card.btn}`}>
                  Manage Resources <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
