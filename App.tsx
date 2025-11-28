import React, { useState } from 'react';
import { ViewLevel, AppState } from './types';
import { Header } from './components/Header';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: ViewLevel.MONTHS,
    selectedMonth: null,
    selectedWeek: null,
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Navigation Handlers
  const goHome = () => setState({ view: ViewLevel.MONTHS, selectedMonth: null, selectedWeek: null });
  
  const selectMonth = (month: string) => {
    setState({ ...state, view: ViewLevel.WEEKS, selectedMonth: month });
  };

  const selectWeek = (week: number) => {
    setState({ ...state, view: ViewLevel.DAYS, selectedWeek: week });
  };

  const goBackToMonth = () => {
    if (state.selectedMonth) {
      setState({ ...state, view: ViewLevel.WEEKS, selectedWeek: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-mega-dark">
      <Header 
        currentView={state.view}
        selectedMonth={state.selectedMonth}
        selectedWeek={state.selectedWeek}
        onNavigateHome={goHome}
        onNavigateMonth={goBackToMonth}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.view === ViewLevel.MONTHS && (
          <MonthView onSelectMonth={selectMonth} />
        )}

        {state.view === ViewLevel.WEEKS && state.selectedMonth && (
          <WeekView 
            month={state.selectedMonth} 
            onSelectWeek={selectWeek} 
          />
        )}

        {state.view === ViewLevel.DAYS && state.selectedMonth && state.selectedWeek && (
          <DayView 
            month={state.selectedMonth} 
            week={state.selectedWeek} 
          />
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;