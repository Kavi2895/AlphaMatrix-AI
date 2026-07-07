import { create } from 'zustand';
import { Stock, MarketIndex, SectorPerformance, EconomicEvent, NewsItem, MarketData } from '../types';

interface MarketState {
  stocks: Stock[];
  indices: MarketIndex[];
  sectors: SectorPerformance[];
  news: NewsItem[];
  economicEvents: EconomicEvent[];
  watchlist: string[];
  searchQuery: string;
  selectedSymbol: string | null;
  isLoading: boolean;
  
  setSearchQuery: (query: string) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  toggleWatchlist: (symbol: string) => void;
  updateMarketPrices: () => void;
}

// Initial mock stock dataset
const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 1.42,
    changePercent: 0.78,
    volume: 52140000,
    marketCap: 2850000000000,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    sparkline: [180.2, 181.1, 180.5, 181.8, 182.0, 181.3, 182.52],
    high24h: 183.10,
    low24h: 179.80,
    peRatio: 28.4,
    dividendYield: 0.52,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.50,
    change: -2.30,
    changePercent: -0.55,
    volume: 21850000,
    marketCap: 3080000000000,
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    sparkline: [418.0, 417.2, 416.5, 419.0, 418.1, 414.9, 415.50],
    high24h: 420.10,
    low24h: 413.50,
    peRatio: 35.1,
    dividendYield: 0.72,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.12,
    change: 22.15,
    changePercent: 2.60,
    volume: 48920000,
    marketCap: 2180000000000,
    sector: 'Technology',
    industry: 'Semiconductors',
    sparkline: [830.0, 842.1, 840.5, 855.0, 862.3, 850.1, 875.12],
    high24h: 880.00,
    low24h: 841.20,
    peRatio: 72.3,
    dividendYield: 0.02,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 151.60,
    change: -1.20,
    changePercent: -0.79,
    volume: 28450000,
    marketCap: 1890000000000,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    sparkline: [153.1, 152.9, 151.0, 152.5, 153.2, 152.0, 151.60],
    high24h: 154.00,
    low24h: 150.80,
    peRatio: 25.2,
    dividendYield: 0.00,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.15,
    change: 3.45,
    changePercent: 1.98,
    volume: 34120000,
    marketCap: 1850000000000,
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    sparkline: [172.5, 174.1, 173.0, 175.5, 176.8, 175.2, 178.15],
    high24h: 179.12,
    low24h: 172.00,
    peRatio: 61.4,
    dividendYield: 0.00,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 175.34,
    change: -5.46,
    changePercent: -3.02,
    volume: 81200000,
    marketCap: 560000000000,
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    sparkline: [186.2, 184.0, 181.5, 180.2, 178.9, 174.5, 175.34],
    high24h: 182.10,
    low24h: 173.52,
    peRatio: 42.6,
    dividendYield: 0.00,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 505.10,
    change: 8.50,
    changePercent: 1.71,
    volume: 19820000,
    marketCap: 1290000000000,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    sparkline: [492.1, 495.0, 491.5, 498.0, 502.3, 499.5, 505.10],
    high24h: 510.00,
    low24h: 490.50,
    peRatio: 31.8,
    dividendYield: 0.40,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 195.40,
    change: 0.85,
    changePercent: 0.44,
    volume: 10250000,
    marketCap: 565000000000,
    sector: 'Financial Services',
    industry: 'Banks—Diversified',
    sparkline: [193.1, 194.2, 193.8, 195.0, 194.5, 194.2, 195.40],
    high24h: 196.50,
    low24h: 192.90,
    peRatio: 12.1,
    dividendYield: 2.35,
  }
];

const INITIAL_INDICES: MarketIndex[] = [
  { name: 'S&P 500', value: 5137.08, change: 41.16, changePercent: 0.80, sparkline: [5080, 5095, 5102, 5115, 5122, 5110, 5137.08] },
  { name: 'Nasdaq Composite', value: 16274.94, change: 183.02, changePercent: 1.14, sparkline: [15980, 16050, 16110, 16180, 16220, 16150, 16274.94] },
  { name: 'Dow Jones Industrial', value: 39087.38, change: 68.20, changePercent: 0.17, sparkline: [38950, 39020, 39010, 39120, 39050, 39020, 39087.38] },
];

const INITIAL_SECTORS: SectorPerformance[] = [
  { sector: 'Technology', change: 1.82, changePercent: 1.82 },
  { sector: 'Consumer Cyclical', change: 1.12, changePercent: 1.12 },
  { sector: 'Financial Services', change: 0.44, changePercent: 0.44 },
  { sector: 'Healthcare', change: -0.21, changePercent: -0.21 },
  { sector: 'Energy', change: -0.58, changePercent: -0.58 },
  { sector: 'Utilities', change: -0.85, changePercent: -0.85 },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n_1',
    title: 'NVIDIA Launches Next-Generation Blackwell B200 Chip',
    summary: 'NVIDIA CEO Jensen Huang unveiled the brand-new Blackwell B200 GPU, claiming massive advancements in generative AI computation efficiency.',
    source: 'TechCrunch',
    url: 'https://techcrunch.com',
    publishedAt: '2026-07-06T08:30:00Z',
    sentiment: 'positive',
    sectors: ['Technology'],
    symbols: ['NVDA', 'MSFT']
  },
  {
    id: 'n_2',
    title: 'Federal Reserve Hints at Postponing Interest Rate Cuts',
    summary: 'Powell warned that inflation indicators remain moderately sticky, suggesting that interest rates will stay higher for longer.',
    source: 'Bloomberg',
    url: 'https://bloomberg.com',
    publishedAt: '2026-07-06T07:15:00Z',
    sentiment: 'negative',
    sectors: ['Financial Services'],
    symbols: ['JPM']
  },
  {
    id: 'n_3',
    title: 'Apple Expands AI Partnerships into Autonomous Ecosystems',
    summary: 'Apple is in deep exploratory talks with auto developers to integrate advanced onboard AI models, driving the next phase of tech synergy.',
    source: 'Wall Street Journal',
    url: 'https://wsj.com',
    publishedAt: '2026-07-06T06:00:00Z',
    sentiment: 'positive',
    sectors: ['Technology', 'Consumer Cyclical'],
    symbols: ['AAPL', 'TSLA']
  }
];

const INITIAL_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'e_1',
    title: 'CPI Inflation Rate (MoM)',
    date: '2026-07-08',
    time: '08:30 AM',
    impact: 'high',
    previous: '0.4%',
    forecast: '0.3%'
  },
  {
    id: 'e_2',
    title: 'Initial Jobless Claims',
    date: '2026-07-09',
    time: '08:30 AM',
    impact: 'medium',
    previous: '215K',
    forecast: '212K'
  },
  {
    id: 'e_3',
    title: 'University of Michigan Consumer Sentiment Index',
    date: '2026-07-10',
    time: '10:00 AM',
    impact: 'low',
    previous: '79.4',
    forecast: '79.8'
  }
];

export const useMarketStore = create<MarketState>((set) => ({
  stocks: INITIAL_STOCKS,
  indices: INITIAL_INDICES,
  sectors: INITIAL_SECTORS,
  news: INITIAL_NEWS,
  economicEvents: INITIAL_ECONOMIC_EVENTS,
  watchlist: ['AAPL', 'NVDA', 'TSLA'],
  searchQuery: '',
  selectedSymbol: 'AAPL', // default selected symbol for details
  isLoading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  
  toggleWatchlist: (symbol) => set((state) => {
    const isWatched = state.watchlist.includes(symbol);
    const watchlist = isWatched
      ? state.watchlist.filter(s => s !== symbol)
      : [...state.watchlist, symbol];
    return { watchlist };
  }),

  updateMarketPrices: () => set((state) => {
    // Tick prices randomly up or down slightly for dynamic dashboard illusion
    const updatedStocks = state.stocks.map(stock => {
      const volatility = 0.005; // 0.5% max swing per tick
      const pct = (Math.random() - 0.48) * volatility; // slight upward bias
      const priceDiff = stock.price * pct;
      const newPrice = Number((stock.price + priceDiff).toFixed(2));
      const totalChange = Number((stock.change + priceDiff).toFixed(2));
      const originalPrice = stock.price / (1 + stock.changePercent / 100);
      const newPct = Number((((newPrice - originalPrice) / originalPrice) * 100).toFixed(2));
      const sparkline = [...stock.sparkline.slice(1), newPrice];
      
      return {
        ...stock,
        price: newPrice,
        change: totalChange,
        changePercent: newPct,
        sparkline,
      };
    });

    const updatedIndices = state.indices.map(index => {
      const volatility = 0.002;
      const pct = (Math.random() - 0.48) * volatility;
      const diff = index.value * pct;
      const newValue = Number((index.value + diff).toFixed(2));
      const totalChange = Number((index.change + diff).toFixed(2));
      const original = index.value / (1 + index.changePercent / 100);
      const newPct = Number((((newValue - original) / original) * 100).toFixed(2));
      const sparkline = [...index.sparkline.slice(1), newValue];
      
      return {
        ...index,
        value: newValue,
        change: totalChange,
        changePercent: newPct,
        sparkline,
      };
    });

    return {
      stocks: updatedStocks,
      indices: updatedIndices,
    };
  })
}));
