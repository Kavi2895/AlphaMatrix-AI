import React from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { RightPanel } from "./RightPanel";
import GlobalAIChat from "../GlobalAIChat";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#090a0f] text-slate-100">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Workspace Body Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Row */}
        <TopHeader />

        {/* Dynamic Inner Tab Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0b0c14] relative scrollbar-thin">
          {children}
        </main>
      </div>

      {/* 3. Right collapsible News / Briefing Sidebar */}
      <RightPanel />

      {/* 4. Global AI Chat Assistant Panel */}
      <GlobalAIChat />
    </div>
  );
}
