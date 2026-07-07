import { useState } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency, formatPercent } from "../../lib/utils";
import { TrendingUp, TrendingDown, Eye, Activity } from "lucide-react";

export function MarketOverview() {
  const { stocks, selectedSymbol, setSelectedSymbol } = useMarketStore();
  const [activeCategory, setActiveCategory] = useState<'gainers' | 'losers' | 'active'>('gainers');

  // Derive categories dynamically from stock list
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 4);

  const getActiveList = () => {
    switch (activeCategory) {
      case 'gainers': return topGainers;
      case 'losers': return topLosers;
      case 'active': return mostActive;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md">
      {/* Category selector row */}
      <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Activity size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Market Intelligence Highlights</h2>
        </div>
        
        <div className="flex gap-1.5">
          {(['gainers', 'losers', 'active'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getActiveList().map((stock) => {
          const isUp = stock.changePercent >= 0;
          const isSelected = selectedSymbol === stock.symbol;
          
          return (
            <div
              key={stock.symbol}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                isSelected 
                  ? 'bg-primary/5 border-primary/40 glow-blue' 
                  : 'bg-secondary/15 border-border/15 hover:border-border/40 hover:bg-secondary/30'
              }`}
            >
              {/* Highlight active selection marker */}
              {isSelected && <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-primary" />}

              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-extrabold text-slate-200 text-xs block group-hover:text-primary transition-colors">
                    {stock.symbol}
                  </span>
                  <span className="text-[9px] text-muted-foreground block truncate max-w-[120px]">
                    {stock.name}
                  </span>
                </div>
                
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                  isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {formatPercent(stock.changePercent)}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {formatCurrency(stock.price)}
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground block">
                    Vol: {Number((stock.volume / 1000000).toFixed(1))}M
                  </span>
                </div>
                
                <Eye size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
