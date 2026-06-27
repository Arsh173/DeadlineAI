import React, { useState } from "react";
import { 
  Bell, 
  Flame, 
  Search, 
  Sparkles, 
  User as UserIcon,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

export const Header: React.FC = () => {
  const { 
    profile, 
    notifications, 
    clearNotifications, 
    habits,
    isAiLoading 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Calculate current streak from habits or profile
  const maxHabitStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak)) 
    : 3;

  return (
    <header id="app-header" className="h-16 border-b border-white/[0.04] bg-[#030305]/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 text-zinc-100 font-sans pl-72">
      {/* Search / Command palette launcher */}
      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-1.5 w-64 text-zinc-400 text-xs focus-within:border-purple-500/40 focus-within:bg-white/[0.04] transition-all">
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search tasks, study notes... (⌘K)" 
          className="bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-650 w-full"
          disabled
        />
        <span className="bg-white/[0.04] text-[10px] px-1.5 py-0.5 rounded font-mono border border-white/[0.05]">⌘K</span>
      </div>

      {/* Utilities Center */}
      <div className="flex items-center gap-4">
        {/* AI Processing Sparkle indicator */}
        {isAiLoading && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium animate-pulse">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>AI Thinking...</span>
          </div>
        )}

        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold select-none">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
          <span>{maxHabitStreak} Day Streak</span>
        </div>

        {/* Notification bell dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all relative"
          >
            <Bell className="w-4 h-4 text-zinc-300" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            )}
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-[#09090c]/90 border border-white/[0.08] backdrop-blur-xl rounded-xl shadow-2xl p-4 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] mb-2">
                    <h3 className="text-xs font-bold text-zinc-350 uppercase tracking-wider font-display">Smart Notifications</h3>
                    {unreadNotifs.length > 0 && (
                      <button 
                        onClick={() => {
                          clearNotifications();
                          setShowNotifications(false);
                        }}
                        className="text-[10px] text-purple-400 hover:text-purple-350 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 py-1 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 text-xs">
                        No active alerts
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        let Icon = Info;
                        let color = "text-blue-400 bg-blue-500/10";
                        if (notif.type === "success") {
                          Icon = CheckCircle;
                          color = "text-emerald-400 bg-emerald-500/10";
                        } else if (notif.type === "alert") {
                          Icon = AlertTriangle;
                          color = "text-pink-400 bg-pink-500/10";
                        }
                        return (
                          <div 
                            key={notif.id} 
                            className={`p-2.5 rounded-lg border text-xs flex gap-2.5 transition-all ${
                              notif.read ? "bg-white/[0.01] border-white/[0.03] opacity-60" : "bg-white/[0.03] border-white/[0.06]"
                            }`}
                          >
                            <div className={`p-1 rounded-md h-fit ${color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-zinc-200 font-medium leading-relaxed">{notif.text}</p>
                              <span className="text-[9px] text-zinc-500 mt-1 block">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile drop trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-white/[0.02] p-1 px-2 rounded-lg border border-transparent hover:border-white/[0.05] transition-all text-xs"
          >
            <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {profile?.name[0]?.toUpperCase() || "A"}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-[#09090c]/90 border border-white/[0.08] backdrop-blur-xl rounded-xl shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                    <p className="font-semibold text-zinc-300 font-display">{profile?.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">XP Total: {profile?.xp}</p>
                  </div>
                  <div className="p-1">
                    <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-lg hover:bg-white/[0.03] cursor-not-allowed">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Configure API Key</span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
