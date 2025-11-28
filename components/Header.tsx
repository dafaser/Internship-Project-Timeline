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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm sm:text-base font-medium text-mega-dark">
          
          <button 
            onClick={onNavigateHome} 
            className="flex items-center hover:text-mega-yellow transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Timeline</span>
          </button>

          {currentView !== ViewLevel.MONTHS && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button 
                onClick={onNavigateMonth} 
                className={`hover:text-mega-yellow transition-colors ${currentView === ViewLevel.WEEKS ? 'text-mega-yellow font-bold' : ''}`}
              >
                {selectedMonth}
              </button>
            </>
          )}

          {currentView === ViewLevel.DAYS && selectedWeek && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-mega-yellow font-bold">Week {selectedWeek}</span>
            </>
          )}
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2 text-gray-500 hover:text-mega-yellow hover:bg-gray-50 rounded-full transition-all"
          title="Backend Settings"
        >
          <Database className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};