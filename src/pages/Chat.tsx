import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  HelpCircle, 
  TrendingUp, 
  Clock, 
  Activity,
  Heart
} from "lucide-react";
import { motion } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chat: React.FC = () => {
  const { askGemini, tasks, habits, goals, isAiLoading } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your DeadlineAI companion. I've automatically synced your current backlog of tasks, goal milestones, and habit streaks. Type naturally — whether you want me to calculate deadline risks, prioritize tomorrow's roadmap, or write custom reminders!"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isAiLoading) return;
    const userMsg = input;
    setInput("");
    
    // Add user message to history
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    try {
      const reply = await askGemini(userMsg, messages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "Apologies, I encountered an issue querying the AI gateway. Verify your API keys." }]);
    }
  };

  const handleQuickQuestion = (qText: string) => {
    setInput(qText);
  };

  const quickPrompts = [
    { label: "Predict Risk", text: "My deadlines look high risk. Can you look at my tasks and suggest a recovery plan?" },
    { label: "Plan Tomorrow", text: "Create a highly productive daily focus schedule for tomorrow including breaks." },
    { label: "Give Motivation", text: "I'm feeling burnt out. Can you give me a personalized motivational boost?" }
  ];

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72 h-[calc(100vh-2rem)] flex flex-col select-none">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050508]/60 border border-white/[0.04] p-5 rounded-2xl shrink-0 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            AI Productivity Coach <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Analyze bottlenecks, estimate effort durations, and adapt schedules in real-time.
          </p>
        </div>

        {/* Live Context tracker info */}
        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-bold text-purple-300 glow-btn">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Context Sync: {tasks.length} tasks | {habits.length} habits | {goals.length} goals</span>
        </div>
      </div>

      {/* Main chat interface row */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Messages feed */}
        <div className="lg:col-span-3 bg-[#050508]/40 border border-white/[0.04] rounded-2xl flex flex-col justify-between overflow-hidden relative backdrop-blur-md">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3.5 max-w-2xl ${isAssistant ? "" : "ml-auto flex-row-reverse"}`}
                >
                  {/* avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isAssistant 
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
                      : "bg-black/40 border-white/[0.06] text-zinc-300"
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>

                  {/* text balloon */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAssistant 
                      ? "bg-[#030305]/60 border border-white/[0.04] text-zinc-300 font-medium font-sans" 
                      : "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/5 glow-btn"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            
            {/* AI loading placeholder */}
            {isAiLoading && (
              <div className="flex gap-3.5 max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center animate-spin">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.04] text-zinc-550 text-xs italic">
                  Synthesizing coaching suggestions from your daily roadmap...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick presets */}
          <div className="px-4 py-2 border-t border-white/[0.04] bg-black/20 flex flex-wrap gap-2 shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(p.text)}
                className="text-[10px] bg-black/40 border border-white/[0.04] hover:border-purple-500/40 text-zinc-400 hover:text-purple-300 px-3 py-1.5 rounded-lg font-bold transition-all font-display"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-4 border-t border-white/[0.04] shrink-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask DeadlineAI anything... (e.g. 'I couldn't finish React UI, suggest a backup schedule.')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-3.5 pl-4 pr-12 text-xs text-zinc-200 outline-none focus:border-purple-500/40 focus:bg-white/[0.01] transition-all placeholder:text-zinc-650 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isAiLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white rounded-lg hover:scale-[1.01] transition-all disabled:opacity-50 glow-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right context helper column */}
        <div className="hidden lg:flex flex-col justify-between bg-[#050508]/40 border border-white/[0.04] p-5 rounded-2xl backdrop-blur-md">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-500 block font-display">AI Coach Sandbox</span>
            <div className="p-4 bg-black/40 border border-white/[0.04] rounded-xl space-y-2">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1 font-display">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Suggested Queries
              </span>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                Try typing: "Review my study hours and estimate whether I will meet my weekend hackathon targets."
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1 font-display">Context Synced</span>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
              Every message passes your entire database status securely as active context to the Gemini LLM pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
