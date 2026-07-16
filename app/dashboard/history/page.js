"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Map, CheckCircle, Zap, Flame,
  Loader2, Clock, Calendar
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }

      // Pull roadmaps + checkins + progress together as a timeline
      const [roadmapsRes, checkinsRes, progressRes] = await Promise.all([
        supabase.from("roadmaps").select("id, goal, created_at").eq("user_id", u.id),
        supabase.from("daily_checkins").select("checkin_date, points_earned, created_at").eq("user_id", u.id),
        supabase.from("roadmap_progress").select("section_key, roadmap_id, completed_at").eq("user_id", u.id).eq("completed", true).not("completed_at", "is", null),
      ]);

      const timeline = [];

      (roadmapsRes.data || []).forEach(r => {
        timeline.push({
          type: "roadmap_created",
          title: `Generated roadmap: ${r.goal}`,
          date: r.created_at,
          icon: Map,
          color: "text-indigo-400 bg-indigo-400/10",
        });
      });

      (checkinsRes.data || []).forEach(c => {
        timeline.push({
          type: "checkin",
          title: `Daily check-in (+${c.points_earned} points)`,
          date: c.created_at,
          icon: Flame,
          color: "text-amber-400 bg-amber-400/10",
        });
      });

      (progressRes.data || []).forEach(p => {
        timeline.push({
          type: "section_complete",
          title: `Completed section: ${p.section_key.replace(/_/g, " ")}`,
          date: p.completed_at,
          icon: CheckCircle,
          color: "text-green-400 bg-green-400/10",
        });
      });

      timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(timeline);
      setLoading(false);
    }
    load();
  }, []);

  // Group by date
  const grouped = events.reduce((acc, e) => {
    const dateKey = new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(e);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-lg font-black">Activity History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No activity yet</h3>
            <p className="text-gray-500 text-sm mb-6">Generate a roadmap or check in daily to build your history</p>
            <a href="/generate" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
              Get Started
            </a>
          </div>
        )}

        {!loading && Object.keys(grouped).length > 0 && (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([date, dayEvents]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-bold text-gray-400">{date}</h3>
                </div>
                <div className="flex flex-col gap-2 pl-2 border-l border-white/[0.07]">
                  {dayEvents.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-3 pl-4 rounded-xl hover:bg-white/[0.02] transition-colors -ml-px"
                    >
                      <div className={`w-8 h-8 rounded-lg ${e.color} flex items-center justify-center flex-shrink-0`}>
                        <e.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200">{e.title}</div>
                      </div>
                      <div className="text-xs text-gray-600 flex-shrink-0">
                        {new Date(e.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}