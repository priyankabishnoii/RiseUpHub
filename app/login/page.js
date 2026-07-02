"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage({ text: error.message, type: "error" });
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      setMessage({ text: "Please enter email and password.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Signing you in…", type: "success" });
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleEmailSignup() {
    if (!name || !email || !password) {
      setMessage({ text: "Please fill in all fields.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({
        text: "✅ Account created! Check your email to verify, then sign in.",
        type: "success",
      });
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessage({ text: "Enter your email above first.", type: "error" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "✅ Password reset email sent! Check your inbox.", type: "success" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[460px] flex-shrink-0 p-12 relative overflow-hidden border-r border-white/[0.06]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-black text-white tracking-tight">
              RiseUp<span className="text-indigo-400">Hub</span>
            </div>
            <div className="text-[9px] text-indigo-400 font-semibold tracking-widest uppercase">AI Roadmap Builder</div>
          </div>
        </div>

        <div className="relative">
          <div className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Every expert<br />was once a<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              beginner.
            </span>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-xs">
            Your personalized roadmap is 30 seconds away. Join thousands of students and professionals who are rising up.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["🧑‍💻", "👩‍🎓", "🧑‍💼", "👩‍🔬"].map((e, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-indigo-600/30 border-2 border-[#0a0a0a] flex items-center justify-center text-base">
                  {e}
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm text-white font-semibold">10,000+ learners</div>
              <div className="text-xs text-gray-500">already rising up</div>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-gray-600">© 2026 RiseUpHub · Made with ❤️ in India</div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <div className="text-xl font-black text-white">RiseUp<span className="text-indigo-400">Hub</span></div>
        </div>

        <div className="w-full max-w-sm">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-2xl p-1 mb-8">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMessage({ text: "", type: "" }); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-7">
                <h1 className="text-2xl font-black text-white mb-1">
                  {tab === "login" ? "Welcome back 👋" : "Join RiseUpHub ✨"}
                </h1>
                <p className="text-sm text-gray-500">
                  {tab === "login"
                    ? "Sign in to access your roadmaps and dashboard."
                    : "Create your free account. No credit card needed."}
                </p>
              </div>

              {/* Message box */}
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
                    message.type === "error"
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "bg-green-500/10 border border-green-500/20 text-green-400"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              {/* Google button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold transition-all hover:scale-[1.02] mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Please wait…" : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-xs text-gray-600 font-medium">or with email</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-4 mb-5">
                {tab === "signup" && (
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-400">Password</label>
                    {tab === "login" && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={tab === "login" ? handleEmailLogin : handleEmailSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-xl shadow-indigo-600/25 mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Free Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {tab === "signup" && (
                <p className="text-center text-xs text-gray-600">
                  By signing up you agree to our{" "}
                  <a href="#" className="text-indigo-400 hover:underline">Terms</a> and{" "}
                  <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              ← Back to RiseUpHub.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}