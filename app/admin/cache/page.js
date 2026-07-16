"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Zap, DollarSign, TrendingUp,
  Database, RefreshCw, Loader2, Trash2,
  CheckCircle, XCircle
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CacheStatsPage() {
  const [stats, setStats] = useState(null);
  const [cacheEntries, setCacheEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function loadData() {
    setRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: costData } = await supabase
        .from("ai_cost_tracker")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: entries } = await supabase
        .from("ai_cache")
        .select("id, goal, level, hours_per_day, hit_count, last_used_at, created_at")
        .order("hit_count", { ascending: false })
        .limit(20);

      if (costData) {
        const hits = costData.filter(e => e.event_type === "cache_hit");
        const misses = costData.filter(e => e.event_type === "cache_miss");
        const totalSaved = hits.reduce((sum, e) => sum + (e.cost_saved_usd || 0), 0);
        setStats({
          totalHits: hits.length,
          totalMisses: misses.length,
          totalSavedUsd: totalSaved,
          totalSavedInr: totalSaved * 84,
          hitRate: costData.length > 0 ? Math.round((hits.length / costData.length) * 100) : 0,
        });
      }
      setCacheEntries(entries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function deleteEntry(id) {
    await supabase.from("ai_cache").delete().eq("id", id);
    setCacheEntries(prev => prev.filter(e => e.id !== id));
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-black">AI Cache Monitor</h1>
              <p className="text-gray-500 text-sm">Track cost savings from intelligent caching</p>
            </div>
          </div>
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: CheckCircle, label: "Cache Hits", value: stats.totalHits, sub: "Served free from cache", color: "bg-green-600/15", iconColor: "text-green-400" },
              { icon: XCircle, label: "Cache Misses", value: stats.totalMisses, sub: "Called Claude AI", color: "bg-red-600/15", iconColor: "text-red-400" },
              { icon: TrendingUp, label: "Hit Rate", value: `${stats.hitRate}%`, sub: "Higher = more savings", color: "bg-indigo-600/15", iconColor: "text-indigo-400" },
              { icon: DollarSign, label: "Total Saved", value: `₹${stats.totalSavedInr.toFixed(0)}`, sub: `$${stats.totalSavedUsd.toFixed(2)} USD`, color: "bg-amber-600/15", iconColor: "text-amber-400" },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{card.value}</div>
                <div className="text-xs font-semibold text-gray-400">{card.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{card.sub}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-600/5 mb-8">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            How Caching Saves You Money
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold text-green-400 text-sm">✅ Cache Hit = ₹0</div>
              <div className="text-gray-500 text-xs mt-1">Same goal + level + hours → returns saved roadmap instantly</div>
            </div>
            <div>
              <div className="font-semibold text-red-400 text-sm">❌ Cache Miss = ₹2</div>
              <div className="text-gray-500 text-xs mt-1">New combination → calls Claude AI → saves for next user</div>
            </div>
            <div>
              <div className="font-semibold text-amber-400 text-sm">💰 Real Savings</div>
              <div className="text-gray-500 text-xs mt-1">1000 cache hits on "JEE Main" = ₹2000 saved!</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
          <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Cached Roadmaps ({cacheEntries.length}) — Top by Usage
            </h3>
          </div>
          {cacheEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No cached roadmaps yet. Generate roadmaps to build the cache!
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {cacheEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{entry.goal}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{entry.level} · {entry.hours_per_day}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600/10 border border-green-500/20 flex-shrink-0">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-bold text-xs">{entry.hit_count} hits saved</span>
                  </div>
                  <div className="text-xs text-gray-600 hidden sm:block flex-shrink-0">
                    {new Date(entry.created_at).toLocaleDateString("en-IN")}
                  </div>
                  <button onClick={() => deleteEntry(entry.id)}
                    className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}