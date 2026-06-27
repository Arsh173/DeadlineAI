export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
  duration: number; // estimated hours
  importance: "High" | "Medium" | "Low";
  category: "Study" | "Work" | "Personal" | "Health" | "Finance";
  urgency: "High" | "Medium" | "Low";
  energyLevel: "High" | "Medium" | "Low";
  difficulty: "Hard" | "Medium" | "Easy";
  priority: "Critical" | "High" | "Medium" | "Low";
  completed: boolean;
  progress: number; // 0 - 100
  pomodoros: number; // completed focus sessions
  notes: string; // interactive note content
  createdAt: string;
}

export interface ScheduleBlock {
  time: string; // e.g. "09:00 - 10:00"
  type: "focus" | "break" | "habit" | "chore" | "flexible";
  label: string;
  associatedTaskId?: string;
  description: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  period: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
  unit: string; // "hrs", "tasks", "completed", "ml"
  completed: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  name: string; // "Coding" | "Reading" | "Exercise" | "Water Intake" | "Meditation" | "Sleep"
  targetValue: string; // e.g., "2 hours", "8 glasses", "30 mins"
  streak: number;
  history: string[]; // dates of completion, e.g. ["2026-06-25"]
  category: "Coding" | "Reading" | "Exercise" | "Water Intake" | "Meditation" | "Sleep" | "Other";
}

export interface Flashcard {
  id: string;
  userId: string;
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  box: number; // For Leitner System spaced repetition (1 - 5)
  nextReview: string; // date string
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  badges: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: "alert" | "info" | "success" | "review";
}

export interface AIHistoryMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
