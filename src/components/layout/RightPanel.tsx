import { useState } from "react";
import { Newspaper, ChevronRight, ChevronLeft, Sparkles, MessageCircleCode, ArrowUpRight } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useMarketStore } from "../../stores/marketStore";
import { useAIStore } from "../../stores/aiStore";
import { formatDate } from "../../lib/utils";

export function RightPanel() {
  const { rightPanelOpen, setRightPanelOpen } = useUIStore();
  const { news } = useMarketStore();
  const { activeWorkflow } = useAIStore();
  const [briefSection, setBriefSection] = useState<'brief' | 'logs'>('brief');

  if (!rightPanelOpen) {
    return (
      <button
        onClick={() => setRightPanelOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-card border border-r-0 border-border p-1.5 rounded-l-md hover:bg-secondary cursor-pointer z-40 text-muted-foreground hover:text-foreground hidden xl:block shadow-md"
      >
        <ChevronLeft size={16} />
      </button>
    );
  }

  return (
    <aside className="w-80 border-l border-border bg-card/15 backdrop-blur-xl h-screen flex flex-col z-30 shrink-0 relative transition-all duration-300 xl:flex hidden">
      {/* Collapse button */}
      <button
        onClick={() => setRightPanelOpen(false)}
        className="absolute -left-3 top-6 bg-card border border-border p-1 rounded-full hover:bg-secondary cursor-pointer z-40 text-muted-foreground hover:text-foreground shadow"
      >
        <ChevronRight size={12} />
      </button>

      {/* Panel Headers */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/20 shrink-0">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs uppercase tracking-wider">
          <Newspaper size={14} className="text-primary" />
          <span>Macro Stream & News</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/10 px-2 pt-2 shrink-0">
        <button
          onClick={() => setBriefSection('brief')}
          className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider border-b-2 text-center cursor-pointer transition-all ${
            briefSection === 'brief' 
              ? 'border-primary text-slate-100' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Daily Briefing
        </button>
        <button
          onClick={() => setBriefSection('logs')}
          className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider border-b-2 text-center cursor-pointer transition-all ${
            briefSection === 'logs' 
              ? 'border-primary text-slate-100' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          RAG Pipelines
        </button>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {briefSection === 'brief' ? (
          <>
            {/* AI Daily briefing summary card */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 relative overflow-hidden glow-blue">
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                <Sparkles size={14} className="pulse-glow" />
                <span>AI Daily Intelligence Summary</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Data centers are driving semiconductor pipelines to record throughput. Bonds hover as interest-rate indexes steady. Rebalancing tech portfolio sectors into financial defensive buffers (JPM) is recommended.
              </p>
              <div className="mt-3 text-[9px] text-primary font-semibold flex items-center gap-1 font-mono">
                <span>🔬 Research Insight - Not Financial Advice</span>
              </div>
            </div>

            {/* News Lists */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">MARKET INTELLIGENCE FEED</span>
              {news.map((item) => {
                const isPos = item.sentiment === 'positive';
                const isNeg = item.sentiment === 'negative';
                return (
                  <div key={item.id} className="p-3 rounded-lg border border-border/15 bg-card/30 hover:border-border/30 transition-all flex flex-col gap-1.5 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-semibold text-muted-foreground uppercase">{item.source}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isNeg ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-200 group-hover:text-primary transition-colors leading-snug flex items-start gap-1">
                      <span>{item.title}</span>
                      <ArrowUpRight size={10} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-[9px] font-mono text-muted-foreground">{formatDate(item.publishedAt)}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Multi agent active pipeline workflows logging */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold border-b border-border/15 pb-2">
              <MessageCircleCode size={14} className="text-primary" />
              <span>RAG Analysis History</span>
            </div>
            
            {activeWorkflow ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">{activeWorkflow.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 animate-pulse border border-amber-500/25 uppercase font-bold font-mono">
                    {activeWorkflow.status}
                  </span>
                </div>
                
                {/* Workflow execution steps */}
                <div className="relative border-l border-border/30 pl-4 space-y-3 mt-4">
                  {activeWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {/* Step node dot */}
                      <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border ${
                        step.status === 'completed' ? 'bg-emerald-500 border-emerald-400' :
                        step.status === 'running' ? 'bg-amber-500 border-amber-400 animate-ping' :
                        'bg-slate-700 border-slate-600'
                      }`} />
                      
                      <div className="text-xs font-semibold text-slate-300">{step.name}</div>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">{step.agent}</span>
                      {step.output && (
                        <p className="text-[10px] text-slate-400 leading-relaxed bg-black/20 p-2 rounded mt-1 border border-border/10 font-mono">
                          {step.output}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-xs leading-relaxed font-mono">
                No active RAG workflows running.<br />
                Trigger one inside "SEC Fundamental Terminal" or "AI Multi-Agent Labs".
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
