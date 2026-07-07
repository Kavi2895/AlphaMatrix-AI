import { useState } from "react";
import { Settings, Shield, Key, Bell, Check, HelpCircle, BookOpen, AlertTriangle, Coins, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useToasts } from "../components/ui/toast";
import { useCurrencyStore } from "../stores/currencyStore";

export default function SettingsPage() {
  const { addToast } = useToasts();
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSaving, setIsSaving] = useState(false);
  const { mode: currencyMode, setMode: setCurrencyMode, rate: currencyRate } = useCurrencyStore();

  // Learning Hub completed states
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'l1': true,
    'l2': false,
  });

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: "Preferences Saved",
        description: `Risk profile successfully configured to ${riskTolerance.toUpperCase()}. AI allocation recommendation models will realign.`,
        type: "success"
      });
    }, 1200);
  };

  const handleToggleLesson = (lessonId: string, title: string) => {
    const nextVal = !completedLessons[lessonId];
    setCompletedLessons(prev => ({ ...prev, [lessonId]: nextVal }));
    addToast({
      title: nextVal ? "Lesson Completed!" : "Progress Cleared",
      description: nextVal 
        ? `You completed the '${title}' training module successfully.`
        : `Marked '${title}' as incomplete.`,
      type: nextVal ? "success" : "info"
    });
  };

  const lessons = [
    { id: 'l1', title: 'Macro Portfolio Hedging Basics', duration: '5 min', desc: 'Understand correlation indexes between tech sectors and value assets.' },
    { id: 'l2', title: 'Reading SEC filings with Multi-Agent RAG', duration: '12 min', desc: 'Deep dive into balance sheets, operating margins, and liability footnotes.' },
    { id: 'l3', title: 'Risk Hedging: Bollinger Bands & EMA(20)', duration: '8 min', desc: 'Practical technical guides to trigger trailing stops on volatility indices.' }
  ];

  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk profile settings column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
              <Shield size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">System Risk Parameters</h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Determine the allocation boundaries utilized by Sophia AI when computing your target Portfolio Twin optimal weights.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {([
                { id: 'low', label: 'Conservative', desc: 'High fixed income' },
                { id: 'medium', label: 'Moderate', desc: '60/40 Split' },
                { id: 'high', label: 'Aggressive', desc: '100% Growth multiples' }
              ] as const).map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setRiskTolerance(profile.id)}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    riskTolerance === profile.id 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-secondary/15 border-border/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">{profile.label}</span>
                  <span className="text-[8px] font-mono block opacity-80 mt-1">{profile.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full h-10 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving Preferences...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>

          {/* Valuation Currency settings */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
              <Coins size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Valuation Currency Settings</h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Configure how asset prices, gains, and balances are displayed across the terminal. Live exchange rate: <strong className="text-slate-300">1 USD ≈ ₹{currencyRate.toFixed(2)}</strong>.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'USD', label: 'USD Only', desc: 'Standard $' },
                { id: 'INR', label: 'INR Only', desc: 'Rupees ₹' },
                { id: 'USD_INR', label: 'USD + INR', desc: 'Dual Display' }
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setCurrencyMode(opt.id);
                    addToast({
                      title: "Currency Realignment",
                      description: `Workspace currency is now displayed in ${opt.label.toUpperCase()}.`,
                      type: "success"
                    });
                  }}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    currencyMode === opt.id 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-secondary/15 border-border/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">{opt.label}</span>
                  <span className="text-[8px] font-mono block opacity-80 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secure Environment Settings */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
              <Key size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Secure Environment Variables</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground block mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full h-10 bg-secondary/20 border border-border/15 rounded-md px-3 text-xs text-muted-foreground disabled:cursor-not-allowed font-mono"
                />
                <span className="text-[9px] text-muted-foreground block mt-1.5 leading-normal">
                  Managed securely on server environment variables to block Client-Side leaks completely.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quant Academy Learning Hub Column */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
                <BookOpen size={16} className="text-primary" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Quant Academy Learning Hub</h2>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Unlock core training lessons built by BlackRock quants to master the mathematics of micro-hedging and RAG operations.
              </p>

              {/* Lesson items list */}
              <div className="space-y-3">
                {lessons.map((lesson) => {
                  const isDone = completedLessons[lesson.id];
                  return (
                    <div key={lesson.id} className="p-3.5 rounded-lg border border-border/15 bg-secondary/10 flex items-start gap-3 group">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => handleToggleLesson(lesson.id, lesson.title)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`text-xs font-semibold truncate transition-colors ${
                            isDone ? 'text-muted-foreground line-through' : 'text-slate-200 group-hover:text-primary'
                          }`}>
                            {lesson.title}
                          </h4>
                          <span className="text-[9px] font-mono text-muted-foreground shrink-0">{lesson.duration}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          {lesson.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warning advisory */}
            <div className="mt-6 flex items-start gap-2 text-[9px] text-muted-foreground bg-black/10 p-2.5 rounded border border-border/5">
              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Trading securities carries substantial systemic risk. Sophia AI models provide advanced quantitative models and education, not licensed financial solicitations.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
