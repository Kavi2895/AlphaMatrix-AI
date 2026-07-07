import { useState } from "react";
import { useAIStore } from "../stores/aiStore";
import { 
  FileText, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Terminal, 
  Activity, 
  Cpu,
  Bookmark,
  Award
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useToasts } from "../components/ui/toast";

export default function Research() {
  const { startMultiAgentWorkflow, activeWorkflow } = useAIStore();
  const { addToast } = useToasts();
  const [selectedFiling, setSelectedFiling] = useState<string | null>(null);
  const [researchOutput, setResearchOutput] = useState<string | null>(null);

  const isWorkflowLoading = activeWorkflow?.status === 'running';

  const mockFilings = [
    { id: 'f1', ticker: 'NVDA', type: '10-K', date: '2026-03-01', desc: 'Annual SEC report containing complete financial disclosures and Blackwell foundry risk metrics.' },
    { id: 'f2', ticker: 'AAPL', type: '10-Q', date: '2026-05-14', desc: 'Quarterly financial report including consumer hardware margins and service-segment growth vectors.' },
    { id: 'f3', ticker: 'MSFT', type: '8-K', date: '2026-06-22', desc: 'Current report indicating pivotal strategic AI infrastructure capital expansions.' }
  ];

  const handleRunRAGResearch = async () => {
    if (!selectedFiling) {
      addToast({
        title: "No Filing Selected",
        description: "Please select an SEC filing card from the terminal menu.",
        type: "warning"
      });
      return;
    }

    const targetFiling = mockFilings.find(f => f.id === selectedFiling)!;
    setResearchOutput(null);

    try {
      await startMultiAgentWorkflow(targetFiling.ticker);
      
      // Extract the output of the final step (Synthesis Agent)
      // Since startMultiAgentWorkflow handles it, we can display a success notification
      addToast({
        title: "RAG Analysis Completed",
        description: `Successfully analyzed the SEC filing for ${targetFiling.ticker}.`,
        type: "success"
      });
    } catch {
      addToast({
        title: "Analysis Failure",
        description: "Unable to complete the multi-agent quantitative pipeline.",
        type: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* SEC Filings Terminal List */}
        <div className="xl:col-span-6 rounded-xl border border-border bg-card p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">SEC Edgar Live Filing Feeds</h2>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">LIVE API SOCKETS</span>
            </div>

            {/* Filing card selection */}
            <div className="space-y-3 mb-5">
              {mockFilings.map((filing) => {
                const isSel = selectedFiling === filing.id;
                return (
                  <div
                    key={filing.id}
                    onClick={() => setSelectedFiling(filing.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group ${
                      isSel 
                        ? 'bg-primary/5 border-primary/40 glow-blue' 
                        : 'bg-secondary/15 border-border/10 hover:border-border/30 hover:bg-secondary/25'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-100 group-hover:text-primary transition-colors">{filing.ticker}</span>
                        <Badge variant="purple">{filing.type}</Badge>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">{filing.date}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-normal mb-1">
                      {filing.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRunRAGResearch}
            disabled={isWorkflowLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold cursor-pointer transition-all shadow-md"
          >
            <Sparkles size={14} className={isWorkflowLoading ? 'animate-spin' : ''} />
            <span>{isWorkflowLoading ? "Executing Multi-Agent Pipelines..." : "Launch AI Multi-Agent RAG Audit"}</span>
          </button>
        </div>

        {/* Multi-Agent Active workflow live visual logs */}
        <div className="xl:col-span-6 rounded-xl border border-border bg-card p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-primary pulse-glow" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Quant Pipeline Execution Visualiser</h2>
              </div>
              <Activity size={14} className="text-muted-foreground" />
            </div>

            {activeWorkflow ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{activeWorkflow.name}</span>
                  <Badge variant="warning">{activeWorkflow.status.toUpperCase()}</Badge>
                </div>

                <div className="relative border-l border-border/20 pl-4 space-y-4 mt-3 font-mono text-[11px]">
                  {activeWorkflow.steps.map((step) => (
                    <div key={step.id} className="relative">
                      {/* Step node dot */}
                      <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border ${
                        step.status === 'completed' ? 'bg-emerald-500 border-emerald-400' :
                        step.status === 'running' ? 'bg-amber-500 border-amber-400 animate-ping' :
                        'bg-slate-700 border-slate-600'
                      }`} />

                      <div className="text-slate-200 font-bold">{step.name}</div>
                      <span className="text-[9px] text-muted-foreground uppercase">{step.agent}</span>
                      <p className="text-[10px] text-slate-300 leading-normal bg-black/20 p-2 rounded mt-1 border border-border/5 whitespace-pre-line">
                        {step.status === 'running' ? (step.input || 'Parsing documents, computing vector chunks...') :
                         step.status === 'completed' ? (step.output || 'Successfully output quantitative calibration variables.') :
                         'Awaiting previous pipeline node outputs.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed border-border/15 rounded-lg bg-black/10">
                <Terminal size={32} className="text-muted-foreground mb-2 opacity-50" />
                <span className="text-xs text-slate-300 font-bold block mb-1">Pipeline Console Idle</span>
                <p className="text-[10px] text-muted-foreground max-w-[280px]">
                  Select an SEC filing on the left, then click "Launch AI Multi-Agent RAG Audit" to witness real-time collaborative quantitative agent actions.
                </p>
              </div>
            )}
          </div>

          {researchOutput && (
            <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary mb-2 font-mono">
                <Award size={12} />
                <span>Consolidated Fundamental AI Audit Report</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {researchOutput}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
