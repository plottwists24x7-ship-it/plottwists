"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Incorrect password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success: redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E8] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Ambient Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#FFECC8] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFD46B] rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Paper Dot Grid Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="login-paper-dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.3" fill="rgba(62,42,36,0.18)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#login-paper-dots)" />
        </svg>
      </div>

      {/* Floating Decorative Bakery Badges */}
      <div className="absolute top-12 left-[10%] text-3xl animate-bounce hidden sm:block">
        🍓
      </div>
      <div className="absolute bottom-16 right-[12%] text-3xl animate-pulse hidden sm:block">
        🧁
      </div>
      <div className="absolute top-20 right-[15%] text-2xl hidden md:block">
        ⭐
      </div>

      {/* Back to Public Storefront */}
      <Link
        href="/"
        className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#FFFDF8] border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] hover:bg-[#FFECC8] transition-all z-20"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Storefront</span>
      </Link>

      {/* Scrapbook Login Card */}
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[10px_10px_0_#3E2A24] p-7 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Masking Tape Decoration */}
        <MaskingTape
          color="washi-pink"
          className="absolute -top-4 left-1/2 -translate-x-1/2 -rotate-2 w-32 shadow-sm pointer-events-none"
        />

        {/* Card Header */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFE26E] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] text-3xl mb-3 transform -rotate-3 hover:rotate-0 transition-transform">
            🧁
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="font-bowlby text-2xl text-[#3E2A24] tracking-tight">
              PlotTwist24x
            </h1>
            <span className="bg-[#FF4FA3] text-white text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24] uppercase">
              Admin
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] font-semibold">
            Enter your owner password to manage your bakery
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-[#FF4FA3]/15 border-2 border-[#FF4FA3] text-[#3E2A24] text-xs font-bricolage font-bold flex items-center gap-2 animate-in fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F4A3A]/70">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter password..."
                required
                autoFocus
                className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] text-sm font-bricolage text-[#3E2A24] placeholder:text-[#5F4A3A]/40 focus:outline-none focus:bg-[#FFECC8]/30 shadow-[2px_2px_0_#3E2A24] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5F4A3A] hover:text-[#3E2A24] cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#3E2A24]" />
                <span>Verifying Password...</span>
              </>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
