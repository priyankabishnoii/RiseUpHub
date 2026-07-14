"use client";
import { useState, useEffect, use, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, ArrowLeft, Download, Share2, BookOpen,
  Target, Clock, Calendar, Brain, Trophy, Star,
  CheckCircle, Zap, Map, Users, AlertCircle, Lightbulb,
  ChevronDown, ChevronUp, Loader2, Circle, Lock,
  Youtube, Globe, FileText, Coffee, Flame, Award,
  Bell, TrendingUp, Clipboard, CheckSquare, Square,
  Sparkles, Shield, Copy, Camera
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

// ── Parse roadmap into structured sections ────────────────────────────────────
function parseRoadmap(content) {
  if (!content) return {};
  const sections = {};
  const sectionKeys = [
    "OVERVIEW", "ESTIMATED_COMPLETION", "MONTHLY_PLAN", "WEEKLY_SCHEDULE",
    "DAILY_STUDY_PLAN", "SKILLS_ORDER", "FREE_RESOURCES", "RECOMMENDED_COURSES",
    "PROJECTS", "CERTIFICATES", "INTERVIEW_PREP", "RESUME_MILESTONES",
    "PORTFOLIO_MILESTONES", "INTERNSHIP_PREP", "BEGINNER_MISTAKES",
    "PRO_TIPS", "MOTIVATION_STRATEGY"
  ];
  sectionKeys.forEach((key, i) => {
    const startMarker = `---${key}---`;
    const nextKey = sectionKeys[i + 1];
    const endMarker = nextKey ? `---${nextKey}---` : null;
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return;
    const contentStart = startIdx + startMarker.length;
    const endIdx = endMarker ? content.indexOf(endMarker) : content.length;
    sections[key] = content.slice(contentStart, endIdx === -1 ? content.length : endIdx).trim();
  });
  return sections;
}

// ── Section config with categories ───────────────────────────────────────────
const SECTION_CONFIG = [
  // Overview
  { key: "OVERVIEW", title: "Overview & Summary", icon: Target, color: "bg-indigo-600", category: "overview", emoji: "🎯", points: 5 },
  { key: "ESTIMATED_COMPLETION", title: "Timeline & Completion Dates", icon: Calendar, color: "bg-blue-600", category: "overview", emoji: "📅", points: 5 },

  // Study Plans
  { key: "MONTHLY_PLAN", title: "Monthly Study Plan", icon: Calendar, color: "bg-violet-600", category: "plans", emoji: "📆", points: 20 },
  { key: "WEEKLY_SCHEDULE", title: "Weekly Schedule", icon: Clock, color: "bg-cyan-600", category: "plans", emoji: "🗓️", points: 15 },
  { key: "DAILY_STUDY_PLAN", title: "Daily Study Routine", icon: Coffee, color: "bg-teal-600", category: "plans", emoji: "☀️", points: 15 },

  // Learning Path
  { key: "SKILLS_ORDER", title: "Skills in the Right Order", icon: TrendingUp, color: "bg-amber-600", category: "learning", emoji: "📈", points: 20 },
  { key: "PROJECTS", title: "Hands-on Projects", icon: Rocket, color: "bg-pink-600", category: "learning", emoji: "🚀", points: 25 },
  { key: "CERTIFICATES", title: "Certificates to Earn", icon: Trophy, color: "bg-yellow-600", category: "learning", emoji: "🏆", points: 15 },

  // Resources
  { key: "FREE_RESOURCES", title: "Free Resources", icon: BookOpen, color: "bg-green-600", category: "resources", emoji: "📚", points: 10 },
  { key: "RECOMMENDED_COURSES", title: "Recommended Courses", icon: Star, color: "bg-orange-600", category: "resources", emoji: "⭐", points: 10 },

  // Career
  { key: "INTERVIEW_PREP", title: "Interview & Exam Preparation", icon: Brain, color: "bg-red-600", category: "career", emoji: "🧠", points: 25 },
  { key: "RESUME_MILESTONES", title: "Resume Milestones", icon: FileText, color: "bg-indigo-500", category: "career", emoji: "📄", points: 20 },
  { key: "PORTFOLIO_MILESTONES", title: "Portfolio Milestones", icon: Globe, color: "bg-purple-600", category: "career", emoji: "🌐", points: 20 },
  { key: "INTERNSHIP_PREP", title: "Internship Preparation", icon: Users, color: "bg-blue-500", category: "career", emoji: "💼", points: 20 },

  // Wisdom
  { key: "BEGINNER_MISTAKES", title: "Common Beginner Mistakes", icon: AlertCircle, color: "bg-rose-600", category: "wisdom", emoji: "⚠️", points: 10 },
  { key: "PRO_TIPS", title: "Pro Tips & Insider Strategies", icon: Lightbulb, color: "bg-amber-500", category: "wisdom", emoji: "💡", points: 15 },
  { key: "MOTIVATION_STRATEGY", title: "Motivation & Consistency", icon: Flame, color: "bg-violet-500", category: "wisdom", emoji: "🔥", points: 10 },
];

const CATEGORIES = [
  { key: "all", label: "All Sections", emoji: "📋" },
  { key: "overview", label: "Overview", emoji: "🎯" },
  { key: "plans", label: "Study Plans", emoji: "📆" },
  { key: "learning", label: "Learning Path", emoji: "📈" },
  { key: "resources", label: "Resources", emoji: "📚" },
  { key: "career", label: "Career", emoji: "💼" },
  { key: "wisdom", label: "Tips & Wisdom", emoji: "💡" },
];

// ── Copy/Screenshot Protection ────────────────────────────────────────────────
function useProtection(userEmail) {
  useEffect(() => {
    // Disable right click
    const noRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", noRightClick);

    // Disable copy
    const noCopy = (e) => {
      e.preventDefault();
      alert("⚠️ Content is protected. Copying is not allowed.");
    };
    document.addEventListener("copy", noCopy);

    // Disable keyboard shortcuts for copy/print/screenshot
    const noShortcuts = (e) => {
      // Block Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+U, F12, PrintScreen
      if (
        (e.ctrlKey && ["c", "p", "s", "u", "a"].includes(e.key.toLowerCase())) ||
        e.key === "PrintScreen" ||
        e.key === "F12"
      ) {
        e.preventDefault();
        if (e.key === "PrintScreen") {
          alert("⚠️ Screenshots are disabled for protected content.");
        }
      }
    };
    document.addEventListener("keydown", noShortcuts);

    // Blur on visibility change (tab switch for screenshot tools)
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(10px)";
      } else {
        document.body.style.filter = "none";
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // CSS protection
    const style = document.createElement("style");
    style.innerHTML = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", noRightClick);
      document.removeEventListener("copy", noCopy);
      document.removeEventListener("keydown", noShortcuts);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.head.removeChild(style);
    };
  }, []);
}

// ── Watermark ─────────────────────────────────────────────────────────────────
function Watermark({ email }) {
  if (!email) return null;
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-white/[0.04] text-sm font-bold select-none whitespace-nowrap"
          style={{
            top: `${(i * 12) % 100}%`,
            left: `${(i * 17) % 80}%`,
            transform: "rotate(-30deg)",
          }}
        >
          {email} • RiseUpHub
        </div>
      ))}
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 60 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#6366f1" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ── Points Toast ──────────────────────────────────────────────────────────────
function PointsToast({ points, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-600/40"
        >
          <Zap className="w-5 h-5 text-yellow-300" />
          +{points} points earned! 🎉
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Section Card with Tracking ────────────────────────────────────────────────
function SectionCard({ section, content, completed, onToggle, userPoints }) {
  const [open, setOpen] = useState(section.key === "OVERVIEW" || section.key === "ESTIMATED_COMPLETION");

  return (
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        completed
          ? "border-indigo-500/40 bg-indigo-600/5"
          : "border-white/[0.07] bg-white/[0.03]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-0">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(section.key, section.points)}
          className="flex-shrink-0 p-4 hover:bg-white/5 transition-colors group"
          title={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed ? (
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg border-2 border-white/20 group-hover:border-indigo-500/60 transition-colors flex items-center justify-center">
              <Circle className="w-3 h-3 text-white/20 group-hover:text-indigo-400 transition-colors" />
            </div>
          )}
        </button>

        {/* Title button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-3 py-4 pr-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className={`w-9 h-9 rounded-xl ${section.color} flex items-center justify-center flex-shrink-0`}>
            <section.icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm sm:text-base truncate ${completed ? "line-through text-gray-500" : "text-white"}`}>
              {section.emoji} {section.title}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">+{section.points} pts when completed</div>
          </div>
          {completed && (
            <span className="hidden sm:block text-xs font-semibold text-indigo-400 bg-indigo-600/10 px-2 py-1 rounded-lg flex-shrink-0">
              ✓ Done
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          }
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[0.05]">
              <div className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap protected-content">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Daily Check-in Button ─────────────────────────────────────────────────────
function DailyCheckin({ supabase, userId, onCheckin }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkToday() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("daily_checkins")
        .select("id")
        .eq("user_id", userId)
        .eq("checkin_date", today)
        .single();
      if (data) setChecked(true);
    }
    if (userId) checkToday();
  }, [userId]);

  async function handleCheckin() {
    if (checked || loading) return;
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    // Insert checkin
    const { error } = await supabase
      .from("daily_checkins")
      .insert({ user_id: userId, checkin_date: today, points_earned: 10 });

    if (!error) {
      // Update points
      const { data: existing } = await supabase
        .from("user_points")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existing) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        const newStreak = existing.last_checkin === yStr ? existing.current_streak + 1 : 1;

        await supabase.from("user_points").update({
          total_points: existing.total_points + 10,
          current_streak: newStreak,
          longest_streak: Math.max(existing.longest_streak, newStreak),
          last_checkin: today,
        }).eq("user_id", userId);
      } else {
        await supabase.from("user_points").insert({
          user_id: userId,
          total_points: 10,
          current_streak: 1,
          longest_streak: 1,
          last_checkin: today,
        });
      }

      setChecked(true);
      onCheckin(10);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleCheckin}
      disabled={checked || loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
        checked
          ? "bg-green-600/15 border border-green-500/30 text-green-400 cursor-default"
          : "bg-amber-600/15 border border-amber-500/30 text-amber-400 hover:bg-amber-600/25 hover:scale-105"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Flame className="w-4 h-4" />
      )}
      {checked ? "✓ Checked in today!" : "Daily Check-in (+10 pts)"}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RoadmapPage({ params }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({});
  const [userPoints, setUserPoints] = useState({ total_points: 0, current_streak: 0 });
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPointsToast, setShowPointsToast] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Protection
  useProtection(user?.email);

  // Load everything
  useEffect(() => {
    if (!id) return;
    async function loadAll() {
      try {
        // Get user
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) { router.push("/login"); return; }
        setUser(u);

        // Get roadmap
        const { data: rm, error: rmErr } = await supabase
          .from("roadmaps").select("*").eq("id", id).single();
        if (rmErr || !rm) { setError("Roadmap not found."); setLoading(false); return; }
        setRoadmap(rm);

        // Get progress
        const { data: prog } = await supabase
          .from("roadmap_progress")
          .select("*")
          .eq("roadmap_id", id)
          .eq("user_id", u.id);

        if (prog) {
          const progressMap = {};
          prog.forEach(p => { progressMap[p.section_key] = p.completed; });
          setProgress(progressMap);
        }

        // Get points
        const { data: pts } = await supabase
          .from("user_points").select("*").eq("user_id", u.id).single();
        if (pts) setUserPoints(pts);

      } catch (e) {
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [id]);

  // Toggle section completion
  const handleToggle = useCallback(async (sectionKey, points) => {
    if (!user) return;
    const isCompleted = !progress[sectionKey];

    // Optimistic update
    setProgress(prev => ({ ...prev, [sectionKey]: isCompleted }));

    // Save to DB
    const { error } = await supabase
      .from("roadmap_progress")
      .upsert({
        user_id: user.id,
        roadmap_id: id,
        section_key: sectionKey,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      }, { onConflict: "user_id,roadmap_id,section_key" });

    if (!error && isCompleted) {
      // Award points
      const { data: existing } = await supabase
        .from("user_points").select("*").eq("user_id", user.id).single();

      if (existing) {
        await supabase.from("user_points")
          .update({ total_points: existing.total_points + points })
          .eq("user_id", user.id);
        setUserPoints(prev => ({ ...prev, total_points: prev.total_points + points }));
      } else {
        await supabase.from("user_points")
          .insert({ user_id: user.id, total_points: points, current_streak: 0, longest_streak: 0 });
        setUserPoints(prev => ({ ...prev, total_points: points }));
      }

      // Show toast
      setLastPoints(points);
      setShowPointsToast(true);
      setTimeout(() => setShowPointsToast(false), 2500);
    }
  }, [user, id, progress]);

  const handleCheckin = useCallback((pts) => {
    setUserPoints(prev => ({ ...prev, total_points: prev.total_points + pts }));
    setLastPoints(pts);
    setShowPointsToast(true);
    setTimeout(() => setShowPointsToast(false), 2500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 animate-pulse">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <p className="text-white font-bold text-lg">Loading your roadmap…</p>
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-bold text-lg mb-2">{error}</p>
          <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const sections = parseRoadmap(roadmap?.roadmap_content);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSections = SECTION_CONFIG.filter(s => sections[s.key]).length;
  const completionPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  const filteredSections = activeCategory === "all"
    ? SECTION_CONFIG
    : SECTION_CONFIG.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Watermark */}
      <Watermark email={user?.email} />

      {/* Points toast */}
      <PointsToast points={lastPoints} show={showPointsToast} />

      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:block">Dashboard</span>
            </button>
            <div className="h-4 w-px bg-white/10 flex-shrink-0" />
            <span className="font-bold text-sm truncate text-white">{roadmap?.goal}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Points display */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">{userPoints.total_points} pts</span>
            </div>
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm">{userPoints.current_streak} day streak</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:scale-105">
              <Download className="w-4 h-4" />
              <span className="hidden sm:block">Download ₹50</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <Shield className="w-3 h-3" />
                Protected Roadmap · Watermarked
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
                {roadmap?.goal}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: Clock, label: roadmap?.hours_per_day },
                  { icon: Calendar, label: roadmap?.months },
                  { icon: Brain, label: roadmap?.level },
                  { icon: BookOpen, label: roadmap?.learning_style },
                ].filter(i => i.label).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-gray-400">
                    <item.icon className="w-3 h-3 text-indigo-400" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Daily checkin */}
              {user && (
                <DailyCheckin
                  supabase={supabase}
                  userId={user.id}
                  onCheckin={handleCheckin}
                />
              )}
            </div>

            {/* Progress ring */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] min-w-[160px]">
              <div className="relative">
                <ProgressRing percent={completionPercent} size={80} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-white">{completionPercent}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-white">{completedCount}/{totalSections}</div>
                <div className="text-xs text-gray-500">sections done</div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 font-bold text-xs">{userPoints.total_points} pts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Section cards */}
        <div className="flex flex-col gap-3">
          {filteredSections.map((section, i) => {
            const content = sections[section.key];
            if (!content) return null;
            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <SectionCard
                  section={section}
                  content={content}
                  completed={!!progress[section.key]}
                  onToggle={handleToggle}
                  userPoints={userPoints}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Completion celebration */}
        {completionPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-8 rounded-3xl border border-yellow-500/30 bg-yellow-600/5 text-center"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-black text-yellow-400 mb-2">Roadmap Complete!</h3>
            <p className="text-gray-400 text-sm mb-4">You've completed all sections. Amazing dedication!</p>
            <div className="text-3xl font-black text-white">{userPoints.total_points} pts earned total</div>
          </motion.div>
        )}

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-600/5 text-center"
        >
          <Download className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-2xl font-black mb-2">Download Your Roadmap</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Get a beautifully formatted PDF and Word document. Study offline, print it, or share with your mentor.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25">
            <Download className="w-5 h-5" />
            Download PDF & Word — ₹50
          </button>
        </motion.div>
      </div>
    </div>
  );
}