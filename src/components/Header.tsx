import React from 'react';
import { ViewLevel } from '../types';
import { ChevronRight, Database, Home } from 'lucide-react';

interface HeaderProps {
  currentView: ViewLevel;
  selectedMonth: string | null;
  selectedWeek: number | null;
  onNavigateHome: () => void;
  onNavigateMonth: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedMonth,
  selectedWeek,
  onNavigateHome,
  onNavigateMonth,
  onOpenSettings
}) => {
  return (
    <header className="bg-mega-yellow border-b border-orange-400 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm sm:text-base font-bold text-white">
          
          <button 
            onClick={onNavigateHome} 
            className="flex items-center hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Timeline</span>
          </button>

          {currentView !== ViewLevel.MONTHS && (
            <>
              <ChevronRight className="w-5 h-5 text-white/60 mx-1" />
              <button 
                onClick={onNavigateMonth} 
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
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
              <ChevronRight className="w-5 h-5 text-white/60 mx-1" />
              <span className="bg-white text-mega-yellow px-3 py-2 rounded-lg shadow-md font-bold">
                Week {selectedWeek}
              </span>
            </>
          )}
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200"
          title="Backend Settings"
        >
          <Database className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};