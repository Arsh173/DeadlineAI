import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Goal, Habit, Flashcard, UserProfile, Notification, ScheduleBlock } from "../types";
import { DataService } from "../services/dataService";
import { auth, googleProvider } from "../firebase";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  flashcards: Flashcard[];
  notifications: Notification[];
  scheduleBlocks: ScheduleBlock[];
  isAiLoading: boolean;
  aiResponseText: string;
  smartSuggestions: string[];
  riskAnalysis: any[];
  productivityTip: string;
  isLoggedIn: boolean;
  
  // Auth Operations
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Core Mutations
  addTask: (task: Omit<Task, "id" | "userId" | "createdAt" | "priority" | "pomodoros" | "notes">) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "userId" | "completed">) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, "id" | "userId" | "streak" | "history">) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;
  addFlashcard: (question: string, answer: string, difficulty: "Easy" | "Medium" | "Hard") => Promise<void>;
  updateFlashcard: (card: Flashcard) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  reviewFlashcard: (id: string, correct: boolean) => Promise<void>;
  addCustomNotification: (text: string, type: "alert" | "info" | "success" | "review") => Promise<void>;
  clearNotifications: () => Promise<void>;
  
  // AI Operations
  triggerAIPrioritization: () => Promise<void>;
  generateAISchedule: () => Promise<void>;
  triggerAIReplanning: (failedTaskTitle: string) => Promise<void>;
  generateFlashcardsFromText: (topic: string, text: string) => Promise<void>;
  askGemini: (message: string, history: any[]) => Promise<string>;
  awardUserXP: (xp: number) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([
    "Consider tackling 'Finish React UI Prototype' first thing tomorrow. Your high energy level is perfect for it.",
    "Your coding streak is on fire! Complete 30 minutes of habit goals today to secure level 4."
  ]);
  const [riskAnalysis, setRiskAnalysis] = useState<any[]>([]);
  const [productivityTip, setProductivityTip] = useState("Your schedule is balanced. Take short 5-minute breaks after focus slots to avoid cognitive exhaustion.");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync local cache to Firebase on login
        await DataService.syncLocalCacheToCloud();
      }
      await loadAllData();
    });
    return () => unsubscribe();
  }, []);

  const loadAllData = async () => {
    try {
      const uProfile = await DataService.getUserProfile();
      setProfile(uProfile);

      const uTasks = await DataService.getTasks();
      setTasks(uTasks);

      const uGoals = await DataService.getGoals();
      setGoals(uGoals);

      const uHabits = await DataService.getHabits();
      setHabits(uHabits);

      const uFlashcards = await DataService.getFlashcards();
      setFlashcards(uFlashcards);

      const uNotifs = await DataService.getNotifications();
      setNotifications(uNotifs);

      // Pre-calculate schedule from initial tasks locally
      generateLocalFallbackSchedule(uTasks, uHabits);
    } catch (e) {
      console.error("Error loading app data:", e);
    }
  };

  const refreshAllData = async () => {
    await loadAllData();
  };

  const generateLocalFallbackSchedule = (currentTasks: Task[], currentHabits: Habit[]) => {
    // Generate an hourly schedule locally as fallback
    const blocks: ScheduleBlock[] = [];
    const activeTasks = currentTasks.filter(t => !t.completed);
    
    blocks.push({
      time: "08:00 - 09:00",
      type: "habit",
      label: "Morning Review & Goals",
      description: "Quick planning and hydration checklist."
    });

    let currentHour = 9;
    activeTasks.slice(0, 3).forEach((task, idx) => {
      blocks.push({
        time: `${String(currentHour).padStart(2, "0")}:00 - ${String(currentHour + 1).padStart(2, "0")}:30`,
        type: "focus",
        label: `Focus Session: ${task.title}`,
        associatedTaskId: task.id,
        description: `Dedicated deep work. Urgency: ${task.urgency}. Target progress: +20%.`
      });
      blocks.push({
        time: `${String(currentHour + 1).padStart(2, "0")}:30 - ${String(currentHour + 2).padStart(2, "0")}:00`,
        type: "break",
        label: "Water Intake & Stretch",
        description: "Stand up, stretch your back, and secure focus."
      });
      currentHour += 2;
    });

    currentHabits.slice(0, 2).forEach((habit) => {
      blocks.push({
        time: `${String(currentHour).padStart(2, "0")}:00 - ${String(currentHour).padStart(2, "0")}:45`,
        type: "habit",
        label: `Habit: ${habit.name}`,
        description: `Target: ${habit.targetValue}. Consistency is key.`
      });
      currentHour += 1;
    });

    blocks.push({
      time: `${String(currentHour).padStart(2, "0")}:00 - ${String(currentHour + 1).padStart(2, "0")}:00`,
      type: "flexible",
      label: "Evening Retro & Review",
      description: "Log completions, review uncompleted tasks, generate reports."
    });

    setScheduleBlocks(blocks);
  };

  // AUTH ACTIONS
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await loadAllData();
    } catch (e: any) {
      console.error("Google sign in failed:", e);
      throw e;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      await loadAllData();
    } catch (e: any) {
      console.error("Email login failed:", e);
      throw e;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      // Initialize profile
      const anonProfile: UserProfile = {
        uid: credential.user.uid,
        name: name,
        email: email,
        xp: 100,
        level: 1,
        badges: ["Early Bird"],
        createdAt: new Date().toISOString()
      };
      await DataService.updateUserProfile(anonProfile);
      await loadAllData();
    } catch (e: any) {
      console.error("Email sign up failed:", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.clear();
      await loadAllData();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // GAMIFICATION HELPER
  const awardUserXP = async (xpValue: number) => {
    const result = await DataService.awardXP(xpValue);
    const uProfile = await DataService.getUserProfile();
    setProfile(uProfile);

    if (result.levelUp) {
      await addCustomNotification(`🎉 LEVEL UP! You reached Level ${result.newLevel}! New badges are available in your locker.`, "success");
    } else {
      await addCustomNotification(`🔥 Earned +${xpValue} XP for productivity achievements!`, "success");
    }
  };

  // TASK OPERATIONS
  const addTask = async (taskInput: Omit<Task, "id" | "userId" | "createdAt" | "priority" | "pomodoros" | "notes">) => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const newTask: Task = {
      ...taskInput,
      id: "task-" + Math.random().toString(36).substr(2, 9),
      userId,
      priority: taskInput.urgency === "High" && taskInput.importance === "High" ? "Critical" : "Medium",
      pomodoros: 0,
      notes: "",
      createdAt: new Date().toISOString()
    };

    const saved = await DataService.saveTask(newTask);
    setTasks(prev => [...prev, saved]);
    await awardUserXP(30);
    await addCustomNotification(`🆕 Task '${newTask.title}' successfully added and scheduled.`, "info");
  };

  const updateTask = async (task: Task) => {
    const wasCompleted = tasks.find(t => t.id === task.id)?.completed;
    const isCompleted = task.completed;

    const saved = await DataService.saveTask(task);
    setTasks(prev => prev.map(t => t.id === task.id ? saved : t));

    if (!wasCompleted && isCompleted) {
      await awardUserXP(50);
      await addCustomNotification(`🏆 Congratulations! You finished '${task.title}'! Keep this momentum.`, "success");
    }
  };

  const deleteTask = async (id: string) => {
    const title = tasks.find(t => t.id === id)?.title;
    await DataService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (title) {
      await addCustomNotification(`🗑️ Task '${title}' deleted.`, "info");
    }
  };

  // GOAL OPERATIONS
  const addGoal = async (goalInput: Omit<Goal, "id" | "userId" | "completed">) => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const newGoal: Goal = {
      ...goalInput,
      id: "goal-" + Math.random().toString(36).substr(2, 9),
      userId,
      completed: false
    };
    const saved = await DataService.saveGoal(newGoal);
    setGoals(prev => [...prev, saved]);
    await awardUserXP(20);
  };

  const updateGoal = async (goal: Goal) => {
    const isCompletedNow = goal.current >= goal.target && !goal.completed;
    const finalGoal = isCompletedNow ? { ...goal, completed: true } : goal;

    const saved = await DataService.saveGoal(finalGoal);
    setGoals(prev => prev.map(g => g.id === goal.id ? saved : g));

    if (isCompletedNow) {
      await awardUserXP(100);
      await addCustomNotification(`🎯 Goal Met! You achieved: '${goal.title}'. Streak extended!`, "success");
    }
  };

  const deleteGoal = async (id: string) => {
    await DataService.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // HABIT OPERATIONS
  const addHabit = async (habitInput: Omit<Habit, "id" | "userId" | "streak" | "history">) => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const newHabit: Habit = {
      ...habitInput,
      id: "habit-" + Math.random().toString(36).substr(2, 9),
      userId,
      streak: 0,
      history: []
    };
    const saved = await DataService.saveHabit(newHabit);
    setHabits(prev => [...prev, saved]);
    await awardUserXP(25);
  };

  const updateHabit = async (habit: Habit) => {
    const saved = await DataService.saveHabit(habit);
    setHabits(prev => prev.map(h => h.id === habit.id ? saved : h));
  };

  const deleteHabit = async (id: string) => {
    await DataService.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitToday = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.history.includes(todayStr);

    let updatedHistory = [...habit.history];
    let updatedStreak = habit.streak;

    if (isCompletedToday) {
      updatedHistory = updatedHistory.filter(d => d !== todayStr);
      updatedStreak = Math.max(0, updatedStreak - 1);
    } else {
      updatedHistory.push(todayStr);
      updatedStreak += 1;
      await awardUserXP(15);
      await addCustomNotification(`💧 Checked off habit: ${habit.name}! Current streak: ${updatedStreak} days.`, "success");
    }

    const updatedHabit = {
      ...habit,
      history: updatedHistory,
      streak: updatedStreak
    };

    await updateHabit(updatedHabit);
  };

  // FLASHCARD OPERATIONS
  const addFlashcard = async (question: string, answer: string, difficulty: "Easy" | "Medium" | "Hard") => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const newCard: Flashcard = {
      id: "card-" + Math.random().toString(36).substr(2, 9),
      userId,
      question,
      answer,
      difficulty,
      box: 1,
      nextReview: new Date().toISOString().split('T')[0]
    };
    const saved = await DataService.saveFlashcard(newCard);
    setFlashcards(prev => [...prev, saved]);
    await awardUserXP(10);
  };

  const updateFlashcard = async (card: Flashcard) => {
    const saved = await DataService.saveFlashcard(card);
    setFlashcards(prev => prev.map(c => c.id === card.id ? saved : c));
  };

  const deleteFlashcard = async (id: string) => {
    await DataService.deleteFlashcard(id);
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  const reviewFlashcard = async (id: string, correct: boolean) => {
    const card = flashcards.find(c => c.id === id);
    if (!card) return;

    let nextBox = card.box;
    if (correct) {
      nextBox = Math.min(5, card.box + 1);
      await awardUserXP(10);
    } else {
      nextBox = 1; // Demote to box 1 for Leitner
    }

    // Interval multiplier based on Box number
    const daysInterval = Math.pow(2, nextBox - 1); // Box 1 = 1d, Box 2 = 2d, Box 3 = 4d, Box 4 = 8d, Box 5 = 16d
    const nextReviewDate = new Date(Date.now() + daysInterval * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updatedCard: Flashcard = {
      ...card,
      box: nextBox,
      nextReview: nextReviewDate
    };

    await updateFlashcard(updatedCard);
    await addCustomNotification(`📚 Reviewed card. Leitner Box updated to Box ${nextBox}. Next review in ${daysInterval} days.`, "success");
  };

  // NOTIFICATION UTILS
  const addCustomNotification = async (text: string, type: "alert" | "info" | "success" | "review") => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const notif = await DataService.addNotification(text, type);
    setNotifications(prev => [notif, ...prev]);
  };

  const clearNotifications = async () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "anonymous_user";
    const cleared = notifications.map(n => ({ ...n, read: true }));
    setNotifications(cleared);
    localStorage.setItem(`deadlineai_${userId}_notifications`, JSON.stringify(cleared));
  };

  // AI OPERATIONS
  const triggerAIPrioritization = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/analyze-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, habits })
      });
      const data = await res.json();
      
      if (data.priorities) {
        // Update priorities in tasks list
        const updatedTasks = tasks.map(t => {
          if (data.priorities[t.id]) {
            return { ...t, priority: data.priorities[t.id] };
          }
          return t;
        });
        setTasks(updatedTasks);
        localStorage.setItem(`deadlineai_${DataService.getLocalUserId()}_tasks`, JSON.stringify(updatedTasks));
      }

      if (data.smartSuggestions) {
        setSmartSuggestions(data.smartSuggestions);
      }

      if (data.riskAnalysis) {
        setRiskAnalysis(data.riskAnalysis);
        // Alert critical risk
        const highRiskTasks = data.riskAnalysis.filter((r: any) => r.riskPercentage > 60);
        for (const r of highRiskTasks) {
          const tName = tasks.find(task => task.id === r.taskId)?.title || "Task";
          await addCustomNotification(`⚠️ Critical Deadline Risk detected for '${tName}' (${r.riskPercentage}% risk). Reason: ${r.reason}`, "alert");
        }
      }

      await awardUserXP(30);
      await addCustomNotification("🧠 DeadlineAI prioritized tasks and performed risk analysis successfully.", "success");
    } catch (e: any) {
      console.error("AI Prioritisation failed:", e);
      await addCustomNotification("❌ AI Prioritization failed. Please check your network or key config.", "alert");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateAISchedule = async () => {
    setIsAiLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, habits, dateString: todayStr })
      });
      const data = await res.json();
      if (data.timeblocks) {
        setScheduleBlocks(data.timeblocks);
      }
      if (data.productivityTip) {
        setProductivityTip(data.productivityTip);
      }
      await awardUserXP(40);
      await addCustomNotification("📅 AI Scheduler generated your dynamic, adaptive hourly roadmap.", "success");
    } catch (e) {
      console.error("AI scheduling failed:", e);
      // Fallback schedule
      generateLocalFallbackSchedule(tasks, habits);
      await addCustomNotification("📅 Scheduled calculated locally (network proxy fallback).", "info");
    } finally {
      setIsAiLoading(false);
    }
  };

  const triggerAIReplanning = async (failedTaskTitle: string) => {
    setIsAiLoading(true);
    await addCustomNotification(`⚠️ Replanning initiated because you flagged '${failedTaskTitle}' as uncompleted.`, "review");
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      // Send a modified prompt or payload
      const res = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tasks: tasks.map(t => t.title === failedTaskTitle ? { ...t, importance: "High", urgency: "High" } : t), 
          habits, 
          dateString: todayStr 
        })
      });
      const data = await res.json();
      if (data.timeblocks) {
        setScheduleBlocks(data.timeblocks);
      }
      if (data.productivityTip) {
        setProductivityTip("Replanning complete: " + data.productivityTip);
      }
      await awardUserXP(25);
      await addCustomNotification("🔄 Adaptive Replanning complete! Future task timeline has been adjusted to achieve critical milestones safely.", "success");
    } catch (e) {
      console.error("AI replanning failed:", e);
      await addCustomNotification("🔄 Schedule adjusted locally. Let's finish strong!", "info");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateFlashcardsFromText = async (topic: string, text: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, content: text })
      });
      const cards = await res.json();
      if (Array.isArray(cards)) {
        for (const card of cards) {
          await addFlashcard(card.question, card.answer, card.difficulty || "Medium");
        }
        await awardUserXP(35);
        await addCustomNotification(`🧠 Leitner System updated! Generated ${cards.length} spaced repetition study cards from notepad content.`, "success");
      }
    } catch (e) {
      console.error("AI flashcard generation failed:", e);
      await addCustomNotification("❌ Flashcard generation failed. Use mock text or verify Express server logs.", "alert");
    } finally {
      setIsAiLoading(false);
    }
  };

  const askGemini = async (message: string, history: any[]): Promise<string> => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message, 
          history, 
          context: { tasks, habits, goals } 
        })
      });
      const data = await res.json();
      return data.reply || "Sorry, I am facing an issue processing this request.";
    } catch (e: any) {
      console.error("Gemini Chat failed:", e);
      return "I'm experiencing high latency or my API key is missing. Ensure GEMINI_API_KEY is configured correctly in your Secrets panel!";
    } finally {
      setIsAiLoading(false);
    }
  };

  const isLoggedIn = user !== null;

  return (
    <AppContext.Provider value={{
      user,
      profile,
      tasks,
      goals,
      habits,
      flashcards,
      notifications,
      scheduleBlocks,
      isAiLoading,
      aiResponseText,
      smartSuggestions,
      riskAnalysis,
      productivityTip,
      isLoggedIn,
      
      loginWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      
      addTask,
      updateTask,
      deleteTask,
      addGoal,
      updateGoal,
      deleteGoal,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitToday,
      addFlashcard,
      updateFlashcard,
      deleteFlashcard,
      reviewFlashcard,
      addCustomNotification,
      clearNotifications,
      
      triggerAIPrioritization,
      generateAISchedule,
      triggerAIReplanning,
      generateFlashcardsFromText,
      askGemini,
      awardUserXP,
      refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
