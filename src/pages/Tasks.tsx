import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Task } from "../types";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Hourglass, 
  Tag, 
  CheckSquare, 
  ChevronsUp, 
  BarChart2, 
  ChevronDown, 
  Sparkles,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Tasks: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    triggerAIPrioritization, 
    isAiLoading,
    smartSuggestions
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("deadline");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // New task form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState(2);
  const [importance, setImportance] = useState<"High" | "Medium" | "Low">("Medium");
  const [urgency, setUrgency] = useState<"High" | "Medium" | "Low">("Medium");
  const [category, setCategory] = useState<"Study" | "Work" | "Personal" | "Health" | "Finance">("Study");
  const [difficulty, setDifficulty] = useState<"Hard" | "Medium" | "Easy">("Medium");
  const [energyLevel, setEnergyLevel] = useState<"High" | "Medium" | "Low">("Medium");

  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ["All", "Study", "Work", "Personal", "Health", "Finance"];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      deadline: deadline || new Date().toISOString().split('T')[0],
      duration: Number(duration),
      importance,
      category,
      urgency,
      energyLevel,
      difficulty,
      progress: 0,
      completed: false
    });

    // Reset states
    setTitle("");
    setDescription("");
    setDeadline("");
    setDuration(2);
    setImportance("Medium");
    setCategory("Study");
    setShowAddForm(false);
  };

  // Filter & Sort logic
  const filteredTasks = tasks.filter(t => {
    if (activeTab === "All") return true;
    return t.category === activeTab;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sortBy === "duration") {
      return b.duration - a.duration;
    }
    if (sortBy === "priority") {
      const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      const rankA = rank[a.priority] || 2;
      const rankB = rank[b.priority] || 2;
      return rankB - rankA;
    }
    return 0;
  });

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Backlog & Priorities <ClipboardList className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Map out commitments, configure difficulty thresholds, and trigger automated AI prioritization.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-500/10 transition-all glow-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
          
          <button 
            onClick={triggerAIPrioritization}
            disabled={isAiLoading}
            className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>{isAiLoading ? "Processing Backlog..." : "AI Prioritization"}</span>
          </button>
        </div>
      </div>

      {/* Task Creation Form Collapsible */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateTask} className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl space-y-4 backdrop-blur-md">
              <h3 className="text-sm font-bold text-zinc-300 mb-1">New Commitment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Task Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Write Spandrel research paper"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs outline-none focus:border-purple-500/40 focus:bg-white/[0.01] transition-all text-zinc-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Deadline Target</label>
                  <input 
                    type="date" 
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs outline-none focus:border-purple-500/40 focus:bg-white/[0.01] transition-all text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Category</label>
                  <select 
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-300 outline-none focus:border-purple-500/40 transition-all font-medium"
                  >
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Est. Effort (Hours)</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={100}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 text-xs outline-none focus:border-purple-500/40 focus:bg-white/[0.01] transition-all text-zinc-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Importance Level</label>
                  <select 
                    value={importance}
                    onChange={(e: any) => setImportance(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-300 outline-none focus:border-purple-500/40 transition-all font-medium"
                  >
                    <option value="High">High Importance</option>
                    <option value="Medium">Medium Importance</option>
                    <option value="Low">Low Importance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Difficulty Threshold</label>
                  <select 
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-3 text-xs text-zinc-300 outline-none focus:border-purple-500/40 transition-all font-medium"
                  >
                    <option value="Hard">Hard Difficulty</option>
                    <option value="Medium">Medium Difficulty</option>
                    <option value="Easy">Easy Difficulty</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Detailed Description</label>
                <textarea 
                  placeholder="Include links, steps, resources, guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-2.5 px-4 h-20 text-xs outline-none focus:border-purple-500/40 focus:bg-white/[0.01] transition-all text-zinc-200 resize-none placeholder:text-zinc-650"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-purple-500/10 transition-all glow-btn"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-3">
        {/* tabs */}
        <div className="flex flex-wrap gap-1">
          {categories.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive 
                    ? "bg-white/[0.05] border border-white/[0.06] text-zinc-100 shadow-sm" 
                    : "text-zinc-450 hover:text-zinc-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* sorter */}
        <div className="flex items-center gap-2 text-xs bg-white/[0.02] border border-white/[0.04] p-1.5 rounded-lg">
          <span className="text-zinc-500 font-semibold px-2">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/40 border border-white/[0.04] text-zinc-300 outline-none py-1 px-2.5 rounded font-medium cursor-pointer focus:ring-0"
          >
            <option value="deadline">Target Due Date</option>
            <option value="duration">Estimated Hours</option>
            <option value="priority">AI Priority Rank</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-850 p-8 rounded-2xl text-zinc-500 text-sm flex flex-col items-center gap-3">
            <ClipboardList className="w-10 h-10 text-zinc-600 animate-pulse" />
            <div>
              <p className="font-bold text-zinc-400">Your backlog is clear!</p>
              <p className="text-xs text-zinc-600 mt-1">Add tasks manually or input speech prompts from the dashboard.</p>
            </div>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            
            // Priority Tag Styles
            let priorityBadge = "bg-blue-500/10 text-blue-400 border-blue-500/20";
            if (task.priority === "Critical") {
              priorityBadge = "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
            } else if (task.priority === "High") {
              priorityBadge = "bg-pink-500/10 text-pink-400 border-pink-500/20";
            } else if (task.priority === "Medium") {
              priorityBadge = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            }

            return (
              <div 
                key={task.id} 
                className={`bg-white/[0.015] border border-white/[0.04] rounded-2xl overflow-hidden backdrop-blur-md transition-all ${
                  task.completed ? "opacity-60 border-white/[0.02]" : "hover:border-purple-500/20"
                }`}
              >
                {/* Collapsed Header */}
                <div 
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateTask({ ...task, completed: !task.completed, progress: !task.completed ? 100 : 0 });
                      }}
                      className="w-5 h-5 rounded-lg border-white/[0.06] text-purple-600 bg-black/45 focus:ring-0 outline-none shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold font-display text-zinc-100 ${task.completed ? "line-through text-zinc-500" : ""}`}>
                        {task.title}
                      </h4>
                      <p className="text-zinc-500 text-xs mt-1 truncate max-w-lg">{task.description || "No description provided."}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {/* Category Label */}
                    <span className="text-[10px] bg-black/40 border border-white/[0.04] text-zinc-450 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {task.category}
                    </span>

                    {/* Priority */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${priorityBadge}`}>
                      {task.priority || "Medium"}
                    </span>

                    {/* Deadline */}
                    <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5 bg-black/40 border border-white/[0.04] px-2.5 py-1 rounded-full">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    {/* Expand Trigger */}
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/[0.04] bg-[#030305]/40 px-5 py-6 space-y-4 text-xs"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Specifications */}
                        <div className="space-y-2.5">
                          <p className="text-zinc-500 uppercase font-extrabold tracking-wider text-[10px]">Specifications</p>
                          <div className="space-y-1.5 text-zinc-400 font-medium font-display">
                            <p className="flex justify-between">
                              <span>Estimated Effort:</span>
                              <span className="font-mono text-zinc-200">{task.duration} hours</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Difficulty Rating:</span>
                              <span className="text-zinc-200 font-semibold">{task.difficulty || "Medium"}</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Energy Requirement:</span>
                              <span className="text-zinc-200 font-semibold">{task.energyLevel || "Medium"}</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Importance:</span>
                              <span className="text-zinc-200 font-semibold">{task.importance}</span>
                            </p>
                          </div>
                        </div>

                        {/* Interactive Progress bar */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-zinc-500 uppercase font-extrabold tracking-wider text-[10px]">
                            <span>Progress Scale</span>
                            <span className="font-mono text-purple-400 font-bold">{task.progress}%</span>
                          </div>
                          <div className="space-y-3 pt-2">
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={task.progress} 
                              onChange={(e) => {
                                const progVal = Number(e.target.value);
                                updateTask({ 
                                  ...task, 
                                  progress: progVal, 
                                  completed: progVal === 100 
                                });
                              }}
                              className="w-full accent-purple-500 bg-white/[0.05] rounded-lg cursor-pointer h-1.5 outline-none"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-500">
                              <span>Not Started</span>
                              <span>Completed</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col justify-end gap-2.5 font-display">
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold transition-all w-full mt-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Task</span>
                          </button>
                        </div>
                      </div>

                      {/* Study Notes Workspace */}
                      <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                        <p className="text-zinc-500 uppercase font-extrabold tracking-wider text-[10px]">Study Notes Notepad Workspace</p>
                        <textarea 
                          placeholder="Jot down notes, outlines, formulas, and resources here. Tap AI study buttons in Pomodoro modes to auto-generate study flashcards!"
                          value={task.notes || ""}
                          onChange={(e) => {
                            updateTask({ ...task, notes: e.target.value });
                          }}
                          className="w-full bg-black/40 border border-white/[0.05] rounded-xl p-3 h-28 outline-none focus:border-purple-500/40 text-zinc-300 placeholder:text-zinc-650 font-mono text-xs leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
