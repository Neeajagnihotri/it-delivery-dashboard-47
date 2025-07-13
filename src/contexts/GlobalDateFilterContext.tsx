
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface DatePeriod {
  start: Date;
  end: Date;
}

export interface DateOption {
  value: string;
  label: string;
  period: DatePeriod;
}

interface GlobalDateFilterContextType {
  selectedPeriod: string;
  selectedOption: DateOption;
  dateOptions: DateOption[];
  setSelectedPeriod: (period: string) => void;
  getCurrentDateRange: () => DatePeriod;
}

const GlobalDateFilterContext = createContext<GlobalDateFilterContextType | undefined>(undefined);

export const useGlobalDateFilter = () => {
  const context = useContext(GlobalDateFilterContext);
  if (!context) {
    throw new Error('useGlobalDateFilter must be used within a GlobalDateFilterProvider');
  }
  return context;
};

const getCurrentMonth = (): DatePeriod => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
};

const getPreviousMonths = (monthsBack: number): DatePeriod => {
  const now = new Date();
  const targetMonth = subMonths(now, monthsBack);
  return {
    start: startOfMonth(targetMonth),
    end: endOfMonth(targetMonth)
  };
};

const dateOptions: DateOption[] = [
  { value: "current", label: "Current Month", period: getCurrentMonth() },
  { value: "prev1", label: "1 Month Ago", period: getPreviousMonths(1) },
  { value: "prev2", label: "2 Months Ago", period: getPreviousMonths(2) },
  { value: "prev3", label: "3 Months Ago", period: getPreviousMonths(3) },
  { value: "prev4", label: "4 Months Ago", period: getPreviousMonths(4) },
  { value: "prev5", label: "5 Months Ago", period: getPreviousMonths(5) },
];

interface GlobalDateFilterProviderProps {
  children: ReactNode;
}

export const GlobalDateFilterProvider: React.FC<GlobalDateFilterProviderProps> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const selectedOption = dateOptions.find(opt => opt.value === selectedPeriod) || dateOptions[0];

  const getCurrentDateRange = useCallback((): DatePeriod => {
    return selectedOption.period;
  }, [selectedOption]);

  const value: GlobalDateFilterContextType = {
    selectedPeriod,
    selectedOption,
    dateOptions,
    setSelectedPeriod,
    getCurrentDateRange,
  };

  return (
    <GlobalDateFilterContext.Provider value={value}>
      {children}
    </GlobalDateFilterContext.Provider>
  );
};
