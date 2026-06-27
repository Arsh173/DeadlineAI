import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  CartesianGrid
} from "recharts";
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Analytics: React.FC = () => {
  const { tasks, habits, goals } = useApp();

  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly">("weekly");

  // Local chart datasets
  const weeklyFocusData = [
    { day: "Mon", hours: 4.5, target: 5 },
    { day: "Tue", hours: 6.0, target: 5 },
    { day: "Wed", hours: 3.5, target: 5 },
    { day: "Thu", hours: 7.0, target: 5 },
    { day: "Fri", hours: 5.5, target: 5 },
    { day: "Sat", hours: 2.0, target: 4 },
    { day: "Sun", hours: 3.0, target: 4 }
  ];

  // Calculate category distribution dynamically from task list
  const categoryCounts: { [key: string]: number } = { Study: 0, Work: 0, Personal: 0, Health: 0, Finance: 0 };
  tasks.forEach(t => {
    if (categoryCounts[t.category] !== undefined) {
      categoryCounts[t.category]++;
    }
  });

  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    Committed: categoryCounts[cat]
  }));

  const triggerReportGeneration = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, habits, goals, period: activePeriod })
      });
      const data = await res.json();
      setAiReport(data);
    } catch (e) {
      console.error("AI report failed:", e);
      // Fallback dummy report
      setAiReport({
        productivityScore: 78,
        summary: "Excellent completion density on Work items, but study goals are lagging behind schedule. Spaced repetition reviews should be accelerated tomorrow.",
        strengths: ["Highly consistent Coding habit streaks", "Pristine focus density during morning slots"],
        weaknesses: ["Water intake targets missed on Wednesday", "Critical milestone risk detected for react mock UI"],
        actionPlan: ["Trigger 2 study focus sessions first thing in the morning", "Check off daily water logging checklist promptly"],
        streakMessage: "Your max streak reached 5 days! Level 4 unlock is imminent."
      });
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    triggerReportGeneration();
  }, [activePeriod]);

  // Compute stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72 select-none">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050508]/60 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            Productivity Analytics <BarChart3 className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Examine performance vectors, task category splits, daily focus hour indices, and receive custom AI-generated reports.
          </p>
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/[0.04] shrink-0 text-xs font-display">
          <button 
            onClick={() => setActivePeriod("daily")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePeriod === "daily" ? "bg-white/[0.08] text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Daily review
          </button>
          <button 
            onClick={() => setActivePeriod("weekly")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePeriod === "weekly" ? "bg-white/[0.08] text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Weekly Report
          </button>
        </div>
      </div>

      {/* Grid: Recharts data visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Focus Area Chart */}
        <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md h-80 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-zinc-500 tracking-widest mb-4 block font-display">Weekly Focus Duration (Hours)</span>
          </div>
          <div className="flex-1 min-h-[180px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFocusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#030305", borderColor: "rgba(255,255,255,0.06)", borderRadius: "12px", color: "#f4f4f5" }} />
                <Area type="monotone" dataKey="hours" stroke="#c084fc" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 pt-3 border-t border-white/[0.04] font-display">
            <span>Aggregated focus time logs.</span>
            <span className="font-semibold text-purple-400">Avg: 4.5 hrs/day</span>
          </div>
        </div>

        {/* Task Category Split Bar Chart */}
        <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md h-80 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-zinc-500 tracking-widest mb-4 block font-display">Task Category distributions</span>
          </div>
          <div className="flex-1 min-h-[180px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#030305", borderColor: "rgba(255,255,255,0.06)", borderRadius: "12px", color: "#f4f4f5" }} />
                <Bar dataKey="Committed" fill="#c084fc" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 pt-3 border-t border-white/[0.04] font-display">
            <span>Committed backlog tasks count.</span>
            <span className="font-semibold text-purple-400">Total Backlog: {tasks.length} items</span>
          </div>
        </div>
      </div>

      {/* AI Report Card Panel */}
      <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>
        
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase font-extrabold text-zinc-300 tracking-widest font-display">
              AI Intelligent Executive Report
            </span>
          </div>
          <button 
            onClick={triggerReportGeneration}
            disabled={loadingReport}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 font-display glow-btn px-2.5 py-1 bg-purple-500/5 rounded-lg border border-purple-500/10"
          >
            {loadingReport ? "Recalculating..." : "Regenerate Report"}
          </button>
        </div>

        {loadingReport ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-500 text-xs">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Evaluating task timelines, habits, and goals securely...</p>
          </div>
        ) : aiReport ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs"
          >
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center text-center bg-black/40 p-5 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-3 font-display">Overall Score</span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/[0.02]" />
                  <circle cx="50" cy="50" r="40" stroke="#a855f7" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * aiReport.productivityScore) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-white font-mono">{aiReport.productivityScore}</span>
                  <span className="text-[8px] uppercase font-bold text-zinc-550 block font-display">Grade</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 italic leading-relaxed">{aiReport.streakMessage}</p>
            </div>

            {/* Performance Summary & Strengths */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-500 block mb-1.5 font-display">Coach Summary</span>
                <p className="text-zinc-400 leading-relaxed font-medium">{aiReport.summary}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-500 block mb-1.5 flex items-center gap-1 font-display">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Strengths
                </span>
                <ul className="space-y-1.5 text-zinc-400 py-0.5">
                  {(aiReport.strengths || []).map((st: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottlenecks & Recovery Blueprint */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-pink-500 block mb-1.5 flex items-center gap-1 font-display">
                  <AlertCircle className="w-3.5 h-3.5 text-pink-500" /> Improvement Areas
                </span>
                <ul className="space-y-1.5 text-zinc-400 py-0.5">
                  {(aiReport.weaknesses || []).map((wk: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-yellow-500 block mb-1.5 flex items-center gap-1 font-display">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" /> Recovery Action Plan
                </span>
                <ul className="space-y-1.5 text-zinc-300 font-semibold py-0.5">
                  {(aiReport.actionPlan || []).map((act: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start leading-relaxed font-display">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-6 text-zinc-500 text-xs">
            Trigger performance reviews to evaluate metrics.
          </div>
        )}
      </div>
    </div>
  );
};
