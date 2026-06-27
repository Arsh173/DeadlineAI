import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Flame, 
  Calendar, 
  CheckSquare, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight, 
  Mic, 
  CornerDownLeft,
  Activity,
  Heart,
  Plus
} from "lucide-react";
import { motion } from "motion/react";

export const Dashboard: React.FC = () => {
  const { 
    profile, 
    tasks, 
    habits, 
    addTask, 
    riskAnalysis, 
    triggerAIPrioritization, 
    smartSuggestions,
    isAiLoading,
    askGemini
  } = useApp();

  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState<"Study" | "Work" | "Personal" | "Health" | "Finance">("Study");
  const [naturalCommand, setNaturalCommand] = useState("");
  const [speechActive, setSpeechActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const incompleteTasks = tasks.filter(t => !t.completed);
  const criticalTasksCount = incompleteTasks.filter(t => t.priority === "Critical" || t.importance === "High").length;

  const currentLevel = profile?.level || 1;
  const xp = profile?.xp || 0;
  const xpInCurrentLevel = xp % 500;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 3;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    
    // Default deadline is tomorrow
    const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await addTask({
      title: quickTitle,
      description: "Added quickly from Dashboard dashboard.",
      deadline: tomorrowStr,
      duration: 2,
      importance: "Medium",
      category: quickCategory,
      urgency: "Medium",
      energyLevel: "Medium",
      difficulty: "Medium",
      progress: 0,
      completed: false
    });
    setQuickTitle("");
  };

  const handleNaturalLanguageCommand = async () => {
    if (!naturalCommand.trim() || isAiLoading) return;
    const command = naturalCommand;
    setNaturalCommand("");
    setSpeechActive(true);

    try {
      const responseText = await askGemini(
        `The user typed a natural command: "${command}". Parse this to extract task details and reply with a raw JSON of this structure ONLY (no markdown backticks or commentary, just the JSON string):
        {
          "isTaskCreation": true,
          "taskTitle": "Extracted task title",
          "taskCategory": "Study | Work | Personal | Health | Finance",
          "deadlineOffsetDays": number (e.g. 1 if tomorrow, 3 if friday when today is Thursday),
          "estimatedHours": number,
          "importance": "High | Medium | Low",
          "explanation": "Brief explanation of what was extracted"
        }
        Current Date is: ${new Date().toISOString()}.`,
        []
      );

      // Clean up response if wrapped in backticks
      let cleanText = responseText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      if (parsed.isTaskCreation) {
        const offsetMs = (parsed.deadlineOffsetDays || 1) * 24 * 60 * 60 * 1000;
        const targetDate = new Date(Date.now() + offsetMs).toISOString().split('T')[0];
        await addTask({
          title: parsed.taskTitle,
          description: "Created via Natural Voice Command parsing. " + (parsed.explanation || ""),
          deadline: targetDate,
          duration: parsed.estimatedHours || 2,
          importance: parsed.importance || "Medium",
          category: parsed.taskCategory || "Study",
          urgency: parsed.importance === "High" ? "High" : "Medium",
          energyLevel: "Medium",
          difficulty: "Medium",
          progress: 0,
          completed: false
        });
      }
    } catch (e) {
      console.error("Natural command parsing failed:", e);
    } finally {
      setSpeechActive(false);
    }
  };

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72">
      {/* Top Banner with Clock */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Welcome, Creator <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Let's keep your streaks ablaze. You have <span className="text-purple-400 font-bold">{criticalTasksCount} urgent milestones</span> today.
          </p>
        </div>

        {/* Dynamic Digital Clock */}
        <div className="bg-black/40 border border-white/[0.06] px-4 py-2 rounded-xl text-right shrink-0">
          <p className="text-lg font-bold font-mono bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Grid: Gauges & General Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity Score Circular Gauge */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl flex flex-col items-center justify-center text-center relative backdrop-blur-md">
          <span className="text-xs uppercase font-bold font-display text-zinc-400 tracking-widest mb-4">Productivity Score</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Back track */}
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/[0.04]" />
              {/* Score ring */}
              <motion.circle 
                cx="50" cy="50" r="40" 
                stroke="url(#scoreGrad)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2" 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * completionRate) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">{completionRate}%</span>
              <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Completion Rate</span>
            </div>
          </div>

          <div className="flex justify-between w-full border-t border-white/[0.04] pt-4 text-xs">
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-zinc-200">{completedTasks}</p>
              <p className="text-[10px] text-zinc-500 font-semibold">Done</p>
            </div>
            <div className="border-r border-white/[0.04] h-8 self-center"></div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-zinc-200">{totalTasks}</p>
              <p className="text-[10px] text-zinc-500 font-semibold">Total</p>
            </div>
            <div className="border-r border-white/[0.04] h-8 self-center"></div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-orange-400">{maxStreak}d</p>
              <p className="text-[10px] text-zinc-500 font-semibold">Streak</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full"></div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-md bg-purple-500/10 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase font-bold font-display text-zinc-400 tracking-widest">AI Suggestions</span>
            </div>
            <h3 className="text-sm font-bold font-display text-zinc-100 mb-2 leading-snug">Personalized coaching updates</h3>
            <ul className="space-y-2.5 text-xs text-zinc-400 py-1">
              {smartSuggestions.slice(0, 3).map((sug, idx) => (
                <li key={idx} className="flex gap-2 items-start leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={triggerAIPrioritization}
            disabled={isAiLoading}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 text-xs font-bold transition-all w-full glow-btn"
          >
            <span>{isAiLoading ? "Analyzing..." : "Regenerate AI Analysis"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Natural Language Action center */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md relative">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase font-bold font-display text-zinc-400 tracking-widest">Speech-to-Task</span>
            </div>
            <h3 className="text-sm font-bold font-display text-zinc-100 mb-2">Speak or Type Task Naturally</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mb-4">
              Enter commands like "Create chemistry project task due on Friday". Our AI parses the deadline and adds it to your backlog.
            </p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type 'History exam due on Friday with 4 hrs estimate'..."
                value={naturalCommand}
                onChange={(e) => setNaturalCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNaturalLanguageCommand()}
                className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-3 pl-4 pr-10 text-xs text-zinc-200 outline-none focus:border-cyan-500/40 focus:bg-white/[0.01] transition-all placeholder:text-zinc-650"
              />
              <button 
                onClick={handleNaturalLanguageCommand}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 border border-white/[0.05]"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-[10px] text-zinc-550 flex items-center gap-1.5 pt-4">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>AI voice-processing engine enabled.</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Quick Add & Deadline Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Add Task */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 rounded-md bg-pink-500/10 text-pink-400">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold font-display text-zinc-400 tracking-widest">Quick Add Task</span>
          </div>
          <form onSubmit={handleQuickAdd} className="space-y-4">
            <div className="space-y-1.5">
              <input 
                type="text" 
                required
                placeholder="What needs to be done?"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-3 px-4 text-xs text-zinc-200 outline-none focus:border-pink-500/40 focus:bg-white/[0.01] transition-all placeholder:text-zinc-650 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={quickCategory}
                onChange={(e: any) => setQuickCategory(e.target.value)}
                className="bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-400 outline-none focus:border-pink-500/40 transition-all font-medium"
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
              <button 
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg shadow-pink-500/10 hover:scale-[1.01] transition-all"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>

        {/* Deadline Risk Prediction Widget */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl lg:col-span-2 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-2xl rounded-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-pink-500/10 text-pink-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase font-bold font-display text-zinc-450 tracking-widest">Deadline Risk Prediction</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">AI Calculations</span>
          </div>

          <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
            {riskAnalysis.length === 0 ? (
              <div className="text-center py-8 text-zinc-550 text-xs flex flex-col items-center gap-2">
                <p>No high-risk deadlines predicted yet.</p>
                <button 
                  onClick={triggerAIPrioritization}
                  className="text-xs text-purple-400 font-bold hover:underline"
                >
                  Analyze Backlog Now
                </button>
              </div>
            ) : (
              riskAnalysis.map((risk, idx) => {
                const targetTask = tasks.find(t => t.id === risk.taskId);
                if (!targetTask) return null;
                const percent = risk.riskPercentage || 0;
                let colorClass = "bg-emerald-500";
                let textClass = "text-emerald-400";
                if (percent > 65) {
                  colorClass = "bg-pink-500";
                  textClass = "text-pink-400";
                } else if (percent > 35) {
                  colorClass = "bg-yellow-500";
                  textClass = "text-yellow-400";
                }
                return (
                  <div key={idx} className="p-3 bg-black/40 border border-white/[0.05] rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <p className="font-semibold text-zinc-200 font-display">{targetTask.title}</p>
                      <span className={`font-mono font-bold ${textClass}`}>{percent}% Risk</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-zinc-450 leading-relaxed pt-1 border-t border-white/[0.04]">
                      <div>
                        <span className="font-bold text-zinc-500 uppercase block tracking-wider">Risk Reason:</span>
                        {risk.reason}
                      </div>
                      <div>
                        <span className="font-bold text-zinc-500 uppercase block tracking-wider">AI Recovery Plan:</span>
                        {risk.recoveryPlan || risk.recommendation}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
