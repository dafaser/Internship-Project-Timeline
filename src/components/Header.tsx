import React from 'react';
import { ViewLevel, User } from '../types';
import { ChevronRight, Home, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: ViewLevel;
  selectedMonth: string | null;
  selectedWeek: number | null;
  user: User | null;
  onNavigateHome: () => void;
  onNavigateMonth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedMonth,
  selectedWeek,
  user,
  onNavigateHome,
  onNavigateMonth,
  onLogout
}) => {
  return (
    <header className="bg-mega-yellow border-b border-orange-400 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Navigation Breadcrumbs */}
        <div className="flex items-center space-x-1 text-sm sm:text-base font-bold text-white overflow-hidden">
          <button 
            onClick={onNavigateHome} 
            className="flex items-center hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Timeline</span>
          </button>

          {currentView !== ViewLevel.MONTHS && (
            <>
              <ChevronRight className="w-5 h-5 text-white/60 mx-1 flex-shrink-0" />
              <button 
                onClick={onNavigateMonth} 
                className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  currentView === ViewLevel.WEEKS 
                    ? 'bg-white text-mega-yellow shadow-md' 
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                {selectedMonth}
              </button>
            </>
          )}

          {currentView === ViewLevel.DAYS && selectedWeek && (
            <>
              <ChevronRight className="w-5 h-5 text-white/60 mx-1 flex-shrink-0" />
              <span className="bg-white text-mega-yellow px-3 py-2 rounded-lg shadow-md font-bold whitespace-nowrap">
                Week {selectedWeek}
              </span>
            </>
          )}
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs text-white/80 font-normal">Signed in as</p>
                <p className="text-sm text-white font-bold leading-none">{user.name}</p>
              </div>
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <button
                onClick={onLogout}
                className="p-2 bg-white/10 hover:bg-red-500 hover:text-white text-white rounded-full transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};