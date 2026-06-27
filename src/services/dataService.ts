import { db, auth } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  addDoc 
} from "firebase/firestore";
import { Task, Goal, Habit, Flashcard, UserProfile, Notification } from "../types";

// SEED DATA FOR FIRST TIME USERS
const SEED_TASKS = (userId: string): Task[] => [
  {
    id: "task-1",
    userId,
    title: "Finish React UI Prototype (DeadlineAI)",
    description: "Build a pristine, visual user interface with Framer Motion and glassmorphic cards.",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
    duration: 5,
    importance: "High",
    category: "Study",
    urgency: "High",
    energyLevel: "High",
    difficulty: "Medium",
    priority: "Critical",
    completed: false,
    progress: 65,
    pomodoros: 2,
    notes: "Integrated with Firebase database and server-side Gemini. Focus on animating components gracefully.",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    userId,
    title: "Google AI Hackathon Submission",
    description: "Write the documentation, record a demo video, and submit the GitHub repository.",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
    duration: 8,
    importance: "High",
    category: "Work",
    urgency: "High",
    energyLevel: "High",
    difficulty: "Hard",
    priority: "High",
    completed: false,
    progress: 20,
    pomodoros: 0,
    notes: "Make sure all environment variables are correctly specified in .env.example before push.",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    userId,
    title: "Revise Spaced Repetition Flashcards",
    description: "Use the Leitner system to review React state patterns, hooks, and Vite concepts.",
    deadline: new Date().toISOString().split('T')[0], // today
    duration: 1,
    importance: "Medium",
    category: "Study",
    urgency: "High",
    energyLevel: "Medium",
    difficulty: "Easy",
    priority: "High",
    completed: true,
    progress: 100,
    pomodoros: 1,
    notes: "Review useEffect dependency array warnings. Primitive values are safer.",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    userId,
    title: "Prepare Cloud Run Deployment",
    description: "Double check Dockerfile and server.ts port bindings to make sure port 3000 is used.",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days
    duration: 3,
    importance: "High",
    category: "Work",
    urgency: "Low",
    energyLevel: "Medium",
    difficulty: "Medium",
    priority: "Medium",
    completed: false,
    progress: 0,
    pomodoros: 0,
    notes: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-5",
    userId,
    title: "Refactor database service layer",
    description: "Ensure fallback logic triggers cleanly if network is congested.",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days
    duration: 2,
    importance: "Low",
    category: "Personal",
    urgency: "Medium",
    energyLevel: "Low",
    difficulty: "Easy",
    priority: "Low",
    completed: true,
    progress: 100,
    pomodoros: 1,
    notes: "Offline persistence works! LocalStorage acts as our hot cache.",
    createdAt: new Date().toISOString()
  }
];

const SEED_HABITS = (userId: string): Habit[] => [
  { id: "habit-1", userId, name: "Coding", targetValue: "2 hours", streak: 5, history: [new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]], category: "Coding" },
  { id: "habit-2", userId, name: "Reading", targetValue: "20 mins", streak: 2, history: [], category: "Reading" },
  { id: "habit-3", userId, name: "Exercise", targetValue: "30 mins", streak: 1, history: [], category: "Exercise" },
  { id: "habit-4", userId, name: "Water Intake", targetValue: "8 glasses", streak: 7, history: [new Date().toISOString().split('T')[0]], category: "Water Intake" },
  { id: "habit-5", userId, name: "Meditation", targetValue: "10 mins", streak: 0, history: [], category: "Meditation" }
];

const SEED_GOALS = (userId: string): Goal[] => [
  { id: "goal-1", userId, title: "Study for AI Hackathon", period: "weekly", target: 10, current: 7, unit: "hrs", completed: false },
  { id: "goal-2", userId, title: "Finish 5 Mock Interviews", period: "monthly", target: 5, current: 3, unit: "sessions", completed: false },
  { id: "goal-3", userId, title: "Drink 8 Glasses of Water", period: "daily", target: 8, current: 5, unit: "glasses", completed: false }
];

const SEED_FLASHCARDS = (userId: string): Flashcard[] => [
  {
    id: "card-1",
    userId,
    question: "What is the primary benefit of full-stack rendering in AI Studio?",
    answer: "It hides secret developer credentials (like GEMINI_API_KEY) server-side inside Cloud Run, routing them securely and bypassing direct client-side leaks.",
    difficulty: "Medium",
    box: 1,
    nextReview: new Date().toISOString().split('T')[0]
  },
  {
    id: "card-2",
    userId,
    question: "Why should React useEffect dependencies avoid object variables?",
    answer: "React does referential comparison. Creating objects on every render creates unique references, causing dangerous infinite re-render loops. Use primitives inside instead.",
    difficulty: "Hard",
    box: 2,
    nextReview: new Date().toISOString().split('T')[0]
  },
  {
    id: "card-3",
    userId,
    question: "How does Leitner Spaced Repetition function?",
    answer: "Correct answers promote flashcards to higher boxes reviewed less frequently. Incorrect answers demote them to Box 1 for immediate review, optimizing retention.",
    difficulty: "Easy",
    box: 3,
    nextReview: new Date().toISOString().split('T')[0]
  }
];

const SEED_NOTIFICATIONS = (userId: string): Notification[] => [
  {
    id: "notif-1",
    userId,
    text: "Welcome to DeadlineAI! Your AI companion is ready to calculate priority levels and help you conquer deadlines.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "success"
  },
  {
    id: "notif-2",
    userId,
    text: "High Risk Warning: 'React UI Prototype' is due tomorrow! Consider triggering focus sessions immediately.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    type: "alert"
  }
];

export class DataService {
  public static getLocalUserId(): string {
    const user = auth.currentUser;
    return user ? user.uid : "anonymous_user";
  }

  // Load complete state from LocalStorage or seed if empty
  private static getLocal<T>(key: string, seeder: (uid: string) => T[]): T[] {
    const userId = this.getLocalUserId();
    const storageKey = `deadlineai_${userId}_${key}`;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const seed = seeder(userId);
    localStorage.setItem(storageKey, JSON.stringify(seed));
    return seed;
  }

  private static setLocal<T>(key: string, data: T[]): void {
    const userId = this.getLocalUserId();
    const storageKey = `deadlineai_${userId}_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  // USER PROFILE
  static async getUserProfile(): Promise<UserProfile> {
    const user = auth.currentUser;
    const anonymousProfile: UserProfile = {
      uid: user ? user.uid : "anonymous_user",
      name: user?.displayName || "Anonymous Creator",
      email: user?.email || "hackathon@aistudio.com",
      xp: 450,
      level: 3,
      badges: ["Early Bird", "Pomodoro Pro", "Deadline Conqueror"],
      createdAt: new Date().toISOString()
    };

    if (!user) {
      const cached = localStorage.getItem(`deadlineai_profile_anonymous_user`);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(`deadlineai_profile_anonymous_user`, JSON.stringify(anonymousProfile));
      return anonymousProfile;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        await setDoc(docRef, anonymousProfile);
        return anonymousProfile;
      }
    } catch (e) {
      console.warn("Firestore error getting user profile, using local:", e);
      const cached = localStorage.getItem(`deadlineai_profile_${user.uid}`);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(`deadlineai_profile_${user.uid}`, JSON.stringify(anonymousProfile));
      return anonymousProfile;
    }
  }

  static async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const userId = this.getLocalUserId();
    const current = await this.getUserProfile();
    const updated = { ...current, ...profile };

    localStorage.setItem(`deadlineai_profile_${userId}`, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, updated, { merge: true });
      } catch (e) {
        console.warn("Firestore save profile failed:", e);
      }
    }
    return updated;
  }

  static async awardXP(xpGained: number): Promise<{ levelUp: boolean; newLevel: number; totalXp: number }> {
    const profile = await this.getUserProfile();
    let totalXp = profile.xp + xpGained;
    const xpPerLevel = 500;
    const newLevel = Math.floor(totalXp / xpPerLevel) + 1;
    const levelUp = newLevel > profile.level;

    const badges = [...profile.badges];
    if (newLevel >= 5 && !badges.includes("Focus Guru")) {
      badges.push("Focus Guru");
    }
    if (totalXp >= 2000 && !badges.includes("Elite Committer")) {
      badges.push("Elite Committer");
    }

    await this.updateUserProfile({
      xp: totalXp,
      level: newLevel,
      badges
    });

    return { levelUp, newLevel, totalXp };
  }

  // TASKS
  static async getTasks(): Promise<Task[]> {
    const cached = this.getLocal<Task>("tasks", SEED_TASKS);
    if (!auth.currentUser) return cached;

    try {
      const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        // Seed firestore if empty
        for (const task of cached) {
          await setDoc(doc(db, "tasks", task.id), task);
        }
        return cached;
      }
      const fetched: Task[] = [];
      snap.forEach(d => fetched.push(d.data() as Task));
      this.setLocal("tasks", fetched);
      return fetched;
    } catch (e) {
      console.warn("Firestore read tasks failed, using local fallback", e);
      return cached;
    }
  }

  static async saveTask(task: Task): Promise<Task> {
    const current = await this.getTasks();
    const exists = current.some(t => t.id === task.id);
    const updated = exists 
      ? current.map(t => t.id === task.id ? task : t)
      : [...current, task];

    this.setLocal("tasks", updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "tasks", task.id), task);
      } catch (e) {
        console.warn("Firestore task write failed", e);
      }
    }
    return task;
  }

  static async deleteTask(taskId: string): Promise<void> {
    const current = await this.getTasks();
    this.setLocal("tasks", current.filter(t => t.id !== taskId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
      } catch (e) {
        console.warn("Firestore task delete failed", e);
      }
    }
  }

  // GOALS
  static async getGoals(): Promise<Goal[]> {
    const cached = this.getLocal<Goal>("goals", SEED_GOALS);
    if (!auth.currentUser) return cached;

    try {
      const q = query(collection(db, "goals"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        for (const goal of cached) {
          await setDoc(doc(db, "goals", goal.id), goal);
        }
        return cached;
      }
      const fetched: Goal[] = [];
      snap.forEach(d => fetched.push(d.data() as Goal));
      this.setLocal("goals", fetched);
      return fetched;
    } catch (e) {
      console.warn("Firestore goals read failed", e);
      return cached;
    }
  }

  static async saveGoal(goal: Goal): Promise<Goal> {
    const current = await this.getGoals();
    const exists = current.some(g => g.id === goal.id);
    const updated = exists 
      ? current.map(g => g.id === goal.id ? goal : g)
      : [...current, goal];

    this.setLocal("goals", updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "goals", goal.id), goal);
      } catch (e) {
        console.warn("Firestore goal write failed", e);
      }
    }
    return goal;
  }

  static async deleteGoal(goalId: string): Promise<void> {
    const current = await this.getGoals();
    this.setLocal("goals", current.filter(g => g.id !== goalId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "goals", goalId));
      } catch (e) {
        console.warn("Firestore goal delete failed", e);
      }
    }
  }

  // HABITS
  static async getHabits(): Promise<Habit[]> {
    const cached = this.getLocal<Habit>("habits", SEED_HABITS);
    if (!auth.currentUser) return cached;

    try {
      const q = query(collection(db, "habits"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        for (const h of cached) {
          await setDoc(doc(db, "habits", h.id), h);
        }
        return cached;
      }
      const fetched: Habit[] = [];
      snap.forEach(d => fetched.push(d.data() as Habit));
      this.setLocal("habits", fetched);
      return fetched;
    } catch (e) {
      console.warn("Firestore habits read failed", e);
      return cached;
    }
  }

  static async saveHabit(habit: Habit): Promise<Habit> {
    const current = await this.getHabits();
    const exists = current.some(h => h.id === habit.id);
    const updated = exists 
      ? current.map(h => h.id === habit.id ? habit : h)
      : [...current, habit];

    this.setLocal("habits", updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "habits", habit.id), habit);
      } catch (e) {
        console.warn("Firestore habit write failed", e);
      }
    }
    return habit;
  }

  static async deleteHabit(habitId: string): Promise<void> {
    const current = await this.getHabits();
    this.setLocal("habits", current.filter(h => h.id !== habitId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "habits", habitId));
      } catch (e) {
        console.warn("Firestore habit delete failed", e);
      }
    }
  }

  // FLASHCARDS (STUDY MODE)
  static async getFlashcards(): Promise<Flashcard[]> {
    const cached = this.getLocal<Flashcard>("flashcards", SEED_FLASHCARDS);
    if (!auth.currentUser) return cached;

    try {
      const q = query(collection(db, "flashcards"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        for (const f of cached) {
          await setDoc(doc(db, "flashcards", f.id), f);
        }
        return cached;
      }
      const fetched: Flashcard[] = [];
      snap.forEach(d => fetched.push(d.data() as Flashcard));
      this.setLocal("flashcards", fetched);
      return fetched;
    } catch (e) {
      console.warn("Firestore flashcards read failed", e);
      return cached;
    }
  }

  static async saveFlashcard(card: Flashcard): Promise<Flashcard> {
    const current = await this.getFlashcards();
    const exists = current.some(c => c.id === card.id);
    const updated = exists 
      ? current.map(c => c.id === card.id ? card : c)
      : [...current, card];

    this.setLocal("flashcards", updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "flashcards", card.id), card);
      } catch (e) {
        console.warn("Firestore flashcard write failed", e);
      }
    }
    return card;
  }

  static async deleteFlashcard(cardId: string): Promise<void> {
    const current = await this.getFlashcards();
    this.setLocal("flashcards", current.filter(c => c.id !== cardId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "flashcards", cardId));
      } catch (e) {
        console.warn("Firestore flashcard delete failed", e);
      }
    }
  }

  // NOTIFICATIONS
  static async getNotifications(): Promise<Notification[]> {
    const cached = this.getLocal<Notification>("notifications", SEED_NOTIFICATIONS);
    if (!auth.currentUser) return cached;

    try {
      const q = query(collection(db, "notifications"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      if (snap.empty) {
        for (const n of cached) {
          await setDoc(doc(db, "notifications", n.id), n);
        }
        return cached;
      }
      const fetched: Notification[] = [];
      snap.forEach(d => fetched.push(d.data() as Notification));
      this.setLocal("notifications", fetched);
      return fetched;
    } catch (e) {
      console.warn("Firestore notifications read failed", e);
      return cached;
    }
  }

  static async saveNotification(n: Notification): Promise<Notification> {
    const current = await this.getNotifications();
    const exists = current.some(notif => notif.id === n.id);
    const updated = exists 
      ? current.map(notif => notif.id === n.id ? n : notif)
      : [n, ...current];

    this.setLocal("notifications", updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "notifications", n.id), n);
      } catch (e) {
        console.warn("Firestore notification write failed", e);
      }
    }
    return n;
  }

  static async addNotification(text: string, type: "alert" | "info" | "success" | "review"): Promise<Notification> {
    const userId = this.getLocalUserId();
    const notif: Notification = {
      id: "notif-" + Math.random().toString(36).substr(2, 9),
      userId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    return this.saveNotification(notif);
  }

  // SYNCHRONIZE CACHE UPON LOGIN
  static async syncLocalCacheToCloud(): Promise<void> {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;

    try {
      // Sync tasks
      const tasks = this.getLocal<Task>("tasks", SEED_TASKS).map(t => ({ ...t, userId }));
      for (const t of tasks) {
        await setDoc(doc(db, "tasks", t.id), t);
      }
      // Sync habits
      const habits = this.getLocal<Habit>("habits", SEED_HABITS).map(h => ({ ...h, userId }));
      for (const h of habits) {
        await setDoc(doc(db, "habits", h.id), h);
      }
      // Sync goals
      const goals = this.getLocal<Goal>("goals", SEED_GOALS).map(g => ({ ...g, userId }));
      for (const g of goals) {
        await setDoc(doc(db, "goals", g.id), g);
      }
      // Sync flashcards
      const cards = this.getLocal<Flashcard>("flashcards", SEED_FLASHCARDS).map(f => ({ ...f, userId }));
      for (const f of cards) {
        await setDoc(doc(db, "flashcards", f.id), f);
      }
      // Sync profile
      const profile = await this.getUserProfile();
      await setDoc(doc(db, "users", userId), { ...profile, uid: userId });
    } catch (e) {
      console.error("Critical Cloud Cache Sync failed:", e);
    }
  }
}
