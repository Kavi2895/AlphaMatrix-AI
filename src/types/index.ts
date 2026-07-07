export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  currency: string;
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketAlerts: boolean;
  portfolioAlerts: boolean;
  researchAlerts: boolean;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  industry: string;
  sparkline: number[];
  high24h: number;
  low24h: number;
  peRatio?: number;
  dividendYield?: number;
}

export interface PortfolioHolding {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  cash: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface MarketData {
  indices: MarketIndex[];
  topGainers: Stock[];
  topLosers: Stock[];
  mostActive: Stock[];
  sectorPerformance: SectorPerformance[];
  timestamp: string;
}

export interface SectorPerformance {
  sector: string;
  change: number;
  changePercent: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sectors: string[];
  symbols: string[];
}

export interface AIInsight {
  id: string;
  type: 'summary' | 'analysis' | 'recommendation' | 'alert';
  title: string;
  content: string;
  timestamp: string;
  confidence: number;
  disclaimer: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  symbols: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AIAgentMessage {
  id: string;
  agentName: string;
  agentAvatar: string;
  agentRole: string;
  content: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface AIWorkflow {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  steps: AIWorkflowStep[];
  startedAt: string;
  completedAt?: string;
}

export interface AIWorkflowStep {
  id: string;
  name: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: string;
  output?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface LearningProgress {
  path: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completedLessons: number;
  totalLessons: number;
  quizzesPassed: number;
  quizzesFailed: number;
  streak: number;
  lastActivity: string;
  badges: string[];
}

export interface ResearchScore {
  symbol: string;
  overall: number;
  fundamentals: number;
  valuation: number;
  growth: number;
  profitability: number;
  risk: number;
  innovation: number;
  sentiment: number;
  strength: number;
  explanations: Record<string, string>;
  timestamp: string;
}

export interface CompanyTimeline {
  symbol: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'earnings' | 'split' | 'merger' | 'ceo_change' | 'lawsuit' | 'dividend' | 'announcement' | 'product';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  metadata?: Record<string, any>;
}
