import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { Coffee, Loader2, Lock } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_LOGIN } from "@/constants/testIds";

export default function AdminLoginPage() {
  const { user, login, checking } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!checking && user?.role === "admin") return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await login(form.email.trim(), form.password);
      toast.success("Welcome back", { description: "Redirecting to dashboard…" });
      nav("/admin", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 py-16 font-body">
      <div className="grain-overlay" aria-hidden="true" />

      {/* Left decorative panel on large screens */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#1E3F20]" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-0 shadow-[0_20px_60px_-30px_rgba(30,63,32,0.35)]">
        {/* Left side */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex flex-col justify-between bg-[#1E3F20] text-white p-12"
        >
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
                Kolli Hills
              </p>
              <p className="font-display text-2xl leading-none">Fresh Cafe</p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#D4AF37]">
              — Staff console
            </p>
            <h2 className="font-display text-5xl leading-[1.05] mt-4">
              Manage the counter.
              <br />
              <em className="text-[#D4AF37]">From the hills, in your hand.</em>
            </h2>
            <p className="mt-6 text-white/70 max-w-md text-sm leading-relaxed">
              Track live pickup orders, curate the menu, and keep the shelves
              fresh. Only authorised staff can sign in from this screen.
            </p>
          </div>

          <p className="text-[10px] tracking-widest uppercase text-white/40">
            Phase 4 · MVP Admin
          </p>
        </motion.aside>

        {/* Right side form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-[#FDFBF7] border border-[#E8E2D9] p-8 sm:p-12"
        >
          <div className="flex items-center gap-2 text-[#4A2E15]">
            <Lock className="w-4 h-4" />
            <p className="text-[11px] tracking-[0.4em] uppercase">Admin Login</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1E3F20] mt-4">
            Sign in to continue
          </h1>
          <p className="text-sm text-[#5C5C5C] mt-2">
            Use your issued admin credentials. Sessions last 12 hours.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
            <div>
              <Label
                htmlFor="admin-email"
                className="text-[10px] tracking-widest uppercase text-[#4A2E15]"
              >
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                data-testid={ADMIN_LOGIN.emailInput}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b border-[#1E3F20] focus-visible:ring-0 focus-visible:border-[#D4AF37] bg-transparent px-0"
                placeholder="admin@kollihills.cafe"
              />
            </div>

            <div>
              <Label
                htmlFor="admin-password"
                className="text-[10px] tracking-widest uppercase text-[#4A2E15]"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                data-testid={ADMIN_LOGIN.passwordInput}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b border-[#1E3F20] focus-visible:ring-0 focus-visible:border-[#D4AF37] bg-transparent px-0"
                placeholder="••••••••••"
              />
            </div>

            {err && (
              <p
                data-testid={ADMIN_LOGIN.errorMessage}
                className="text-sm text-[#B4451D] border-l-2 border-[#B4451D] pl-3 py-1 bg-[#FDF3EF]"
              >
                {err}
              </p>
            )}

            <Button
              type="submit"
              disabled={busy}
              data-testid={ADMIN_LOGIN.submitButton}
              className="w-full h-12 rounded-none bg-[#1E3F20] hover:bg-[#152C16] text-white text-xs tracking-[0.3em] uppercase disabled:opacity-50"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-8 text-[11px] tracking-widest uppercase text-[#5C5C5C]">
            Not staff?{" "}
            <a href="/" className="text-[#1E3F20] border-b border-[#D4AF37]">
              Back to cafe
            </a>
          </p>
        </motion.section>
      </div>

      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#FDFBF7",
            color: "#1F1F1F",
            border: "1px solid #E8E2D9",
            borderRadius: 0,
          },
        }}
      />
    </div>
  );
}
