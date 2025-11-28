export interface Task {
  id: string;
  month: string;
  week: number;
  day: string;
  task: string;
  is_completed: boolean; // Checklist
  status: 'Not Started' | 'In Progress' | 'Done';
  notes: string;
  created_at: string;
}

export interface WeeklyGoal {
  id: string;
  month: string;
  week: number;
  goal: string;
  created_at: string;
}

export interface MonthlyGoal {
  id: string;
  month: string;
  goal: string;
  created_at: string;
}

export enum ViewLevel {
  MONTHS = 'MONTHS', // Level 1
  WEEKS = 'WEEKS',   // Level 2
  DAYS = 'DAYS',     // Level 3
}

export interface AppState {
  view: ViewLevel;
  selectedMonth: string | null;
  selectedWeek: number | null;
}

export const MONTHS = [
  "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];
