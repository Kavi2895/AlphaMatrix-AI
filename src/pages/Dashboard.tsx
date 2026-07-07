import { PortfolioSummary } from "../components/dashboard/PortfolioSummary";
import { AIDailyBrief } from "../components/dashboard/AIDailyBrief";
import { MarketOverview } from "../components/dashboard/MarketOverview";
import { Watchlist } from "../components/dashboard/Watchlist";
import { InteractiveCharts } from "../components/dashboard/InteractiveCharts";
import { MarketSentiment } from "../components/dashboard/MarketSentiment";
import { EconomicCalendar } from "../components/dashboard/EconomicCalendar";
import { AISuggestions } from "../components/dashboard/AISuggestions";
import { MarketHeatmap } from "../components/dashboard/MarketHeatmap";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* 1. Header Section with Sophia compiled morning brief */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <AIDailyBrief />
        </div>
        <div className="xl:col-span-4">
          <PortfolioSummary />
        </div>
      </div>

      {/* 2. Main interactive Chart and Watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <InteractiveCharts />
        </div>
        <div className="xl:col-span-4">
          <Watchlist />
        </div>
      </div>

      {/* 3. Market Tickers Overview */}
      <div>
        <MarketOverview />
      </div>

      {/* 4. Heatmap Matrix */}
      <div>
        <MarketHeatmap />
      </div>

      {/* 5. Macro factor columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <MarketSentiment />
        </div>
        <div>
          <AISuggestions />
        </div>
        <div>
          <EconomicCalendar />
        </div>
      </div>
    </div>
  );
}
