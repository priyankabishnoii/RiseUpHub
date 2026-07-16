import MarkdownContent from "../../../components/MarkdownContent";
"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, ArrowLeft, Clock, Calendar, Brain,
  Target, Trophy, Star, CheckCircle, Zap, Map,
  Users, AlertCircle, Lightbulb, ChevronDown,
  ChevronUp, Loader2, Sparkles, BookOpen,
  FileText, Globe, TrendingUp, Coffee, Flame,
  ArrowRight, Lock
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

// ── Parse sections ────────────────────────────────────────────────────────────
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

// ── Section config ────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  { key: "OVERVIEW",             title: "Overview & Summary",           icon: Target,      color: "bg-indigo-600",  free: true  },
  { key: "ESTIMATED_COMPLETION", title: "Timeline & Completion Dates",  icon: Calendar,    color: "bg-blue-600",    free: true  },
  { key: "MONTHLY_PLAN",         title: "Monthly Study Plan",           icon: Calendar,    color: "bg-violet-600",  free: true  },
  { key: "WEEKLY_SCHEDULE",      title: "Weekly Schedule",              icon: Clock,       color: "bg-cyan-600",    free: false },
  { key: "DAILY_STUDY_PLAN",     title: "Daily Study Routine",          icon: Coffee,      color: "bg-teal-600",    free: false },
  { key: "SKILLS_ORDER",         title: "Skills in the Right Order",    icon: TrendingUp,  color: "bg-amber-600",   free: true  },
  { key: "PROJECTS",             title: "Hands-on Projects",            icon: Rocket,      color: "bg-pink-600",    free: false },
  { key: "CERTIFICATES",         title: "Certificates to Earn",         icon: Trophy,      color: "bg-yellow-600",  free: false },
  { key: "FREE_RESOURCES",       title: "Free Resources",               icon: BookOpen,    color: "bg-green-600",   free: true  },
  { key: "RECOMMENDED_COURSES",  title: "Recommended Courses",          icon: Star,        color: "bg-orange-600",  free: false },
  { key: "INTERVIEW_PREP",       title: "Interview & Exam Preparation", icon: Brain,       color: "bg-red-600",     free: false },
  { key: "RESUME_MILESTONES",    title: "Resume Milestones",            icon: FileText,    color: "bg-indigo-500",  free: false },
  { key: "PORTFOLIO_MILESTONES", title: "Portfolio Milestones",         icon: Globe,       color: "bg-purple-600",  free: false },
  { key: "INTERNSHIP_PREP",      title: "Internship Preparation",       icon: Users,       color: "bg-blue-500",    free: false },
  { key: "BEGINNER_MISTAKES",    title: "Common Beginner Mistakes",     icon: AlertCircle, color: "bg-rose-600",    free: true  },
  { key: "PRO_TIPS",             title: "Pro Tips & Strategies",        icon: Lightbulb,   color: "bg-amber-500",   free: false },
  { key: "MOTIVATION_STRATEGY",  title: "Motivation & Consistency",     icon: Flame,       color: "bg-violet-500",  free: false },
];

const DIFFICULTY_COLORS = {
  "Beginner":  "text-green-400 bg-green-400/10 border-green-400/20",
  "Easy":      "text-teal-400 bg-teal-400/10 border-teal-400/20",
  "Medium":    "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Hard":      "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Very Hard": "text-red-400 bg-red-400/10 border-red-400/20",
};

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ section, content, isLoggedIn, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const isLocked = !section.free && !isLoggedIn;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      isLocked
        ? "border-white/[0.05] bg-white/[0.01] opacity-75"
        : "border-white/[0.07] bg-white/[0.03]"
    }`}>
      <button
        onClick={() => !isLocked && setOpen(!open)}
        className={`w-full flex items-center gap-0 ${isLocked ? "cursor-not-allowed" : "hover:bg-white/[0.02]"} transition-colors`}
      >
        <div className="flex items-center gap-3 p-5 flex-1 text-left">
          <div className={`w-9 h-9 rounded-xl ${isLocked ? "bg-white/10" : section.color} flex items-center justify-center flex-shrink-0`}>
            {isLocked
              ? <Lock className="w-4 h-4 text-gray-500" />
              : <section.icon className="w-4 h-4 text-white" />
            }
          </div>
          <div>
            <div className={`font-bold text-base ${isLocked ? "text-gray-600" : "text-white"}`}>
              {section.title}
            </div>
            {isLocked && (
              <div className="text-xs text-gray-600 mt-0.5">
                Sign in to unlock this section
              </div>
            )}
          </div>
        </div>
        {!isLocked && (
          <div className="pr-5">
            {open
              ? <ChevronUp className="w-4 h-4 text-gray-500" />
              : <ChevronDown className="w-4 h-4 text-gray-500" />
            }
          </div>
        )}
        {isLocked && (
          <div className="pr-5">
            <Lock className="w-4 h-4 text-gray-700" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[0.05]">
            <div className="mt-4">
              <MarkdownContent content={content} />
            </div>
            </div>{/*<--Added a closing div tag here to fix the JSX structure*/}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BrowseRoadmapPage({ params }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        // Get user (optional - page works without login)
        const { data: { user: u } } = await supabase.auth.getUser();
        setUser(u);

        // Get library roadmap
        const { data, error: err } = await supabase
          .from("roadmap_library")
          .select("*")
          .eq("id", id)
          .single();

        if (err || !data) {
          setError("Roadmap not found.");
        } else {
          setRoadmap(data);
        }
      } catch (e) {
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
          <Rocket className="w-7 h-7 text-white" />
        </div>
        <p className="text-white font-bold">Loading roadmap…</p>
        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <a href="/browse" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Browse Library
        </a>
      </div>
    </div>
  );

  const sections = parseRoadmap(roadmap?.roadmap_content);
  const freeSections = SECTION_CONFIG.filter(s => s.free).length;
  const lockedSections = SECTION_CONFIG.filter(s => !s.free).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/browse")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:block">Library</span>
            </button>
            <div className="h-4 w-px bg-white/10 flex-shrink-0" />
            <span className="font-bold text-sm truncate">{roadmap?.goal}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <a
                href="/generate"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:block">Personalize with AI</span>
                <span className="sm:hidden">Customize</span>
              </a>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
              >
                Sign in to unlock all
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Map className="w-3 h-3" />
            Pre-made Roadmap · RiseUpHub Library
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5 leading-tight">
            {roadmap?.goal}
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${DIFFICULTY_COLORS[roadmap?.difficulty] || DIFFICULTY_COLORS["Medium"]}`}>
              {roadmap?.difficulty}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-gray-400">
              <Clock className="w-3 h-3 text-indigo-400" />{roadmap?.duration}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-gray-400">
              <Brain className="w-3 h-3 text-indigo-400" />{roadmap?.education_required}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-gray-400">
              👁 {roadmap?.views || 0} views
            </div>
          </div>

          {/* Login CTA banner (only for non-logged-in users) */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-600/8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-2 flex-1">
                <Lock className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">{lockedSections} sections locked</div>
                  <div className="text-xs text-gray-400">Sign in free to unlock weekly schedule, projects, interview prep, and more</div>
                </div>
              </div>
              <a
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all whitespace-nowrap"
              >
                Sign in Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          {/* Personalize CTA (for logged-in users) */}
          {user && (
            <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-600/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Want a personalized version?</div>
                  <div className="text-xs text-gray-400">This is a general roadmap. Get one tailored to your exact level, schedule & goals.</div>
                </div>
              </div>
              <a
                href="/generate"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                Personalize with AI
              </a>
            </div>
          )}
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {SECTION_CONFIG.map((section, i) => {
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
                  isLoggedIn={!!user}
                  defaultOpen={section.key === "OVERVIEW" || section.key === "ESTIMATED_COMPLETION"}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-600/5 text-center"
        >
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-2xl font-black mb-2">
            {user ? "Make This Roadmap Yours" : "Unlock Everything + Personalize"}
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            {user
              ? "Generate a 100% personalized version with your exact schedule, level, and goals. Takes 30 seconds."
              : "Sign in free to unlock all sections, then generate a personalized AI roadmap just for you."
            }
          </p>
          <a
            href={user ? "/generate" : "/login"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25"
          >
            {user ? (
              <><Sparkles className="w-5 h-5" /> Generate My Personalized Roadmap</>
            ) : (
              <><ArrowRight className="w-5 h-5" /> Sign in Free to Unlock All</>
            )}
          </a>
        </motion.div>
      </div>
    </div>
  );
}