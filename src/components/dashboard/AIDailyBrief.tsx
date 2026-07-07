import { useState } from "react";
import { useAIStore } from "../../stores/aiStore";
import { Sparkles, Calendar, BookOpen, AlertCircle, Play } from "lucide-react";
import { Badge } from "../ui/badge";

export function AIDailyBrief() {
  const { chatMessages, sendChatMessage, isChatLoading } = useAIStore();
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);

  const bulletPoints = [
    "Inflation indexes (CPI) indicate persistent 3.1% YoY baseline pressure, suggesting Fed 'Higher for Longer' regime.",
    "Hardware supply chains remain tight; chip manufacturers show record booking backlog for Blackwell sub-modules.",
    "Portfolio Risk Factor: Elevated allocation to premium multiples (NVDA, TSLA) warrants partial rotational hedging into secure cash-yield instruments."
  ];

  const handlePlayVoice = () => {
    setIsPlayingBrief(true);
    // Simulate real text-to-speech feedback or sound cue
    setTimeout(() => {
      setIsPlayingBrief(false);
    }, 4000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md relative overflow-hidden">
      {/* Subtle top light bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Morning Research Intelligence Briefing</h2>
            <span className="text-[10px] text-muted-foreground font-mono block">COMPILED TODAY BY SOPHIA MACRO MODEL</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple">LEVEL: STRATEGIST</Badge>
          <button
            onClick={handlePlayVoice}
            disabled={isPlayingBrief}
            className={`flex items-center gap-1.5 px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold cursor-pointer transition-all ${
              isPlayingBrief ? 'animate-pulse text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : ''
            }`}
          >
            <Play size={12} className={isPlayingBrief ? 'animate-spin' : ''} />
            <span>{isPlayingBrief ? 'Synthesizing Speech...' : 'Listen Brief'}</span>
          </button>
        </div>
      </div>

      {/* Bullet points mapping */}
      <div className="space-y-4">
        {bulletPoints.map((pt, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/15 border border-border/10">
            <div className="h-5 w-5 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{pt}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono font-bold uppercase">
          <AlertCircle size={12} />
          <span>🔬 Research Insight - Not Financial Advice</span>
        </div>
        
        <span className="text-[10px] text-muted-foreground font-mono">CONFIDENCE COEFFICIENT: 94.2%</span>
      </div>
    </div>
  );
}
