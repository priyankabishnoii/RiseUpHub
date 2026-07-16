"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Loader2, FileText, Lock } from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }

      const { data } = await supabase
        .from("payments")
        .select("id, roadmap_id, amount, status, download_type, created_at")
        .eq("user_id", u.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      setDownloads(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-lg font-black">My Downloads</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {!loading && downloads.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No downloads yet</h3>
            <p className="text-gray-500 text-sm mb-2 max-w-sm mx-auto">
              Downloaded PDF & Word roadmaps will appear here after purchase.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 mb-6">
              <Lock className="w-3 h-3" />
              Payments (Razorpay) coming soon
            </div>
            <a href="/dashboard/roadmaps" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
              View My Roadmaps
            </a>
          </div>
        )}

        {!loading && downloads.length > 0 && (
          <div className="flex flex-col gap-3">
            {downloads.map(d => (
              <div key={d.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-green-600/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">Roadmap Download</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    ₹{(d.amount / 100).toFixed(0)} · {new Date(d.created_at).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <a
                  href={`/roadmap/${d.roadmap_id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/15 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/25 transition-colors"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}