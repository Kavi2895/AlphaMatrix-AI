import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  X, 
  Send, 
  Trash2, 
  Download, 
  MessageSquare, 
  Plus, 
  ChevronRight, 
  HelpCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Briefcase, 
  AlertTriangle,
  Info
} from "lucide-react";
import { useUIStore } from "../stores/uiStore";
import { usePortfolioStore } from "../stores/portfolioStore";
import { useMarketStore } from "../stores/marketStore";
import { useToasts } from "./ui/toast";

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}

const SUGGESTED_QUESTIONS = [
  "What is my current portfolio allocation?",
  "Analyze Microsoft (MSFT) fundamental ratios",
  "Compare NVIDIA vs Tesla valuations",
  "What is the impact of stickier inflation on bonds?",
  "How do dividend yields affect mutual funds & ETFs?",
  "What are the top market indices doing today?"
];

export default function GlobalAIChat() {
  const { isGlobalChatOpen, setGlobalChatOpen } = useUIStore();
  const { portfolio } = usePortfolioStore();
  const { stocks, watchlist } = useMarketStore();
  const { addToast } = useToasts();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    const stored = localStorage.getItem("finsight_global_chat");
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // Fallback to default
        resetToWelcome();
      }
    } else {
      resetToWelcome();
    }
  }, []);

  const resetToWelcome = () => {
    const welcome: ChatMessage = {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome to AlphaMatrix Copilot. I have synchronized with your secure session context, portfolio holdings, and active watchlists.\n\nAsk me anything regarding:\n- **Your Portfolio Allocations & Gains**\n- **Company Fundamentals (PE, EPS, Margin ratios)**\n- **Inflation, Bonds, Mutual Funds, & ETFs**\n- **Technical Indicators & Market News**\n\nHow can I support your research efforts today?\n\n*Research Insight – Not Financial Advice.*",
      timestamp: new Date().toISOString(),
      sources: ["AlphaMatrix Fundamental Engine", "SEC Filings Database"]
    };
    setMessages([welcome]);
    localStorage.setItem("finsight_global_chat", JSON.stringify([welcome]));
  };

  // Scroll to bottom on messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const saveMessages = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem("finsight_global_chat", JSON.stringify(updated));
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    saveMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    // Build the system prompt to anchor the AI to actual user data
    const portfolioContext = `User portfolio name: ${portfolio.name}. Total value: $${portfolio.totalValue.toLocaleString()}. Cash holding: $${portfolio.cash.toLocaleString()}. Total gain/loss: $${portfolio.totalGainLoss.toLocaleString()} (${portfolio.totalGainLossPercent.toFixed(2)}%).
Holdings: ${portfolio.holdings.map(h => `${h.symbol}: ${h.shares} shares @ average price $${h.averagePrice} (Current: $${h.currentPrice})`).join(", ")}.
Watchlist symbol targets: ${watchlist.join(", ")}.
Listed stocks: ${stocks.map(s => `${s.symbol} (${s.name}) is at $${s.price} (change: ${s.changePercent}%, PE: ${s.peRatio || 'N/A'}, Yield: ${s.dividendYield || 'N/A'}%)`).join("; ")}.`;

    const prompt = `User query: "${textToSend}"
Session Context:
${portfolioContext}

As AlphaMatrix AI Copilot, answer the user's question with institutional-level depth, analytical clarity, and concise bullet points. You can format numbers, use tables for comparison, and point out indicators.
EVERY response must strictly contain the disclaimer "Research Insight – Not Financial Advice." on its own line at the end. Keep response detailed yet structured.`;

    try {
      const res = await fetch("/api/gemini/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      let reply = data.reply || "I am processing your query. Please stand by.";
      
      // Ensure the disclaimer is present
      if (!reply.includes("Research Insight – Not Financial Advice")) {
        reply = `${reply}\n\nResearch Insight – Not Financial Advice.`;
      }

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toISOString(),
        sources: ["AlphaMatrix Real-Time Pricing Feed", "Finsight Analytics Engine", "SEC Archive"]
      };

      saveMessages([...newMessages, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: "I experienced a temporary communication hiccup with the AlphaMatrix cloud node. Rest assured, your portfolio values are fully secure.\n\n*Research Insight – Not Financial Advice.*",
        timestamp: new Date().toISOString(),
        sources: ["Local Failover Engine"]
      };
      saveMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    resetToWelcome();
    addToast({
      title: "Conversation Cleared",
      description: "Chat history was successfully flushed.",
      type: "success"
    });
  };

  const handleExport = () => {
    try {
      const text = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join("\n---\n\n");
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AlphaMatrix_AI_Copilot_Chat_${Date.now()}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast({
        title: "Export Success",
        description: "The conversation was exported as a text file.",
        type: "success"
      });
    } catch {
      addToast({
        title: "Export Failure",
        description: "Unable to compile the export payload.",
        type: "destructive"
      });
    }
  };

  // Premium, lightweight inline markdown and table formatter
  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    let inTable = false;
    let tableRows: string[][] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // 1. Disclaimer Special Formatting
      if (line.includes("Research Insight") || line.includes("Not Financial Advice")) {
        elements.push(
          <div key={`disclaimer-${idx}`} className="mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-2 text-[10px] text-amber-400 font-mono leading-normal">
            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
            <span>{line.replace(/\*/g, "")}</span>
          </div>
        );
        return;
      }

      // 2. Table Parsing
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (cells.length > 0) {
          // Skip the divider rows (e.g. |---|---|)
          if (cells.every(c => c.match(/^-+$/))) {
            return;
          }
          inTable = true;
          tableRows.push(cells);
          return;
        }
      } else if (inTable) {
        // Table ended, compile it
        inTable = false;
        if (tableRows.length > 0) {
          elements.push(
            <div key={`table-${idx}`} className="my-3 overflow-x-auto border border-border/10 rounded-lg max-w-full">
              <table className="w-full text-[10px] text-left border-collapse bg-black/20 font-mono">
                <thead>
                  <tr className="border-b border-border/10 bg-secondary/15">
                    {tableRows[0].map((h, i) => (
                      <th key={`th-${i}`} className="p-2 font-bold text-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.slice(1).map((row, rIdx) => (
                    <tr key={`tr-${rIdx}`} className="border-b border-border/5 hover:bg-white/5 transition-colors">
                      {row.map((c, cIdx) => (
                        <td key={`td-${cIdx}`} className="p-2 text-slate-300">{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
        }
      }

      // 3. Header formatting (e.g. ### Header or - **Bold Item**)
      let parsedLine: React.ReactNode = line;
      const isHeader = line.startsWith("###");
      const isBullet = line.startsWith("- ") || line.startsWith("* ");

      let contentStr = line;
      if (isHeader) contentStr = line.replace(/^###\s*/, "");
      else if (isBullet) contentStr = line.replace(/^[-*]\s*/, "");

      // Handle Bold segments inside line
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(contentStr)) !== null) {
        if (match.index > lastIndex) {
          parts.push(contentStr.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-100">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < contentStr.length) {
        parts.push(contentStr.substring(lastIndex));
      }

      const innerContent = parts.length > 0 ? parts : contentStr;

      if (isHeader) {
        elements.push(<h4 key={`h-${idx}`} className="text-xs font-extrabold text-primary uppercase font-mono tracking-wider mt-4 mb-1.5">{innerContent}</h4>);
      } else if (isBullet) {
        elements.push(
          <div key={`b-${idx}`} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed pl-1">
            <span className="text-primary mt-1 shrink-0">•</span>
            <span>{innerContent}</span>
          </div>
        );
      } else if (line.trim() !== "") {
        elements.push(<p key={`p-${idx}`} className="text-xs text-slate-300 leading-relaxed my-1">{innerContent}</p>);
      }
    });

    // Handle trailing tables that didn't terminate with non-table line
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="table-trail" className="my-3 overflow-x-auto border border-border/10 rounded-lg max-w-full">
          <table className="w-full text-[10px] text-left border-collapse bg-black/20 font-mono">
            <thead>
              <tr className="border-b border-border/10 bg-secondary/15">
                {tableRows[0].map((h, i) => (
                  <th key={`th-${i}`} className="p-2 font-bold text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={`tr-${rIdx}`} className="border-b border-border/5 hover:bg-white/5 transition-colors">
                  {row.map((c, cIdx) => (
                    <td key={`td-${cIdx}`} className="p-2 text-slate-300">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setGlobalChatOpen(!isGlobalChatOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-violet-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/10 pulse-glow"
          id="global-chat-trigger"
        >
          {isGlobalChatOpen ? <X size={20} /> : <Bot size={20} className="animate-pulse" />}
        </button>
      </div>

      {/* Slide-out Overlay Drawer */}
      <AnimatePresence>
        {isGlobalChatOpen && (
          <>
            {/* Backdrop click-away shield */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setGlobalChatOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-default"
            />

            {/* Sidebar Chat Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-slate-950 border-l border-border/30 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="h-16 border-b border-border/20 px-4 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-violet-500">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-100 text-sm block">Global AI Copilot</span>
                    <span className="text-[9px] text-primary font-bold font-mono tracking-widest block uppercase -mt-0.5">AlphaMatrix Core</span>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleExport}
                    title="Export session log"
                    className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={handleClear}
                    title="Clear history"
                    className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="h-4 w-px bg-border/20 mx-1" />
                  <button
                    onClick={() => setGlobalChatOpen(false)}
                    className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Chat Message Scroll Panel */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : ''}`}>
                      {!isUser && (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <Bot size={13} />
                        </div>
                      )}

                      <div className={`max-w-[85%] rounded-lg border p-3 text-xs flex flex-col gap-1.5 select-text ${
                        isUser 
                          ? 'bg-primary/10 border-primary/20 text-slate-200 ml-6' 
                          : 'bg-slate-900/40 border-slate-800/80 mr-6 shadow-inner'
                      }`}>
                        
                        {/* Text formatting container */}
                        <div className="space-y-1">
                          {isUser ? <p className="leading-relaxed">{msg.text}</p> : renderMessageText(msg.text)}
                        </div>

                        {/* Message Metadata (Source & Time) */}
                        {!isUser && msg.sources && (
                          <div className="mt-2 pt-2 border-t border-border/5 flex flex-wrap gap-1 items-center">
                            <span className="text-[8px] uppercase font-mono text-muted-foreground font-bold mr-1 flex items-center gap-0.5">
                              <Info size={8} /> Sources:
                            </span>
                            {msg.sources.map((s, i) => (
                              <span key={i} className="text-[8px] bg-secondary/30 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="text-[7px] text-muted-foreground font-mono self-end uppercase mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                      <Bot size={13} />
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-3.5 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions Section */}
              <div className="border-t border-border/10 bg-black/10 px-4 py-3.5">
                <span className="text-[9px] uppercase font-bold font-mono text-primary/80 block mb-2 flex items-center gap-1">
                  <HelpCircle size={10} /> suggested prompts
                </span>
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto scrollbar-thin pr-1">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full text-left bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-primary/20 px-2.5 py-1.5 rounded-md text-[10px] text-slate-300 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ArrowUpRight size={10} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border/20 p-3 bg-slate-950 flex flex-col gap-1 pb-6">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }} 
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask AlphaMatrix Copilot..."
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-md h-9 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="h-9 w-9 bg-primary hover:bg-primary-hover text-white rounded-md flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-primary cursor-pointer shrink-0"
                  >
                    <Send size={13} />
                  </button>
                </form>
                <div className="text-[8px] text-center text-muted-foreground font-mono mt-1 select-none">
                  SEC-COMPLIANT RESEARCH COGNITION NODE
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
