"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Search, Map, Clock, Brain, Star,
  ArrowRight, Sparkles, Filter, X, Loader2,
  GraduationCap, Briefcase, Code, Globe,
  BookOpen, Award, TrendingUp, Zap
} from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { key: "all", label: "All", icon: Map },
  { key: "After Class 10", label: "After Class 10", icon: GraduationCap },
  { key: "After Class 12", label: "After Class 12", icon: BookOpen },
  { key: "After Graduation", label: "Govt Jobs", icon: Briefcase },
  { key: "Career & Skill Paths", label: "Tech & Skills", icon: Code },
  { key: "International Exams", label: "International", icon: Globe },
  { key: "Engineering & Science PG", label: "Engineering PG", icon: TrendingUp },
  { key: "Human Languages", label: "Languages", icon: Award },
  { key: "Teaching Exams", label: "Teaching", icon: Star },
];

const DIFFICULTY_COLORS = {
  "Beginner": "text-green-400 bg-green-400/10 border-green-400/20",
  "Easy": "text-teal-400 bg-teal-400/10 border-teal-400/20",
  "Medium": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Hard": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Very Hard": "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function BrowsePage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

    const { data, error } = await supabase
  .from("roadmap_library")
  .select("id, goal, category, subcategory, difficulty, duration, education_required, tags, views, is_featured")
  .order("is_featured", { ascending: false })
  .order("views", { ascending: false });

console.log("Library data:", data);
console.log("Library error:", error);
      setRoadmaps(data || []);
      setFiltered(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let result = roadmaps;

    if (category !== "all") {
      result = result.filter(r => r.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.goal.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    setFiltered(result);
  }, [search, category, roadmaps]);

  async function handleView(roadmap) {
    // Increment views
    await supabase.from("roadmap_library")
      .update({ views: (roadmap.views || 0) + 1 })
      .eq("id", roadmap.id);

    router.push(`/browse/${roadmap.id}`);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg">RiseUp<span className="text-indigo-400">Hub</span></span>
          </a>
          <div className="flex items-center gap-3">
            {user ? (
              <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all">
                Dashboard
              </a>
            ) : (
              <a href="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all">
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            {roadmaps.length} Pre-made Roadmaps · Free to Browse
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Browse Roadmap Library
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Find your goal, explore the complete roadmap for free. Want a personalized version? Generate with AI in 30 seconds.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search: JEE, Python, UPSC, IELTS..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-base outline-none focus:border-indigo-500/60 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                category === cat.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 border border-white/8 text-gray-400 hover:text-white"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            {loading ? "Loading..." : `${filtered.length} roadmaps found`}
            {search && <span className="text-indigo-400 font-medium"> for "{search}"</span>}
          </p>
          <a
            href="/generate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-600/10 text-indigo-400 text-sm font-semibold hover:bg-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Custom AI Roadmap
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No roadmaps found</h3>
            <p className="text-gray-500 mb-6">Try a different search or generate a custom AI roadmap</p>
            <a
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </a>
          </div>
        )}

        {/* Roadmap grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => handleView(r)}
                className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-indigo-500/40 hover:bg-white/[0.05] cursor-pointer transition-all group"
              >
                {/* Featured badge */}
                {r.is_featured && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-400">Featured</span>
                  </div>
                )}

                {/* Goal */}
                <h3 className="font-black text-white text-lg mb-2 group-hover:text-indigo-300 transition-colors leading-tight">
                  {r.goal}
                </h3>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${DIFFICULTY_COLORS[r.difficulty] || DIFFICULTY_COLORS["Medium"]}`}>
                    {r.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.duration}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    👁 {r.views || 0} views
                  </span>
                </div>

                {/* Category */}
                <p className="text-xs text-gray-600 mb-4">{r.category} · {r.education_required}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    View Roadmap
                  </span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-10 rounded-3xl border border-indigo-500/20 bg-indigo-600/5 text-center"
        >
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-3">Don't see your goal?</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            Our AI can generate a 100% personalized roadmap for ANY goal — just tell it your details and schedule.
          </p>
          <a
            href={user ? "/generate" : "/login"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25"
          >
            Generate My Custom Roadmap
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}