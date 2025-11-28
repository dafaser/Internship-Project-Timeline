import React, { useState, useEffect } from 'react';
import { ViewLevel, AppState, User } from './types';
import { Header } from './components/Header';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { SettingsModal } from './components/SettingsModal';
import { Login } from './components/Login';
import { jwtDecode } from "jwt-decode";
import { storageService } from './services/storage';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // App Navigation State
  const [state, setState] = useState<AppState>({
    view: ViewLevel.MONTHS,
    selectedMonth: null,
    selectedWeek: null,
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('megatrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const newUser: User = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      };
      setUser(newUser);
      localStorage.setItem('megatrack_user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('megatrack_user');
    // Reset view
    setState({ view: ViewLevel.MONTHS, selectedMonth: null, selectedWeek: null });
  };

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

  // Override storage save to include user email
  const handleSaveTaskWithUser = async (task: any) => {
    await storageService.saveTask(task, user?.email);
  };

  // Render Login if no user
  if (!user) {
    return (
      <Login 
        onSuccess={handleLoginSuccess}
        onError={() => console.log('Login Failed')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-mega-dark">
      <Header 
        currentView={state.view}
        selectedMonth={state.selectedMonth}
        selectedWeek={state.selectedWeek}
        user={user}
        onNavigateHome={goHome}
        onNavigateMonth={goBackToMonth}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
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
            // We need to inject the user email when saving from DayView
            // However, DayView imports storageService directly.
            // To be cleanest without refactoring DayView props deeply, 
            // we will modify DayView to accept a userEmail prop in the next step,
            // or rely on DayView using the service. 
            // For now, let's pass the user email via prop to DayView.
            userEmail={user.email}
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