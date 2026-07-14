"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket, Users, Map, DollarSign, TrendingUp,
  Bell, Settings, LogOut, Shield, Eye,
  ChevronRight, Loader2, RefreshCw, Search,
  CheckCircle, XCircle, Clock, Zap, Award,
  BarChart3, PieChart, Activity, AlertCircle,
  MessageSquare, Trash2, Plus, X
} from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm font-semibold text-gray-400">{title}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </motion.div>
  );
}

// ── ANNOUNCEMENT FORM ─────────────────────────────────────────────────────────
function AnnouncementForm({ supabase, onSave }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title || !message) return;
    setSaving(true);
    await supabase.from("announcements").insert({ title, message, type });
    setTitle(""); setMessage(""); setType("info");
    setSaving(false);
    onSave();
  }

  return (
    <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-indigo-400" />
        Send Announcement
      </h3>
      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Announcement title..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all"
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Write your message to all users..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 transition-all resize-none"
        />
        <div className="flex gap-2">
          {["info", "success", "warning", "error"].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                type === t
                  ? t === "info" ? "bg-blue-600 text-white"
                    : t === "success" ? "bg-green-600 text-white"
                    : t === "warning" ? "bg-amber-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !title || !message}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? "Sending..." : "Send to All Users"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN ADMIN PAGE ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_users: 0, today_users: 0,
    total_roadmaps: 0, today_roadmaps: 0,
    total_revenue: 0, total_orders: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentRoadmaps, setRecentRoadmaps] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function loadData() {
    setRefreshing(true);
    try {
      // Check admin
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      const isAdmin = u.user_metadata?.is_admin;
      if (!isAdmin) { router.push("/dashboard"); return; }
      setUser(u);

      // Load stats manually since view might need service role
     const [roadmapsRes, paymentsRes, announcementsRes] = await Promise.all([
  supabase.from("roadmaps").select("id, created_at, goal, user_id"),
  supabase.from("payments").select("id, amount, status, created_at"),
  supabase.from("announcements").select("*").order("created_at", { ascending: false }),
]);

const allRoadmaps = Array.isArray(roadmapsRes.data) ? roadmapsRes.data : [];
const allPayments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
const allAnnouncements = Array.isArray(announcementsRes.data) ? announcementsRes.data : [];

const today = new Date(); today.setHours(0, 0, 0, 0);

setStats({
  total_roadmaps: allRoadmaps.length,
  today_roadmaps: allRoadmaps.filter(r => new Date(r.created_at) >= today).length,
  total_revenue: allPayments.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0),
  total_orders: allPayments.filter(p => p.status === "completed").length,
  total_users: "—",
  today_users: "—",
});

setRecentRoadmaps(allRoadmaps.slice(-10).reverse());
setRecentPayments(allPayments.slice(-10).reverse());
setAnnouncements(allAnnouncements);
        

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function deleteAnnouncement(id) {
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }

  async function toggleAnnouncement(id, current) {
    await supabase.from("announcements").update({ active: !current }).eq("id", id);
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !current } : a));
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center animate-pulse">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <p className="text-white font-bold">Loading Admin Panel…</p>
        <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
      </div>
    </div>
  );

  const TABS = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "roadmaps", label: "Roadmaps", icon: Map },
    { key: "payments", label: "Payments", icon: DollarSign },
    { key: "announcements", label: "Announcements", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-base">RiseUpHub Admin</div>
              <div className="text-[10px] text-red-400 font-semibold uppercase tracking-widest">Control Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:block">Refresh</span>
            </button>
            <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:block">View Site</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Roadmaps" value={stats.total_roadmaps} sub={`${stats.today_roadmaps} today`} icon={Map} color="bg-indigo-600" delay={0} />
              <StatCard title="Total Revenue" value={`₹${(stats.total_revenue / 100).toFixed(0)}`} sub={`${stats.total_orders} orders`} icon={DollarSign} color="bg-green-600" delay={0.08} />
              <StatCard title="Total Users" value={stats.total_users} sub="All time" icon={Users} color="bg-blue-600" delay={0.16} />
              <StatCard title="Today Roadmaps" value={stats.today_roadmaps} sub="Generated today" icon={Activity} color="bg-violet-600" delay={0.24} />
            </div>

            {/* Recent roadmaps */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Map className="w-4 h-4 text-indigo-400" />
                  Recent Roadmaps
                </h3>
                {recentRoadmaps.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No roadmaps yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentRoadmaps.slice(0, 6).map((r, i) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                          <Map className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{r.goal}</div>
                          <div className="text-xs text-gray-600">{new Date(r.created_at).toLocaleDateString("en-IN")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent payments */}
              <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Recent Payments
                </h3>
                {recentPayments.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No payments yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentPayments.slice(0, 6).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          p.status === "completed" ? "bg-green-600/20" : "bg-amber-600/20"
                        }`}>
                          {p.status === "completed"
                            ? <CheckCircle className="w-4 h-4 text-green-400" />
                            : <Clock className="w-4 h-4 text-amber-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">₹{(p.amount / 100).toFixed(0)}</div>
                          <div className="text-xs text-gray-600">{new Date(p.created_at).toLocaleDateString("en-IN")}</div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          p.status === "completed"
                            ? "bg-green-600/15 text-green-400"
                            : "bg-amber-600/15 text-amber-400"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ROADMAPS TAB ── */}
        {activeTab === "roadmaps" && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">All Roadmaps ({recentRoadmaps.length})</h2>
            <div className="flex flex-col gap-3">
              {recentRoadmaps.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No roadmaps generated yet.</div>
              ) : recentRoadmaps.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center flex-shrink-0">
                    <Map className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{r.goal}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      ID: {r.id.slice(0, 8)}… · {new Date(r.created_at).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <a
                    href={`/roadmap/${r.id}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/25 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {activeTab === "payments" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Payments</h2>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/10 border border-green-500/20">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">Total: ₹{(stats.total_revenue / 100).toFixed(0)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {recentPayments.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No payments yet. Once Razorpay is set up, payments will appear here.</p>
                </div>
              ) : recentPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    p.status === "completed" ? "bg-green-600/15" : "bg-amber-600/15"
                  }`}>
                    {p.status === "completed"
                      ? <CheckCircle className="w-5 h-5 text-green-400" />
                      : <Clock className="w-5 h-5 text-amber-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">₹{(p.amount / 100).toFixed(0)}</div>
                    <div className="text-xs text-gray-500">{p.razorpay_payment_id || "Pending"} · {new Date(p.created_at).toLocaleString("en-IN")}</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                    p.status === "completed" ? "bg-green-600/15 text-green-400" : "bg-amber-600/15 text-amber-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {activeTab === "announcements" && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Announcements</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create form */}
              <AnnouncementForm supabase={supabase} onSave={loadData} />

              {/* List */}
              <div>
                <h3 className="text-base font-bold text-white mb-4">Active Announcements</h3>
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-600 border border-white/[0.07] rounded-2xl">
                    No announcements yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {announcements.map(a => (
                      <div key={a.id} className={`p-4 rounded-2xl border ${
                        a.type === "success" ? "border-green-500/20 bg-green-600/5"
                        : a.type === "warning" ? "border-amber-500/20 bg-amber-600/5"
                        : a.type === "error" ? "border-red-500/20 bg-red-600/5"
                        : "border-blue-500/20 bg-blue-600/5"
                      }`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-bold text-white text-sm">{a.title}</div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleAnnouncement(a.id, a.active)}
                              className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                                a.active ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-500"
                              }`}
                            >
                              {a.active ? "Active" : "Hidden"}
                            </button>
                            <button
                              onClick={() => deleteAnnouncement(a.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{a.message}</p>
                        <p className="text-[10px] text-gray-600 mt-2">{new Date(a.created_at).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}