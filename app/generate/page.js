"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Search, ChevronDown, ChevronRight, ChevronLeft,
  Check, Sparkles, Clock, Calendar, Brain, Target,
  BookOpen, User, Zap, X, Loader2
} from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

// ── ALL 200+ EXAM & CAREER PATHS ─────────────────────────────────────────────
const ALL_PATHS = [
  // After Class 10
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NMMS (National Means-cum-Merit Scholarship)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NTSE (National Talent Search Exam)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "SOF Olympiads" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "IOQM (Math Olympiad)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NSEJS (Junior Science)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NSEP (Physics)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NSEC (Chemistry)" },
  { category: "After Class 10 — Scholarships & Talent Exams", label: "NSEA (Astronomy)" },
  { category: "After Class 10 — Diploma / Polytechnic", label: "AP POLYCET" },
  { category: "After Class 10 — Diploma / Polytechnic", label: "TS POLYCET" },
  { category: "After Class 10 — Diploma / Polytechnic", label: "JEECUP (UP Polytechnic)" },
  { category: "After Class 10 — Diploma / Polytechnic", label: "Delhi CET" },
  { category: "After Class 10 — Diploma / Polytechnic", label: "State Diploma Entrance" },
  { category: "After Class 10 — Government Jobs", label: "India Post GDS" },
  { category: "After Class 10 — Government Jobs", label: "SSC MTS" },
  { category: "After Class 10 — Government Jobs", label: "SSC GD Constable" },
  { category: "After Class 10 — Government Jobs", label: "Railway Group D" },
  { category: "After Class 10 — Government Jobs", label: "State Police Constable" },
  { category: "After Class 10 — Government Jobs", label: "Forest Guard" },
  { category: "After Class 10 — Government Jobs", label: "Agniveer (Army)" },
  { category: "After Class 10 — Government Jobs", label: "Agniveer (Navy)" },
  { category: "After Class 10 — Government Jobs", label: "Agniveer (Air Force)" },
  { category: "After Class 10 — Government Jobs", label: "BSF Constable" },
  { category: "After Class 10 — Government Jobs", label: "CRPF Constable" },
  { category: "After Class 10 — Government Jobs", label: "CISF Constable" },

  // After Class 12 — Engineering
  { category: "After Class 12 — Engineering", label: "JEE Main" },
  { category: "After Class 12 — Engineering", label: "JEE Advanced (IIT)" },
  { category: "After Class 12 — Engineering", label: "BITSAT (BITS Pilani)" },
  { category: "After Class 12 — Engineering", label: "VITEEE" },
  { category: "After Class 12 — Engineering", label: "SRMJEEE" },
  { category: "After Class 12 — Engineering", label: "KIITEE" },
  { category: "After Class 12 — Engineering", label: "COMEDK UGET" },
  { category: "After Class 12 — Engineering", label: "WBJEE" },
  { category: "After Class 12 — Engineering", label: "MHT CET" },
  { category: "After Class 12 — Engineering", label: "KCET" },
  { category: "After Class 12 — Engineering", label: "AP EAMCET" },
  { category: "After Class 12 — Engineering", label: "TS EAMCET" },
  { category: "After Class 12 — Engineering", label: "KEAM" },
  { category: "After Class 12 — Engineering", label: "GUJCET" },

  // After Class 12 — Medical
  { category: "After Class 12 — Medical", label: "NEET UG" },
  { category: "After Class 12 — Medical", label: "AIIMS (through NEET)" },
  { category: "After Class 12 — Medical", label: "JIPMER (through NEET)" },

  // After Class 12 — Law
  { category: "After Class 12 — Law", label: "CLAT" },
  { category: "After Class 12 — Law", label: "AILET" },
  { category: "After Class 12 — Law", label: "SLAT" },
  { category: "After Class 12 — Law", label: "MH CET Law" },
  { category: "After Class 12 — Law", label: "LSAT India" },

  // After Class 12 — Management
  { category: "After Class 12 — Management", label: "IPMAT (IIM Indore/Rohtak)" },
  { category: "After Class 12 — Management", label: "NPAT (NMIMS)" },
  { category: "After Class 12 — Management", label: "SET (Symbiosis)" },
  { category: "After Class 12 — Management", label: "CUET UG (BBA)" },

  // After Class 12 — Design & Architecture
  { category: "After Class 12 — Design & Architecture", label: "NID DAT" },
  { category: "After Class 12 — Design & Architecture", label: "UCEED" },
  { category: "After Class 12 — Design & Architecture", label: "NIFT Entrance" },
  { category: "After Class 12 — Design & Architecture", label: "NATA" },
  { category: "After Class 12 — Design & Architecture", label: "JEE Paper 2 (B.Arch)" },

  // After Class 12 — Other
  { category: "After Class 12 — Defence & Other", label: "NDA (National Defence Academy)" },
  { category: "After Class 12 — Defence & Other", label: "TES (Technical Entry Scheme)" },
  { category: "After Class 12 — Defence & Other", label: "NCHM JEE (Hotel Management)" },
  { category: "After Class 12 — Defence & Other", label: "ICAR AIEEA (Agriculture)" },
  { category: "After Class 12 — Commerce", label: "CA Foundation" },
  { category: "After Class 12 — Commerce", label: "CSEET (CS Foundation)" },
  { category: "After Class 12 — Commerce", label: "CMA Foundation" },

  // After Graduation — SSC
  { category: "After Graduation — SSC", label: "SSC CGL" },
  { category: "After Graduation — SSC", label: "SSC CPO" },
  { category: "After Graduation — SSC", label: "SSC JE" },
  { category: "After Graduation — SSC", label: "SSC Selection Post" },
  { category: "After Graduation — SSC", label: "SSC CHSL" },

  // After Graduation — Banking
  { category: "After Graduation — Banking", label: "IBPS PO" },
  { category: "After Graduation — Banking", label: "IBPS Clerk" },
  { category: "After Graduation — Banking", label: "IBPS SO" },
  { category: "After Graduation — Banking", label: "SBI PO" },
  { category: "After Graduation — Banking", label: "SBI Clerk" },
  { category: "After Graduation — Banking", label: "RBI Grade B" },
  { category: "After Graduation — Banking", label: "RBI Assistant" },
  { category: "After Graduation — Banking", label: "NABARD Grade A" },
  { category: "After Graduation — Banking", label: "SIDBI Grade A" },

  // After Graduation — Railways
  { category: "After Graduation — Railways", label: "RRB NTPC" },
  { category: "After Graduation — Railways", label: "RRB JE" },
  { category: "After Graduation — Railways", label: "RRB ALP" },
  { category: "After Graduation — Railways", label: "RRB Technician" },

  // After Graduation — Insurance
  { category: "After Graduation — Insurance", label: "LIC AAO" },
  { category: "After Graduation — Insurance", label: "LIC ADO" },
  { category: "After Graduation — Insurance", label: "NIACL AO" },
  { category: "After Graduation — Insurance", label: "NICL AO" },

  // After Graduation — UPSC
  { category: "After Graduation — UPSC", label: "UPSC Civil Services (IAS/IPS/IFS)" },
  { category: "After Graduation — UPSC", label: "UPSC Engineering Services (ESE)" },
  { category: "After Graduation — UPSC", label: "UPSC Combined Medical Services" },
  { category: "After Graduation — UPSC", label: "UPSC CAPF" },
  { category: "After Graduation — UPSC", label: "UPSC Indian Forest Service" },
  { category: "After Graduation — UPSC", label: "EPFO EO/AO" },

  // After Graduation — Defence
  { category: "After Graduation — Defence", label: "CDS (Combined Defence Services)" },
  { category: "After Graduation — Defence", label: "AFCAT" },
  { category: "After Graduation — Defence", label: "INET (Navy)" },
  { category: "After Graduation — Defence", label: "Coast Guard Assistant Commandant" },

  // After Graduation — State Govt
  { category: "After Graduation — State Government", label: "State PCS (any state)" },
  { category: "After Graduation — State Government", label: "State SI (Sub Inspector)" },
  { category: "After Graduation — State Government", label: "State Forest Officer" },
  { category: "After Graduation — State Government", label: "State AE / JE" },

  // Engineering & Science PG
  { category: "Engineering & Science PG", label: "GATE" },
  { category: "Engineering & Science PG", label: "JAM (IIT MSc)" },
  { category: "Engineering & Science PG", label: "JEST" },
  { category: "Engineering & Science PG", label: "TIFR GS" },
  { category: "Engineering & Science PG", label: "CSIR NET" },
  { category: "Engineering & Science PG", label: "UGC NET" },
  { category: "Engineering & Science PG", label: "NEST" },
  { category: "Engineering & Science PG", label: "IISER IAT" },

  // MBA
  { category: "MBA Entrance", label: "CAT" },
  { category: "MBA Entrance", label: "XAT" },
  { category: "MBA Entrance", label: "SNAP" },
  { category: "MBA Entrance", label: "NMAT" },
  { category: "MBA Entrance", label: "CMAT" },
  { category: "MBA Entrance", label: "MAT" },
  { category: "MBA Entrance", label: "ATMA" },
  { category: "MBA Entrance", label: "MAH MBA CET" },
  { category: "MBA Entrance", label: "IIFT" },

  // Medical PG
  { category: "Medical PG", label: "NEET PG" },
  { category: "Medical PG", label: "INI CET" },
  { category: "Medical PG", label: "FMGE (Foreign Medical Graduates)" },
  { category: "Medical PG", label: "AIAPGET (Ayurveda)" },

  // Research & PhD
  { category: "Research & PhD", label: "UGC NET (JRF)" },
  { category: "Research & PhD", label: "CSIR NET (JRF)" },
  { category: "Research & PhD", label: "DBT BET" },
  { category: "Research & PhD", label: "ICMR JRF" },
  { category: "Research & PhD", label: "ICAR NET" },

  // Chartered Professional
  { category: "Chartered Professional Exams", label: "CA Foundation → Intermediate → Final" },
  { category: "Chartered Professional Exams", label: "CS (CSEET → Executive → Professional)" },
  { category: "Chartered Professional Exams", label: "CMA Foundation → Intermediate → Final" },
  { category: "Chartered Professional Exams", label: "CFA (Level 1, 2, 3)" },
  { category: "Chartered Professional Exams", label: "FRM (Part 1 & 2)" },
  { category: "Chartered Professional Exams", label: "Actuarial Exams" },

  // Teaching
  { category: "Teaching Exams", label: "CTET" },
  { category: "Teaching Exams", label: "UPTET" },
  { category: "Teaching Exams", label: "REET" },
  { category: "Teaching Exams", label: "HTET" },
  { category: "Teaching Exams", label: "KVS Teacher" },
  { category: "Teaching Exams", label: "NVS Teacher" },
  { category: "Teaching Exams", label: "DSSSB Teacher" },

  // Judiciary
  { category: "Judiciary", label: "Judicial Services (Civil Judge)" },
  { category: "Judiciary", label: "AIBE (Bar Exam)" },

  // Aviation
  { category: "Civil Aviation", label: "DGCA CPL (Commercial Pilot)" },
  { category: "Civil Aviation", label: "AFCAT Flying Branch" },
  { category: "Civil Aviation", label: "AME CET (Aircraft Maintenance)" },

  // Merchant Navy
  { category: "Merchant Navy", label: "IMU CET" },
  { category: "Merchant Navy", label: "Sponsorship / Deck Cadet" },

  // International
  { category: "International — English Proficiency", label: "IELTS" },
  { category: "International — English Proficiency", label: "TOEFL" },
  { category: "International — English Proficiency", label: "PTE Academic" },
  { category: "International — English Proficiency", label: "Duolingo English Test" },
  { category: "International — Undergraduate", label: "SAT" },
  { category: "International — Undergraduate", label: "ACT" },
  { category: "International — Undergraduate", label: "UCAT (Medicine UK)" },
  { category: "International — Undergraduate", label: "LNAT (Law UK)" },
  { category: "International — Graduate", label: "GRE" },
  { category: "International — Graduate", label: "GMAT" },
  { category: "International — Graduate", label: "MCAT (Medicine USA)" },
  { category: "International — Graduate", label: "LSAT (Law USA)" },
  { category: "International — Finance", label: "CFA" },
  { category: "International — Finance", label: "FRM" },
  { category: "International — Finance", label: "CPA (USA)" },
  { category: "International — Finance", label: "ACCA (UK)" },
  { category: "International — Finance", label: "CIMA" },

  // Olympiads
  { category: "International Olympiads", label: "International Mathematical Olympiad (IMO)" },
  { category: "International Olympiads", label: "International Physics Olympiad (IPhO)" },
  { category: "International Olympiads", label: "International Chemistry Olympiad (IChO)" },
  { category: "International Olympiads", label: "International Biology Olympiad (IBO)" },
  { category: "International Olympiads", label: "International Olympiad in Informatics (IOI)" },
  { category: "International Olympiads", label: "International Astronomy Olympiad" },

  // Tech Certifications
  { category: "Tech & Cloud Certifications", label: "AWS Certified Solutions Architect" },
  { category: "Tech & Cloud Certifications", label: "Microsoft Azure Fundamentals / Associate" },
  { category: "Tech & Cloud Certifications", label: "Google Cloud Professional" },
  { category: "Tech & Cloud Certifications", label: "Cisco CCNA" },
  { category: "Tech & Cloud Certifications", label: "Cisco CCNP" },
  { category: "Tech & Cloud Certifications", label: "CompTIA Security+" },

  // Programming Languages
  { category: "Programming Languages", label: "Python" },
  { category: "Programming Languages", label: "JavaScript" },
  { category: "Programming Languages", label: "Java" },
  { category: "Programming Languages", label: "C++" },
  { category: "Programming Languages", label: "C" },
  { category: "Programming Languages", label: "Go (Golang)" },
  { category: "Programming Languages", label: "C#" },
  { category: "Programming Languages", label: "TypeScript" },
  { category: "Programming Languages", label: "Rust" },
  { category: "Programming Languages", label: "Kotlin" },
  { category: "Programming Languages", label: "Swift" },
  { category: "Programming Languages", label: "PHP" },
  { category: "Programming Languages", label: "SQL" },
  { category: "Programming Languages", label: "R" },

  // Human Languages
  { category: "Human Languages", label: "English (Fluency)" },
  { category: "Human Languages", label: "Spanish" },
  { category: "Human Languages", label: "French" },
  { category: "Human Languages", label: "German" },
  { category: "Human Languages", label: "Japanese" },
  { category: "Human Languages", label: "Korean" },
  { category: "Human Languages", label: "Mandarin Chinese" },
  { category: "Human Languages", label: "Italian" },
  { category: "Human Languages", label: "Portuguese" },
  { category: "Human Languages", label: "Arabic" },
  { category: "Human Languages", label: "Russian" },
  { category: "Human Languages", label: "Turkish" },
  { category: "Human Languages", label: "Dutch" },

  // Career Paths
  { category: "Career & Skill Paths", label: "Data Science & Machine Learning" },
  { category: "Career & Skill Paths", label: "Web Development (Full Stack)" },
  { category: "Career & Skill Paths", label: "Android App Development" },
  { category: "Career & Skill Paths", label: "iOS App Development" },
  { category: "Career & Skill Paths", label: "UI/UX Design" },
  { category: "Career & Skill Paths", label: "Cybersecurity" },
  { category: "Career & Skill Paths", label: "DevOps & Cloud" },
  { category: "Career & Skill Paths", label: "Artificial Intelligence" },
  { category: "Career & Skill Paths", label: "Blockchain Development" },
  { category: "Career & Skill Paths", label: "Digital Marketing" },
  { category: "Career & Skill Paths", label: "Graphic Design" },
  { category: "Career & Skill Paths", label: "Video Editing & Content Creation" },
  { category: "Career & Skill Paths", label: "Stock Market & Trading" },
  { category: "Career & Skill Paths", label: "Entrepreneurship & Startup" },
];

// ── STEP CONFIG ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Your Goal", icon: Target, desc: "What do you want to achieve?" },
  { id: 2, title: "Your Background", icon: User, desc: "Tell us about yourself" },
  { id: 3, title: "Your Time", icon: Clock, desc: "How much time can you give?" },
  { id: 4, title: "Learning Style", icon: Brain, desc: "How do you learn best?" },
  { id: 5, title: "Current Skills", icon: BookOpen, desc: "What do you already know?" },
  { id: 6, title: "Review & Generate", icon: Sparkles, desc: "Ready to build your roadmap!" },
];

const HOURS_OPTIONS = ["1 hour/day", "2 hours/day", "3 hours/day", "4 hours/day", "6 hours/day", "8 hours/day"];
const MONTHS_OPTIONS = ["1 month", "2 months", "3 months", "6 months", "9 months", "12 months", "18 months", "24 months"];
const LEVEL_OPTIONS = ["Complete Beginner", "Some Basic Knowledge", "Intermediate", "Advanced"];
const EDUCATION_OPTIONS = ["Currently in School (Class 9-10)", "Currently in School (Class 11-12)", "Undergraduate Student", "Graduate / Postgraduate", "Working Professional", "Dropped Out / Self-Taught", "Other"];
const STYLE_OPTIONS = [
  { label: "Visual Learner", desc: "Videos, diagrams, charts", emoji: "🎥" },
  { label: "Reading / Writing", desc: "Books, notes, articles", emoji: "📚" },
  { label: "Practice Heavy", desc: "Hands-on, coding, exercises", emoji: "💻" },
  { label: "Mixed Approach", desc: "Little bit of everything", emoji: "🔀" },
];

// ── SEARCHABLE GOAL SELECTOR ──────────────────────────────────────────────────
function GoalSelector({ value, onChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef(null);

  const filtered = search.length > 0
    ? ALL_PATHS.filter(p => p.label.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())).slice(0, 20)
    : [];

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Selected value display */}
      {value && !open && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/40 mb-3">
          <div>
            <div className="text-xs text-indigo-400 font-semibold mb-0.5">Selected Goal</div>
            <div className="text-white font-bold">{value}</div>
          </div>
          <button onClick={() => { onChange(""); setSearch(""); }} className="text-gray-500 hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search input */}
      {!value && (
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); setCustomMode(false); }}
            onFocus={() => setOpen(true)}
            placeholder="Search: JEE, UPSC, Python, IELTS, CAT…"
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
          />
        </div>
      )}

      {/* Dropdown results */}
      <AnimatePresence>
        {open && search.length > 0 && !value && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
          >
            {Object.keys(grouped).length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm mb-3">No match found for "{search}"</p>
                <button
                  onClick={() => { onChange(search); setOpen(false); }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Use "{search}" as my custom goal ✨
                </button>
              </div>
            ) : (
              <>
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-white/2 sticky top-0">
                      {cat}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { onChange(item.label); setOpen(false); setSearch(""); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition-colors border-b border-white/3"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="p-3 border-t border-white/8">
                  <button
                    onClick={() => { onChange(search); setOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-indigo-600/20 hover:text-indigo-400 transition-colors"
                  >
                    ✨ Use "{search}" as custom goal
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular suggestions when no search */}
      {!value && search.length === 0 && (
        <div>
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest mb-3">Popular Goals</p>
          <div className="flex flex-wrap gap-2">
            {["JEE Main", "UPSC Civil Services", "CAT", "NEET UG", "SSC CGL", "Python", "IELTS", "GATE", "SBI PO", "Data Science & Machine Learning"].map(g => (
              <button
                key={g}
                onClick={() => onChange(g)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-500/40 transition-all"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── OPTION CARD ───────────────────────────────────────────────────────────────
function OptionCard({ label, desc, emoji, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        selected
          ? "border-indigo-500 bg-indigo-600/10 shadow-lg shadow-indigo-600/10"
          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-bold ${selected ? "text-indigo-300" : "text-white"}`}>{label}</div>
          {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ── PILL SELECTOR ─────────────────────────────────────────────────────────────
function PillSelector({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105 ${
            value === opt
              ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              : "border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── STEP CONTENT ──────────────────────────────────────────────────────────────
function StepContent({ step, data, setData }) {
  switch (step) {
    case 1:
      return (
        <div>
          <GoalSelector value={data.goal} onChange={(val) => setData(d => ({ ...d, goal: val }))} />
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">Your Current Education Level</label>
            <div className="flex flex-col gap-2">
              {EDUCATION_OPTIONS.map(opt => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={data.education === opt}
                  onClick={() => setData(d => ({ ...d, education: opt }))}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">Your Knowledge Level for This Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {LEVEL_OPTIONS.map(opt => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={data.level === opt}
                  onClick={() => setData(d => ({ ...d, level: opt }))}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              How many hours can you study per day?
            </label>
            <PillSelector
              options={HOURS_OPTIONS}
              value={data.hoursPerDay}
              onChange={(val) => setData(d => ({ ...d, hoursPerDay: val }))}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              How many months do you have?
            </label>
            <PillSelector
              options={MONTHS_OPTIONS}
              value={data.months}
              onChange={(val) => setData(d => ({ ...d, months: val }))}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              Target date or exam year (optional)
            </label>
            <input
              type="text"
              value={data.targetDate || ""}
              onChange={(e) => setData(d => ({ ...d, targetDate: e.target.value }))}
              placeholder="e.g. JEE 2026, December 2025, 6 months from now…"
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">How do you learn best?</label>
            <div className="flex flex-col gap-2">
              {STYLE_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.label}
                  label={opt.label}
                  desc={opt.desc}
                  emoji={opt.emoji}
                  selected={data.learningStyle === opt.label}
                  onClick={() => setData(d => ({ ...d, learningStyle: opt.label }))}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              Any specific focus area? (optional)
            </label>
            <input
              type="text"
              value={data.focusArea || ""}
              onChange={(e) => setData(d => ({ ...d, focusArea: e.target.value }))}
              placeholder="e.g. Weak in Maths, Strong in English, Focus on interview prep…"
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              Describe your current skills or knowledge (in your own words)
            </label>
            <textarea
              value={data.currentSkills || ""}
              onChange={(e) => setData(d => ({ ...d, currentSkills: e.target.value }))}
              placeholder="e.g. I know basic Maths and Science from Class 10. I have no coding experience. I've read one chapter of Python basics..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-300 mb-3 block">
              What is your main motivation? (optional)
            </label>
            <input
              type="text"
              value={data.motivation || ""}
              onChange={(e) => setData(d => ({ ...d, motivation: e.target.value }))}
              placeholder="e.g. Get a government job, earn ₹1 lakh/month, get into IIT, move abroad…"
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>
        </div>
      );

    case 6:
      return (
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-indigo-600/8 border border-indigo-500/20">
            <h3 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">Your Roadmap Summary</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Goal", value: data.goal },
                { label: "Education", value: data.education },
                { label: "Level", value: data.level },
                { label: "Study Time", value: data.hoursPerDay },
                { label: "Timeline", value: data.months },
                { label: "Target Date", value: data.targetDate || "Not specified" },
                { label: "Learning Style", value: data.learningStyle },
                { label: "Current Skills", value: data.currentSkills ? data.currentSkills.slice(0, 80) + "…" : "Not specified" },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0 font-medium pt-0.5">{item.label}</span>
                  <span className="text-sm text-white font-medium">{item.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-xs text-amber-400 font-medium">
              ⚡ Your AI roadmap will include: Month-wise plan · Weekly schedule · Daily tasks · Resources · Projects · Interview prep · Resume milestones · Beginner mistakes · Pro tips
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({
    goal: "", education: "", level: "", hoursPerDay: "",
    months: "", targetDate: "", learningStyle: "", focusArea: "",
    currentSkills: "", motivation: "",
  });
  const router = useRouter();
  const supabase = createClient();

  // Validate current step
  function canProceed() {
    if (currentStep === 1) return !!data.goal;
    if (currentStep === 2) return !!data.education && !!data.level;
    if (currentStep === 3) return !!data.hoursPerDay && !!data.months;
    if (currentStep === 4) return !!data.learningStyle;
    if (currentStep === 5) return true; // optional
    return true;
  }

  function nextStep() {
    if (canProceed() && currentStep < 6) setCurrentStep(s => s + 1);
  }

  function prevStep() {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });
        const result = await response.json();
        console.log("Result from API:", result);
        if (result.id) {
         window.location.href = `/roadmap/${result.id}`;
        } else {
        alert("Something went wrong. Please try again.");
        setGenerating(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating roadmap. Please try again.");
      setGenerating(false);
    }
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg">RiseUp<span className="text-indigo-400">Hub</span></span>
          </a>
          <div className="text-sm text-gray-500 font-medium">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: currentStep === s.id ? 1.15 : 1,
                  backgroundColor: currentStep > s.id ? "#4f46e5" : currentStep === s.id ? "#4f46e5" : "rgba(255,255,255,0.05)",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-xs font-bold"
              >
                {currentStep > s.id ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className={currentStep === s.id ? "text-white" : "text-gray-600"}>{s.id}</span>
                )}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${currentStep > s.id ? "bg-indigo-500" : "bg-white/8"} transition-colors`} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step header */}
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                {(() => { const Icon = STEPS[currentStep - 1].icon; return <Icon className="w-7 h-7 text-indigo-400" />; })()}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                {STEPS[currentStep - 1].title}
              </h1>
              <p className="text-gray-500 text-base">{STEPS[currentStep - 1].desc}</p>
            </div>

            {/* Step content */}
            <div className="mb-8">
              <StepContent step={currentStep} data={data} setData={setData} />
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              {currentStep < 6 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    canProceed()
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02]"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-lg transition-all hover:scale-[1.02] shadow-2xl shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Building Your Roadmap…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Roadmap
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Skip hint for step 5 */}
            {currentStep === 5 && (
              <p className="text-center text-xs text-gray-600 mt-4">
                This step is optional — you can skip it by clicking Continue
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}