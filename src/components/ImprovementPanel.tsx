import { useEffect, useState } from "react";
import { TrendingUp, CheckCircle2, Circle } from "lucide-react";

function ImprovementPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;

    fetch(`http://localhost:5000/api/improvement-plan/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Plan Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-card border border-border rounded-[2rem] p-8 h-full shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
          Growth Roadmap
        </span>
      </div>

      <h3 className="text-2xl font-display font-bold mb-8 tracking-tight">Focus Areas</h3>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-muted rounded-2xl animate-pulse" />
          ))
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div 
              key={index} 
              className="group p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center font-black text-primary shadow-sm group-hover:scale-110 transition-transform">
                  {item.tech?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.tech} Mastery</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Focus on {item.topic || 'advanced concepts'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${item.progress || 30}%` }} 
                  />
                </div>
                <span className="text-[10px] font-black text-primary">{item.progress || 30}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <Circle className="w-10 h-10 text-muted mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground text-sm font-medium">Complete more assessments to generate your roadmap.</p>
          </div>
        )}
      </div>

      <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Pro Tip:</span> Users who follow their roadmap improve their scores by <span className="text-primary font-black">40%</span> within 2 weeks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImprovementPanel;
