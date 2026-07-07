import { useState } from "react";
import { useMarketStore } from "../stores/marketStore";
import { usePortfolioStore } from "../stores/portfolioStore";
import { formatCurrency, formatPercent, formatCompact } from "../lib/utils";
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Database, 
  Briefcase, 
  Info,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useToasts } from "../components/ui/toast";

export default function Market() {
  const { stocks, selectedSymbol, setSelectedSymbol, watchlist, toggleWatchlist } = useMarketStore();
  const { portfolio, buyHolding, sellHolding } = usePortfolioStore();
  const { addToast } = useToasts();

  const [tradeShares, setTradeShares] = useState(10);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');

  const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  const isUp = selectedStock.changePercent >= 0;

  const currentHolding = portfolio.holdings.find(h => h.symbol === selectedStock.symbol);
  const isWatched = watchlist.includes(selectedStock.symbol);

  const handleExecuteTrade = () => {
    if (tradeShares <= 0) return;

    if (tradeAction === 'buy') {
      const totalCost = selectedStock.price * tradeShares;
      if (portfolio.cash < totalCost) {
        addToast({
          title: "Insufficient Capital",
          description: `Total cost is ${formatCurrency(totalCost)}, but your cash reserve is ${formatCurrency(portfolio.cash)}.`,
          type: "error"
        });
        return;
      }
      
      buyHolding(selectedStock, tradeShares);
      addToast({
        title: "Trade Transaction Success",
        description: `Successfully purchased ${tradeShares} shares of ${selectedStock.symbol} at ${formatCurrency(selectedStock.price)}.`,
        type: "success"
      });
    } else {
      if (!currentHolding || currentHolding.shares < tradeShares) {
        addToast({
          title: "Insufficient Holding Balance",
          description: `You only own ${currentHolding?.shares || 0} shares of ${selectedStock.symbol}.`,
          type: "error"
        });
        return;
      }

      sellHolding(selectedStock.symbol, tradeShares);
      addToast({
        title: "Trade Transaction Success",
        description: `Successfully sold ${tradeShares} shares of ${selectedStock.symbol} at ${formatCurrency(selectedStock.price)}.`,
        type: "success"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 2 column grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: All Tickers Listing */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-md">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-border/10 pb-2">
              Equity Markets List
            </h2>
            
            <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
              {stocks.map((stock) => {
                const sUp = stock.changePercent >= 0;
                const isSelected = stock.symbol === selectedStock.symbol;
                
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`p-3.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all group ${
                      isSelected 
                        ? 'bg-primary/5 border-primary/40 glow-blue' 
                        : 'bg-secondary/15 border-border/10 hover:border-border/30 hover:bg-secondary/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Watchlist Star Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="p-1 hover:bg-white/5 rounded cursor-pointer text-muted-foreground hover:text-amber-400 transition-colors"
                      >
                        <Star 
                          size={14} 
                          className={watchlist.includes(stock.symbol) ? 'fill-amber-400 text-amber-400' : ''} 
                        />
                      </button>
                      
                      <div>
                        <span className="font-extrabold text-slate-100 text-sm group-hover:text-primary transition-all">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">
                          {stock.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold block text-slate-200">
                        {formatCurrency(stock.price)}
                      </span>
                      <span className={`text-xs font-semibold font-mono ${sUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(stock.changePercent)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In depth Fundamental card and Trade Terminal */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active equity details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

            <div className="flex justify-between items-start mb-4 pb-2 border-b border-border/10">
              <div>
                <span className="text-[9px] font-bold font-mono text-primary uppercase block">Ticker Profile</span>
                <h3 className="text-xl font-extrabold text-slate-100">{selectedStock.symbol}</h3>
                <span className="text-xs text-muted-foreground block">{selectedStock.name}</span>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold block text-slate-100">
                  {formatCurrency(selectedStock.price)}
                </span>
                <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded ${
                  isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {formatPercent(selectedStock.changePercent)}
                </span>
              </div>
            </div>

            {/* General metrics grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-5">
              <div className="p-2.5 rounded bg-secondary/20 border border-border/5">
                <span className="text-muted-foreground block text-[9px] uppercase font-bold">Market Capitalisation</span>
                <strong className="text-slate-200">{formatCompact(selectedStock.marketCap)}</strong>
              </div>
              <div className="p-2.5 rounded bg-secondary/20 border border-border/5">
                <span className="text-muted-foreground block text-[9px] uppercase font-bold">24H High / Low</span>
                <strong className="text-slate-200">{formatCurrency(selectedStock.high24h)} / {formatCurrency(selectedStock.low24h)}</strong>
              </div>
              <div className="p-2.5 rounded bg-secondary/20 border border-border/5">
                <span className="text-muted-foreground block text-[9px] uppercase font-bold">Price to Earnings (PE)</span>
                <strong className="text-slate-200">{selectedStock.peRatio || 'N/A'}</strong>
              </div>
              <div className="p-2.5 rounded bg-secondary/20 border border-border/5">
                <span className="text-muted-foreground block text-[9px] uppercase font-bold">Dividend Yield</span>
                <strong className="text-slate-200">{selectedStock.dividendYield ? `${selectedStock.dividendYield}%` : '0%'}</strong>
              </div>
            </div>

            {/* Sector metadata info */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono border-t border-border/10 pt-4">
              <span className="text-muted-foreground font-semibold">Sector:</span>
              <span className="text-slate-200 bg-secondary/40 px-2 py-0.5 rounded border border-border/5">{selectedStock.sector}</span>
              <span className="text-muted-foreground font-semibold ml-2">Industry:</span>
              <span className="text-slate-200 bg-secondary/40 px-2 py-0.5 rounded border border-border/5">{selectedStock.industry}</span>
            </div>
          </div>

          {/* Trade action console */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md relative">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Trading Execution Terminal</h3>
            </div>

            <div className="space-y-4">
              {/* Buy Sell Switcher */}
              <div className="grid grid-cols-2 rounded-lg bg-secondary/40 p-1 border border-border/10">
                <button
                  onClick={() => setTradeAction('buy')}
                  className={`py-2 text-xs font-bold rounded-md cursor-pointer transition-all ${
                    tradeAction === 'buy' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Buy Asset
                </button>
                <button
                  onClick={() => setTradeAction('sell')}
                  className={`py-2 text-xs font-bold rounded-md cursor-pointer transition-all ${
                    tradeAction === 'sell' ? 'bg-rose-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sell Asset
                </button>
              </div>

              {/* Shares input */}
              <div>
                <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground block mb-1.5">Shares Quantity</label>
                <input
                  type="number"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Number(e.target.value))}
                  min={1}
                  className="w-full h-10 bg-secondary/30 focus:bg-background border border-border/15 rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-100 font-mono"
                />
              </div>

              {/* Financial estimates summary */}
              <div className="p-3 bg-black/10 rounded border border-border/5 text-[11px] font-mono space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Price per Share:</span>
                  <span className="text-slate-200 font-bold">{formatCurrency(selectedStock.price)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Owned Balance:</span>
                  <span className="text-slate-200 font-bold">{currentHolding?.shares || 0} shares</span>
                </div>
                <div className="flex justify-between text-muted-foreground border-t border-border/10 pt-1.5">
                  <span>Total Capital Impact:</span>
                  <span className="text-primary font-bold">{formatCurrency(selectedStock.price * tradeShares)}</span>
                </div>
              </div>

              <button
                onClick={handleExecuteTrade}
                className={`w-full py-2.5 rounded-md text-xs font-bold transition-all shadow cursor-pointer ${
                  tradeAction === 'buy' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                Execute Transaction
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
