"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { Lock, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate swift client-side authentication
    setTimeout(() => {
      if (password === "admin123" || password === "plottwist" || password.trim() !== "") {
        router.push("/admin/dashboard");
      } else {
        setError("Please enter the owner passphrase (e.g. admin123)");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = () => {
    setPassword("admin123");
    setIsLoading(true);
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FFF6E8] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Blobs & Paper Texture */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#FFECC8] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFD46B] rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="login-paper-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="rgba(62,42,36,0.18)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#login-paper-dots)" />
        </svg>
      </div>

      {/* Floating Stickers */}
      <div className="absolute top-12 left-[10%] text-3xl animate-bounce hidden sm:block">🍓</div>
      <div className="absolute bottom-16 right-[12%] text-3xl animate-pulse hidden sm:block">🍩</div>
      <div className="absolute top-20 right-[15%] text-2xl hidden md:block">⭐</div>

      {/* Back to Public Site */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] hover:bg-[#FFECC8] transition-all z-20"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Storefront</span>
      </Link>

      {/* Scrapbook Login Card */}
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Masking Tape */}
        <MaskingTape color="pink" width={90} height={26} rotate={-8} className="absolute -top-4 left-10 z-20" />
        <MaskingTape color="yellow" width={80} height={24} rotate={6} className="absolute -bottom-4 right-10 z-20" />

        {/* Brand Stamp */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-[#FF4FA3] border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] flex items-center justify-center text-3xl mx-auto mb-3 transform -rotate-3">
            🧁
          </div>
          <h1 className="font-bowlby text-2xl sm:text-3xl text-[#3E2A24] tracking-tight">
            PlotTwist24x
          </h1>
          <div className="inline-flex items-center gap-1 mt-1 bg-[#FFE26E] border-2 border-[#3E2A24] px-3 py-0.5 rounded-full text-xs font-bricolage font-black text-[#3E2A24] uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-[#FF4FA3]" />
            <span>Bakery Owner Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Owner Passphrase
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passphrase (or click Demo below)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 shadow-inner"
              />
              <Lock className="w-4 h-4 text-[#5F4A3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1.5">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-black text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <span>{isLoading ? "Unlocking Portal..." : "Enter Bakery Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="mt-6 pt-4 border-t-2 border-[#3E2A24]/20 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-xl bg-[#FFECC8] hover:bg-[#ffe2a8] text-[#3E2A24] font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>⚡ Instant Demo Access (One-Click)</span>
          </button>
          <p className="font-kalam text-xs text-[#5F4A3A] mt-2">
            Default pass: <code className="font-mono font-bold bg-[#FFECC8] px-1.5 py-0.5 rounded border border-[#3E2A24]/40">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
