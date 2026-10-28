export const PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Day = (typeof DAYS)[number];

export type View = 'dashboard' | 'assignments' | 'attendance' | 'planner';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  attended: number;
  total: number;
}

export interface StudySession {
  id: string;
  day: Day;
  subject: string;
  startTime: string;
  endTime: string;
}

export interface AppState {
  targetPercent: number;
  tasks: Task[];
  attendance: AttendanceRecord[];
  sessions: StudySession[];
}

export type TaskInput = Omit<Task, 'id' | 'completed'>;
export type AttendanceInput = Omit<AttendanceRecord, 'id'>;
export type SessionInput = Omit<StudySession, 'id'>;
