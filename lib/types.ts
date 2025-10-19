export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  targetDays: number;
  color: string;
}

export interface HabitRecord {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitFormData {
  name: string;
  description?: string;
  targetDays: number;
  color: string;
}

export interface HabitWithRecords extends Habit {
  records: HabitRecord[];
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}