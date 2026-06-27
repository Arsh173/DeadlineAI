import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  GraduationCap, 
  HeartPulse, 
  BarChart3, 
  MessageSquareCode, 
  LogOut, 
  Award, 
  Flame, 
  ShieldAlert,
  Sliders,
  Sparkles
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { profile, logout, isLoggedIn } = useApp();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, color: "text-blue-400" },
    { name: "Tasks & Backlog", path: "/tasks", icon: CheckSquare, color: "text-purple-400" },
    { name: "AI Scheduler", path: "/scheduler", icon: CalendarDays, color: "text-cyan-400" },
    { name: "Study & Pomodoro", path: "/study", icon: GraduationCap, color: "text-pink-400" },
    { name: "Goals & Habits", path: "/habits", icon: HeartPulse, color: "text-emerald-400" },
    { name: "Productivity Stats", path: "/analytics", icon: BarChart3, color: "text-yellow-400" },
    { name: "AI Coach Chat", path: "/chat", icon: MessageSquareCode, color: "text-indigo-400" },
  ];

  if (!isLoggedIn) return null;

  const currentLevel = profile?.level || 1;
  const currentXp = profile?.xp || 0;
  const xpInCurrentLevel = currentXp % 500;
  const progressPercent = Math.min(100, (xpInCurrentLevel / 500) * 100);

  return (
    <aside id="sidebar-container" className="w-64 h-screen fixed left-0 top-0 bg-[#050508]/75 backdrop-blur-xl border-r border-white/[0.04] flex flex-col z-40 text-zinc-100 font-sans">
      {/* Brand Logo */}
      <div className="p-6 border-b border-white/[0.04] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            DeadlineAI
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">Never Miss A Due</p>
        </div>
      </div>

      {/* Gamified Profile Box */}
      {profile && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center border border-white/[0.08] text-white font-bold text-sm shadow">
                {profile.name[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-zinc-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-zinc-950 shadow-sm">
                {currentLevel}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{profile.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{profile.email}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
              <span>Level {currentLevel}</span>
              <span className="font-mono">{xpInCurrentLevel}/500 XP</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Badges Locker */}
          <div className="mt-3 pt-2 border-t border-white/[0.04] flex flex-wrap gap-1.5">
            {profile.badges.slice(0, 3).map((badge, idx) => (
              <span 
                key={idx} 
                className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium flex items-center gap-1"
                title="Earned badge"
              >
                <Award className="w-2 h-2 text-yellow-500" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                isActive 
                  ? "bg-white/[0.05] border-l-2 border-purple-500 text-zinc-100 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]"
              }`}
            >
              <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? item.color : "text-zinc-500"}`} />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Log out */}
      <div className="p-4 border-t border-white/[0.04]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/25 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Coach</span>
        </button>
      </div>
    </aside>
  );
};
