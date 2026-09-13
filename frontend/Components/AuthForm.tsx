"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Wallet, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from "lucide-react";

interface AuthFormProps {
  initialMode?: "login" | "signup";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleTabSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setErrorMessage("");
    setSuccessMessage("");
    window.history.pushState({}, "", newMode === "login" ? "/login" : "/sign");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to log in. Please check your credentials.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register account.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900 hover:opacity-90 transition">
            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <span>Spend<span className="text-emerald-600">Smart</span></span>
          </Link>
          <p className="text-sm text-slate-600 mt-2 font-normal">
            {mode === "login" 
              ? "Sign in to manage your expense dashboard" 
              : "Create an account to start tracking expenses"}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            {mode === "login" ? (
              <p className="text-xs text-slate-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Secure JWT Authentication</span>
        </div>
      </div>
    </div>
  );
}
