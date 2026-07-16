"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Loader2, Zap, CheckCircle, Clock, Sparkles } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }

      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      setPayments(data || []);

      // Count today's roadmap generations for credit display
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("roadmaps")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id)
        .gte("created_at", today.toISOString());

      setTodayCount(count || 0);
      setLoading(false);
    }
    load();
  }, []);

  const totalSpent = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-lg font-black">Credits & Payments</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Credits card */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-600/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">{Math.max(0, 3 - todayCount)}/3</div>
                <div className="text-sm text-gray-400">Free generations remaining today</div>
              </div>
              <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-green-600/15 flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">₹{(totalSpent / 100).toFixed(0)}</div>
                <div className="text-sm text-gray-400">Total spent on downloads</div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-600/5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Sparkles className="w-8 h-8 text-violet-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-white text-sm mb-1">Upgrade to Pro — ₹99/month</div>
                <div className="text-xs text-gray-400">5 roadmaps/day, unlimited downloads, live tracking, reminders</div>
              </div>
              <span className="px-4 py-2 rounded-xl bg-white/5 text-gray-500 text-xs font-semibold border border-white/10">
                Coming Soon
              </span>
            </div>

            {/* Payment history */}
            <h3 className="text-sm font-bold text-gray-400 mb-4">Payment History</h3>
            {payments.length === 0 ? (
              <div className="text-center py-12 border border-white/[0.07] rounded-2xl">
                <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No payments yet</p>
                <p className="text-gray-600 text-xs mt-1">Razorpay integration coming soon</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {payments.map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      p.status === "completed" ? "bg-green-600/15" : "bg-amber-600/15"
                    }`}>
                      {p.status === "completed"
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <Clock className="w-4 h-4 text-amber-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">₹{(p.amount / 100).toFixed(0)}</div>
                      <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString("en-IN")}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      p.status === "completed" ? "bg-green-600/15 text-green-400" : "bg-amber-600/15 text-amber-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}