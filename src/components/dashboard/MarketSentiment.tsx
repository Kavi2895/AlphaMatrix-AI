import { useState } from "react";
import { Sparkles, ArrowRight, RefreshCw, BarChart2 } from "lucide-react";
import { Badge } from "../ui/badge";

export function MarketSentiment() {
  const [sentiment, setSentiment] = useState(72); // 0 to 100 Fear & Greed index
  const [isSyncing, setIsSyncing] = useState(false);

  const getSentimentLabel = (val: number) => {
    if (val < 30) return { label: "EXTREME FEAR", color: "text-rose-400 border-rose-500/25 bg-rose-500/10" };
    if (val < 45) return { label: "FEAR", color: "text-amber-400 border-amber-500/25 bg-amber-500/10" };
    if (val < 60) return { label: "NEUTRAL", color: "text-slate-300 border-slate-500/25 bg-slate-500/10" };
    if (val < 80) return { label: "GREED", color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10" };
    return { label: "EXTREME GREED", color: "text-primary border-primary/25 bg-primary/10" };
  };

  const current = getSentimentLabel(sentiment);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSentiment(Math.floor(60 + Math.random() * 25)); // fluctuate greed elegantly
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">AI Multi-Factor Sentiment</h2>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="p-1 hover:bg-white/5 text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Sentiment Gauge representation */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center">
            {/* Circular Track */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-secondary"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-primary transition-all duration-1000 ease-out"
                strokeWidth="8"
                fill="none"
                strokeDasharray="301"
                strokeDashoffset={301 - (301 * sentiment) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
                {sentiment}
              </span>
              <span className="block text-[8px] text-muted-foreground font-mono font-bold uppercase mt-0.5">INDEX SCORE</span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${current.color}`}>
              {current.label}
            </span>
          </div>
        </div>
      </div>

      {/* AI Advice snippet */}
      <div className="mt-4 p-3 rounded bg-secondary/15 border border-border/10">
        <span className="text-[9px] uppercase font-bold text-primary font-mono tracking-wider flex items-center gap-1.5 mb-1.5">
          <Sparkles size={11} className="pulse-glow" />
          <span>Macro Hedging Signal</span>
        </span>
        <p className="text-[10px] text-slate-300 leading-normal font-sans">
          Greed index at {sentiment} indicates a near-term overextended trend. Tighten stop-losses on high-multiple silicon holdings.
        </p>
      </div>
    </div>
  );
}
