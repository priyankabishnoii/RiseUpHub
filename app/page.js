"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, BookOpen, Target, Trophy,
  Clock, Star, ChevronDown, Moon, Sun, Menu, X,
  CheckCircle, Zap, Download, Map, Brain, GraduationCap,
  Briefcase, Code, Globe, TrendingUp, Users, Award,
  Rocket, BarChart3, FileText, MessageSquare
} from "lucide-react";

// ── ROTATING WORDS ────────────────────────────────────────────────────────────
const GOALS = [
  "Crack JEE Advanced",
  "Clear UPSC CSE",
  "Ace CAT 2025",
  "Pass CA Final",
  "Learn Python",
  "Crack NEET PG",
  "Get into IIM",
  "Clear GATE",
  "Master Data Science",
  "Clear SSC CGL",
  "Learn Japanese",
  "Crack IELTS 8+",
];

// ── STATS ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "200+", label: "Career & Exam Paths" },
  { value: "30 sec", label: "To Generate Roadmap" },
  { value: "₹0", label: "To Get Started" },
  { value: "10K+", label: "Roadmaps Created" },
];

// ── FEATURES ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "Built for You, Not Everyone",
    desc: "Answer 7 questions. Get a roadmap that matches your exact level, schedule, and goal whether you're a student, a working professional, or a complete beginner.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Map,
    title: "Month-by-Month Clarity",
    desc: "No more guessing what to study next. Get a clear monthly plan with weekly breakdowns and daily tasks tailored to your available hours.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Clock,
    title: "Adapts to Your Time",
    desc: "Studying 1 hour/day or 8 hours/day? The AI recalculates everything completion dates, milestones, and pace based on your real schedule.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Trophy,
    title: "Interview, Resume & Portfolio",
    desc: "Every roadmap includes interview prep, resume milestones, portfolio project ideas, and internship guidance built in not as an afterthought.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    desc: "Books, YouTube channels, courses, practice platforms, and affiliate recommended tools hand picked and ordered so you never waste time searching.",
    gradient: "from-green-500 to-teal-600",
  },
  {
    icon: Download,
    title: "Download & Keep Forever",
    desc: "Premium users get beautifully formatted PDF and Word documents perfect for printing, sharing with mentors, or tracking offline.",
    gradient: "from-pink-500 to-rose-600",
  },
];

// ── WHO IT'S FOR ──────────────────────────────────────────────────────────────
const WHO_FOR = [
  { icon: GraduationCap, label: "Class 10 & 12 Students", sub: "JEE, NEET, CLAT, NDA, Boards" },
  { icon: Briefcase, label: "Working Professionals", sub: "Career switch, upskilling, MBA" },
  { icon: Code, label: "Tech Learners", sub: "Python, DSA, Web Dev, AI/ML" },
  { icon: Globe, label: "International Aspirants", sub: "GRE, IELTS, SAT, GMAT, TOEFL" },
  { icon: Award, label: "Govt Job Seekers", sub: "UPSC, SSC, Banking, Railways" },
  { icon: TrendingUp, label: "Self-Learners", sub: "Any skill, any language, any goal" },
];

// ── ROADMAP CATEGORIES ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "After Class 10", count: "30+ paths", color: "border-violet-500/30 hover:border-violet-500/70 hover:bg-violet-500/5" },
  { label: "After Class 12", count: "40+ paths", color: "border-blue-500/30 hover:border-blue-500/70 hover:bg-blue-500/5" },
  { label: "Government Jobs", count: "50+ exams", color: "border-green-500/30 hover:border-green-500/70 hover:bg-green-500/5" },
  { label: "Engineering & GATE", count: "15+ paths", color: "border-cyan-500/30 hover:border-cyan-500/70 hover:bg-cyan-500/5" },
  { label: "MBA Entrances", count: "CAT, XAT, SNAP…", color: "border-orange-500/30 hover:border-orange-500/70 hover:bg-orange-500/5" },
  { label: "Medical & NEET", count: "UG + PG paths", color: "border-red-500/30 hover:border-red-500/70 hover:bg-red-500/5" },
  { label: "CA / CS / CFA", count: "10+ cert paths", color: "border-yellow-500/30 hover:border-yellow-500/70 hover:bg-yellow-500/5" },
  { label: "Programming", count: "15+ languages", color: "border-purple-500/30 hover:border-purple-500/70 hover:bg-purple-500/5" },
  { label: "International Exams", count: "GRE, IELTS, SAT…", color: "border-pink-500/30 hover:border-pink-500/70 hover:bg-pink-500/5" },
  { label: "Language Learning", count: "20+ languages", color: "border-teal-500/30 hover:border-teal-500/70 hover:bg-teal-500/5" },
  { label: "Teaching (CTET…)", count: "State + Central", color: "border-indigo-500/30 hover:border-indigo-500/70 hover:bg-indigo-500/5" },
  { label: "Custom Goal ✨", count: "Type anything", color: "border-white/20 hover:border-white/50 hover:bg-white/5" },
];

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
const STEPS = [
  { title: "Tell us about yourself", desc: "Your education, skills, goal, daily hours, and learning style. Takes 2 minutes." },
  { title: "AI builds your roadmap", desc: "Our AI generates a complete month-by-month plan with resources, projects, and milestones in under 30 seconds." },
  { title: "Follow. Track. Succeed.", desc: "Save your roadmap, download it, track progress, and update it anytime as your goals evolve." },
];

// ── PRICING ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Free",
    price: "₹0",
    sub: "Always free",
    highlight: false,
    features: [
      "3 roadmap generations / day",
      "Full online roadmap viewer",
      "Month-wise & weekly plan",
      "Curated resources & books",
      "Save up to 5 roadmaps",
      "Interview prep summary",
    ],
    cta: "Start for Free",
  },
  {
    name: "Premium",
    price: "₹49",
    sub: "Per month (cancel anytime)",
    highlight: true,
    features: [
      "Everything in Free",
      "Download as PDF",
      "Download as Word (DOCX)",
      "Professional layout & formatting",
      "Unlimited saves",
      "Full interview guide",
      "Resume & portfolio milestones",
      "Beginner mistakes & pro tips",
    ],
    cta: "Download Roadmap",
  },
];

// ── FAQS ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is this only for students?",
    a: "No! RiseUpHub is for anyone who wants to learn or grow. Students preparing for JEE, professionals switching careers, people learning new languages or skills the AI adapts to whoever you are.",
  },
  {
    q: "What exams and goals does it cover?",
    a: "200+ paths including JEE, NEET, UPSC, SSC, Banking, CAT, GATE, CA Foundation, IELTS, GRE, Python, Data Science, Web Development, language learning, government jobs after Class 10 or 12, and much more. You can also type any custom goal.",
  },
  {
    q: "How accurate is the roadmap?",
    a: "Very accurate. The AI is trained on real exam patterns, syllabus data, and learning timelines. Every roadmap is tailored to your specific level beginner, intermediate, or advanced.",
  },
  {
    q: "Are the recommended resources free?",
    a: "We recommend the best resources for your goal including free YouTube channels, websites, and books, as well as premium courses when they're worth it. We also include affiliate recommended tools that we genuinely believe in.",
  },
  {
    q: "Can I update my roadmap later?",
    a: "Yes. You can regenerate a new roadmap any time your goal, schedule, or level changes. Your saved roadmaps stay in your dashboard.",
  },
  {
    q: "What's in the ₹50 premium download?",
    a: "A professionally formatted PDF and Word document with your complete roadmap every month, week, day, resource, project, and milestone. Printable, shareable, and beautifully designed.",
  },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg = dark
    ? scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
    : scrolled ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.08] shadow-sm" : "bg-transparent";

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${bg}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[68px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <Rocket className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
              RiseUp<span className="text-indigo-500">Hub</span>
            </span>
            <span className="text-[10px] font-medium text-indigo-400 tracking-widest uppercase">AI Roadmap Builder</span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
            <a key={label} href={href} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "hover:bg-white/8 text-gray-400" : "hover:bg-black/5 text-gray-500"}`}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="/login" className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${dark ? "text-gray-300 hover:text-white hover:bg-white/8" : "text-gray-700 hover:bg-black/5"}`}>
            Sign in
          </a>
          <a href="/login" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all hover:scale-105 shadow-lg shadow-indigo-600/25">
            Get Started Free
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setDark(!dark)} className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? "text-gray-400" : "text-gray-600"}`}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? "text-gray-300" : "text-gray-700"}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${dark ? "bg-[#0a0a0a] border-white/[0.06]" : "bg-white border-black/[0.08]"}`}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMobileOpen(false)} className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{label}</a>
              ))}
              <div className="pt-3 border-t border-white/[0.06] flex gap-3">
                <a href="/login" className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border ${dark ? "border-white/15 text-white" : "border-gray-300 text-gray-700"}`}>Sign in</a>
                <a href="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white">Get Started</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero({ dark }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % GOALS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep gradient */}
        <div className={`absolute inset-0 ${dark ? "bg-[#0a0a0a]" : "bg-white"}`} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-32 left-1/4 w-72 h-72 bg-violet-600/15 rounded-full blur-[80px]" />
        <div className="absolute top-32 right-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dark
              ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-6 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-400 text-xs font-semibold tracking-wide mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered · 200+ Paths · Free to Start
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className={`text-5xl sm:text-6xl lg:text-[80px] font-black tracking-tighter leading-[1.05] mb-4 ${dark ? "text-white" : "text-gray-950"}`}
        >
          Your Personal
          <br />
          Roadmap to
        </motion.h1>

        {/* Animated goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="h-[80px] sm:h-[90px] lg:h-[110px] flex items-center justify-center mb-6 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.35 }}
              className="text-5xl sm:text-6xl lg:text-[80px] font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent block"
            >
              {GOALS[idx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 ${dark ? "text-gray-400" : "text-gray-600"}`}
        >
          Tell us your goal and schedule. Get a complete month by month plan with resources, projects, and milestones in 30 seconds. For students, professionals, and lifelong learners.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <a
            href="/login"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-500/40"
          >
            Build My Roadmap — Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg border transition-all hover:scale-105 ${dark ? "border-white/15 text-white hover:bg-white/5" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34 }}
          className={`grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto py-8 border-t border-b ${dark ? "border-white/[0.06]" : "border-gray-100"}`}
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-indigo-400 mb-1">{s.value}</div>
              <div className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-500"}`}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className={`w-5 h-5 ${dark ? "text-gray-600" : "text-gray-400"}`} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function WhoFor({ dark }) {
  return (
    <section className={`py-20 ${dark ? "bg-white/[0.02]" : "bg-gray-50/80"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">Who It's For</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}>
            Not Just for Students for every achiever.
          </h2>
          <p className={`mt-3 text-base max-w-xl mx-auto ${dark ? "text-gray-500" : "text-gray-500"}`}>
            Whether you're 16 or 45, RiseUpHub builds a roadmap for where you are and where you want to go.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {WHO_FOR.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`p-5 rounded-2xl border text-center cursor-default transition-all ${dark ? "border-white/8 bg-white/3 hover:bg-white/6 hover:border-indigo-500/40" : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center mx-auto mb-3">
                <w.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div className={`text-sm font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{w.label}</div>
              <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>{w.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories({ dark }) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">200+ Roadmaps</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}>
            Whatever Your Goal
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              className={`px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${cat.color} ${dark ? "bg-transparent" : "bg-white"}`}
            >
              <div className={`text-sm font-semibold ${dark ? "text-gray-200" : "text-gray-800"}`}>{cat.label}</div>
              <div className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-500"}`}>{cat.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ dark }) {
  return (
    <section id="features" className={`py-24 ${dark ? "bg-white/[0.02]" : "bg-gray-50/80"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">Features</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 ${dark ? "text-white" : "text-gray-950"}`}>
            A Roadmap That Actually Works
          </h2>
          <p className={`text-base max-w-xl mx-auto ${dark ? "text-gray-500" : "text-gray-500"}`}>
            Not a generic PDF. A living, personalized plan built specifically for your level, goal, and schedule.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className={`p-7 rounded-2xl border transition-all ${dark ? "bg-white/[0.03] border-white/[0.07] hover:border-indigo-500/40 hover:bg-white/[0.05]" : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg"}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold text-lg mb-2.5 ${dark ? "text-white" : "text-gray-900"}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ dark }) {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">How It Works</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}>
            From Zero to Roadmap in 3 Steps
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`flex gap-6 p-7 rounded-2xl border transition-all ${dark ? "bg-white/[0.03] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/25">
                <span className="text-white font-black text-lg">{i + 1}</span>
              </div>
              <div>
                <h3 className={`font-bold text-xl mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/25">
            Start Now — Free
            <Zap className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Pricing({ dark }) {
  return (
    <section id="pricing" className={`py-24 ${dark ? "bg-white/[0.02]" : "bg-gray-50/80"}`}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">Pricing</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 ${dark ? "text-white" : "text-gray-950"}`}>
            Honest, Simple Pricing
          </h2>
          <p className={`text-base ${dark ? "text-gray-500" : "text-gray-500"}`}>
            with monthly subscription.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all ${
                plan.highlight
                  ? "border-indigo-500/50 bg-indigo-600/8 shadow-2xl shadow-indigo-600/15"
                  : dark ? "border-white/[0.07] bg-white/[0.03]" : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wide shadow-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-7">
                <div className={`text-sm font-bold mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{plan.name}</div>
                <div className={`text-5xl font-black mb-1 ${plan.highlight ? "text-indigo-400" : dark ? "text-white" : "text-gray-950"}`}>{plan.price}</div>
                <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>{plan.sub}</div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-400" : "text-green-500"}`} />
                    <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                    : dark ? "bg-white/8 hover:bg-white/12 text-white border border-white/10" : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ dark }) {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-3">FAQ</p>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${dark ? "text-white" : "text-gray-950"}`}>
            Questions Answered
          </h2>
        </motion.div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border overflow-hidden ${dark ? "border-white/[0.07] bg-white/[0.03]" : "border-gray-200 bg-white"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className={`font-semibold text-sm pr-4 ${dark ? "text-white" : "text-gray-900"}`}>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-indigo-400" : dark ? "text-gray-500" : "text-gray-400"}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`px-6 pb-5 text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ dark }) {
  return (
    <section className={`py-24 ${dark ? "bg-white/[0.02]" : "bg-gray-50/80"}`}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-14 rounded-3xl border text-center overflow-hidden ${dark ? "border-indigo-500/20 bg-indigo-600/5" : "border-indigo-100 bg-indigo-50"}`}
        >
          {/* glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="relative">
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${dark ? "text-white" : "text-gray-950"}`}>
              Your Roadmap is
              <br />
              One Click Away.
            </h2>
            <p className={`text-lg mb-10 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Free to start. No credit card. Your first roadmap in under 30 seconds.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30"
            >
              Build My Roadmap — Free
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer({ dark }) {
  return (
    <footer className={`border-t py-14 ${dark ? "border-white/[0.06] bg-[#0a0a0a]" : "border-gray-200 bg-white"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-lg font-black ${dark ? "text-white" : "text-gray-900"}`}>RiseUp<span className="text-indigo-500">Hub</span></div>
                <div className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">AI Roadmap Builder</div>
              </div>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
              Personalized AI roadmaps for students, professionals, and lifelong learners. Whatever your goal we have a plan.
            </p>
          </div>
          <div>
            <h4 className={`text-sm font-bold mb-5 ${dark ? "text-white" : "text-gray-900"}`}>Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "How It Works", "FAQ"].map(l => (
                <li key={l}><a href="#" className={`text-sm transition-colors hover:text-indigo-400 ${dark ? "text-gray-500" : "text-gray-500"}`}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`text-sm font-bold mb-5 ${dark ? "text-white" : "text-gray-900"}`}>Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Use", "Refund Policy", "Contact"].map(l => (
                <li key={l}><a href="#" className={`text-sm transition-colors hover:text-indigo-400 ${dark ? "text-gray-500" : "text-gray-500"}`}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${dark ? "border-white/[0.06]" : "border-gray-200"}`}>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>© 2026 RiseUpHub. Made with ❤️ in India.</p>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── ROOT PAGE ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [dark, setDark] = useState(true);

  return (
    <div className={`min-h-screen ${dark ? "bg-[#0a0a0a] text-white" : "bg-white text-gray-900"}`}>
      <Navbar dark={dark} setDark={setDark} />
      <Hero dark={dark} />
      <WhoFor dark={dark} />
      <Categories dark={dark} />
      <Features dark={dark} />
      <HowItWorks dark={dark} />
      <Pricing dark={dark} />
      <FAQ dark={dark} />
      <FinalCTA dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}