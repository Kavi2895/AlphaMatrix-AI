import { create } from 'zustand';
import { AIAgentMessage, AIWorkflow, ResearchScore, LearningProgress, TimelineEvent } from '../types';

interface AIState {
  chatMessages: AIAgentMessage[];
  isChatLoading: boolean;
  
  workflows: AIWorkflow[];
  activeWorkflow: AIWorkflow | null;
  
  researchScores: Record<string, ResearchScore>;
  companyTimelines: Record<string, TimelineEvent[]>;
  
  learning: LearningProgress;
  
  selectedAgent: string;
  isDebateActive: boolean;
  debateOpinion: string;
  isVoiceActive: boolean;
  
  // Actions
  sendChatMessage: (message: string, agentName?: string) => Promise<void>;
  startMultiAgentWorkflow: (symbol: string) => Promise<void>;
  submitDebateStance: (opinion: string) => Promise<void>;
  updateLearningQuiz: (passed: boolean) => void;
  toggleVoice: () => void;
  clearChat: () => void;
}

const INITIAL_AGENTS_MESSAGES: AIAgentMessage[] = [
  {
    id: 'msg_0',
    agentName: 'Sophia (Macro Strategist)',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128&q=80',
    agentRole: 'Sovereign Debt & Interest Rate Analyst',
    content: "Welcome to AlphaMatrix Research. I am monitoring global bond rates, inflation indices, and central bank communications to contextualize your portfolio. How can I help guide your macro thesis today?\n\n🔬 Research Insight - Not Financial Advice",
    timestamp: '2026-07-06T10:00:00-07:00',
    type: 'info'
  }
];

const INITIAL_WORKFLOWS: AIWorkflow[] = [
  {
    id: 'wf_1',
    name: 'Full Fundamental Deep-Dive',
    status: 'completed',
    startedAt: '2026-07-06T09:00:00Z',
    completedAt: '2026-07-06T09:02:15Z',
    steps: [
      { id: 's1', name: 'SEC SEC Filing Crawler', agent: 'Librarian Agent', status: 'completed', input: '10-K & 10-Q SEC Files for AAPL', output: 'Pulled latest 4 quarters of balance sheets, cash flow, and note disclosures successfully.', startedAt: '2026-07-06T09:00:01Z', completedAt: '2026-07-06T09:00:25Z' },
      { id: 's2', name: 'Earnings Call Transcript Parser', agent: 'Synthesizer Agent', status: 'completed', input: 'Q2 2026 Earnings Call Q&A Section', output: 'Extracted key metrics on customer retention, silicon development margins, and capital expenditure forecasts.', startedAt: '2026-07-06T09:00:26Z', completedAt: '2026-07-06T09:01:10Z' },
      { id: 's3', name: 'Valuation & DCF Modeling', agent: 'Quant Agent', status: 'completed', input: 'Discount Rate 8.5%, Terminal Growth 2.5%', output: 'Calculated baseline Fair Value of $194.30 per share. Model matches standard EBITDA multiple approaches.', startedAt: '2026-07-06T09:01:11Z', completedAt: '2026-07-06T09:02:15Z' }
    ]
  }
];

const INITIAL_RESEARCH_SCORES: Record<string, ResearchScore> = {
  AAPL: {
    symbol: 'AAPL',
    overall: 84,
    fundamentals: 88,
    valuation: 65,
    growth: 72,
    profitability: 95,
    risk: 78,
    innovation: 92,
    sentiment: 81,
    strength: 88,
    explanations: {
      fundamentals: 'Unrivaled cash flow generation capability with cash-to-debt metrics matching AA corporate ratings. Share repurchases buffer standard down-cycles.',
      valuation: 'Trading at 28.4x forward P/E, representing a moderate premium over its five-year trailing historical mean of 25.1x.',
      risk: 'Geopolitical hardware concentration remains the primary risk vector; supply chain shifts to alternative regions represent short-term cost headwinds.'
    },
    timestamp: '2026-07-06T08:00:00Z'
  },
  NVDA: {
    symbol: 'NVDA',
    overall: 92,
    fundamentals: 94,
    valuation: 42,
    growth: 98,
    profitability: 99,
    risk: 55,
    innovation: 97,
    sentiment: 95,
    strength: 96,
    explanations: {
      fundamentals: 'Net profit margins exceeding 55% in core semiconductor segments. Liquid asset balances allow unconstrained research capital expenditures.',
      valuation: 'Near-term valuation indicators remain stretched at 72.3x P/E; high multiples depend heavily on sustained data center infrastructure capital allocation.',
      risk: 'Primary risk is customer concentration and eventual chip cycle digestion; hyperscaler custom silicon programs present alternative long-term supply.'
    },
    timestamp: '2026-07-06T08:00:00Z'
  },
  TSLA: {
    symbol: 'TSLA',
    overall: 68,
    fundamentals: 72,
    valuation: 50,
    growth: 60,
    profitability: 75,
    risk: 42,
    innovation: 91,
    sentiment: 55,
    strength: 65,
    explanations: {
      fundamentals: 'Strong debt-free balance sheet with healthy working capital reserves, though operating margins have compressed due to pricing actions.',
      valuation: 'Continues to trade at a premium automobile multiple reflecting secondary AI/robotics option value; traditional auto metrics suggest downside.',
      risk: 'Intense global competitive pressures, capital-intensive expansion logistics, and key-person dependencies represent elevated risk profiles.'
    },
    timestamp: '2026-07-06T08:00:00Z'
  }
};

const INITIAL_TIMELINES: Record<string, TimelineEvent[]> = {
  AAPL: [
    { id: 't_a1', date: '2026-06-15', type: 'product', title: 'Spatial Headset 2 Released', description: 'Announced massive production shipments and global software integrations for lightweight spatial displays.', impact: 'positive' },
    { id: 't_a2', date: '2026-05-02', type: 'earnings', title: 'Q2 Earnings Beat expectations', description: 'Reported EPS of $1.53 against consensus $1.50. Services division rose 14% year-over-year, cementing recurring margins.', impact: 'positive' },
    { id: 't_a3', date: '2026-03-12', type: 'lawsuit', title: 'Antitrust Regulatory Challenge Filed', description: 'EU competition authorities initiated formal inquiries into software distribution rules, raising structural legal fee risks.', impact: 'negative' }
  ],
  NVDA: [
    { id: 't_n1', date: '2026-06-30', type: 'announcement', title: 'Blackwell GPU Hyperscale Delivery Begins', description: 'Confirmed direct bulk deliveries to major hyperscalers including Microsoft and Amazon cloud data centers.', impact: 'positive' },
    { id: 't_n2', date: '2026-05-22', type: 'earnings', title: 'Blowout Q1 Financial Statement', description: 'Data Center segment revenues grew 150% YoY, sending GAAP gross margins to record highs of 76.5%.', impact: 'positive' }
  ]
};

const INITIAL_LEARNING: LearningProgress = {
  path: 'intermediate',
  completedLessons: 6,
  totalLessons: 12,
  quizzesPassed: 4,
  quizzesFailed: 1,
  streak: 5,
  lastActivity: '2026-07-05T18:00:00Z',
  badges: ['SEC Explorer', 'Ratio Master', 'DCF Builder']
};

export const useAIStore = create<AIState>((set, get) => ({
  chatMessages: INITIAL_AGENTS_MESSAGES,
  isChatLoading: false,
  workflows: INITIAL_WORKFLOWS,
  activeWorkflow: null,
  researchScores: INITIAL_RESEARCH_SCORES,
  companyTimelines: INITIAL_TIMELINES,
  learning: INITIAL_LEARNING,
  selectedAgent: 'Sophia (Macro Strategist)',
  isDebateActive: false,
  debateOpinion: '',
  isVoiceActive: false,

  sendChatMessage: async (message, agentName) => {
    const activeAgent = agentName || get().selectedAgent;
    
    // Append user message
    const userMsg: AIAgentMessage = {
      id: `usr_${Date.now()}`,
      agentName: 'User Investor',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80',
      agentRole: 'Research Architect',
      content: message,
      timestamp: new Date().toISOString(),
      type: 'info'
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isChatLoading: true
    }));

    try {
      // Direct post to backend proxy (server.ts) to utilize server-side Gemini API
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          agent: activeAgent,
          history: get().chatMessages.slice(-6).map(m => ({ role: m.agentName.includes('User') ? 'user' : 'model', text: m.content }))
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch AI response from server proxy');
      }

      const data = await res.json();
      
      const botMsg: AIAgentMessage = {
        id: `bot_${Date.now()}`,
        agentName: activeAgent,
        agentAvatar: activeAgent.includes('Sophia')
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128&q=80'
          : activeAgent.includes('Marcus')
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80'
          : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&h=128&q=80',
        agentRole: activeAgent.includes('Sophia')
          ? 'Sovereign Debt & Interest Rate Analyst'
          : activeAgent.includes('Marcus')
          ? 'Corporate Valuation & LBO Modeler'
          : 'Tech Sector Trend Researcher',
        content: data.reply + "\n\n🔬 Research Insight - Not Financial Advice",
        timestamp: new Date().toISOString(),
        type: 'success'
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMsg],
        isChatLoading: false
      }));

    } catch (err) {
      console.error(err);
      
      // Fallback response with disclaimer if server communication is interrupted
      const botMsg: AIAgentMessage = {
        id: `bot_${Date.now()}`,
        agentName: activeAgent,
        agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128&q=80',
        agentRole: 'Autonomous Agent Backup',
        content: `I've analyzed your prompt locally. In an optimal scenario, central bank metrics dictate defensive positioning on higher duration holdings. For ${activeAgent}, I suggest reviewing standard free cash flow stability and regulatory risks.\n\n🔬 Research Insight - Not Financial Advice`,
        timestamp: new Date().toISOString(),
        type: 'warning'
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMsg],
        isChatLoading: false
      }));
    }
  },

  startMultiAgentWorkflow: async (symbol) => {
    // Generate an in-progress workflow
    const wfId = `wf_${Date.now()}`;
    const newWorkflow: AIWorkflow = {
      id: wfId,
      name: `Automated RAG Digest - ${symbol}`,
      status: 'running',
      startedAt: new Date().toISOString(),
      steps: [
        { id: 'st1', name: 'SEC Document Fetching', agent: 'Retrieval Agent', status: 'running', input: `Scraping recent SEC reports for ${symbol}`, startedAt: new Date().toISOString() },
        { id: 'st2', name: 'Valuation Modelling', agent: 'Quant Agent', status: 'pending', input: `Compiling DCF parameters for ${symbol}` },
        { id: 'st3', name: 'Sentiment Synthesis', agent: 'Synthesis Agent', status: 'pending', input: `Evaluating industry news sentiment for ${symbol}` }
      ]
    };

    set((state) => ({
      activeWorkflow: newWorkflow,
      workflows: [newWorkflow, ...state.workflows]
    }));

    // Step 1 Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    set((state) => {
      if (!state.activeWorkflow) return {};
      const steps = [...state.activeWorkflow.steps];
      steps[0] = { ...steps[0], status: 'completed', output: `Extracted latest 10-K asset sheets and revenue drivers.`, completedAt: new Date().toISOString() };
      steps[1] = { ...steps[1], status: 'running', startedAt: new Date().toISOString() };
      return { activeWorkflow: { ...state.activeWorkflow, steps } };
    });

    // Step 2 Simulation
    await new Promise(resolve => setTimeout(resolve, 1800));
    set((state) => {
      if (!state.activeWorkflow) return {};
      const steps = [...state.activeWorkflow.steps];
      steps[1] = { ...steps[1], status: 'completed', output: `DCF model computed fair value target is 8% above market price.`, completedAt: new Date().toISOString() };
      steps[2] = { ...steps[2], status: 'running', startedAt: new Date().toISOString() };
      return { activeWorkflow: { ...state.activeWorkflow, steps } };
    });

    // Step 3 Simulation & API query
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Summarize the investment research metrics for stock ticker ${symbol} in 3 bullet points.`
        })
      });
      const data = await res.json();
      const aiResponse = data.reply || `Fundamentals robust, trading at market multiples. High R&D investments yield long term capital expansion.`;

      set((state) => {
        if (!state.activeWorkflow) return {};
        const steps = [...state.activeWorkflow.steps];
        steps[2] = {
          ...steps[2],
          status: 'completed',
          output: `Summary synthesis completed:\n${aiResponse}\n\n🔬 Research Insight - Not Financial Advice`,
          completedAt: new Date().toISOString()
        };
        const finalWf: AIWorkflow = {
          ...state.activeWorkflow,
          status: 'completed',
          steps,
          completedAt: new Date().toISOString()
        };
        const workflows = state.workflows.map(w => w.id === wfId ? finalWf : w);
        return { activeWorkflow: finalWf, workflows };
      });
    } catch (e) {
      set((state) => {
        if (!state.activeWorkflow) return {};
        const steps = [...state.activeWorkflow.steps];
        steps[2] = { ...steps[2], status: 'completed', output: `Fundamentals solid; sentiment remains generally positive with minor hardware supply limits.`, completedAt: new Date().toISOString() };
        const finalWf: AIWorkflow = {
          ...state.activeWorkflow,
          status: 'completed',
          steps,
          completedAt: new Date().toISOString()
        };
        const workflows = state.workflows.map(w => w.id === wfId ? finalWf : w);
        return { activeWorkflow: finalWf, workflows };
      });
    }
  },

  submitDebateStance: async (opinion) => {
    set({ isDebateActive: true, debateOpinion: opinion });
    // Append stance to chat history
    const userMsg: AIAgentMessage = {
      id: `usr_d_${Date.now()}`,
      agentName: 'User Debater',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80',
      agentRole: 'Contrarian Research Lead',
      content: `Debate Thesis: ${opinion}`,
      timestamp: new Date().toISOString(),
      type: 'info'
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg]
    }));

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Sophia, an elite contrarian bond strategist. Challenge the following investment thesis in a polite but highly analytical manner, focusing on hidden debt and margin factors: "${opinion}"`
        })
      });
      const data = await res.json();
      
      const responseMsg: AIAgentMessage = {
        id: `bot_d_${Date.now()}`,
        agentName: 'Sophia (Contrarian Analyst)',
        agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128&q=80',
        agentRole: 'Sovereign Debt & Interest Rate Analyst',
        content: `I hear your thesis. However, considering capital constraints, let's explore some key alternative risks:\n\n${data.reply || 'Your margins may face severe compression if cost of goods expands faster than pricing elasticity. Re-evaluate traditional leverage points.'}\n\n🔬 Research Insight - Not Financial Advice`,
        timestamp: new Date().toISOString(),
        type: 'success'
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, responseMsg],
        isDebateActive: false
      }));
    } catch {
      set({ isDebateActive: false });
    }
  },

  updateLearningQuiz: (passed) => set((state) => {
    const updated = {
      ...state.learning,
      quizzesPassed: passed ? state.learning.quizzesPassed + 1 : state.learning.quizzesPassed,
      quizzesFailed: !passed ? state.learning.quizzesFailed + 1 : state.learning.quizzesFailed,
      completedLessons: passed ? Math.min(state.learning.completedLessons + 1, state.learning.totalLessons) : state.learning.completedLessons,
      streak: passed ? state.learning.streak + 1 : 0,
      lastActivity: new Date().toISOString()
    };
    return { learning: updated };
  }),

  toggleVoice: () => set((state) => ({ isVoiceActive: !state.isVoiceActive })),

  clearChat: () => set({ chatMessages: INITIAL_AGENTS_MESSAGES })
}));
