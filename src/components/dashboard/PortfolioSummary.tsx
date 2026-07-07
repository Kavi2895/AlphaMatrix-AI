import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency, formatPercent } from "../../lib/utils";
import { TrendingUp, Award, DollarSign, PieChart as PieIcon } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6"];

export function PortfolioSummary() {
  const { portfolio } = usePortfolioStore();
  const isGain = portfolio.totalGainLoss >= 0;

  const chartData = portfolio.holdings.map(h => ({
    name: h.symbol,
    value: h.totalValue
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md relative overflow-hidden">
      {/* Visual top subtle glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieIcon size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Portfolio Performance</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">LAST UPDATED: SECONDS AGO</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Statistics Columns */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Net Asset Valuation (NAV)</span>
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-200">
              {formatCurrency(portfolio.totalValue)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-border/20 bg-secondary/20 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Absolute Returns</span>
              <span className={`text-sm font-bold flex items-center gap-1 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp size={14} />
                {formatCurrency(portfolio.totalGainLoss)}
              </span>
            </div>
            
            <div className="p-3.5 rounded-lg border border-border/20 bg-secondary/20 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-muted-foreground">Portfolio Yield</span>
              <span className={`text-sm font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercent(portfolio.totalGainLossPercent)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign size={12} className="text-emerald-400" />
              <span>Cash: <strong className="text-slate-200">{formatCurrency(portfolio.cash)}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={12} className="text-violet-400" />
              <span>Sharpe Ratio: <strong className="text-slate-200">2.84</strong></span>
            </div>
          </div>
        </div>

        {/* Allocation Pie Chart */}
        <div className="lg:col-span-5 h-40 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value: any) => [formatCurrency(Number(value)), "Valuation"]}
                contentStyle={{ background: '#0e101a', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Inner allocation stats list overlay */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-black/20 p-2 rounded border border-border/5 text-[9px] font-mono">
            {portfolio.holdings.slice(0, 4).map((h, i) => (
              <div key={h.symbol} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300 font-bold">{h.symbol}</span>
                <span className="text-muted-foreground">{h.allocation.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
