import { create } from 'zustand';
import { Portfolio, PortfolioHolding, Stock } from '../types';

interface PortfolioState {
  portfolio: Portfolio;
  twinPortfolio: Portfolio; // AI Digital Twin (Optimal Asset Hedging Model)
  simulatedScenarios: { name: string; impact: number; changePercent: number; description: string }[];
  isLoading: boolean;
  
  buyHolding: (stock: Stock, shares: number) => void;
  sellHolding: (symbol: string, shares: number) => void;
  adjustCash: (amount: number) => void;
  rebalanceToTwin: () => void;
  runScenarioSimulation: (stressValue: string) => void;
}

const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'AAPL',
    shares: 150,
    averagePrice: 175.20,
    currentPrice: 182.52,
    totalValue: 27378.00,
    gainLoss: 1098.00,
    gainLossPercent: 4.18,
    allocation: 25.10,
  },
  {
    symbol: 'NVDA',
    shares: 40,
    averagePrice: 650.00,
    currentPrice: 875.12,
    totalValue: 35004.80,
    gainLoss: 9004.80,
    gainLossPercent: 34.63,
    allocation: 32.10,
  },
  {
    symbol: 'MSFT',
    shares: 60,
    averagePrice: 395.00,
    currentPrice: 415.50,
    totalValue: 24930.00,
    gainLoss: 1230.00,
    gainLossPercent: 5.19,
    allocation: 22.86,
  },
  {
    symbol: 'TSLA',
    shares: 80,
    averagePrice: 210.00,
    currentPrice: 175.34,
    totalValue: 14027.20,
    gainLoss: -2772.80,
    gainLossPercent: -16.50,
    allocation: 12.86,
  }
];

const INITIAL_TWIN_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'AAPL',
    shares: 120,
    averagePrice: 175.20,
    currentPrice: 182.52,
    totalValue: 21902.40,
    gainLoss: 878.40,
    gainLossPercent: 4.18,
    allocation: 20.08,
  },
  {
    symbol: 'NVDA',
    shares: 35,
    averagePrice: 650.00,
    currentPrice: 875.12,
    totalValue: 30629.20,
    gainLoss: 7879.20,
    gainLossPercent: 34.63,
    allocation: 28.09,
  },
  {
    symbol: 'MSFT',
    shares: 70,
    averagePrice: 395.00,
    currentPrice: 415.50,
    totalValue: 29085.00,
    gainLoss: 1435.00,
    gainLossPercent: 5.19,
    allocation: 26.67,
  },
  {
    symbol: 'JPM',
    shares: 140,
    averagePrice: 185.00,
    currentPrice: 195.40,
    totalValue: 27356.00,
    gainLoss: 1456.00,
    gainLossPercent: 5.62,
    allocation: 25.16,
  }
];

const calculatePortfolioSummary = (holdings: PortfolioHolding[], cash: number): Omit<Portfolio, 'id' | 'name' | 'createdAt' | 'updatedAt'> => {
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.averagePrice), 0);
  const totalValue = totalHoldingsValue + cash;
  const totalGainLoss = totalHoldingsValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  const updatedHoldings = holdings.map(h => ({
    ...h,
    allocation: totalValue > 0 ? (h.totalValue / totalValue) * 100 : 0,
  }));

  return {
    holdings: updatedHoldings,
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    cash,
  };
};

export const usePortfolioStore = create<PortfolioState>((set) => {
  const pSummary = calculatePortfolioSummary(INITIAL_HOLDINGS, 7500);
  const twinSummary = calculatePortfolioSummary(INITIAL_TWIN_HOLDINGS, 6500);

  return {
    portfolio: {
      id: 'p_1',
      name: 'Alpha Tech Growth Portfolio',
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-07-06T10:00:00Z',
      ...pSummary,
    },
    twinPortfolio: {
      id: 'p_2',
      name: 'Beta Hedged Optimus Twin',
      createdAt: '2026-03-20T00:00:00Z',
      updatedAt: '2026-07-06T10:00:00Z',
      ...twinSummary,
    },
    simulatedScenarios: [],
    isLoading: false,

    buyHolding: (stock, shares) => set((state) => {
      const cost = stock.price * shares;
      if (state.portfolio.cash < cost) return {}; // Insufficient cash

      const existingIndex = state.portfolio.holdings.findIndex(h => h.symbol === stock.symbol);
      let newHoldings = [...state.portfolio.holdings];

      if (existingIndex >= 0) {
        const existing = newHoldings[existingIndex];
        const newShares = existing.shares + shares;
        const newAveragePrice = ((existing.shares * existing.averagePrice) + cost) / newShares;
        const newTotalValue = newShares * stock.price;
        const newGainLoss = newTotalValue - (newShares * newAveragePrice);
        
        newHoldings[existingIndex] = {
          ...existing,
          shares: newShares,
          averagePrice: Number(newAveragePrice.toFixed(2)),
          currentPrice: stock.price,
          totalValue: Number(newTotalValue.toFixed(2)),
          gainLoss: Number(newGainLoss.toFixed(2)),
          gainLossPercent: Number(((newGainLoss / (newShares * newAveragePrice)) * 100).toFixed(2)),
        };
      } else {
        const newHolding: PortfolioHolding = {
          symbol: stock.symbol,
          shares,
          averagePrice: stock.price,
          currentPrice: stock.price,
          totalValue: cost,
          gainLoss: 0,
          gainLossPercent: 0,
          allocation: 0,
        };
        newHoldings.push(newHolding);
      }

      const summary = calculatePortfolioSummary(newHoldings, state.portfolio.cash - cost);

      return {
        portfolio: {
          ...state.portfolio,
          ...summary,
          updatedAt: new Date().toISOString(),
        }
      };
    }),

    sellHolding: (symbol, shares) => set((state) => {
      const existingIndex = state.portfolio.holdings.findIndex(h => h.symbol === symbol);
      if (existingIndex < 0) return {};

      const existing = state.portfolio.holdings[existingIndex];
      if (existing.shares < shares) return {}; // cannot sell more than owned

      let newHoldings = [...state.portfolio.holdings];
      const proceeds = existing.currentPrice * shares;

      if (existing.shares === shares) {
        newHoldings.splice(existingIndex, 1);
      } else {
        const newShares = existing.shares - shares;
        const newTotalValue = newShares * existing.currentPrice;
        const newGainLoss = newTotalValue - (newShares * existing.averagePrice);

        newHoldings[existingIndex] = {
          ...existing,
          shares: newShares,
          totalValue: Number(newTotalValue.toFixed(2)),
          gainLoss: Number(newGainLoss.toFixed(2)),
          gainLossPercent: Number(((newGainLoss / (newShares * existing.averagePrice)) * 100).toFixed(2)),
        };
      }

      const summary = calculatePortfolioSummary(newHoldings, state.portfolio.cash + proceeds);

      return {
        portfolio: {
          ...state.portfolio,
          ...summary,
          updatedAt: new Date().toISOString(),
        }
      };
    }),

    adjustCash: (amount) => set((state) => {
      if (state.portfolio.cash + amount < 0) return {};
      const summary = calculatePortfolioSummary(state.portfolio.holdings, state.portfolio.cash + amount);
      return {
        portfolio: {
          ...state.portfolio,
          ...summary,
          updatedAt: new Date().toISOString(),
        }
      };
    }),

    rebalanceToTwin: () => set((state) => {
      // Rebalance action: adjust current portfolio to perfectly replicate twin portfolio
      const summary = calculatePortfolioSummary(state.twinPortfolio.holdings, state.twinPortfolio.cash);
      return {
        portfolio: {
          ...state.portfolio,
          ...summary,
          updatedAt: new Date().toISOString(),
        }
      };
    }),

    runScenarioSimulation: (stressValue) => set((state) => {
      let impact = 0;
      let pctChange = 0;
      let name = '';
      let description = '';

      const totalVal = state.portfolio.totalValue;

      switch (stressValue) {
        case 'inflation':
          pctChange = -8.5;
          impact = totalVal * (pctChange / 100);
          name = 'Sticky High Inflation & Fed Tightening';
          description = 'A 100bps rate hike. Technology growth multiples contract under higher cost of capital; defensive bank allocations hedge risk.';
          break;
        case 'geopolitical':
          pctChange = -12.3;
          impact = totalVal * (pctChange / 100);
          name = 'Taiwan Strait Semiconductor Embargo';
          description = 'Supply chains halt. High-flying silicon tickers (NVDA) slide sharply due to foundry disruptions; consumer products drop.';
          break;
        case 'ai_boom':
          pctChange = 18.2;
          impact = totalVal * (pctChange / 100);
          name = 'Unbounded AI Compute Commercialization';
          description = 'Software integrations surge. Enterprise software licensing triples, semiconductor pipelines max out, and index breaks resistance.';
          break;
        default:
          pctChange = -3.4;
          impact = totalVal * (pctChange / 100);
          name = 'Mild Economic Recession';
          description = 'Yield curve remains flat; general consumer spending slows down slightly across technology and cyclical sectors.';
      }

      return {
        simulatedScenarios: [
          { name, impact, changePercent: pctChange, description },
          ...state.simulatedScenarios,
        ]
      };
    })
  };
});
