import React, { useEffect, useState } from "react";
import { Globe, Clock } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency, formatPercent } from "../../lib/utils";

export function TopHeader() {
  const { activeTab } = useUIStore();
  const { indices, updateMarketPrices } = useMarketStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update UTC clock and market ticking simulation
  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const marketTimer = setInterval(() => updateMarketPrices(), 4000); // Ticks prices dynamically!
    return () => {
      clearInterval(timeTimer);
      clearInterval(marketTimer);
    };
  }, [updateMarketPrices]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Investment Dashboard';
      case 'market': return 'Market Intelligence Intelligence';
      case 'portfolio': return 'Portfolio Twin Engine';
      case 'research': return 'SEC Fundamental Terminal';
      case 'ai-workspace': return 'AI Multi-Agent RAG Labs';
      case 'settings': return 'System Configurations';
      default: return 'AlphaMatrix Research';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/25 backdrop-blur-xl shrink-0 z-20">
      {/* Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-base font-bold text-slate-100 tracking-tight whitespace-nowrap">
          {getPageTitle()}
        </h1>
      </div>

      {/* Indices ticker row & UTC display */}
      <div className="flex items-center gap-6">
        {/* Market index ticker values */}
        <div className="lg:flex items-center gap-4 hidden border-r border-border/25 pr-6 font-mono text-[11px]">
          {indices.map((idx) => {
            const isGain = idx.change >= 0;
            return (
              <div key={idx.name} className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-semibold uppercase">{idx.name}</span>
                <span className="text-slate-200">{formatCurrency(idx.value).replace('$', '')}</span>
                <span className={isGain ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                  {formatPercent(idx.changePercent)}
                </span>
              </div>
            );
          })}
        </div>

        {/* UTC Clock & System Environment markers */}
        <div className="flex items-center gap-4 text-muted-foreground text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-primary" />
            <span>{currentTime.toISOString().split('T')[1].slice(0, 8)} UTC</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
            <Globe size={10} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>LIVE PROTOCOL</span>
          </div>
        </div>
      </div>
    </header>
  );
}
