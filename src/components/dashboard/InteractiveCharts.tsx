import { useState } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { formatCurrency, formatPercent } from "../../lib/utils";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ReferenceLine, 
  BarChart, 
  Bar
} from "recharts";
import { TrendingUp, HelpCircle, Sparkles, Activity, FileText } from "lucide-react";
import { Badge } from "../ui/badge";

export function InteractiveCharts() {
  const { stocks, selectedSymbol } = useMarketStore();
  const [indicator, setIndicator] = useState<'none' | 'ma' | 'bollinger'>('none');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1M');
  const [explainerText, setExplainerText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const activeStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  // Synthesize realistic timeseries price charts for selected stock
  const generateChartData = () => {
    const basePrice = activeStock.price;
    const itemsCount = timeframe === '1D' ? 12 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 60;
    
    return Array.from({ length: itemsCount }).map((_, idx) => {
      const step = idx - itemsCount / 2;
      const noise = (Math.sin(idx / 3) * 5) + (Math.cos(idx / 5) * 3);
      const priceVal = basePrice + (step * (activeStock.changePercent / 5)) + noise;
      const volumeVal = activeStock.volume * (0.8 + Math.random() * 0.4) / itemsCount;
      
      // Moving average simulation
      const maVal = priceVal * 0.985 + (Math.sin(idx / 4) * 2);
      // Bollinger bands simulation
      const upperBand = priceVal * 1.04;
      const lowerBand = priceVal * 0.96;

      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - (itemsCount - idx));

      return {
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(priceVal.toFixed(2)),
        volume: Number(volumeVal.toFixed(0)),
        ma: Number(maVal.toFixed(2)),
        upper: Number(upperBand.toFixed(2)),
        lower: Number(lowerBand.toFixed(2)),
      };
    });
  };

  const chartData = generateChartData();
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  const handleExplainChart = async () => {
    setIsExplaining(true);
    setExplainerText(null);
    try {
      const prompt = `You are an elite quantitative chart pattern researcher. Analyze the chart data for ${activeStock.symbol} (${activeStock.name}) currently trading at $${activeStock.price} with a change of ${activeStock.changePercent}%. The chart data points span from $${Math.min(...prices).toFixed(2)} to $${Math.max(...prices).toFixed(2)}. Write a 3-sentence technical pattern report analyzing structural support levels, moving average crossovers, and current breakout trajectory. Keep it highly objective, quantitative, and professional.`;
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setExplainerText(data.reply || "Support levels hold around the 50-day moving average. The recent upside momentum points toward an emerging bullish flag formation with resistance forming near recent historical highs.");
    } catch {
      setExplainerText("Unable to generate AI explanation. Pattern analysis suggests consolidation within the Bollinger bands range with strong support at the lower bands.");
    } finally {
      setIsExplaining(false);
    }
  };

  const isUp = activeStock.changePercent >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col h-full relative">
      {/* Chart controls header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Technical Chart Lab</span>
            <Badge variant={isUp ? 'success' : 'destructive'}>{activeStock.symbol}</Badge>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-1">
            {formatCurrency(activeStock.price)}
            <span className={`text-xs font-semibold ml-2 font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(activeStock.changePercent)}
            </span>
          </h2>
        </div>

        {/* Filters and controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex rounded-md bg-secondary/40 p-0.5 border border-border/10">
            {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                  timeframe === tf ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators dropdown selector */}
          <div className="flex rounded-md bg-secondary/40 p-0.5 border border-border/10">
            <button
              onClick={() => setIndicator(indicator === 'ma' ? 'none' : 'ma')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                indicator === 'ma' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EMA(20)
            </button>
            <button
              onClick={() => setIndicator(indicator === 'bollinger' ? 'none' : 'bollinger')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                indicator === 'bollinger' ? 'bg-violet-500/20 text-violet-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bollinger
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart viewport */}
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
            />
            
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
            />
            
            <RechartsTooltip 
              contentStyle={{ background: '#0e101a', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
              labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
            />

            {/* Price Area */}
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isUp ? "#10b981" : "#ef4444"} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />

            {/* EMA line */}
            {indicator === 'ma' && (
              <Area 
                type="monotone" 
                dataKey="ma" 
                stroke="#3b82f6" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                fill="none" 
              />
            )}

            {/* Bollinger bands */}
            {indicator === 'bollinger' && (
              <>
                <Area type="monotone" dataKey="upper" stroke="#a78bfa" strokeWidth={1} fill="none" />
                <Area type="monotone" dataKey="lower" stroke="#a78bfa" strokeWidth={1} fill="none" />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume chart row */}
      <div className="h-12 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -20 }}>
            <Bar dataKey="volume" fill="#1e293b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Explainer / Pattern recognition button with Gemini */}
      <div className="mt-5 pt-4 border-t border-border/10">
        {!explainerText ? (
          <button
            onClick={handleExplainChart}
            disabled={isExplaining}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles size={14} className={isExplaining ? 'animate-spin' : 'pulse-glow'} />
            <span>{isExplaining ? "Analyzing Chart Patterns..." : "Let Gemini Explain Chart Trend"}</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-lg border border-primary/15 bg-primary/5 relative animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="pulse-glow" />
                <span>AI Automated Chart Pattern Explainer</span>
              </span>
              <button 
                onClick={() => setExplainerText(null)}
                className="text-[9px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer underline"
              >
                Clear
              </button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {explainerText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
