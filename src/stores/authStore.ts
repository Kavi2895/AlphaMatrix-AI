import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
}

const DEFAULT_USER: User = {
  id: 'usr_1',
  name: 'Portfolio Investor',
  email: 'investor@finsight.ai',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
  preferences: {
    theme: 'dark',
    currency: 'USD',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      marketAlerts: true,
      portfolioAlerts: true,
      researchAlerts: true,
    },
  },
};

export const useAuthStore = create<AuthState>((set) => {
  // Check localStorage for existing user
  const storedUser = localStorage.getItem('finsight_user');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,
    isAuthenticated: !!storedUser, // Require sign-in on first load
    isLoading: false,

    login: async (email, name) => {
      set({ isLoading: true });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));
      const user: User = {
        ...DEFAULT_USER,
        email,
        name: name || 'Investor User',
      };
      localStorage.setItem('finsight_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    },

    register: async (email, name) => {
      set({ isLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user: User = {
        ...DEFAULT_USER,
        email,
        name,
      };
      localStorage.setItem('finsight_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
      localStorage.removeItem('finsight_user');
      set({ user: null, isAuthenticated: false });
    },

    updatePreferences: (prefs) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...prefs,
          },
        };
        localStorage.setItem('finsight_user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },
  };
});
