import { useEffect } from "react";
import { useUIStore } from "./stores/uiStore";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Research from "./pages/Research";
import AIWorkspace from "./pages/AIWorkspace";
import SettingsPage from "./pages/Settings";
import { useToasts } from "./components/ui/toast";
import { useAuthStore } from "./stores/authStore";
import AuthPage from "./pages/AuthPage";
import { useCurrencyStore } from "./stores/currencyStore";

export default function App() {
  const { activeTab } = useUIStore();
  const { ToastContainer } = useToasts();
  const { isAuthenticated } = useAuthStore();
  const { fetchLiveRate } = useCurrencyStore();

  useEffect(() => {
    fetchLiveRate();
  }, [fetchLiveRate]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'market':
        return <Market />;
      case 'portfolio':
        return <Portfolio />;
      case 'research':
        return <Research />;
      case 'ai-workspace':
        return <AIWorkspace />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <MainLayout>
      {renderActivePage()}
      <ToastContainer />
    </MainLayout>
  );
}
