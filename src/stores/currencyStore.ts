import { create } from 'zustand';

export type CurrencyMode = 'USD' | 'INR' | 'USD_INR';

interface CurrencyState {
  mode: CurrencyMode;
  rate: number; // USD to INR exchange rate
  setMode: (mode: CurrencyMode) => void;
  setRate: (rate: number) => void;
  fetchLiveRate: () => Promise<void>;
  format: (usdValue: number, compact?: boolean) => string;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => {
  // Check localStorage for persisted user currency preferences
  const storedMode = (localStorage.getItem('finsight_currency_mode') as CurrencyMode) || 'USD_INR';
  const storedRate = Number(localStorage.getItem('finsight_currency_rate')) || 85.0; // Robust real fallback rate

  return {
    mode: storedMode,
    rate: storedRate,
    setMode: (mode) => {
      localStorage.setItem('finsight_currency_mode', mode);
      set({ mode });
    },
    setRate: (rate) => {
      localStorage.setItem('finsight_currency_rate', String(rate));
      set({ rate });
    },
    fetchLiveRate: async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (res.ok) {
          const data = await res.json();
          const inrRate = data.rates?.INR;
          if (inrRate) {
            get().setRate(Number(inrRate.toFixed(2)));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live exchange rate, using cached/fallback rate", err);
      }
    },
    format: (usdValue, compact = false) => {
      const mode = get().mode;
      const rate = get().rate;

      const formatUSD = (val: number) => {
        if (compact) {
          return '$' + new Intl.NumberFormat('en-US', { 
            notation: 'compact', 
            compactDisplay: 'short',
            maximumFractionDigits: 1
          }).format(val);
        }
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val);
      };

      const formatINR = (valInUSD: number) => {
        const valInINR = valInUSD * rate;
        if (compact) {
          return '₹' + new Intl.NumberFormat('en-IN', { 
            notation: 'compact', 
            compactDisplay: 'short',
            maximumFractionDigits: 1
          }).format(valInINR);
        }
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(valInINR);
      };

      if (mode === 'USD') {
        return formatUSD(usdValue);
      } else if (mode === 'INR') {
        return formatINR(usdValue);
      } else {
        // Mode 'USD_INR' -> USD + INR dual format
        // Return format: "$1,250.50 (≈ ₹1,07,000)"
        if (compact) {
          return `${formatUSD(usdValue)} (≈ ${formatINR(usdValue)})`;
        }
        return `${formatUSD(usdValue)}\n(≈ ${formatINR(usdValue)})`;
      }
    }
  };
});
