import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  HeartPulse, 
  Flame, 
  Droplet, 
  Plus, 
  Trash2, 
  Target, 
  Award, 
  CheckCircle, 
  TrendingUp,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Habits: React.FC = () => {
  const { 
    habits, 
    addHabit, 
    deleteHabit, 
    toggleHabitToday, 
    goals, 
    addGoal, 
    updateGoal, 
    deleteGoal,
    isAiLoading,
    awardUserXP
  } = useApp();

  // New Habit state
  const [habitName, setHabitName] = useState("");
  const [habitValue, setHabitValue] = useState("1 hour");
  const [habitCategory, setHabitCategory] = useState<"Coding" | "Reading" | "Exercise" | "Water Intake" | "Meditation" | "Sleep" | "Other">("Coding");
  const [showAddHabit, setShowAddHabit] = useState(false);

  // New Goal state
  const [goalTitle, setGoalTitle] = useState("");
  const [goalPeriod, setGoalPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalUnit, setGoalUnit] = useState("hrs");
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Water intake state
  const [waterGlasses, setWaterGlasses] = useState(4); // default 4/8 glasses

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    await addHabit({
      name: habitName,
      targetValue: habitValue,
      category: habitCategory
    });

    setHabitName("");
    setHabitValue("1 hour");
    setShowAddHabit(false);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    await addGoal({
      title: goalTitle,
      period: goalPeriod,
      target: Number(goalTarget),
      current: 0,
      unit: goalUnit
    });

    setGoalTitle("");
    setGoalPeriod("weekly");
    setGoalTarget(10);
    setGoalUnit("hrs");
    setShowAddGoal(false);
  };

  const handleIncrementWater = async () => {
    if (waterGlasses < 12) {
      const newVal = waterGlasses + 1;
      setWaterGlasses(newVal);
      if (newVal === 8) {
        // Hydration goal reached!
        await awardUserXP(35);
      } else {
        await awardUserXP(5);
      }
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72 select-none">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050508]/60 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            Goals & Habit Loop <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Build bulletproof consistency, check off habits, fill your daily hydration glass, and extend milestone progress.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 font-display">
          <button 
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 transition-all glow-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
          
          <button 
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="flex items-center gap-2 bg-black/40 border border-white/[0.04] hover:bg-white/[0.04] text-zinc-350 px-5 py-2.5 rounded-xl text-xs font-bold transition-all font-display"
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Grid: Habit list & Goal List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Habits Tracker */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add Habit collapsible */}
          <AnimatePresence>
            {showAddHabit && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateHabit}
                className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl space-y-4 backdrop-blur-md overflow-hidden text-xs font-display"
              >
                <h3 className="text-sm font-bold text-zinc-300">Register New Habit</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400">Habit Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Read 10 pages"
                      value={habitName}
                      onChange={(e) => setHabitName(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs outline-none focus:border-emerald-500/40 focus:bg-white/[0.01] transition-all text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400">Target Value</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 30 minutes, 10 pages"
                      value={habitValue}
                      onChange={(e) => setHabitValue(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs outline-none focus:border-emerald-500/40 focus:bg-white/[0.01] transition-all text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400">Category Tag</label>
                    <select 
                      value={habitCategory}
                      onChange={(e: any) => setHabitCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-355 outline-none focus:border-emerald-500/40 transition-all"
                    >
                      <option value="Coding">Coding</option>
                      <option value="Reading">Reading</option>
                      <option value="Exercise">Exercise</option>
                      <option value="Water Intake">Water Intake</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Sleep">Sleep</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button type="button" onClick={() => setShowAddHabit(false)} className="text-zinc-500 font-semibold">Cancel</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold glow-btn">Add Habit</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Habits Matrix Card */}
          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-4 block font-display">Daily Habits Loop Matrix</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-display">
              {habits.map((habit) => {
                const isCheckedToday = habit.history.includes(todayStr);
                return (
                  <div 
                    key={habit.id} 
                    className={`p-4 bg-black/40 border border-white/[0.04] rounded-xl flex items-center justify-between gap-4 transition-all hover:bg-[#030305]/60 ${
                      isCheckedToday ? "border-emerald-500/20 bg-emerald-500/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Check toggler */}
                      <button 
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          isCheckedToday 
                            ? "bg-emerald-500 border-emerald-500 text-zinc-950" 
                            : "border-white/[0.08] hover:border-white/[0.12] text-transparent"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <div className="min-w-0 font-sans">
                        <p className={`text-xs font-bold text-zinc-200 ${isCheckedToday ? "text-zinc-550 line-through" : ""}`}>
                          {habit.name}
                        </p>
                        <span className="text-[10px] text-zinc-500 font-medium">Target: {habit.targetValue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-orange-400 text-xs font-semibold select-none bg-orange-500/5 px-2 py-1 rounded-lg border border-orange-500/10 glow-btn">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span>{habit.streak}d</span>
                      </div>

                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-white/[0.04]"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Columns: Hydration & Core Goals */}
        <div className="space-y-6 h-fit">
          
          {/* Hydration Widget */}
          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full"></div>
            
            <div>
              <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-3 block font-display">Daily Hydration Track</span>
              <div className="flex items-center gap-4 mb-4 font-sans">
                {/* Visual glass bar filler */}
                <div className="relative w-14 h-20 border-2 border-cyan-500/20 bg-black/40 rounded-b-xl rounded-t-sm flex flex-col justify-end overflow-hidden shadow-lg">
                  {/* Filling blue wave */}
                  <motion.div 
                    className="bg-gradient-to-t from-cyan-600 via-cyan-500 to-blue-400 w-full"
                    animate={{ height: `${Math.min(100, (waterGlasses / 8) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-white drop-shadow">
                    {waterGlasses}/8
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-zinc-200">Drink 8 Glasses daily</h4>
                  <p className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed">
                    Hydration optimizes cognitive efficiency and increases concentration periods during Pomodoro intervals.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleIncrementWater}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-all w-full glow-btn font-display"
            >
              <Droplet className="w-4 h-4" />
              <span>Log Glass (+5 XP)</span>
            </button>
          </div>

          {/* Goal Milestones Section */}
          <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md relative">
            
            {/* Create Goal Form collapsible */}
            <AnimatePresence>
              {showAddGoal && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateGoal}
                  className="bg-black/40 border border-white/[0.04] p-4 rounded-xl space-y-3 mb-4 text-xs overflow-hidden font-display"
                >
                  <div className="space-y-1">
                    <span className="text-zinc-450">Goal Title</span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Study 15 hours"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.06] rounded-lg p-2 text-zinc-200 outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-450">Target Level</span>
                      <input 
                        type="number" 
                        required
                        min={1}
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/[0.06] rounded-lg p-1.5 text-zinc-250 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-455">Unit (e.g., hrs, sessions)</span>
                      <input 
                        type="text" 
                        required
                        value={goalUnit}
                        onChange={(e) => setGoalUnit(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.06] rounded-lg p-1.5 text-zinc-250 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <select 
                      value={goalPeriod}
                      onChange={(e: any) => setGoalPeriod(e.target.value)}
                      className="bg-black/40 border border-white/[0.06] rounded-lg p-1 text-zinc-400 text-[10px]"
                    >
                      <option value="daily">Daily Goal</option>
                      <option value="weekly">Weekly Goal</option>
                      <option value="monthly">Monthly Goal</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowAddGoal(false)} className="text-zinc-550 font-semibold px-2">Cancel</button>
                      <button type="submit" className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold glow-btn">Add Goal</button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-4 block font-display">Core Goal Milestones</span>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {goals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div key={goal.id} className="p-3 bg-black/40 border border-white/[0.04] rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-3 text-xs font-display">
                      <div className="font-sans">
                        <p className={`font-bold text-zinc-200 ${goal.completed ? "line-through text-zinc-550" : ""}`}>{goal.title}</p>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 inline-block border border-purple-500/20">
                          {goal.period}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        {/* Incrementor */}
                        {!goal.completed && (
                          <button 
                            onClick={() => updateGoal({ ...goal, current: Math.min(goal.target, goal.current + 1) })}
                            className="bg-black/40 border border-white/[0.06] hover:bg-white/[0.04] text-zinc-300 w-5 h-5 rounded flex items-center justify-center text-xs font-bold font-mono"
                          >
                            +
                          </button>
                        )}
                        <button 
                          onClick={() => deleteGoal(goal.id)}
                          className="text-zinc-600 hover:text-red-400 p-1"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Progress slider */}
                    <div className="space-y-1">
                      <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-1 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                        <span>{percent}% Completed</span>
                        <span>{goal.current}/{goal.target} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
