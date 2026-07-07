import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  FileText, 
  Bot, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  MicOff,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useAIStore } from "../../stores/aiStore";
import { useAuthStore } from "../../stores/authStore";
import { cn } from "../../lib/utils";
import { DropdownMenu, DropdownMenuItem } from "../ui/dropdown-menu";

export function Sidebar() {
  const { activeTab, setActiveTab, isSidebarOpen, setSidebarOpen, isGlobalChatOpen, setGlobalChatOpen } = useUIStore();
  const { isVoiceActive, toggleVoice } = useAIStore();
  const { user, logout } = useAuthStore();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio Optimiser', icon: Briefcase },
    { id: 'research', label: 'Research Terminal', icon: FileText },
    { id: 'ai-workspace', label: 'AI Multi-Agent Labs', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-border bg-card/40 backdrop-blur-xl transition-all duration-300 z-30 shrink-0",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/20">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-violet-500 shadow-md">
              <span className="font-bold text-white text-sm">AM</span>
            </div>
            <div>
              <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">AlphaMatrix</span>
              <span className="text-[10px] block text-primary font-bold -mt-1 font-mono">FINSIGHT AI</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-violet-500 shadow-md">
            <span className="font-bold text-white text-xs">A</span>
          </div>
        )}
        
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="rounded-md p-1 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
        
        {/* Global AI Copilot Button */}
        <button
          onClick={() => setGlobalChatOpen(!isGlobalChatOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group cursor-pointer mt-3 border border-primary/20",
            isGlobalChatOpen 
              ? "bg-primary/20 text-primary border-primary/40" 
              : "text-primary/90 bg-primary/5 hover:bg-primary/10 hover:text-primary"
          )}
        >
          <Bot size={18} className="text-primary shrink-0 animate-pulse" />
          {isSidebarOpen && <span className="truncate font-semibold">Global AI Copilot</span>}
        </button>
      </nav>

      {/* Voice Assistant module in rail */}
      <div className="p-2 border-t border-border/20 bg-black/10">
        <button
          onClick={toggleVoice}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer",
            isVoiceActive 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 pulse-glow" 
              : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/15"
          )}
        >
          {isVoiceActive ? <Mic size={14} className="animate-bounce" /> : <MicOff size={14} />}
          {isSidebarOpen && (
            <span>{isVoiceActive ? "Voice Lab Active" : "Enable Voice Lab"}</span>
          )}
        </button>
      </div>

      {/* Footer User Avatar */}
      {user && (
        <div className="p-2 border-t border-border/20">
          <DropdownMenu
            align="right"
            className="bottom-12 left-0 w-56 bg-slate-950/90 border-border/40 backdrop-blur-md shadow-2xl"
            trigger={
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer text-left select-none">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-border/20 object-cover shrink-0"
                />
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-slate-200 truncate">{user.name}</span>
                    <span className="block text-[10px] text-muted-foreground truncate">{user.email}</span>
                  </div>
                )}
              </div>
            }
          >
            <div className="px-3 py-2 border-b border-border/10 mb-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuItem onClick={() => setActiveTab('settings')} className="gap-2 text-slate-300">
              <UserIcon size={14} className="text-primary" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab('settings')} className="gap-2 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Security Hub</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()} className="gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
              <LogOut size={14} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
