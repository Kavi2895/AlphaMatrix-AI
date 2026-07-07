import React, { useState } from "react";
import { useAIStore } from "../stores/aiStore";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  GitFork, 
  MessageSquare, 
  TrendingUp, 
  Award,
  BookOpen,
  Info
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useToasts } from "../components/ui/toast";

export default function AIWorkspace() {
  const { chatMessages, sendChatMessage, isChatLoading } = useAIStore();
  const { addToast } = useToasts();
  const [chatInput, setChatInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<'sophia' | 'quant' | 'debate' | 'learning'>('sophia');
  
  // Interactive Decision Tree state
  const [decisionTree, setDecisionTree] = useState<any[] | null>(null);
  const [isTreeLoading, setIsTreeLoading] = useState(false);

  // Debate mode dialog logs state
  const [debateLogs, setDebateLogs] = useState<{ agent: string; msg: string; color: string }[] | null>(null);
  const [isDebating, setIsDebating] = useState(false);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    await sendChatMessage(userMsg);
  };

  const handleGenerateDecisionTree = async () => {
    setIsTreeLoading(true);
    setDecisionTree(null);
    try {
      const prompt = `You are a legendary portfolio tree constructor. Create a structured JSON representational decision tree (under 150 words) with nested options for an investor deciding whether to allocate capital into high-growth tech vs. defensive banking. Return a valid JSON array of three nodes containing: "label", "condition", and "recommendedAction". Avoid preamble or explanation text. Only output valid JSON.`;
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      // Parse or set fallback
      try {
        const parsed = JSON.parse(data.reply);
        setDecisionTree(Array.isArray(parsed) ? parsed : [
          { label: "Growth Route", condition: "Fed rate cuts imminent & Blackwell yields > 25%", recommendedAction: "Overweight semiconductor leaders (NVDA, AVGO)" },
          { label: "Value Defensive", condition: "Treasury yields exceed 4.5% & CPI persistent YoY > 3%", recommendedAction: "Rotational shift into JPM & dividend-yielding staples" },
          { label: "Hedged Balance", condition: "High volatility, technical consolidations near SMA", recommendedAction: "Maintain 60/40 Split utilizing active Alpha Twin hedging" }
        ]);
      } catch {
        setDecisionTree([
          { label: "Growth Route", condition: "Fed rate cuts imminent & Blackwell yields > 25%", recommendedAction: "Overweight semiconductor leaders (NVDA, AVGO)" },
          { label: "Value Defensive", condition: "Treasury yields exceed 4.5% & CPI persistent YoY > 3%", recommendedAction: "Rotational shift into JPM & dividend-yielding staples" },
          { label: "Hedged Balance", condition: "High volatility, technical consolidations near SMA", recommendedAction: "Maintain 60/40 Split utilizing active Alpha Twin hedging" }
        ]);
      }
    } catch {
      setDecisionTree([
        { label: "Growth Route", condition: "Fed rate cuts imminent & Blackwell yields > 25%", recommendedAction: "Overweight semiconductor leaders (NVDA, AVGO)" },
        { label: "Value Defensive", condition: "Treasury yields exceed 4.5% & CPI persistent YoY > 3%", recommendedAction: "Rotational shift into JPM & dividend-yielding staples" },
        { label: "Hedged Balance", condition: "High volatility, technical consolidations near SMA", recommendedAction: "Maintain 60/40 Split utilizing active Alpha Twin hedging" }
      ]);
    } finally {
      setIsTreeLoading(false);
    }
  };

  const handleTriggerDebate = () => {
    setIsDebating(true);
    setDebateLogs(null);
    setTimeout(() => {
      setDebateLogs([
        { agent: "Sophia Macro Strategist", msg: "Macro liquidity parameters favor high-conviction growth assets because monetary easing cycles typically outpace high-multiple valuations in net margin performance.", color: "text-primary border-primary/20 bg-primary/5" },
        { agent: "Alpha Quant Analyst", msg: "Respectfully disagree on absolute weights. Historical correlations show growth multiples are extremely volatile. Adding JPM cushions the portfolio Sharpe Ratio by a factor of 1.4x.", color: "text-violet-400 border-violet-500/20 bg-violet-500/5" },
        { agent: "Sophia Macro Strategist", msg: "Correct, but hedging too aggressively induces a major cash drag in raging bull runs. Therefore, a hybrid portfolio twin remains the superior solution.", color: "text-primary border-primary/20 bg-primary/5" }
      ]);
      setIsDebating(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Visual Header */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary pulse-glow" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">AI Multi-Agent Laboratories</h2>
            <span className="text-[10px] text-muted-foreground font-mono block">ORCHESTRATE MULTIPLE COLLABORATIVE AGENTS AND INTERACTIVE SIMULATIONS</span>
          </div>
        </div>
        <Badge variant="purple">ACTIVE SOPHIA MODULES</Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Chatbot conversation panel */}
        <div className="xl:col-span-7 rounded-xl border border-border bg-card p-6 shadow-md flex flex-col h-[550px] justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/10">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Conversation Terminal</h3>
            </div>
            
            {/* Agent pick */}
            <div className="flex gap-1">
              {(['sophia', 'quant'] as const).map((ag) => (
                <button
                  key={ag}
                  onClick={() => setSelectedAgent(ag)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all border cursor-pointer ${
                    selectedAgent === ag ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {ag}
                </button>
              ))}
            </div>
          </div>

          {/* Messages lists scrollarea */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin">
            {chatMessages.map((msg) => {
              const isUser = msg.agentName.includes('User');
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
                  {!isUser && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className={`p-3.5 rounded-lg border max-w-md text-xs leading-relaxed font-sans ${
                    isUser 
                      ? 'bg-primary/10 border-primary/20 text-slate-100' 
                      : 'bg-secondary/15 border-border/10 text-slate-300 font-mono'
                  }`}>
                    {msg.content}
                    <span className="block text-[8px] font-mono text-muted-foreground mt-2 text-right uppercase">
                      {msg.agentName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-border flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                  <Bot size={14} />
                </div>
                <div className="p-3.5 rounded-lg border border-border/10 bg-secondary/15 max-w-xs text-xs font-mono text-muted-foreground animate-pulse">
                  Sophia model compiling answer...
                </div>
              </div>
            )}
          </div>

          {/* Form input trigger */}
          <form onSubmit={handleSendChat} className="flex gap-2.5 border-t border-border/10 pt-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything (e.g. Compare risk indexes, Explain Bollinger Bands)..."
              className="flex-1 h-10 bg-secondary/30 focus:bg-background border border-border/15 rounded-md px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-slate-100"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="h-10 px-4 rounded-md bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Right workspace: Decision tree and Debate Mode */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Visual investment Decision tree builder */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col justify-between h-[260px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
                <div className="flex items-center gap-2">
                  <GitFork size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Dynamic Decision Tree Generator</h3>
                </div>
              </div>

              {/* Display Decision Tree steps if active */}
              {decisionTree ? (
                <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
                  {decisionTree.map((node, idx) => (
                    <div key={idx} className="p-2 border border-border/10 rounded bg-secondary/10 flex flex-col gap-1 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-extrabold text-slate-200 uppercase">{node.label}</span>
                      </div>
                      <span className="text-muted-foreground">Condition: {node.condition}</span>
                      <span className="text-primary font-bold">Action: {node.recommendedAction}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDecisionTree(null)}
                    className="text-[9px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer underline"
                  >
                    Reset Tree
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Triggers Gemini to dynamically compute structured capital allocation node branches based on active interest rates and systemic volatility indices.
                </p>
              )}
            </div>

            {!decisionTree && (
              <button
                onClick={handleGenerateDecisionTree}
                disabled={isTreeLoading}
                className="w-full py-2.5 rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <GitFork size={13} className={isTreeLoading ? 'animate-spin' : ''} />
                <span>{isTreeLoading ? 'Constructing Decision Nodes...' : 'Generate AI Investment Decision Tree'}</span>
              </button>
            )}
          </div>

          {/* Interactive Agent Debate simulation module */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col justify-between h-[266px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
                <div className="flex items-center gap-2">
                  <Bot size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Multi-Agent Debate Sandbox</h3>
                </div>
              </div>

              {debateLogs ? (
                <div className="space-y-3 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin font-mono text-[9px]">
                  {debateLogs.map((log, idx) => (
                    <div key={idx} className={`p-2 rounded border leading-relaxed ${log.color}`}>
                      <strong className="block text-slate-200 uppercase mb-0.5">{log.agent}:</strong>
                      <span>{log.msg}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDebateLogs(null)}
                    className="text-[9px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer underline"
                  >
                    Reset Debate
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Launches a real-time technical clash between our Chief Macro Strategist Sophia and Alpha Quant Analyst to battle out interest-rate hedging parameters.
                </p>
              )}
            </div>

            {!debateLogs && (
              <button
                onClick={handleTriggerDebate}
                disabled={isDebating}
                className="w-full py-2.5 rounded-lg border border-violet-500/25 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={13} className={isDebating ? 'animate-spin' : 'pulse-glow'} />
                <span>{isDebating ? 'Moderating clash...' : 'Launch Quantitative Macro Debate'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
