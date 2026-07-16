"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket, ArrowLeft, Map, Plus, ChevronRight,
  Loader2, Search, Clock, Calendar, Brain
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MyRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);

      const { data } = await supabase
        .from("roadmaps")
        .select("id, goal, level, hours_per_day, months, created_at")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      setRoadmaps(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = roadmaps.filter(r =>
    r.goal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-lg font-black">My Roadmaps</h1>
          </div>
          <a
            href="/generate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your roadmaps..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {search ? "No matching roadmaps" : "No roadmaps yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {search ? "Try a different search term" : "Generate your first AI roadmap to get started"}
            </p>
            {!search && (
              <a
                href="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Build My First Roadmap
              </a>
            )}
          </div>
        )}

        {/* Roadmap list */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((r, i) => (
              <motion.a
                key={r.id}
                href={`/roadmap/${r.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center flex-shrink-0">
                  <Map className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{r.goal}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {r.level && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Brain className="w-3 h-3" /> {r.level}
                      </span>
                    )}
                    {r.hours_per_day && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {r.hours_per_day}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}