import { useMarketStore } from "../../stores/marketStore";
import { formatPercent } from "../../lib/utils";
import { Grid, HelpCircle } from "lucide-react";

export function MarketHeatmap() {
  const { sectors, stocks, setSelectedSymbol } = useMarketStore();

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md">
      <div className="flex items-center justify-between mb-4 border-b border-border/10 pb-2">
        <div className="flex items-center gap-2">
          <Grid size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Sector Tree Matrix Map</h2>
        </div>
        <HelpCircle size={14} className="text-muted-foreground hover:text-foreground cursor-help" title="Sectors mapped by daily returns. Red indicates decline, Green indicates growth." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sec) => {
          const isUp = sec.changePercent >= 0;
          const sectorStocks = stocks.filter(s => s.sector === sec.sector);

          return (
            <div key={sec.sector} className="p-4 rounded-lg border border-border/15 bg-secondary/10 flex flex-col justify-between">
              {/* Sector title and performance indicator */}
              <div className="flex items-center justify-between mb-3 border-b border-border/5 pb-1.5">
                <span className="text-[11px] font-bold text-slate-200 tracking-tight uppercase truncate max-w-[140px]">
                  {sec.sector}
                </span>
                <span className={`text-[10px] font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercent(sec.changePercent)}
                </span>
              </div>

              {/* Grid of stock blocks in this sector */}
              <div className="grid grid-cols-3 gap-1.5">
                {sectorStocks.map((stock) => {
                  const sUp = stock.changePercent >= 0;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => setSelectedSymbol(stock.symbol)}
                      title={`${stock.name}: ${formatPercent(stock.changePercent)}`}
                      className={`py-2 px-1 rounded text-center cursor-pointer transition-all border ${
                        sUp 
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/15 text-emerald-300' 
                          : 'bg-rose-500/10 hover:bg-rose-500/25 border-rose-500/15 text-rose-300'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold block">{stock.symbol}</span>
                      <span className="text-[8px] font-mono block opacity-80">{stock.changePercent.toFixed(1)}%</span>
                    </div>
                  );
                })}
                {sectorStocks.length === 0 && (
                  <span className="col-span-3 text-[9px] text-muted-foreground text-center py-2 font-mono">
                    NO ACTIVE TICKERS
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
