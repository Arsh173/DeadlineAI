import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Clock, 
  Calendar, 
  GraduationCap, 
  BarChart3, 
  Activity, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Flame,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";

export const Landing: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Sparkles,
      title: "Autonomous Prioritization",
      desc: "Our AI calculates deadline risk and task urgency dynamically. No manual ranking needed.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Calendar,
      title: "AI Adaptive Scheduler",
      desc: "Automatically map tasks, breaks, and habits into a customized, high-productivity daily timeline.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: ShieldAlert,
      title: "Deadline Risk Prediction",
      desc: "AI scans your backlog and predicts whether you'll finish. Get instant recovery blueprints.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Clock,
      title: "Integrated Focus Mode",
      desc: "A built-in Pomodoro desk with ambient soundscapes and physical visual pulses to sustain flow.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: GraduationCap,
      title: "Spaced Repetition Generator",
      desc: "Write study scratchpads and let AI generate Leitner flashcards to review concepts with optimal science.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Flame,
      title: "Gamified XP & Milestones",
      desc: "Earn XP, unlock custom creator levels, and secure elite badges by checking off deadlines.",
      gradient: "from-indigo-500 to-pink-500"
    }
  ];

  const faqs = [
    {
      q: "How does the AI predict missing a deadline?",
      a: "DeadlineAI models your current progress, estimated task difficulty, and remaining duration against the due date. If the required rate of completion exceeds your high-energy schedule blocks, it issues a smart risk alert."
    },
    {
      q: "What is Adaptive Replanning?",
      a: "If you fall behind or mark a task as 'Uncompleted', the AI coach doesn't just log it. It automatically runs a server-side scheduling process to shuffle future tasks, preventing cognitive burnout."
    },
    {
      q: "Can I use DeadlineAI offline?",
      a: "Absolutely. DeadlineAI uses a client-side localStorage cache. All task configurations are cached locally first, syncing securely to our cloud Firestore database the moment you log in."
    },
    {
      q: "Is Google Gemini API fully secure?",
      a: "Yes. All AI operations are proxied through a secure Node.js Cloud Run container. Your API credentials are never exposed in the browser."
    }
  ];

  return (
    <div className="bg-[#030305] text-zinc-100 min-h-screen overflow-x-hidden font-sans relative selection:bg-purple-500/20 selection:text-purple-300">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/5 via-pink-900/5 to-transparent blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-[800px] left-10 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-[1600px] right-10 w-96 h-96 bg-pink-500/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/[0.04] sticky top-0 bg-[#030305]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/10 glow-btn">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <span className="text-lg font-bold font-display tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            DeadlineAI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="text-sm font-medium text-zinc-450 hover:text-zinc-100 transition-all px-4 py-2"
          >
            Sign In
          </Link>
          <Link 
            to="/auth" 
            className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2 rounded-lg shadow-lg shadow-purple-500/10 transition-all glow-btn"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Removed Google AI Hackathon badge */}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Never Miss a{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-extrabold">
              Deadline
            </span>{" "}
            Again.
          </h1>

          <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            DeadlineAI is an intelligent productivity companion that proactively prioritizes tasks, builds adaptive hourly roadmaps, predicts submission risks, and coaches you to completion.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/auth" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold text-base shadow-xl shadow-purple-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 glow-btn"
            >
              <span>Meet Your AI Companion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-zinc-300 hover:text-white font-semibold text-base transition-all hover:bg-white/[0.05] flex items-center justify-center backdrop-blur-sm"
            >
              Learn the Science
            </a>
          </div>

          {/* SaaS Interface Mockup */}
          <div className="pt-16 max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-35 transition duration-1000"></div>
            <div className="relative bg-[#050508]/60 border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-4 text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="bg-black/40 text-[10px] px-6 py-1 rounded border border-white/[0.04] font-mono">
                  https://deadlineai.aistudio.build/dashboard
                </div>
                <div className="w-6"></div>
              </div>

              {/* Grid content mockup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">AI Prioritization</span>
                  <p className="text-sm font-bold font-display text-zinc-200">React UI Prototype</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/20">Critical</span>
                    <span className="text-zinc-550 font-mono">Due in 20 hours</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Risk Prediction</span>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold font-display text-zinc-200">Submission Risk</p>
                    <span className="text-pink-400 font-mono font-bold text-sm">65%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-pink-500 h-1.5 rounded-full w-[65%]"></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Focus Desk</span>
                  <div className="flex justify-between items-center text-zinc-300">
                    <p className="text-sm font-bold font-display">Pomodoro Timer</p>
                    <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded border border-white/[0.04]">25:00</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    <span className="text-[10px] text-zinc-455">Deep study mode active...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
            Designed to Conquer Procrastination.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            Traditional task apps are graveyard lists. DeadlineAI active-coaches you with behavioral science, spaced learning, and server-authoritative planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-all" />
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.gradient} w-fit shadow-lg text-white mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{feat.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold font-display text-white">Loved by Builders & Innovators</h2>
          <p className="text-zinc-400 text-sm">Real productivity gains reported from top developers and hackathon creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
            <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">
              "Calculating submission risks completely changed how I prepare for hackathons. Instead of cramming, I knew exactly which days were overloaded."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">A</div>
              <div>
                <p className="text-xs font-semibold font-display text-zinc-200">Alex Rivera</p>
                <p className="text-[10px] text-zinc-500 font-mono">Full Stack Student</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
            <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">
              "The adaptive replanning engine is magic. When I was too tired to finish writing my thesis chapter, it dynamically adjusted my weekly routine."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">J</div>
              <div>
                <p className="text-xs font-semibold font-display text-zinc-200">Jessica Chen</p>
                <p className="text-[10px] text-zinc-500 font-mono">BioTech Entrepreneur</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
            <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">
              "I love the integrated flashcards. Generating Leitner card systems directly from my research notes saves hours of flashcard-writing labor."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">T</div>
              <div>
                <p className="text-xs font-semibold font-display text-zinc-200">Tyler Vance</p>
                <p className="text-[10px] text-zinc-500 font-mono">Core Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <h2 className="text-3xl font-bold font-display text-center text-white mb-10">Frequently Answered</h2>
        <div className="space-y-4 font-display">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border border-white/[0.04] rounded-xl overflow-hidden bg-white/[0.01]">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-zinc-200 hover:text-white transition-all"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-purple-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-450 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] max-w-7xl mx-auto px-6 py-12 text-center space-y-6 text-zinc-500 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center glow-btn">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-350">DeadlineAI</span>
          </div>
          <div className="flex gap-6 text-zinc-450">
            <span className="hover:text-white cursor-not-allowed">Product Blueprint</span>
            <span className="hover:text-white cursor-not-allowed">Privacy Policy</span>
            <span className="hover:text-white cursor-not-allowed">Terms of Service</span>
          </div>
        </div>
        <p className="text-[11px] pt-4 border-t border-white/[0.04]">
          © 2026 DeadlineAI. Designed for Google AI Hackathon. Utilizing Server-Side Gemini API context pipelines.
        </p>
      </footer>
    </div>
  );
};
