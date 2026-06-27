import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Calendar, 
  Sparkles, 
  Hourglass, 
  Coffee, 
  Brain, 
  AlertOctagon, 
  RefreshCw,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Scheduler: React.FC = () => {
  const { 
    scheduleBlocks, 
    generateAISchedule, 
    triggerAIReplanning, 
    tasks, 
    isAiLoading,
    productivityTip
  } = useApp();

  const [showReplanner, setShowReplanner] = useState(false);
  const [failedTaskId, setFailedTaskId] = useState("");

  const activeTasks = tasks.filter(t => !t.completed);

  const handleReplanningSubmit = async () => {
    const selectedTask = tasks.find(t => t.id === failedTaskId);
    if (!selectedTask) return;
    
    await triggerAIReplanning(selectedTask.title);
    setShowReplanner(false);
    setFailedTaskId("");
  };

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050508]/60 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            AI Scheduler Roadmap <Calendar className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Let the coach automatically allocate high-energy focus slots, healthy breaks, and habit intervals dynamically.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 font-display">
          <button 
            onClick={() => setShowReplanner(!showReplanner)}
            className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all glow-btn"
          >
            <AlertOctagon className="w-4 h-4 text-pink-400" />
            <span>Couldn't Finish Task?</span>
          </button>
          
          <button 
            onClick={generateAISchedule}
            disabled={isAiLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-500/10 transition-all glow-btn"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{isAiLoading ? "Synthesizing Schedule..." : "Recompute AI Roadmap"}</span>
          </button>
        </div>
      </div>

      {/* Adaptive Replanning Card */}
      <AnimatePresence>
        {showReplanner && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-pink-400 animate-spin" />
                <h3 className="text-sm font-bold text-zinc-300 font-display">Adaptive AI Rescheduling</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Fell behind on a milestone? Choose the uncompleted task. Our AI coach will automatically recalculate effort rates, extend breaks, and re-allocate lower intensity tasks to future blocks to maintain cognitive balance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={failedTaskId}
                  onChange={(e) => setFailedTaskId(e.target.value)}
                  className="bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-350 outline-none focus:border-pink-500/40 focus:bg-white/[0.01] transition-all flex-1 font-display"
                >
                  <option value="">-- Choose uncompleted task --</option>
                  {activeTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                  ))}
                </select>
                <button 
                  onClick={handleReplanningSubmit}
                  disabled={!failedTaskId || isAiLoading}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 glow-btn"
                >
                  Execute Replanning Blueprint
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Roadmap list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-6 block font-display">Hourly Schedule Roadmap</span>
            
            <div className="relative border-l border-white/[0.04] ml-4 pl-8 space-y-6 pb-2">
              {scheduleBlocks.map((block, idx) => {
                let colorClass = "border-purple-500/20 text-purple-400 bg-purple-500/5";
                let icon = Brain;
                
                if (block.type === "break") {
                  colorClass = "border-pink-500/20 text-pink-400 bg-pink-500/5";
                  icon = Coffee;
                } else if (block.type === "habit") {
                  colorClass = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
                  icon = CheckCircle;
                } else if (block.type === "flexible") {
                  colorClass = "border-purple-500/20 text-purple-400 bg-purple-500/5";
                  icon = Clock;
                }

                const IconComponent = icon;

                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative"
                  >
                    {/* timeline node icon */}
                    <div className="absolute -left-[45px] top-1.5 w-8 h-8 rounded-full bg-[#030305] border border-white/[0.05] flex items-center justify-center text-zinc-500 z-10 shadow shadow-purple-500/5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    {/* Block Card */}
                    <div className={`p-4 rounded-xl border ${colorClass} backdrop-blur-sm relative group`}>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-550 font-mono">{block.time}</span>
                          <h4 className="text-sm font-bold text-zinc-200 mt-0.5 font-display">{block.label}</h4>
                        </div>
                        <span className="text-[9px] uppercase font-bold tracking-widest border border-white/[0.04] bg-black/40 text-zinc-400 px-2 py-0.5 rounded font-display">
                          {block.type}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed font-sans">{block.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Schedule tips & metrics */}
        <div className="space-y-6 h-fit">
          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-3 block font-display">Scheduler Insights</span>
            <div className="p-4 bg-black/40 border border-white/[0.04] rounded-xl space-y-2.5">
              <div className="flex gap-2 items-start">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-300 font-bold leading-snug font-display">AI Coach Tip for today:</p>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed italic font-sans">{productivityTip}</p>
            </div>
          </div>

          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full"></div>
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-4 block font-display">Productive Milestones</span>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                <span className="text-xs text-zinc-400">Scheduled Work Blocks</span>
                <span className="text-sm font-bold text-purple-400 font-mono">3 Focus Blocks</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                <span className="text-xs text-zinc-400">Total Scheduled Hours</span>
                <span className="text-sm font-bold text-purple-400 font-mono">4.5 hours</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-zinc-400">Rest Intervals</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">2 Recalls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
