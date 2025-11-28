import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WeekViewProps {
  month: string;
  onSelectWeek: (week: number) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ month, onSelectWeek }) => {
  const weeks = [1, 2, 3, 4];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-mega-dark">{month}</h2>
        <p className="text-gray-500 mt-2">Select a week to manage daily tasks</p>
      </div>

      <div className="space-y-4">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => onSelectWeek(week)}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:border-mega-yellow hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-mega-light flex items-center justify-center text-mega-dark group-hover:bg-mega-yellow group-hover:text-white transition-colors">
                <span className="font-bold text-lg">{week}</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-mega-dark">Week {week}</h3>
                <p className="text-sm text-gray-500">7 Days</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-400 group-hover:text-mega-yellow transition-colors">
              <span className="mr-2 text-sm font-medium hidden sm:inline">View Tasks</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};