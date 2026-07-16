"use client";
import { useState, useEffect, use, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, ArrowLeft, Download, Clock, Calendar,
  Brain, Trophy, Star, CheckCircle, Zap, Map,
  Users, AlertCircle, Lightbulb, ChevronDown,
  ChevronUp, Loader2, Circle, Flame, FileText,
  Globe, TrendingUp, Coffee, Shield, BookOpen, Target
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import MarkdownContent from "../../../components/MarkdownContent";

// ── PROTECTION ────────────────────────────────────────────────────────────────
function useProtection() {
  useEffect(() => {
    const noRightClick = (e) => e.preventDefault();
    const noCopy = (e) => {
      e.preventDefault();
      alert("⚠️ Content is protected. Copying is not allowed.");
    };
    const noKeys = (e) => {
      if (
        (e.ctrlKey && ["c","p","s","u","a"].includes(e.key.toLowerCase())) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };
    const onBlur = () => { document.body.style.filter = "blur(8px)"; };
    const onFocus = () => { document.body.style.filter = "none"; };

    document.addEventListener("contextmenu", noRightClick);
    document.addEventListener("copy", noCopy);
    document.addEventListener("keydown", noKeys);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    const style = document.createElement("style");
    style.id = "protection-style";
    style.innerHTML = `
      .protected { user-select: none; -webkit-user-select: none; }
      @media print { body { display: none !important; } }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", noRightClick);
      document.removeEventListener("copy", noCopy);
      document.removeEventListener("keydown", noKeys);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      const s = document.getElementById("protection-style");
      if (s) document.head.removeChild(s);
    };
  }, []);
}

// ── WATERMARK ─────────────────────────────────────────────────────────────────
function Watermark({ email }) {
  if (!email) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-white/[0.035] text-xs font-bold select-none whitespace-nowrap"
          style={{
            top: `${(i * 9) % 100}%`,
            left: `${(i * 13) % 85}%`,
            transform: "rotate(-25deg)",
          }}
        >
          {email} · RiseUpHub.com
        </div>
      ))}
    </div>
  );
}

// ── PARSE ROADMAP ─────────────────────────────────────────────────────────────
function parseRoadmap(content) {
  if (!content) return {};
  const sections = {};
  const sectionKeys = [
    "OVERVIEW","ESTIMATED_COMPLETION","MONTHLY_PLAN","WEEKLY_SCHEDULE",
    "DAILY_STUDY_PLAN","SKILLS_ORDER","FREE_RESOURCES","RECOMMENDED_COURSES",
    "PROJECTS","CERTIFICATES","INTERVIEW_PREP","RESUME_MILESTONES",
    "PORTFOLIO_MILESTONES","INTERNSHIP_PREP","BEGINNER_MISTAKES",
    "PRO_TIPS","MOTIVATION_STRATEGY"
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

// ── SECTION CONFIG ────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  { key: "OVERVIEW",             title: "Overview & Summary",           icon: Target,      color: "bg-indigo-600",  category: "overview",  emoji: "🎯", points: 5  },
  { key: "ESTIMATED_COMPLETION", title: "Timeline & Completion Dates",  icon: Calendar,    color: "bg-blue-600",    category: "overview",  emoji: "📅", points: 5  },
  { key: "MONTHLY_PLAN",         title: "Monthly Study Plan",           icon: Calendar,    color: "bg-violet-600",  category: "plans",     emoji: "📆", points: 20 },
  { key: "WEEKLY_SCHEDULE",      title: "Weekly Schedule",              icon: Clock,       color: "bg-cyan-600",    category: "plans",     emoji: "🗓️", points: 15 },
  { key: "DAILY_STUDY_PLAN",     title: "Daily Study Routine",          icon: Coffee,      color: "bg-teal-600",    category: "plans",     emoji: "☀️", points: 15 },
  { key: "SKILLS_ORDER",         title: "Skills in the Right Order",    icon: TrendingUp,  color: "bg-amber-600",   category: "learning",  emoji: "📈", points: 20 },
  { key: "PROJECTS",             title: "Hands-on Projects",            icon: Rocket,      color: "bg-pink-600",    category: "learning",  emoji: "🚀", points: 25 },
  { key: "CERTIFICATES",         title: "Certificates to Earn",         icon: Trophy,      color: "bg-yellow-600",  category: "learning",  emoji: "🏆", points: 15 },
  { key: "FREE_RESOURCES",       title: "Free Resources",               icon: BookOpen,    color: "bg-green-600",   category: "resources", emoji: "📚", points: 10 },
  { key: "RECOMMENDED_COURSES",  title: "Recommended Courses",          icon: Star,        color: "bg-orange-600",  category: "resources", emoji: "⭐", points: 10 },
  { key: "INTERVIEW_PREP",       title: "Interview & Exam Preparation", icon: Brain,       color: "bg-red-600",     category: "career",    emoji: "🧠", points: 25 },
  { key: "RESUME_MILESTONES",    title: "Resume Milestones",            icon: FileText,    color: "bg-indigo-500",  category: "career",    emoji: "📄", points: 20 },
  { key: "PORTFOLIO_MILESTONES", title: "Portfolio Milestones",         icon: Globe,       color: "bg-purple-600",  category: "career",    emoji: "🌐", points: 20 },
  { key: "INTERNSHIP_PREP",      title: "Internship Preparation",       icon: Users,       color: "bg-blue-500",    category: "career",    emoji: "💼", points: 20 },
  { key: "BEGINNER_MISTAKES",    title: "Common Beginner Mistakes",     icon: AlertCircle, color: "bg-rose-600",    category: "wisdom",    emoji: "⚠️", points: 10 },
  { key: "PRO_TIPS",             title: "Pro Tips & Strategies",        icon: Lightbulb,   color: "bg-amber-500",   category: "wisdom",    emoji: "💡", points: 15 },
  { key: "MOTIVATION_STRATEGY",  title: "Motivation & Consistency",     icon: Flame,       color: "bg-violet-500",  category: "wisdom",    emoji: "🔥", points: 10 },
];

const CATEGORIES = [
  { key: "all",       label: "All",          emoji: "📋" },
  { key: "overview",  label: "Overview",     emoji: "🎯" },
  { key: "plans",     label: "Study Plans",  emoji: "📆" },
  { key: "learning",  label: "Learning",     emoji: "📈" },
  { key: "resources", label: "Resources",    emoji: "📚" },
  { key: "career",    label: "Career",       emoji: "💼" },
  { key: "wisdom",    label: "Tips",         emoji: "💡" },
];

// ── PROGRESS RING ─────────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 80 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#6366f1" strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ── POINTS TOAST ──────────────────────────────────────────────────────────────
function PointsToast({ points, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-600/40 pointer-events-none"
        >
          <Zap className="w-5 h-5 text-yellow-300" />
          +{points} points earned! 🎉
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── DAILY CHECK-IN ────────────────────────────────────────────────────────────
function DailyCheckin({ supabase, userId, onCheckin }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("daily_checkins")
        .select("id")
        .eq("user_id", userId)
        .eq("checkin_date", today)
        .single();
      if (data) setChecked(true);
    }
    if (userId) check();
  }, [userId]);

  async function handle() {
    if (checked || loading) return;
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase
      .from("daily_checkins")
      .insert({ user_id: userId, checkin_date: today, points_earned: 10 });

    if (!error) {
      const { data: pts } = await supabase
        .from("user_points").select("*").eq("user_id", userId).single();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];

      if (pts) {
        const newStreak = pts.last_checkin === yStr ? pts.current_streak + 1 : 1;
        await supabase.from("user_points").update({
          total_points: pts.total_points + 10,
          current_streak: newStreak,
          longest_streak: Math.max(pts.longest_streak, newStreak),
          last_checkin: today,
        }).eq("user_id", userId);
      } else {
        await supabase.from("user_points").insert({
          user_id: userId, total_points: 10,
          current_streak: 1, longest_streak: 1, last_checkin: today,
        });
      }
      setChecked(true);
      onCheckin(10);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handle}
      disabled={checked || loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
        checked
          ? "bg-green-600/15 border border-green-500/30 text-green-400 cursor-default"
          : "bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 hover:scale-105"
      }`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
      {checked ? "✓ Checked in today! +10 pts" : "Daily Check-in (+10 pts)"}
    </button>
  );
}

// ── SECTION CARD WITH MARKDOWN ────────────────────────────────────────────────
function SectionCard({ section, content, sectionCompleted, onSectionToggle, roadmapId, supabase, userId, onPointsEarned }) {
  const defaultOpen = ["OVERVIEW", "ESTIMATED_COMPLETION", "MONTHLY_PLAN"].includes(section.key);
  const [open, setOpen] = useState(defaultOpen);
  const [itemStates, setItemStates] = useState({});

  // Load saved item checkboxes
  useEffect(() => {
    async function load() {
      if (!userId || !roadmapId) return;
      const { data } = await supabase
        .from("roadmap_progress")
        .select("section_key, completed")
        .eq("roadmap_id", roadmapId)
        .eq("user_id", userId)
        .like("section_key", `${section.key}__item__%`);
      if (data) {
        const map = {};
        data.forEach(d => { map[d.section_key] = d.completed; });
        setItemStates(map);
      }
    }
    load();
  }, [section.key, roadmapId, userId]);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      sectionCompleted
        ? "border-indigo-500/40 bg-indigo-600/5"
        : "border-white/[0.07] bg-white/[0.03]"
    }`}>
      {/* Header */}
      <div className="flex items-center">
        {/* Section checkbox */}
        <button
          onClick={() => onSectionToggle(section.key, section.points)}
          className="flex-shrink-0 p-4 hover:bg-white/5 transition-colors group"
          title={sectionCompleted ? "Mark incomplete" : "Mark section complete"}
        >
          {sectionCompleted ? (
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg border-2 border-white/20 group-hover:border-indigo-500/60 transition-colors" />
          )}
        </button>

        {/* Title */}
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-3 py-4 pr-5 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className={`w-9 h-9 rounded-xl ${section.color} flex items-center justify-center flex-shrink-0`}>
            <section.icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm sm:text-base ${sectionCompleted ? "line-through text-gray-500" : "text-white"}`}>
              {section.emoji} {section.title}
            </div>
            <div className="text-[11px] text-gray-600 mt-0.5">+{section.points} pts when completed</div>
          </div>
          {sectionCompleted && (
            <span className="hidden sm:block text-xs font-bold text-indigo-400 bg-indigo-600/10 border border-indigo-500/20 px-2 py-1 rounded-lg flex-shrink-0">
              ✓ Complete
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          }
        </button>
      </div>

      {/* Content with MARKDOWN */}
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
              <div className="mt-4 protected">
                <MarkdownContent content={content} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function RoadmapPage({ params }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sectionProgress, setSectionProgress] = useState({});
  const [userPoints, setUserPoints] = useState({ total_points: 0, current_streak: 0 });
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showToast, setShowToast] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useProtection();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) { router.push("/login"); return; }
        setUser(u);

        const { data: rm, error: rmErr } = await supabase
          .from("roadmaps").select("*").eq("id", id).single();
        if (rmErr || !rm) { setError("Roadmap not found."); setLoading(false); return; }
        setRoadmap(rm);

        const { data: prog } = await supabase
          .from("roadmap_progress").select("*")
          .eq("roadmap_id", id).eq("user_id", u.id)
          .not("section_key", "like", `%__item__%`);
        if (prog) {
          const map = {};
          prog.forEach(p => { map[p.section_key] = p.completed; });
          setSectionProgress(map);
        }

        const { data: pts } = await supabase
          .from("user_points").select("*").eq("user_id", u.id).single();
        if (pts) setUserPoints(pts);
      } catch (e) {
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const showPointsToast = useCallback((pts) => {
    setLastPoints(pts);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  const handleSectionToggle = useCallback(async (sectionKey, points) => {
    if (!user) return;
    const isCompleted = !sectionProgress[sectionKey];
    setSectionProgress(prev => ({ ...prev, [sectionKey]: isCompleted }));

    await supabase.from("roadmap_progress").upsert({
      user_id: user.id, roadmap_id: id, section_key: sectionKey,
      completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    }, { onConflict: "user_id,roadmap_id,section_key" });

    if (isCompleted) {
      const { data: pts } = await supabase
        .from("user_points").select("*").eq("user_id", user.id).single();
      if (pts) {
        await supabase.from("user_points")
          .update({ total_points: pts.total_points + points })
          .eq("user_id", user.id);
        setUserPoints(prev => ({ ...prev, total_points: prev.total_points + points }));
      } else {
        await supabase.from("user_points")
          .insert({ user_id: user.id, total_points: points, current_streak: 0, longest_streak: 0 });
        setUserPoints(prev => ({ ...prev, total_points: points }));
      }
      showPointsToast(points);
    }
  }, [user, id, sectionProgress]);

  const handleCheckin = useCallback((pts) => {
    setUserPoints(prev => ({ ...prev, total_points: prev.total_points + pts }));
    showPointsToast(pts);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
          <Rocket className="w-7 h-7 text-white" />
        </div>
        <p className="text-white font-bold">Loading your roadmap…</p>
        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <a href="/dashboard" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </a>
      </div>
    </div>
  );

  const sections = parseRoadmap(roadmap?.roadmap_content);
  const completedSections = Object.values(sectionProgress).filter(Boolean).length;
  const totalSections = SECTION_CONFIG.filter(s => sections[s.key]).length;
  const overallPercent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
  const filtered = activeCategory === "all"
    ? SECTION_CONFIG
    : SECTION_CONFIG.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Watermark email={user?.email} />
      <PointsToast points={lastPoints} show={showToast} />

      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:block">Dashboard</span>
            </button>
            <div className="h-4 w-px bg-white/10 flex-shrink-0" />
            <span className="font-bold text-sm truncate">{roadmap?.goal}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">{userPoints.total_points} pts</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm">{userPoints.current_streak}🔥</span>
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
                Protected · Watermarked
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
                {roadmap?.goal}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: Clock, label: roadmap?.hours_per_day },
                  { icon: Calendar, label: roadmap?.months },
                  { icon: Brain, label: roadmap?.level },
                ].filter(i => i.label).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-gray-400">
                    <item.icon className="w-3 h-3 text-indigo-400" />{item.label}
                  </div>
                ))}
              </div>
              {user && <DailyCheckin supabase={supabase} userId={user.id} onCheckin={handleCheckin} />}
            </div>

            {/* Progress ring */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] min-w-[160px]">
              <div className="relative">
                <ProgressRing percent={overallPercent} size={80} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{overallPercent}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">{completedSections}/{totalSections} sections</div>
                <div className="text-xs text-gray-500">completed</div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 font-bold text-xs">{userPoints.total_points} pts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tip box */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/15 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-indigo-400 font-bold">Tip:</span> Use the big checkbox on the left to mark an entire section complete and earn points. Filter sections using the tabs below.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 border border-white/8 text-gray-400 hover:text-white"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Section cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((section, i) => {
            const content = sections[section.key];
            if (!content) return null;
            return (
              <motion.div key={section.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <SectionCard
                  section={section}
                  content={content}
                  sectionCompleted={!!sectionProgress[section.key]}
                  onSectionToggle={handleSectionToggle}
                  roadmapId={id}
                  supabase={supabase}
                  userId={user?.id}
                  onPointsEarned={() => {}}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Completion */}
        {overallPercent === 100 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-8 rounded-3xl border border-yellow-500/30 bg-yellow-600/5 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-black text-yellow-400 mb-2">Roadmap Complete!</h3>
            <p className="text-gray-400 text-sm">Amazing dedication!</p>
            <div className="text-3xl font-black mt-3">{userPoints.total_points} total points</div>
          </motion.div>
        )}

        {/* Download CTA */}
        <div className="mt-8 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-600/5 text-center">
          <Download className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-2xl font-black mb-2">Download Your Roadmap</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Beautifully formatted PDF and Word document. Study offline, print it, or share with your mentor.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25">
            <Download className="w-5 h-5" />
            Download PDF & Word — ₹50
          </button>
        </div>
      </div>
    </div>
  );
}