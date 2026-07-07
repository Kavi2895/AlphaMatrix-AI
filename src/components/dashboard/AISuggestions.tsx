import { useState } from "react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { Sparkles, HelpCircle, Check, ArrowRight, TrendingUp } from "lucide-react";
import { useToasts } from "../ui/toast";

export function AISuggestions() {
  const { portfolio, rebalanceToTwin } = usePortfolioStore();
  const { addToast } = useToasts();
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyRebalance = () => {
    setIsApplying(true);
    setTimeout(() => {
      rebalanceToTwin();
      setIsApplying(false);
      addToast({
        title: "Portfolio Rebalanced",
        description: "Successfully rebalanced active weights to match optimal Alpha Hedged Twin configurations.",
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-full">
      {/* Glow bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-violet-500 to-transparent" />

      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary pulse-glow" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Automated Hedging Advice</h2>
          </div>
          <HelpCircle size={14} className="text-muted-foreground cursor-help" title="Optimization engine calculates weights to hedge semiconductor exposure with financial value assets." />
        </div>

        <div className="space-y-4">
          {/* Target recommendation metrics */}
          <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100 mb-1">
              <TrendingUp size={14} className="text-primary" />
              <span>Core Rebalancing Recommendations</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              System calculates a high concentration in chip design (NVDA, 32.1%). Rebalance to allocate 25% to banking sector (JPM) and lower hardware risk index to 28%.
            </p>
          </div>

          {/* Asset target weights comparison table */}
          <div className="rounded border border-border/15 overflow-hidden text-[10px] font-mono">
            <div className="bg-secondary/40 p-1.5 flex justify-between font-bold text-muted-foreground border-b border-border/15">
              <span>SYMBOL</span>
              <span>CURRENT</span>
              <span className="text-primary">OPTIMAL TARGET</span>
            </div>
            <div className="divide-y divide-border/10">
              <div className="p-1.5 flex justify-between">
                <span className="font-bold text-slate-200">AAPL</span>
                <span className="text-slate-400">25.1%</span>
                <span className="text-primary font-bold">20.1%</span>
              </div>
              <div className="p-1.5 flex justify-between">
                <span className="font-bold text-slate-200">NVDA</span>
                <span className="text-slate-400">32.1%</span>
                <span className="text-primary font-bold">28.1%</span>
              </div>
              <div className="p-1.5 flex justify-between">
                <span className="font-bold text-slate-200">JPM</span>
                <span className="text-slate-400">0.0%</span>
                <span className="text-primary font-bold">25.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execute trigger */}
      <button
        onClick={handleApplyRebalance}
        disabled={isApplying}
        className="w-full flex items-center justify-center gap-1.5 mt-5 py-2.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all cursor-pointer shadow-md"
      >
        {isApplying ? (
          <>
            <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            <span>Realigning Allocations...</span>
          </>
        ) : (
          <>
            <Check size={14} />
            <span>Synchronize with AI Twin Portfolio</span>
          </>
        )}
      </button>
    </div>
  );
}
