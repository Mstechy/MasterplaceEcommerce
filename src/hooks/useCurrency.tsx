import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

type CurrencyCode = "USD" | "NGN" | "GBP";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  NGN: { code: "NGN", symbol: "₦", rate: 1550 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79 },
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatPrice: (usdPrice: number) => string;
  currencies: typeof CURRENCIES;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem("preferred_currency") as CurrencyCode;
    return saved && CURRENCIES[saved] ? saved : "USD";
  });

  // Auto-detect on first visit
  useEffect(() => {
    if (localStorage.getItem("preferred_currency")) return;
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data.country === "NG") setCode("NGN");
        else if (data.country === "GB") setCode("GBP");
      })
      .catch(() => {});
  }, []);

  const setCurrencyCode = useCallback((c: CurrencyCode) => {
    setCode(c);
    localStorage.setItem("preferred_currency", c);
  }, []);

  const formatPrice = useCallback((usdPrice: number) => {
    const info = CURRENCIES[code];
    const converted = usdPrice * info.rate;
    if (code === "NGN") return `₦${converted.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (code === "GBP") return `£${converted.toFixed(2)}`;
    return `$${converted.toFixed(2)}`;
  }, [code]);

  return (
    <CurrencyContext.Provider value={{ currency: CURRENCIES[code], setCurrencyCode, formatPrice, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
