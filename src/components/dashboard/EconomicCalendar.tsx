import { useState } from "react";
import { useMarketStore } from "../../stores/marketStore";
import { Calendar, Bell, Check, BellOff, Info } from "lucide-react";
import { useToasts } from "../ui/toast";

export function EconomicCalendar() {
  const { economicEvents } = useMarketStore();
  const [alertsEnabled, setAlertsEnabled] = useState<Record<string, boolean>>({});
  const { addToast } = useToasts();

  const handleToggleAlert = (eventId: string, title: string) => {
    const isNowOn = !alertsEnabled[eventId];
    setAlertsEnabled(prev => ({ ...prev, [eventId]: isNowOn }));

    addToast({
      title: isNowOn ? "Macro Alert Configured" : "Alert Cancelled",
      description: isNowOn 
        ? `We will ping you immediately when actual data for ${title} is released.`
        : `Notification alert for ${title} has been cancelled.`,
      type: isNowOn ? "success" : "warning"
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Economic Indicators</h2>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono font-bold">EST/UTC HOURS</span>
        </div>

        {/* List of events */}
        <div className="space-y-3">
          {economicEvents.map((evt) => {
            const hasAlert = alertsEnabled[evt.id];
            return (
              <div key={evt.id} className="p-3 rounded-lg border border-border/15 bg-secondary/10 flex items-center justify-between group">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono font-semibold text-muted-foreground">{evt.time}</span>
                    <span className={`text-[8px] px-1 rounded font-extrabold uppercase tracking-widest ${
                      evt.impact === 'high' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' :
                      evt.impact === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {evt.impact}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-primary transition-colors">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5 font-mono text-[9px] text-muted-foreground">
                    <span>Forecast: <strong className="text-slate-300">{evt.forecast}</strong></span>
                    <span>Prev: <strong className="text-slate-300">{evt.previous}</strong></span>
                  </div>
                </div>

                {/* Notification Toggle button */}
                <button
                  onClick={() => handleToggleAlert(evt.id, evt.title)}
                  className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                    hasAlert 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-transparent border-border/20 text-muted-foreground hover:text-foreground'
                  }`}
                  title={hasAlert ? "Alert active" : "Enable alert notification"}
                >
                  {hasAlert ? <Bell className="animate-swing" size={13} /> : <BellOff size={13} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning Footer */}
      <div className="mt-4 flex items-start gap-2 text-[9px] text-muted-foreground bg-black/10 p-2 rounded border border-border/5">
        <Info size={12} className="text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          High-impact indicators trigger massive capital reallocations across indices. Always structure dynamic risk parameters ahead of releases.
        </p>
      </div>
    </div>
  );
}
