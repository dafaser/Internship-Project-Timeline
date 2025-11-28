import React, { useState, useEffect } from 'react';
import { ViewLevel, AppState, User } from './types';
import { Header } from './components/Header';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
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
            userEmail={user.email}
          />
        )}
      </main>
    </div>
  );
};

export default App;