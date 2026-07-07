import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency, formatPercent } from "../../lib/utils";
import { Star, Eye, Trash2, HelpCircle } from "lucide-react";

export function Watchlist() {
  const { stocks, watchlist, toggleWatchlist, selectedSymbol, setSelectedSymbol } = useMarketStore();

  const watchedStocks = stocks.filter((s) => watchlist.includes(s.symbol));

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/10">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Research Watchlist</h2>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono font-semibold">{watchedStocks.length} WATCHED</span>
      </div>

      {watchedStocks.length > 0 ? (
        <div className="flex-1 space-y-3.5 overflow-y-auto scrollbar-thin pr-1">
          {watchedStocks.map((stock) => {
            const isUp = stock.changePercent >= 0;
            const isSelected = selectedSymbol === stock.symbol;

            return (
              <div
                key={stock.symbol}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all group ${
                  isSelected
                    ? "bg-primary/5 border-primary/30 shadow-sm"
                    : "bg-secondary/10 border-border/15 hover:border-border/30 hover:bg-secondary/20"
                }`}
              >
                {/* Symbol & Name */}
                <div 
                  onClick={() => setSelectedSymbol(stock.symbol)} 
                  className="flex-1 cursor-pointer"
                >
                  <span className="text-xs font-extrabold text-slate-200 block group-hover:text-primary transition-colors">
                    {stock.symbol}
                  </span>
                  <span className="text-[9px] text-muted-foreground block truncate max-w-[120px]">
                    {stock.name}
                  </span>
                </div>

                {/* mini sparkline SVG representation */}
                <div className="h-6 w-16 mx-4 hidden sm:block">
                  <svg className="w-full h-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke={isUp ? "#10b981" : "#ef4444"}
                      strokeWidth="1.5"
                      points={stock.sparkline
                        .map((val, idx) => {
                          const min = Math.min(...stock.sparkline);
                          const max = Math.max(...stock.sparkline);
                          const delta = max - min || 1;
                          const x = (idx / (stock.sparkline.length - 1)) * 64;
                          const y = 24 - ((val - min) / delta) * 20; // scale nicely inside height 24
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>

                {/* Pricing & Gain */}
                <div 
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  className="text-right cursor-pointer min-w-[70px]"
                >
                  <span className="text-xs font-bold text-slate-100 block">
                    {formatCurrency(stock.price)}
                  </span>
                  <span className={`text-[9px] font-mono font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatPercent(stock.changePercent)}
                  </span>
                </div>

                {/* Remove from watchlist */}
                <button
                  onClick={() => toggleWatchlist(stock.symbol)}
                  className="ml-3 p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove from watchlist"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/15 rounded-lg bg-black/10">
          <HelpCircle size={28} className="text-muted-foreground mb-2 opacity-50" />
          <span className="text-xs text-slate-300 font-semibold block mb-1">Watchlist Empty</span>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Search and select any asset ticker in the top bar, then click the Watchlist star in the Market tab.
          </p>
        </div>
      )}
    </div>
  );
}
