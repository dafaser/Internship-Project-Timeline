import React from 'react';
import { Calendar } from 'lucide-react';
import { MONTHS } from '../types';

interface MonthViewProps {
  onSelectMonth: (month: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ onSelectMonth }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-mega-dark">Internship Project Timeline</h1>
        <p className="text-gray-500 mt-2">Select a month to view weekly breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => onSelectMonth(month)}
            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-mega-yellow transition-all duration-300 text-left flex flex-col justify-between h-48 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-24 h-24 text-mega-yellow" />
            </div>
            
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phase {Math.ceil((index + 1) / 2)}</span>
              <h2 className="text-2xl font-bold text-mega-dark mt-1 group-hover:text-mega-yellow transition-colors">
                {month}
              </h2>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 font-medium mt-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full group-hover:bg-mega-yellow group-hover:text-white transition-colors">
                4 Weeks
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};