"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Home, Map, BookOpen, Download, Settings,
  Plus, ChevronRight, Zap, Menu, X, Bell, Search,
  TrendingUp, Award, Code, Globe, Sparkles, ArrowRight,
  Sun, Moon, CreditCard, History, GraduationCap,
  Briefcase, Trophy, LogOut
} from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: "Good Morning", emoji: "🌅" };
  if (h >= 12 && h < 17) return { text: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 21) return { text: "Good Evening", emoji: "🌇" };
  return { text: "Good Night", emoji: "🌙" };
}

function getFirstName(fullName, email) {
  if (fullName) return fullName.split(" ")[0];
  if (email) return email.split("@")[0];
  return "there";
}

// ── SIDEBAR LINKS ─────────────────────────────────────────────────────────────
const SIDEBAR_TOP = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Plus, label: "New Roadmap", href: "/generate", highlight: true },
  { icon: Map, label: "My Roadmaps", href: "/dashboard/roadmaps", badge: "3" },
  { icon: BookOpen, label: "Study Plans", href: "/dashboard/study-plans" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: Download, label: "Downloads", href: "/dashboard/downloads" },
];

const SIDEBAR_BOTTOM = [
  { icon: CreditCard, label: "Credits & Payments", href: "/dashboard/payments" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

// ── QUICK STARTS ──────────────────────────────────────────────────────────────
const QUICK_STARTS = [
  { icon: GraduationCap, label: "Crack JEE Main 2026", tag: "Engineering", color: "from-violet-600 to-indigo-600" },
  { icon: Briefcase, label: "Prepare for UPSC 2026", tag: "Civil Services", color: "from-blue-600 to-cyan-600" },
  { icon: Code, label: "Learn Python from Scratch", tag: "Programming", color: "from-green-600 to-teal-600" },
  { icon: TrendingUp, label: "CAT 2025 Strategy", tag: "MBA", color: "from-orange-600 to-amber-600" },
  { icon: Globe, label: "IELTS 8.0 in 3 months", tag: "International", color: "from-pink-600 to-rose-600" },
  { icon: Award, label: "SSC CGL Complete Guide", tag: "Govt Jobs", color: "from-indigo-600 to-purple-600" },
];

// ── RECENT (mock until DB is ready) ──────────────────────────────────────────
const RECENT = [
  { title: "JEE Main 2026 Roadmap", created: "2 days ago", progress: 35, tag: "Engineering" },
  { title: "Python for Data Science", created: "5 days ago", progress: 68, tag: "Programming" },
  { title: "SSC CGL 2025", created: "1 week ago", progress: 12, tag: "Govt Jobs" },
];

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ dark, collapsed, setCollapsed, mobileOpen, setMobileOpen, user, onLogout }) {
  const firstName = getFirstName(user?.user_metadata?.full_name, user?.email);
  const avatarLetter = firstName[0]?.toUpperCase() || "U";

  const content = (
    <div
      className={`flex flex-col h-full border-r transition-all duration-300 ${
        dark ? "bg-[#111111] border-white/[0.06]" : "bg-gray-50 border-gray-200"
      }`}
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b flex-shrink-0 ${dark ? "border-white/[0.06]" : "border-gray-200"}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none overflow-hidden">
            <span className={`text-base font-black tracking-tight truncate ${dark ? "text-white" : "text-gray-900"}`}>
              RiseUp<span className="text-indigo-500">Hub</span>
            </span>
            <span className="text-[9px] text-indigo-400 font-semibold tracking-widest uppercase">AI Roadmap</span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
        {SIDEBAR_TOP.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              item.highlight
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                : item.active
                ? dark ? "bg-white/8 text-white" : "bg-indigo-50 text-indigo-700"
                : dark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </a>
        ))}
      </nav>

      {/* Bottom links */}
      <div className={`px-2 py-3 border-t flex flex-col gap-1 ${dark ? "border-white/[0.06]" : "border-gray-200"}`}>
        {SIDEBAR_BOTTOM.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              dark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </a>
        ))}

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
            dark ? "text-gray-400 hover:text-red-400 hover:bg-red-500/5" : "text-gray-600 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* User info */}
        <div className={`flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl ${dark ? "bg-white/3" : "bg-gray-100"}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {avatarLetter}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{firstName}</div>
              <div className={`text-xs truncate ${dark ? "text-gray-500" : "text-gray-500"}`}>Free Plan · 2 credits left</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`hidden lg:flex items-center justify-center h-8 border-t text-xs transition-colors ${
          dark ? "border-white/[0.06] text-gray-600 hover:text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-400 hover:text-gray-600"
        }`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <span className="text-[10px] font-medium">Collapse</span>}
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0" style={{ width: collapsed ? 64 : 240 }}>
        {content}
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.div
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────────────────
function Topbar({ dark, setDark, mobileOpen, setMobileOpen }) {
  return (
    <div className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b flex-shrink-0 ${
      dark ? "bg-[#0d0d0d] border-white/[0.06]" : "bg-white border-gray-200"
    }`}>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`lg:hidden w-9 h-9 rounded-lg flex items-center justify-center ${dark ? "text-gray-400 hover:bg-white/8" : "text-gray-600 hover:bg-gray-100"}`}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm flex-1 max-w-sm ${
        dark ? "bg-white/5 border border-white/8 text-gray-500" : "bg-gray-100 border border-gray-200 text-gray-500"
      }`}>
        <Search className="w-4 h-4" />
        <span>Search roadmaps…</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark(!dark)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "text-gray-400 hover:bg-white/8" : "text-gray-500 hover:bg-gray-100"}`}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${dark ? "text-gray-400 hover:bg-white/8" : "text-gray-500 hover:bg-gray-100"}`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        <a
          href="/generate"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          New Roadmap
        </a>
      </div>
    </div>
  );
}

// ── GREETING ──────────────────────────────────────────────────────────────────
function GreetingHeader({ dark, user }) {
  const { text, emoji } = getGreeting();
  const firstName = getFirstName(user?.user_metadata?.full_name, user?.email);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className={`text-sm font-medium mb-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>
            {emoji} {time}
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}>
            {text}, {firstName}! 👋
          </h1>
          <p className={`mt-2 text-base ${dark ? "text-gray-400" : "text-gray-600"}`}>
            Ready to build your roadmap today? You have{" "}
            <span className="text-indigo-400 font-bold">2 generations left</span> today.
          </p>
        </div>
        <a
          href="/generate"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-600/25"
        >
          <Sparkles className="w-4 h-4" />
          Build New Roadmap
        </a>
      </div>
    </motion.div>
  );
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatsRow({ dark }) {
  const stats = [
    { icon: Map, label: "Roadmaps Created", value: "3", color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { icon: Zap, label: "Credits Left Today", value: "2 / 3", color: "text-violet-400", bg: "bg-violet-400/10" },
    { icon: Download, label: "Downloads", value: "1", color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: Trophy, label: "Goals Tracked", value: "3", color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`p-5 rounded-2xl border transition-all ${
            dark ? "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.12]" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <div className={`text-2xl font-black mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{s.value}</div>
          <div className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-500"}`}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ── QUICK START ───────────────────────────────────────────────────────────────
function QuickStart({ dark }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
      <h2 className={`text-lg font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
        What do you want to achieve today?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_STARTS.map((item, i) => (
          <motion.a
            key={i}
            href="/generate"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
              dark ? "bg-white/[0.03] border-white/[0.07] hover:border-indigo-500/40 hover:bg-white/[0.05]" : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{item.label}</div>
              <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>{item.tag}</div>
            </div>
            <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${dark ? "text-gray-600" : "text-gray-400"}`} />
          </motion.a>
        ))}
      </div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`mt-3 flex items-center gap-4 p-4 rounded-2xl border border-dashed cursor-text transition-all ${
          dark ? "border-white/[0.12] hover:border-indigo-500/40 bg-white/[0.02]" : "border-gray-300 hover:border-indigo-400 bg-gray-50"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <span className={`text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
          Type your own goal…{" "}
          <span className="text-indigo-400 font-medium">e.g. "Learn Japanese in 6 months"</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── RECENT ROADMAPS ───────────────────────────────────────────────────────────
function RecentRoadmaps({ dark }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>Recent Roadmaps</h2>
        <a href="/dashboard/roadmaps" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          View all →
        </a>
      </div>
      <div className="flex flex-col gap-3">
        {RECENT.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.07 }}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              dark ? "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.05]" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center flex-shrink-0">
              <Map className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{r.title}</div>
              <div className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-500"}`}>{r.tag} · {r.created}</div>
              <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-gray-200"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.progress}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                />
              </div>
              <div className={`text-[10px] mt-1 ${dark ? "text-gray-600" : "text-gray-400"}`}>{r.progress}% complete</div>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${dark ? "text-gray-600" : "text-gray-400"}`} />
          </motion.div>
        ))}
        <a
          href="/generate"
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed transition-all ${
            dark ? "border-white/[0.08] hover:border-indigo-500/40 text-gray-500 hover:text-indigo-400" : "border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-600"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create a new roadmap</span>
        </a>
      </div>
    </motion.div>
  );
}

// ── ROOT DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? "bg-[#0d0d0d] text-white" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar
        dark={dark}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar dark={dark} setDark={setDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <GreetingHeader dark={dark} user={user} />
            <StatsRow dark={dark} />
            <QuickStart dark={dark} />
            <RecentRoadmaps dark={dark} />
          </div>
        </main>
      </div>
    </div>
  );
}