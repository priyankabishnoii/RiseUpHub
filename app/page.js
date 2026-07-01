"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  Clock,
  Users,
  Star,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  CheckCircle,
  Zap,
  Download,
  Map,
  Brain,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const STATS = [
  { value: "50+", label: "Career Paths" },
  { value: "200+", label: "Exam Roadmaps" },
  { value: "10K+", label: "Students Helped" },
  { value: "98%", label: "Satisfaction Rate" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Personalization",
    desc: "Claude AI analyzes your background, skills, and goals to build a roadmap made only for you — not a generic template.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Map,
    title: "Month-by-Month Roadmap",
    desc: "Clear monthly milestones so you always know exactly what to study next. No more confusion about where to start.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Clock,
    title: "Adapts to Your Schedule",
    desc: "Whether you have 1 hour/day or 8 hours/day, the plan adjusts automatically with realistic completion dates.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Free Resources Only",
    desc: "Every roadmap includes free YouTube channels, websites, books, and practice platforms. No paid courses needed.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Trophy,
    title: "Interview & Resume Ready",
    desc: "Get interview prep tips, resume milestones, portfolio projects, and internship guidance baked into your plan.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Download,
    title: "Download PDF & Word",
    desc: "Premium users can download beautifully formatted PDF and DOCX roadmaps to save, print, or share.",
    color: "from-orange-500 to-amber-500",
  },
];

const CATEGORIES = [
  { icon: GraduationCap, label: "After Class 10", count: "30+ paths", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { icon: BookOpen, label: "After Class 12", count: "40+ paths", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { icon: Briefcase, label: "Government Jobs", count: "50+ exams", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { icon: Brain, label: "MBA & Management", count: "10+ exams", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { icon: Code, label: "Programming", count: "15+ languages", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { icon: Globe, label: "International Exams", count: "20+ exams", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell Us About Yourself",
    desc: "Answer a few simple questions: your education, current skills, goal exam or career, daily study hours, and learning style.",
  },
  {
    step: "02",
    title: "AI Builds Your Roadmap",
    desc: "Claude AI processes your answers and generates a complete, personalized roadmap in under 30 seconds.",
  },
  {
    step: "03",
    title: "Follow Your Plan",
    desc: "Get your month-wise plan, daily schedule, resource list, and milestone tracker. Save it, download it, crush it.",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    highlight: false,
    features: [
      "3 roadmap generations per day",
      "Online roadmap viewer",
      "Month-wise study plan",
      "Free resource recommendations",
      "Save up to 3 roadmaps",
      "Basic interview tips",
    ],
    cta: "Start Free",
    ctaStyle: "border border-white/20 hover:bg-white/5",
  },
  {
    name: "Premium",
    price: "₹49",
    period: "per month",
    highlight: true,
    features: [
      "Everything in Free",
      "Download as PDF",
      "Download as Word (DOCX)",
      "Professional formatting",
      "Unlimited saves",
      "Priority AI generation",
      "Full interview prep guide",
      "Resume & portfolio milestones",
    ],
    cta: "Get Premium",
    ctaStyle: "bg-indigo-600 hover:bg-indigo-500",
  },
];

const FAQS = [
  {
    q: "Is RiseUpHub really free?",
    a: "Yes! You get 3 free roadmap generations every 24 hours. The free plan gives you the full online roadmap. You only pay if you want to download it as a PDF or Word file.",
  },
  {
    q: "Which exams and careers does it cover?",
    a: "We cover 200+ paths including JEE, NEET, UPSC, SSC, Banking, MBA entrances (CAT/XAT), CA/CS, IELTS, GRE, programming languages, government jobs after Class 10/12, and much more.",
  },
  {
    q: "How accurate is the AI roadmap?",
    a: "We use Claude claude-sonnet-4-6 (Anthropic's latest AI) which is trained on massive educational data. Every roadmap is reviewed against real exam patterns and learning timelines.",
  },
  {
    q: "Can I use it if I'm a complete beginner?",
    a: "Absolutely! That's exactly who we built this for. Just tell the AI your current level and it will start from the very basics, step by step.",
  },
  {
    q: "What if my goal isn't in the dropdown?",
    a: "You can type any custom goal in the 'Other' field and our AI will generate a roadmap for it. We cover virtually any educational or career goal.",
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? dark
            ? "bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-xl"
            : "bg-white/90 backdrop-blur-md border-b border-black/10 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>
              RiseUp<span className="text-indigo-500">Hub</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  dark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg transition-colors ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/10 text-gray-600"
              }`}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="/login"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </a>
            <a
              href="/generate"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Build My Roadmap
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              dark ? "bg-gray-950 border-white/10" : "bg-white border-black/10"
            }`}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={() => setDark(!dark)}
                  className={`p-2 rounded-lg ${dark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <a href="/login" className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                  Login
                </a>
                <a
                  href="/generate"
                  className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Build My Roadmap
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection({ dark }) {
  const words = ["JEE", "UPSC", "CAT", "NEET", "GATE", "SSC CGL", "IELTS", "CA Foundation"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Powered by Claude AI · Built for achievers.
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Your Personal Roadmap
          <br />
          to Crack{" "}
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-indigo-500"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Tell us your goal, your schedule, and your current level. Our AI builds a
          complete month-by-month study plan with free resources, projects, and
          interview prep — in under 30 seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="/generate"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-105"
          >
            Build My Free Roadmap
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 border ${
              dark
                ? "border-white/20 text-white hover:bg-white/5"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold text-indigo-400`}>{s.value}</div>
              <div className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className={`w-6 h-6 ${dark ? "text-gray-600" : "text-gray-400"}`} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection({ dark }) {
  return (
    <section className={`py-16 ${dark ? "bg-gray-950/50" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className={`text-sm font-semibold uppercase tracking-widest mb-3 text-indigo-500`}>
            200+ Roadmaps Available
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            Whatever Your Goal, We've Got You
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${cat.color} ${
                dark ? "bg-opacity-10" : ""
              }`}
            >
              <cat.icon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">{cat.label}</div>
              <div className="text-xs opacity-70 mt-1">{cat.count}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ dark }) {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-indigo-500">
            Features
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
            Not Just Another Study Plan
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-600"}`}>
            Every roadmap is built specifically for you your level, your schedule, your goal.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-2xl border transition-all ${
                dark
                  ? "bg-gray-900 border-white/10 hover:border-indigo-500/50"
                  : "bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-semibold text-lg mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({ dark }) {
  return (
    <section id="how-it-works" className={`py-24 ${dark ? "bg-gray-950/50" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-indigo-500">
            How It Works
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            Your Roadmap in 3 Simple Steps
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />

          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/30">
                <span className="text-white font-bold text-lg">{step.step}</span>
              </div>
              <h3 className={`font-semibold text-xl mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <a
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-600/30"
          >
            Start Building Now — It's Free
            <Zap className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection({ dark }) {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-indigo-500">
            Pricing
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
            Simple, Honest Pricing
          </h2>
          <p className={`text-lg ${dark ? "text-gray-400" : "text-gray-600"}`}>
            No subscriptions. No hidden fees. Pay only when you want to download.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {PRICING.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all ${
                plan.highlight
                  ? "border-indigo-500 bg-indigo-600/10 shadow-xl shadow-indigo-600/20"
                  : dark
                  ? "border-white/10 bg-gray-900"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-xl mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlight ? "text-indigo-400" : dark ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-indigo-400" : "text-green-500"}`} />
                    <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/generate"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.ctaStyle} text-white`}
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

function FAQSection({ dark }) {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className={`py-24 ${dark ? "bg-gray-950/50" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-indigo-500">FAQ</p>
          <h2 className={`text-3xl sm:text-4xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border overflow-hidden ${
                dark ? "border-white/10 bg-gray-900" : "border-gray-200 bg-white"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className={`font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    open === i ? "rotate-180 text-indigo-400" : dark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`px-6 pb-4 text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                      {faq.a}
                    </p>
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

function CTASection({ dark }) {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-12 rounded-3xl border overflow-hidden ${
            dark ? "border-indigo-500/30 bg-indigo-600/10" : "border-indigo-200 bg-indigo-50"
          }`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎓", "🧑‍💼", "👩‍🔬", "🧑‍🏫"].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-900 flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className={`text-sm ml-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Loved by 10,000+ students
              </span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
              Your Roadmap is Waiting.
              <br />
              Build It in 30 Seconds.
            </h2>
            <p className={`text-lg mb-8 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Free to start. No credit card. No signup required for your first roadmap.
            </p>
            <a
              href="/generate"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-indigo-600/30"
            >
              Build My Roadmap Free
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
    <footer className={`border-t py-12 ${dark ? "border-white/10 bg-gray-950" : "border-gray-200 bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>
                RiseUp<span className="text-indigo-500">Hub</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
              AI-powered career roadmaps and study plans for every Indian student. Free to start, powerful to use.
            </p>
          </div>

          <div>
            <h4 className={`font-semibold text-sm mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "How It Works", "FAQ"].map((l) => (
                <li key={l}>
                  <a href="#" className={`text-sm hover:text-indigo-400 transition-colors ${dark ? "text-gray-500" : "text-gray-500"}`}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold text-sm mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Use", "Refund Policy", "Contact Us"].map((l) => (
                <li key={l}>
                  <a href="#" className={`text-sm hover:text-indigo-400 transition-colors ${dark ? "text-gray-500" : "text-gray-500"}`}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${dark ? "border-white/10" : "border-gray-200"}`}>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
            © 2026 RiseUpHub. Made with ❤️ in India.
          </p>
          <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
            Powered by Claude AI · Razorpay Payments · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark bg-gray-950 text-white" : "bg-white text-gray-900"}>
      <Navbar dark={dark} setDark={setDark} />
      <HeroSection dark={dark} />
      <CategoriesSection dark={dark} />
      <FeaturesSection dark={dark} />
      <HowItWorksSection dark={dark} />
      <PricingSection dark={dark} />
      <FAQSection dark={dark} />
      <CTASection dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}