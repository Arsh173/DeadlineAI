import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  Plus, 
  Trash2,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Study: React.FC = () => {
  const { 
    flashcards, 
    addFlashcard, 
    deleteFlashcard, 
    reviewFlashcard, 
    generateFlashcardsFromText, 
    isAiLoading 
  } = useApp();

  // Pomodoro states
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Sound States
  const [ambientSound, setAmbientSound] = useState<"none" | "rain" | "cafe" | "white">("none");
  const [soundAudio, setSoundAudio] = useState<HTMLAudioElement | null>(null);

  // Notepad States
  const [notepadText, setNotepadText] = useState(
    `# High-Performance Study Notepad\n\n- React uses a virtual DOM to optimize client rendering.\n- Spaced repetition Leitner systems schedule review cards using Box scales (Boxes 1 to 5).\n- Firestore manages persistent document databases in real time.\n\nUse the Sparkle button below to auto-extract study flashcards!`
  );
  const [notepadTopic, setNotepadTopic] = useState("React & Spaced Study");

  // Flashcard reviewer states
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // Custom manual card state
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Pomodoro Clock Core Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Mode completed trigger
      if (pomodoroMode === "focus") {
        setCompletedPomodoros(prev => prev + 1);
        setPomodoroMode("break");
        setTimeLeft(5 * 60);
        // Play notification sound
        playChime();
      } else {
        setPomodoroMode("focus");
        setTimeLeft(25 * 60);
        playChime();
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, pomodoroMode]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 chime
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio Context blocked or uninitialized:", e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Sound toggles
  const handleToggleSound = (type: "rain" | "cafe" | "white") => {
    if (ambientSound === type) {
      setAmbientSound("none");
      if (soundAudio) {
        soundAudio.pause();
        setSoundAudio(null);
      }
    } else {
      setAmbientSound(type);
      if (soundAudio) {
        soundAudio.pause();
      }
      
      // Simulate ambient sounds utilizing local synthesizer or dynamic audio tag if permitted.
      // Since external MP3 links can fail, we generate a soothing noise synthetically using Web Audio API!
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        if (type === "white") {
          output[i] = Math.random() * 2 - 1;
        } else if (type === "rain") {
          // Pink-ish noise filter
          output[i] = Math.random() * 0.15;
        } else {
          // Cafe brown noise filter
          output[i] = Math.sin(i * 0.01) * 0.1 + Math.random() * 0.05;
        }
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = type === "rain" ? "lowpass" : "bandpass";
      filter.frequency.value = type === "rain" ? 800 : 400;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.05;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      whiteNoise.start();

      // Wrap mock audio handler to toggle off easily
      const fakeAudio: any = {
        pause: () => {
          whiteNoise.stop();
          audioCtx.close();
        }
      };
      setSoundAudio(fakeAudio);
    }
  };

  const handleManualAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    await addFlashcard(newQuestion, newAnswer, newDifficulty);
    setNewQuestion("");
    setNewAnswer("");
    setShowAddCard(false);
  };

  // Leitner deck filtering
  const cardsToReview = flashcards;

  const currentCard = cardsToReview[currentCardIdx];

  const handleReviewAnswer = async (correct: boolean) => {
    if (!currentCard) return;
    await reviewFlashcard(currentCard.id, correct);
    setIsFlipped(false);
    // Cycle deck
    if (currentCardIdx < cardsToReview.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
    } else {
      setCurrentCardIdx(0);
    }
  };

  return (
    <div className="p-6 text-zinc-100 font-sans space-y-6 max-w-7xl mx-auto pl-72 select-none">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050508]/60 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            Study Mode & Pomodoro <GraduationCap className="w-5 h-5 text-purple-400" />
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Focus deeply with automated Pomodoro structures, ambient sound synthesizers, and Leitner spaced repetition flashcards.
          </p>
        </div>
      </div>

      {/* Grid: Pomodoro & Flashcard Deck Flip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pomodoro Timer Widget */}
        <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl flex flex-col items-center justify-center text-center relative backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full"></div>
          
          <span className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-6 font-display">
            {pomodoroMode === "focus" ? "🔥 Deep Focus Block" : "☕ Recreation Break"}
          </span>

          {/* Radial Pulse animation container */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-6">
            {/* Pulsing visual element */}
            <motion.div 
              animate={timerActive ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full border-2 ${
                pomodoroMode === "focus" ? "border-purple-500/10 bg-purple-500/2" : "border-emerald-500/10 bg-emerald-500/2"
              }`}
            />
            
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[9px] uppercase font-bold text-zinc-550 mt-1 tracking-wider font-display">
                Interval Remaining
              </span>
            </div>
          </div>

          {/* Timer controls */}
          <div className="flex gap-3 justify-center mb-6 w-full font-display">
            <button 
              onClick={() => setTimerActive(!timerActive)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                timerActive 
                  ? "bg-white/[0.08] text-zinc-300 border border-white/[0.04]" 
                  : "bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shadow-purple-500/10 glow-btn"
              }`}
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timerActive ? "Pause Flow" : "Start Flow"}</span>
            </button>

            <button 
              onClick={() => {
                setTimerActive(false);
                setTimeLeft(pomodoroMode === "focus" ? 25 * 60 : 5 * 60);
              }}
              className="px-3.5 py-2.5 bg-black/40 border border-white/[0.06] hover:bg-white/[0.04] rounded-xl text-zinc-400 hover:text-white transition-all"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ambient Sound Toggles */}
          <div className="border-t border-white/[0.04] pt-4 w-full text-left font-display">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-500 flex items-center gap-1.5 mb-3">
              <Volume2 className="w-3.5 h-3.5" /> Ambient Flow Noise
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button 
                onClick={() => handleToggleSound("rain")}
                className={`text-[10px] py-1.5 rounded-lg border font-semibold transition-all ${
                  ambientSound === "rain" 
                    ? "bg-pink-500/10 border-pink-500/30 text-pink-300 glow-btn" 
                    : "bg-black/40 border-white/[0.04] text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Rainfall
              </button>
              <button 
                onClick={() => handleToggleSound("cafe")}
                className={`text-[10px] py-1.5 rounded-lg border font-semibold transition-all ${
                  ambientSound === "cafe" 
                    ? "bg-pink-500/10 border-pink-500/30 text-pink-300 glow-btn" 
                    : "bg-black/40 border-white/[0.04] text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Cafe Loop
              </button>
              <button 
                onClick={() => handleToggleSound("white")}
                className={`text-[10px] py-1.5 rounded-lg border font-semibold transition-all ${
                  ambientSound === "white" 
                    ? "bg-pink-500/10 border-pink-500/30 text-pink-300 glow-btn" 
                    : "bg-black/40 border-white/[0.04] text-zinc-400 hover:text-zinc-200"
                }`}
              >
                White Noise
              </button>
            </div>
          </div>
        </div>

        {/* Leitner Spaced Repetition Flipping Deck */}
        <div className="lg:col-span-2 bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-display">Leitner spaced-cards</span>
            </div>
            
            <button 
              onClick={() => setShowAddCard(!showAddCard)}
              className="text-xs text-purple-400 font-bold hover:text-purple-300 flex items-center gap-1 font-display"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create manual card</span>
            </button>
          </div>

          {/* Add card layout collapsible */}
          <AnimatePresence>
            {showAddCard && (
              <motion.form 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleManualAddCard} 
                className="bg-black/40 border border-white/[0.04] p-4 rounded-xl space-y-3 mb-4 text-xs font-display"
              >
                <div className="space-y-1">
                  <span className="text-zinc-450 font-semibold">Question Prompt:</span>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. What is dependency injection?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-lg p-2 text-zinc-200 outline-none focus:border-purple-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-450 font-semibold">Flipped Answer Details:</span>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Passing services to client instead of hardcoding."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.06] rounded-lg p-2 text-zinc-200 outline-none focus:border-purple-500/40"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <select 
                    value={newDifficulty}
                    onChange={(e: any) => setNewDifficulty(e.target.value)}
                    className="bg-black/40 border border-white/[0.06] rounded-lg p-1.5 text-zinc-400 text-[11px]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddCard(false)} className="text-zinc-550 px-2 py-1 font-semibold">Cancel</button>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1 rounded-lg font-bold glow-btn">Add Card</button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Flashcard Body Flip Animation container */}
          <div className="flex-1 flex flex-col justify-center py-6">
            {cardsToReview.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">
                No Leitner cards registered. Use the Study Notepad on the right to auto-generate study flashcards!
              </div>
            ) : (
              <div className="max-w-md mx-auto w-full relative">
                {/* 3D card layout */}
                <motion.div 
                  className="bg-black/40 border border-white/[0.04] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between shadow-xl cursor-pointer relative overflow-hidden group"
                  onClick={() => setIsFlipped(!isFlipped)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
                  
                  {/* Front/Back logic */}
                  {!isFlipped ? (
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider mb-2 font-display">
                        <span>Flashcard {currentCardIdx + 1}/{cardsToReview.length}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">Leitner Box {currentCard.box}</span>
                      </div>
                      <p className="text-sm font-bold text-zinc-100 leading-relaxed mt-2 font-display">{currentCard.question}</p>
                      <p className="text-[10px] text-purple-400 mt-4 flex items-center gap-1 font-bold font-display">
                        <Eye className="w-3.5 h-3.5" /> Tap to flip card
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-wider block mb-2 font-display">Flipped Answer Details</span>
                      <p className="text-xs text-zinc-300 leading-relaxed mt-2 font-medium font-sans">{currentCard.answer}</p>
                      <p className="text-[10px] text-zinc-500 mt-4 font-display">Tap to read question prompt again</p>
                    </div>
                  )}

                  {/* Card Delete button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFlashcard(currentCard.id);
                      if (currentCardIdx > 0) setCurrentCardIdx(prev => prev - 1);
                    }}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#030305]/40 text-zinc-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>

                {/* Score rating triggers */}
                {isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-3 mt-4 font-display"
                  >
                    <button 
                      onClick={() => handleReviewAnswer(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 text-xs font-bold transition-all glow-btn"
                    >
                      <XCircle className="w-4 h-4 text-pink-500" />
                      <span>Demote to Box 1</span>
                    </button>
                    <button 
                      onClick={() => handleReviewAnswer(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all glow-btn"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Promote card (+10 XP)</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-white/[0.04] pt-4 text-xs text-zinc-500">
            <span>Spaced Leitner algorithms apply on rating.</span>
            {cardsToReview.length > 0 && (
              <button 
                onClick={() => {
                  setIsFlipped(false);
                  if (currentCardIdx < cardsToReview.length - 1) {
                    setCurrentCardIdx(prev => prev + 1);
                  } else {
                    setCurrentCardIdx(0);
                  }
                }}
                className="text-purple-400 font-bold flex items-center gap-1 font-display"
              >
                <span>Skip Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notepad with AI Extraction Card */}
      <div className="bg-[#050508]/40 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-display">Active Study Notepad Workspace</span>
          </div>

          <div className="flex gap-2 w-full md:w-auto font-display">
            <input 
              type="text" 
              placeholder="Topic name..." 
              value={notepadTopic}
              onChange={(e) => setNotepadTopic(e.target.value)}
              className="bg-black/40 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-zinc-350 outline-none focus:border-pink-500/40"
            />
            <button 
              onClick={() => generateFlashcardsFromText(notepadTopic, notepadText)}
              disabled={isAiLoading || !notepadText.trim()}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/5 transition-all shrink-0 disabled:opacity-50 glow-btn"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{isAiLoading ? "Extracting cards..." : "AI Generate flashcards"}</span>
            </button>
          </div>
        </div>

        <textarea 
          placeholder="Jot down notes, lists, summaries here..."
          value={notepadText}
          onChange={(e) => setNotepadText(e.target.value)}
          className="w-full bg-black/40 border border-white/[0.06] rounded-xl p-4 h-48 outline-none focus:border-pink-500/40 text-zinc-300 placeholder:text-zinc-650 font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  );
};
