"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Play, CheckCircle, XCircle, Loader2, RefreshCw, ArrowLeft, Zap } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const ROADMAPS = [
  "JEE Main","JEE Advanced (IIT)","NEET UG","UPSC Civil Services (IAS/IPS/IFS)",
  "SSC CGL","IBPS PO","SBI PO","Railway Group D","CAT (MBA)","Python Programming",
  "Data Science & Machine Learning","Web Development (Full Stack)","GATE (Computer Science)",
  "IELTS (7.0+ Band)","GRE (320+ Score)","CA Foundation",
  "NDA (National Defence Academy)","CTET (Central Teacher Eligibility)",
  "Japanese Language (N5 to N2)","Agniveer (Army)",
];

export default function LibraryGeneratorPage() {
  const [statuses, setStatuses] = useState({});
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [log, setLog] = useState([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.user_metadata?.is_admin) router.push("/dashboard");
    }
    checkAdmin();
  }, []);

  function addLog(msg, type = "info") {
    setLog(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 49)]);
  }

  async function generateOne(index) {
  setCurrentIndex(index);
  setStatuses(prev => ({ ...prev, [index]: "loading" }));
  addLog(`Generating: ${ROADMAPS[index]}...`, "info");

  try {
    const controller = new AbortController();
    // 3 minute timeout
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const res = await fetch("/api/library/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();

    if (data.success) {
      setStatuses(prev => ({ ...prev, [index]: data.skipped ? "skipped" : "done" }));
      addLog(`✅ ${data.skipped ? "Already exists" : "Generated"}: ${ROADMAPS[index]}`, "success");
    } else {
      setStatuses(prev => ({ ...prev, [index]: "error" }));
      addLog(`❌ Failed: ${ROADMAPS[index]} - ${data.error}`, "error");
    }
  } catch (e) {
    if (e.name === "AbortError") {
      setStatuses(prev => ({ ...prev, [index]: "error" }));
      addLog(`⏱️ Timeout: ${ROADMAPS[index]} - Try generating individually`, "error");
    } else {
      setStatuses(prev => ({ ...prev, [index]: "error" }));
      addLog(`❌ Error: ${ROADMAPS[index]} - ${e.message}`, "error");
    }
  }
  setCurrentIndex(null);
}

  async function generateAll() {
    setGenerating(true);
    addLog("🚀 Starting batch generation of all 20 roadmaps...", "info");
    for (let i = 0; i < ROADMAPS.length; i++) {
      if (statuses[i] === "done") { addLog(`⏭️ Skipping (already done): ${ROADMAPS[i]}`, "info"); continue; }
      await generateOne(i);
      // Wait 3 seconds between each to avoid rate limits
      if (i < ROADMAPS.length - 1) {
        addLog("⏳ Waiting 3 seconds...", "info");
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    setGenerating(false);
    addLog("🎉 All roadmaps generated!", "success");
  }

  const doneCount = Object.values(statuses).filter(s => s === "done" || s === "skipped").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-black">Library Generator</h1>
              <p className="text-gray-500 text-sm">Generate all 20 pre-made roadmaps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm">
              {doneCount}/20 done
            </div>
            <button
              onClick={generateAll}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {generating ? "Generating..." : "Generate All 20"}
            </button>
          </div>
        </div>

        {/* Cost warning */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-amber-400 text-sm font-medium">
            ⚠️ Cost estimate: 20 roadmaps × ₹2 = <strong>₹40 total</strong> from your Anthropic credits.
            Each generation takes ~15-30 seconds. Total time: ~10-15 minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            animate={{ width: `${(doneCount / 20) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Roadmap list */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {ROADMAPS.map((name, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                statuses[i] === "done" || statuses[i] === "skipped"
                  ? "border-green-500/20 bg-green-600/5"
                  : statuses[i] === "error"
                  ? "border-red-500/20 bg-red-600/5"
                  : statuses[i] === "loading"
                  ? "border-indigo-500/40 bg-indigo-600/10"
                  : "border-white/[0.07] bg-white/[0.03]"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {statuses[i] === "done" || statuses[i] === "skipped" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : statuses[i] === "error" ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : statuses[i] === "loading" ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <span className="text-[10px] text-gray-600 font-bold">{i + 1}</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <span className={`text-sm font-semibold flex-1 ${
                statuses[i] === "done" || statuses[i] === "skipped" ? "text-green-300"
                : statuses[i] === "error" ? "text-red-300"
                : statuses[i] === "loading" ? "text-indigo-300"
                : "text-gray-300"
              }`}>
                {name}
              </span>

              {/* Individual generate button */}
              {!generating && statuses[i] !== "done" && statuses[i] !== "skipped" && (
                <button
                  onClick={() => generateOne(i)}
                  disabled={statuses[i] === "loading"}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-600/20 text-gray-500 hover:text-indigo-400 text-xs font-semibold transition-all"
                >
                  {statuses[i] === "loading" ? "..." : "Generate"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <h3 className="text-sm font-bold text-white mb-3">Activity Log</h3>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {log.map((entry, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-gray-600 flex-shrink-0">{entry.time}</span>
                  <span className={
                    entry.type === "success" ? "text-green-400"
                    : entry.type === "error" ? "text-red-400"
                    : "text-gray-400"
                  }>
                    {entry.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}