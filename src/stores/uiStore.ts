import { create } from 'zustand';

type AppTab = 'dashboard' | 'market' | 'portfolio' | 'research' | 'ai-workspace' | 'settings';

interface UIState {
  activeTab: AppTab;
  isSidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeSettingsTab: string;
  isGlobalChatOpen: boolean;
  
  setActiveTab: (tab: AppTab) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setSettingsTab: (tab: string) => void;
  setGlobalChatOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  isSidebarOpen: true,
  rightPanelOpen: true,
  activeSettingsTab: 'profile',
  isGlobalChatOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
  setSettingsTab: (tab) => set({ activeSettingsTab: tab }),
  setGlobalChatOpen: (isOpen) => set({ isGlobalChatOpen: isOpen }),
}));
